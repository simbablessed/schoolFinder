/**
 * School Finder Zimbabwe - API Client
 * Seamlessly interfaces with Cloudflare Workers / Neon Serverless Postgres
 * with transparent local caching and persistent offline fallbacks.
 */

import { getAllSchools, School, REVIEWS, Review } from "./data";

export interface Enquiry {
  id: string;
  schoolId: string;
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  interest: string;
  date: string;
  status: "New" | "Contacted" | "Interview" | "Enrolled" | "Declined";
  notes?: string;
}

const STORAGE_KEY_ENQUIRIES = "school_finder_db_enquiries";
const STORAGE_KEY_SCHOOL_OVERRIDES = "school_finder_db_school_overrides";
const STORAGE_KEY_REVIEWS = "school_finder_db_reviews";

// Default initial enquiries
const DEFAULT_ENQUIRIES: Enquiry[] = [
  {
    id: "enq-1",
    schoolId: "prince-edward",
    parentName: "Chipo Ncube",
    parentEmail: "chipo.n@gmail.com",
    parentPhone: "+263 77 212 3456",
    interest: "Form 1 Admission (2027)",
    date: "Today",
    status: "New",
    notes: "Requesting boarding house fees schedule and entrance assessment dates.",
  },
  {
    id: "enq-2",
    schoolId: "prince-edward",
    parentName: "Farai Dube",
    parentEmail: "farai.dube@zimcorp.co.zw",
    parentPhone: "+263 71 890 1234",
    interest: "Boarding House Vacancies",
    date: "Yesterday",
    status: "Contacted",
    notes: "Emailed boarding master questionnaire and medical declaration.",
  },
  {
    id: "enq-3",
    schoolId: "prince-edward",
    parentName: "Rutendo Sibanda",
    parentEmail: "r.sibanda@yahoo.co.uk",
    parentPhone: "+263 77 567 8901",
    interest: "Fees & Sports Bursary Scheme",
    date: "2 days ago",
    status: "Interview",
    notes: "Scheduled candidate rugby trial and academic aptitude session for Friday.",
  },
  {
    id: "enq-4",
    schoolId: "prince-edward",
    parentName: "Blessing Chikowore",
    parentEmail: "bchikowore@hotmail.com",
    parentPhone: "+263 78 345 6789",
    interest: "Cambridge A-Level Sciences",
    date: "4 days ago",
    status: "Enrolled",
    notes: "Enrolment deposit and registration documentation validated.",
  },
  {
    id: "enq-5",
    schoolId: "arundel",
    parentName: "Tariro Mutasa",
    parentEmail: "tariro.m@gmail.com",
    parentPhone: "+263 77 333 4455",
    interest: "Form 1 Day Scholar & Music Bursary",
    date: "Today",
    status: "New",
    notes: "Inquiring about cello lessons and orchestral scholarship auditions.",
  },
];

class SchoolFinderAPI {
  private apiUrl: string = import.meta.env.VITE_API_URL || "";

