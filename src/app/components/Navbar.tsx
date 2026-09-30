import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import { Icon } from "./Icon";
import { useCompare } from "../lib/compare";
import { RoleSwitcher } from "./RoleSwitcher";

const LINKS = [
  { to: "/search", label: "Find Schools", icon: "search" },
  { to: "/compare", label: "Compare", icon: "balance" },
  { to: "/resources", label: "Resources", icon: "menu_book" },
  { to: "/about", label: "About", icon: "info" },
  { to: "/contact", label: "Contact", icon: "mail" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { ids, favorites, openSpotlight, userRole } = useCompare();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="size-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
            style={{ background: "var(--brand-blue)" }}
          >
            <Icon name="school" size={24} fill />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-1.5">
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--brand-blue)", fontSize: "1.1rem" }}>
                School Finder
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[var(--brand-sky)]/30 text-[var(--brand-blue)]">
                ZW
              </span>
            </div>
            <div className="text-[10px] tracking-widest text-muted-foreground uppercase font-semibold">
              Zimbabwe
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative py-2 text-sm transition-colors flex items-center gap-1.5 ${
                  isActive
                    ? "text-[var(--brand-blue)] font-bold"
                    : "text-foreground/80 hover:text-foreground font-medium"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span>{l.label}</span>
                  {l.to === "/compare" && ids.length > 0 && (
                    <span
                      className="px-1.5 py-0.2 rounded-full text-[10px] font-bold shadow-2xs"
                      style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
                    >
                      {ids.length}
                    </span>
                  )}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full"
                      style={{ background: "var(--brand-blue)" }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Quick Spotlight Search Icon Button */}
          <button
            onClick={openSpotlight}
            className="p-2 rounded-xl text-muted-foreground hover:text-[var(--brand-blue)] hover:bg-secondary/30 transition flex items-center justify-center"
            title="Search schools (Ctrl+K)"
            aria-label="Search"
          >
            <Icon name="search" size={20} />
          </button>

          {/* Saved wishlist quick icon */}
          <Link
            to="/dashboard"
            className="relative p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-secondary/30 transition flex items-center justify-center"
            title="Saved Schools Wishlist"
            aria-label="Saved Schools"
          >
            <Icon name="favorite" size={20} className={favorites.length > 0 ? "text-rose-500" : ""} fill={favorites.length > 0} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 size-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Persona Role Switcher */}
          <RoleSwitcher />

          {/* List School Button */}
          <button
            onClick={() => navigate("/list-your-school")}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs transition-all shadow-xs hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
            style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 600 }}
          >
            <Icon name="add_business" size={16} />
            <span>List School</span>
          </button>
        </div>


        {/* Mobile controls */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            onClick={openSpotlight}
            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground"
            aria-label="Open global search"
          >
            <Icon name="search" size={20} />
          </button>

          <Link
            to="/dashboard"
            className="p-2 rounded-lg hover:bg-secondary/40 text-muted-foreground relative"
            aria-label="Saved Schools"
          >
            <Icon name="favorite" size={20} className={favorites.length > 0 ? "text-rose-500" : ""} fill={favorites.length > 0} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 size-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <button
            className="p-2 rounded-lg hover:bg-secondary/40 text-foreground transition"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          >
            <Icon name={open ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>


      {/* Mobile Drawer Menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-white/98 backdrop-blur-md px-4 py-4 flex flex-col gap-1.5 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* Mobile Persona Switcher Strip */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-secondary/20 mb-2 border border-border">
            <span className="text-xs text-muted-foreground font-semibold">Active Persona:</span>
            <RoleSwitcher />
          </div>

          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition ${
                  isActive
                    ? "bg-[var(--brand-blue)] text-white font-semibold"
                    : "hover:bg-secondary/40 text-foreground font-medium"
                }`
              }
            >
              <div className="flex items-center gap-2.5">
                <Icon name={l.icon} size={20} />
                <span>{l.label}</span>
              </div>
              {l.to === "/compare" && ids.length > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
                >
                  {ids.length} selected
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-2 border-t border-border mt-1 flex flex-col gap-2">
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[var(--brand-blue)] bg-secondary/30 hover:bg-secondary/50 transition"
            >
              <Icon name="dashboard" size={18} />
              Parent & Student Portal
            </Link>

            <button
              onClick={() => {
                setOpen(false);
                navigate("/list-your-school");
              }}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-xs"
              style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
            >
              <Icon name="add_business" size={18} />
              List Your School
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
