import { NavLink } from "react-router";
import { Icon } from "./Icon";
import { useCompare } from "../lib/compare";

export function MobileBottomNav() {
  const { ids, favorites, openSpotlight } = useCompare();

  const NAV_ITEMS = [
    { to: "/", label: "Home", icon: "home" },
    { to: "/search", label: "Search", icon: "search" },
    { to: "/compare", label: "Compare", icon: "balance", badge: ids.length },
    { to: "/dashboard", label: "Saved", icon: "favorite", badge: favorites.length },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-2 py-1 shadow-lg">
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all ${
                isActive
                  ? "text-[var(--brand-blue)] font-bold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <Icon
                    name={item.icon}
                    size={22}
                    fill={isActive && item.icon !== "balance"}
                    className={isActive ? "text-[var(--brand-blue)]" : ""}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className="absolute -top-1.5 -right-2 size-4.5 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
                      style={{
                        background: item.to === "/compare" ? "var(--brand-mustard)" : "#f43f5e",
                        color: item.to === "/compare" ? "var(--brand-text)" : "#fff",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0.5 size-1 rounded-full bg-[var(--brand-blue)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Global Search Pill on Mobile Bottom Bar */}
        <button
          onClick={openSpotlight}
          className="flex flex-col items-center justify-center py-1.5 px-3 rounded-xl text-muted-foreground hover:text-[var(--brand-blue)] transition"
          aria-label="Open global search"
        >
          <div className="size-6 rounded-lg bg-secondary/40 flex items-center justify-center text-[var(--brand-blue)]">
            <Icon name="manage_search" size={18} />
          </div>
          <span className="text-[10px] mt-0.5 font-medium">Quick</span>
        </button>
      </div>
    </div>
  );
}