  // Helper to get local stored enquiries
  private getLocalEnquiries(): Enquiry[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ENQUIRIES);
      return data ? JSON.parse(data) : DEFAULT_ENQUIRIES;
    } catch {
      return DEFAULT_ENQUIRIES;
    }
  }

  // Helper to save local stored enquiries
  private setLocalEnquiries(enquiries: Enquiry[]) {
    try {
      localStorage.setItem(STORAGE_KEY_ENQUIRIES, JSON.stringify(enquiries));
    } catch {}
  }

  // Helper to get school overrides (for updates made in School Dashboard)
  private getSchoolOverrides(): Record<string, Partial<School>> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SCHOOL_OVERRIDES);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  // Helper to save school overrides
  private setSchoolOverrides(overrides: Record<string, Partial<School>>) {
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL_OVERRIDES, JSON.stringify(overrides));
    } catch {}
  }

  // 1. SCHOOLS
  schools = {
    list: async (filters?: { province?: string; query?: string }): Promise<School[]> => {
      // If remote Cloudflare API URL is configured, try it
      if (this.apiUrl) {
        try {
          const res = await fetch(`${this.apiUrl}/api/schools`);
          if (res.ok) {
            const data = await res.json();
            if (data.schools && Array.isArray(data.schools)) {
              return data.schools;
            }
          }
        } catch (e) {
          console.warn("Cloudflare API unavailable, using local data", e);
        }
      }

      // Local / Offline fallback with user overrides
      const baseSchools = getAllSchools();
      const overrides = this.getSchoolOverrides();

      return baseSchools.map((s) => ({
        ...s,
        ...(overrides[s.id] || {}),
      }));
    },

    get: async (id: string): Promise<School | undefined> => {
      const all = await this.schools.list();
      return all.find((s) => s.id === id);
    },

    update: async (id: string, updates: Partial<School>): Promise<boolean> => {
      // 1. Try remote Cloudflare / Neon worker if configured
      if (this.apiUrl) {
        try {
          await fetch(`${this.apiUrl}/api/schools/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
          });
        } catch {}
      }

      // 2. Persist locally
      const overrides = this.getSchoolOverrides();
      overrides[id] = { ...(overrides[id] || {}), ...updates };
      this.setSchoolOverrides(overrides);
      return true;
    },
  };

  // 2. ENQUIRIES / APPLICATIONS
  enquiries = {
    list: async (schoolId?: string, parentEmail?: string): Promise<Enquiry[]> => {
      if (this.apiUrl) {
        try {
          const params = new URLSearchParams();
          if (schoolId) params.append("schoolId", schoolId);
          if (parentEmail) params.append("parentEmail", parentEmail);
          const res = await fetch(`${this.apiUrl}/api/enquiries?${params}`);
          if (res.ok) {
            const d = await res.json();
            if (d.enquiries) return d.enquiries;
          }
        } catch {}
      }

      const list = this.getLocalEnquiries();
      if (schoolId) {
        return list.filter((e) => e.schoolId === schoolId);
      }
      if (parentEmail) {
        return list.filter((e) => e.parentEmail.toLowerCase() === parentEmail.toLowerCase());
      }
      return list;
    },

    create: async (enquiry: Omit<Enquiry, "id" | "date" | "status">): Promise<Enquiry> => {
      const newEnq: Enquiry = {
        id: `enq-${Date.now()}`,
        date: "Today",
        status: "New",
        ...enquiry,
      };

      if (this.apiUrl) {
        try {
          await fetch(`${this.apiUrl}/api/enquiries`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newEnq),
          });
        } catch {}
      }

      const current = this.getLocalEnquiries();
      const updated = [newEnq, ...current];
      this.setLocalEnquiries(updated);
      return newEnq;
    },

    updateStatus: async (id: string, status: Enquiry["status"]): Promise<boolean> => {
      if (this.apiUrl) {
        try {
          await fetch(`${this.apiUrl}/api/enquiries/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
        } catch {}
      }

      const list = this.getLocalEnquiries();
      const updated = list.map((e) => (e.id === id ? { ...e, status } : e));
      this.setLocalEnquiries(updated);
      return true;
    },
  };

  // 3. REVIEWS
  reviews = {
    list: async (schoolId?: string): Promise<Review[]> => {
      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      const customReviews: Review[] = stored ? JSON.parse(stored) : [];
      const all = [...customReviews, ...REVIEWS];
      return schoolId ? all.filter((r) => r.schoolId === schoolId) : all;
    },

    create: async (review: Omit<Review, "id" | "date" | "avatar"> & { avatar?: string }): Promise<Review> => {
      const newRev: Review = {
        id: `rev-${Date.now()}`,
        date: "Just now",
        avatar: review.avatar || "photo-1534528741775-53994a69daeb",
        ...review,
      };

      if (this.apiUrl) {
        try {
          await fetch(`${this.apiUrl}/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRev),
          });
        } catch {}
      }

      const stored = localStorage.getItem(STORAGE_KEY_REVIEWS);
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem(STORAGE_KEY_REVIEWS, JSON.stringify([newRev, ...list]));
      return newRev;
    },
  };
}

export const api = new SchoolFinderAPI();
