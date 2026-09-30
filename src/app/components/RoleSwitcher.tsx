import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Icon } from "./Icon";
import { useCompare, UserRole } from "../lib/compare";
import { useAuth, TEMP_ACCOUNTS } from "../lib/auth";
import { toast } from "sonner";

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { userRole, switchRole } = useCompare();
  const { user, loginWithTempCredentials, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectRole = (newRole: UserRole, email?: string) => {
    switchRole(newRole);
    if (newRole === "guest") {
      logout();
    } else if (email) {
      loginWithTempCredentials(email);
    } else if (newRole === "school") {
      loginWithTempCredentials("admin@princeedward.co.zw");
    } else {
      loginWithTempCredentials("parent@demo.co.zw");
    }
    setOpen(false);

    if (newRole === "school") {
      navigate("/school-dashboard");
    } else if (newRole === "parent") {
      navigate("/dashboard");
    }
  };

  const displayName = user.role !== "guest" ? user.name.split(" ")[0] : "Guest";
  const badgeLabel = user.role !== "guest" ? user.badge : "Guest";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-border bg-white hover:bg-secondary/20 transition text-xs font-semibold text-foreground shadow-2xs cursor-pointer"
        title="Switch demo persona"
      >
        <span
          className="size-2 rounded-full shrink-0"
          style={{
            background:
              user.role === "school"
                ? "var(--brand-blue)"
                : user.role === "parent"
                ? "var(--brand-mustard)"
                : "#10b981",
          }}
        />
        <span className="max-w-[85px] truncate font-medium">{displayName}</span>
        <span className="text-[10px] px-1 py-0.2 rounded bg-secondary/40 text-muted-foreground font-bold">
          {badgeLabel}
        </span>
        <Icon name={open ? "expand_less" : "expand_more"} size={14} className="text-muted-foreground shrink-0" />
      </button>


      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-border shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border mb-1.5">
            <div className="text-xs font-bold text-[var(--brand-blue)] flex items-center justify-between">
              <span>Demo Role Switcher</span>
              <span className="text-[10px] font-normal text-muted-foreground">Instant Testing</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Parents don&apos;t need an account to use the platform. Switch roles below to test all user journeys:
            </p>
          </div>

          <div className="space-y-1">
            {/* Guest */}
            <button
              onClick={() => handleSelectRole("guest")}
              className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                userRole === "guest" ? "bg-emerald-50 border border-emerald-200" : "hover:bg-secondary/25"
              }`}
            >
              <div className="size-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="person_outline" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Guest Explorer</span>
                  {userRole === "guest" && (
                    <span className="text-[10px] font-bold text-emerald-700">Active</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  100% features available with no login: search, compare, fee calculators & enquiries.
                </p>
              </div>
            </button>

            {/* Parent */}
            <button
              onClick={() => handleSelectRole("parent")}
              className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 ${
                userRole === "parent" ? "bg-amber-50 border border-amber-200" : "hover:bg-secondary/25"
              }`}
            >
              <div className="size-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="family_restroom" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Tendai Moyo (Parent)</span>
                  {userRole === "parent" && (
                    <span className="text-[10px] font-bold text-amber-800">Active</span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                  Parent portal demo: admission tracking, saved wishlists, fee budgets & review history.
                </p>
              </div>
            </button>

            {/* School Admin: Prince Edward */}
            <button
              onClick={() => handleSelectRole("school", "admin@princeedward.co.zw")}
              className={`w-full text-left p-2 rounded-xl transition flex items-start gap-2.5 ${
                user.email === "admin@princeedward.co.zw" ? "bg-blue-50 border border-blue-200" : "hover:bg-secondary/25"
              }`}
            >
              <div className="size-8 rounded-lg bg-blue-100 text-[var(--brand-blue)] flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="domain" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground truncate">Prince Edward Admin</span>
                  {user.email === "admin@princeedward.co.zw" && (
                    <span className="text-[10px] font-bold text-[var(--brand-blue)]">Active</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  admin@princeedward.co.zw
                </p>
              </div>
            </button>

            {/* School Admin: Arundel */}
            <button
              onClick={() => handleSelectRole("school", "admin@arundel.co.zw")}
              className={`w-full text-left p-2 rounded-xl transition flex items-start gap-2.5 ${
                user.email === "admin@arundel.co.zw" ? "bg-blue-50 border border-blue-200" : "hover:bg-secondary/25"
              }`}
            >
              <div className="size-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                <Icon name="corporate_fare" size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground truncate">Arundel School Admin</span>
                  {user.email === "admin@arundel.co.zw" && (
                    <span className="text-[10px] font-bold text-indigo-700">Active</span>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground truncate">
                  admin@arundel.co.zw
                </p>
              </div>
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-border flex items-center justify-between px-2 text-[11px] text-muted-foreground">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/login");
              }}
              className="text-[var(--brand-blue)] font-bold hover:underline"
            >
              Custom Login / Clerk →
            </button>
            <button
              onClick={() => {
                logout();
                switchRole("guest");
                setOpen(false);
                navigate("/");
              }}
              className="text-rose-600 font-semibold hover:underline"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
