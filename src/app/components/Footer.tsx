import { Link } from "react-router";
import { Icon } from "./Icon";
import { toast } from "sonner";

const COLS = [
  {
    title: "Discover",
    links: [
      { label: "Find Schools", to: "/search" },
      { label: "Compare Schools", to: "/compare" },
      { label: "Top Rated", to: "/search" },
      { label: "Browse by Province", to: "/search" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", to: "/about" },
      { label: "Resources", to: "/resources" },
      { label: "Contact", to: "/contact" },
      { label: "For Schools", to: "/school-dashboard" },
    ],
  },
  {
    title: "For Schools",
    links: [
      { label: "List Your School", to: "/list-your-school" },
      { label: "School Dashboard", to: "/school-dashboard" },
      { label: "Log in", to: "/login" },
      { label: "Register", to: "/register" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="text-white mt-auto" style={{ background: "var(--brand-blue)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8">
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}>
                <Icon name="school" size={22} fill />
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem" }}>
                School Finder Zimbabwe
              </div>
            </Link>
            <p className="text-sm text-white/70 mt-4 max-w-xs leading-relaxed">
              Helping Zimbabwean families discover, compare and review schools with confidence and transparency.
            </p>
            <div className="flex gap-2 mt-5">
              {[
                { icon: "public", label: "Website" },
                { icon: "mail", label: "Email" },
                { icon: "call", label: "Phone" },
                { icon: "photo_camera", label: "Instagram" },
              ].map(({ icon, label }) => (
                <button
                  key={icon}
                  onClick={() => toast.info(`Connect with us on ${label}`)}
                  className="size-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
                  aria-label={label}
                >
                  <Icon name={icon} size={18} />
                </button>
              ))}
            </div>
          </div>
          {COLS.map((col) => (
            <div key={col.title}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }} className="mb-3">{col.title}</div>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-white/70 hover:text-white transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/15 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-white/60">
          <div>© 2026 School Finder Zimbabwe. All rights reserved.</div>
          <div className="flex gap-5">
            {["Privacy", "Terms", "Cookies"].map((label) => (
              <button key={label} onClick={() => toast.info(`${label} policy coming soon.`)} className="hover:text-white transition" style={{ background: "none", border: "none", cursor: "pointer", color: "inherit" }}>{label}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
