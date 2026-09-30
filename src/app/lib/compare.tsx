import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAllSchools } from "./data";
import { toast } from "sonner";

export type UserRole = "guest" | "parent" | "school";

export interface UserProfile {
  role: UserRole;
  name: string;
  email: string;
  subtitle: string;
  badge: string;
  avatar?: string;
}

export const USER_PROFILES: Record<UserRole, UserProfile> = {
  guest: {
    role: "guest",
    name: "Guest Explorer",
    email: "",
    subtitle: "Browsing as Guest (No login required)",
    badge: "Guest",
  },
  parent: {
    role: "parent",
    name: "Tendai Moyo",
    email: "tendai.moyo@gmail.com",
    subtitle: "Parent of Two (Grade 7 & Form 3)",
    badge: "Parent",
    avatar: "photo-1614023342667-6f060e9d1e04",
  },
  school: {
    role: "school",
    name: "Prince Edward School",
    email: "admin@princeedward.co.zw",
    subtitle: "Head of Admissions & Administration",
    badge: "School Admin",
    avatar: "photo-1599305445671-ac291c95aaa9",
  },
};

type CompareCtx = {
  ids: string[];
  toggle: (id: string) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  favorites: string[];
  toggleFavorite: (id: string) => void;
  hasFavorite: (id: string) => boolean;
  userRole: UserRole;
  userProfile: UserProfile;
  switchRole: (role: UserRole) => void;
  isSpotlightOpen: boolean;
  openSpotlight: () => void;
  closeSpotlight: () => void;
  dataVersion: number;
  triggerDataRefresh: () => void;
};

const Ctx = createContext<CompareCtx | null>(null);

const STORAGE_KEY_COMPARE = "school_finder_compare_ids";
const STORAGE_KEY_FAVS = "school_finder_favorite_ids";
const STORAGE_KEY_ROLE = "school_finder_user_role";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COMPARE);
      const parsed: string[] = saved ? JSON.parse(saved) : [];
      const valid = new Set(getAllSchools().map((s) => s.id));
      const clean = parsed.filter((id) => valid.has(id));
      return clean.slice(0, 6);
    } catch {
      return [];
    }
  });


  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVS);
      return saved ? JSON.parse(saved) : ["prince-edward", "arundel"];
    } catch {
      return ["prince-edward", "arundel"];
    }
  });

  const [userRole, setUserRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ROLE) as UserRole;
      return saved && USER_PROFILES[saved] ? saved : "guest";
    } catch {
      return "guest";
    }
  });

  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    const handleUpdate = () => setDataVersion((v) => v + 1);
    window.addEventListener("school_data_updated", handleUpdate);
    return () => window.removeEventListener("school_data_updated", handleUpdate);
  }, []);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((open) => !open);
      } else if (e.key === "Escape") {
        setIsSpotlightOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COMPARE, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, [ids]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  const switchRole = (role: UserRole) => {
    setUserRole(role);
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch {
      // ignore
    }
  };

  const toggle = (id: string) =>
    setIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (prev.length >= 6) {
        toast.warning("Comparison limit reached (max 6 schools). Remove one to add another.");
        return prev;
      }
      return [...prev, id];
    });

  const add = (id: string) =>
    setIds((prev) => {
      if (prev.includes(id)) return prev;
      if (prev.length >= 6) {
        toast.warning("Comparison limit reached (max 6 schools). Remove one to add another.");
        return prev;
      }
      return [...prev, id];
    });


  const remove = (id: string) =>
    setIds((prev) => prev.filter((x) => x !== id));

  const clear = () => setIds([]);
  const has = (id: string) => ids.includes(id);

  const toggleFavorite = (id: string) =>
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const hasFavorite = (id: string) => favorites.includes(id);

  const openSpotlight = () => setIsSpotlightOpen(true);
  const closeSpotlight = () => setIsSpotlightOpen(false);
  const triggerDataRefresh = () => setDataVersion((v) => v + 1);

  return (
    <Ctx.Provider
      value={{
        ids,
        toggle,
        add,
        remove,
        clear,
        has,
        favorites,
        toggleFavorite,
        hasFavorite,
        userRole,
        userProfile: USER_PROFILES[userRole] || USER_PROFILES.guest,
        switchRole,
        isSpotlightOpen,
        openSpotlight,
        closeSpotlight,
        dataVersion,
        triggerDataRefresh,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

