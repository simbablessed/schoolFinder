import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export type AuthRole = "guest" | "parent" | "school" | "admin";

export interface TempAccount {
  email: string;
  name: string;
  role: AuthRole;
  schoolId?: string;
  schoolName?: string;
  avatar?: string;
  subtitle: string;
  badge: string;
}

// Preset Temp Credentials for Instant Testing
export const TEMP_ACCOUNTS: Record<string, TempAccount> = {
  // School Admins
  "admin@princeedward.co.zw": {
    email: "admin@princeedward.co.zw",
    name: "Prince Edward School Admin",
    role: "school",
    schoolId: "prince-edward",
    schoolName: "Prince Edward School",
    avatar: "photo-1599305445671-ac291c95aaa9",
    subtitle: "Admissions & School Administration",
    badge: "School Admin",
  },
  "admin@arundel.co.zw": {
    email: "admin@arundel.co.zw",
    name: "Arundel School Administration",
    role: "school",
    schoolId: "arundel",
    schoolName: "Arundel School",
    avatar: "photo-1580582932707-520aed937b7b",
    subtitle: "Head of Admissions & Bursary",
    badge: "School Admin",
  },
  "admin@peterhouse.co.zw": {
    email: "admin@peterhouse.co.zw",
    name: "Peterhouse Bursar Office",
    role: "school",
    schoolId: "peterhouse",
    schoolName: "Peterhouse Boys",
    avatar: "photo-1562774053-701939374585",
    subtitle: "Marondera Campus Admissions",
    badge: "School Admin",
  },
  "admin@stgeorges.co.zw": {
    email: "admin@stgeorges.co.zw",
    name: "St. George's College Office",
    role: "school",
    schoolId: "st-georges",
    schoolName: "St. George's College",
    avatar: "photo-1523050854058-8df90110c9f1",
    subtitle: "Jesuit Education Council",
    badge: "School Admin",
  },

  // Parents
  "parent@demo.co.zw": {
    email: "parent@demo.co.zw",
    name: "Tendai Moyo",
    role: "parent",
    avatar: "photo-1500648767791-00dcc994a43e",
    subtitle: "Parent of Two (Grade 7 & Form 3)",
    badge: "Parent",
  },
  "tendai.moyo@gmail.com": {
    email: "tendai.moyo@gmail.com",
    name: "Tendai Moyo",
    role: "parent",
    avatar: "photo-1614023342667-6f060e9d1e04",
    subtitle: "Parent of Two (Grade 7 & Form 3)",
    badge: "Parent",
  },
  "chipo.ncube@zimfamily.co.zw": {
    email: "chipo.ncube@zimfamily.co.zw",
    name: "Chipo Ncube",
    role: "parent",
    avatar: "photo-1534528741775-53994a69daeb",
    subtitle: "Parent in Bulawayo (Form 1 Applicant)",
    badge: "Parent",
  },
};

export const GUEST_USER: TempAccount = {
  email: "",
  name: "Guest Explorer",
  role: "guest",
  subtitle: "Browsing as Guest (No login required)",
  badge: "Guest",
};

interface AuthContextType {
  user: TempAccount;
  isAuthenticated: boolean;
  isSchoolAdmin: boolean;
  isParent: boolean;
  loginWithTempCredentials: (email: string) => boolean;
  loginWithCustom: (email: string, role: AuthRole, name?: string, schoolId?: string) => void;
  logout: () => void;
  clerkPublishableKey: string | undefined;
  isClerkEnabled: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_AUTH_USER = "school_finder_auth_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const isClerkEnabled = Boolean(clerkPublishableKey && clerkPublishableKey.startsWith("pk_"));

  const [user, setUser] = useState<TempAccount>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_AUTH_USER);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    // Default to Guest or Demo
    return GUEST_USER;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_AUTH_USER, JSON.stringify(user));
    } catch {}
  }, [user]);

  const loginWithTempCredentials = (email: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const match = TEMP_ACCOUNTS[cleanEmail];
    if (match) {
      setUser(match);
      toast.success(`Logged in as ${match.name} (${match.badge})`);
      return true;
    }

    // Heuristic detection: if ends with .co.zw or school domain, treat as school admin
    if (cleanEmail.startsWith("admin@") || cleanEmail.includes("school")) {
      const domain = cleanEmail.split("@")[1]?.split(".")[0] || "school";
      const customSchool: TempAccount = {
        email: cleanEmail,
        name: `${domain.toUpperCase()} Administration`,
        role: "school",
        schoolId: domain,
        schoolName: `${domain.toUpperCase()} High School`,
        subtitle: "Admissions Department",
        badge: "School Admin",
      };
      setUser(customSchool);
      toast.success(`Logged in as School Admin (${customSchool.email})`);
      return true;
    }

    // Default to custom parent account
    const customParent: TempAccount = {
      email: cleanEmail,
      name: cleanEmail.split("@")[0].replace(".", " "),
      role: "parent",
      subtitle: "Verified Parent Account",
      badge: "Parent",
    };
    setUser(customParent);
    toast.success(`Logged in as ${customParent.name}`);
    return true;
  };

  const loginWithCustom = (email: string, role: AuthRole, name?: string, schoolId?: string) => {
    const newUser: TempAccount = {
      email,
      name: name || email.split("@")[0],
      role,
      schoolId: schoolId || (role === "school" ? "prince-edward" : undefined),
      schoolName: schoolId ? schoolId.replace("-", " ") : (role === "school" ? "Prince Edward School" : undefined),
      subtitle: role === "school" ? "School Administration" : "Parent Account",
      badge: role === "school" ? "School Admin" : "Parent",
    };
    setUser(newUser);
    toast.success(`Logged in as ${newUser.name}`);
  };

  const logout = () => {
    setUser(GUEST_USER);
    localStorage.removeItem(STORAGE_AUTH_USER);
    toast.info("Logged out successfully");
  };

  const isSchoolAdmin = user.role === "school";
  const isParent = user.role === "parent";
  const isAuthenticated = user.role !== "guest";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isSchoolAdmin,
        isParent,
        loginWithTempCredentials,
        loginWithCustom,
        logout,
        clerkPublishableKey,
        isClerkEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
