import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Rating } from "../components/Rating";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAllSchools, REVIEWS, unsplash } from "../lib/data";
import { useCompare } from "../lib/compare";
import { useAuth } from "../lib/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { toast } from "sonner";

const APPLICATIONS = [
  { id: "app-1", school: "Prince Edward School", stage: "Interview Scheduled", date: "12 Oct 2026", status: "Interview", color: "var(--brand-mustard)", notes: "Bring original birth certificate and Grade 7 report." },
  { id: "app-2", school: "Arundel School", stage: "Offer of Admission Received", date: "05 Oct 2026", status: "Offer", color: "var(--success)", notes: "Acceptance deposit required by 25 Oct 2026." },
  { id: "app-3", school: "Gateway High School", stage: "Application Under Review", date: "28 Sep 2026", status: "Review", color: "var(--brand-blue)", notes: "Admissions office reviewing academic records." },
];

const ACTIVITY = [
  { m: "May", v: 4 },
  { m: "Jun", v: 7 },
  { m: "Jul", v: 12 },
  { m: "Aug", v: 18 },
  { m: "Sep", v: 24 },
  { m: "Oct", v: 15 },
];

function StatCard({ icon, label, value, accent }: { icon: string; label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <div
          className="size-10 rounded-xl flex items-center justify-center"
          style={{ background: accent ? "rgba(255,184,0,0.18)" : "rgba(165,206,234,0.35)", color: accent ? "#8a6400" : "var(--brand-blue)" }}
        >
          <Icon name={icon} size={22} />
        </div>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)", fontSize: "1.8rem" }} className="mt-3">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
    </div>
  );
}

export function ParentDashboard() {
  const [tab, setTab] = useState("Overview");
  const { favorites, toggleFavorite, ids, toggle } = useCompare();
  const { user } = useAuth();

  // Find actual saved schools from dynamic list
  const allSchools = getAllSchools();
  const savedSchools = allSchools.filter((s) => favorites.includes(s.id));

  const displayName = user.role !== "guest" ? user.name : "Guest Family";
  const displaySubtitle = user.role !== "guest"
    ? `${user.subtitle} • ${user.email}`
    : "Browsing in Guest Mode (No sign-up required. Saved schools stay in your browser.)";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Welcome Profile Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-card rounded-3xl border border-border p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <ImageWithFallback
            src={unsplash(user.avatar || "photo-1500648767791-00dcc994a43e", 120, 120)}
            alt={displayName}
            className="size-14 rounded-2xl object-cover border-2 border-white shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ fontSize: "1.6rem" }} className="font-extrabold text-[var(--brand-blue)]">
                {user.role === "guest" ? "Guest Family Portal" : `Welcome, ${displayName}`}
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--brand-sky)]/40 text-[var(--brand-blue)] font-bold">
                {user.badge}
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              {displaySubtitle}
            </p>
          </div>
        </div>


        <div className="flex items-center gap-2.5">
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white text-xs font-semibold shadow-xs transition hover:opacity-90"
            style={{ background: "var(--brand-blue)" }}
          >
            <Icon name="search" size={16} />
            Find New Schools
          </Link>
          <Link
            to="/compare"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-border bg-white text-xs font-semibold text-foreground hover:bg-secondary/20 transition"
          >
            <Icon name="balance" size={16} />
            Compare ({ids.length})
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon="favorite" label="Saved Wishlist" value={String(favorites.length)} />
        <StatCard icon="description" label="Active Applications" value="3" accent />
        <StatCard icon="balance" label="Schools in Compare" value={String(ids.length)} />
        <StatCard icon="rate_review" label="Reviews Contributed" value="4" />
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {["Overview", "Applications (3)", `Saved Schools (${favorites.length})`, "My Reviews"].map((t) => {
          const tabKey = t.split(" ")[0];
          const active = tab === tabKey;
          return (
            <button
              key={t}
              onClick={() => setTab(tabKey)}
              className={`relative px-4 py-3 text-sm whitespace-nowrap font-medium transition ${
                active ? "text-[var(--brand-blue)] font-bold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {active && (
                <span
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: "var(--brand-mustard)" }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* TAB: OVERVIEW & APPLICATIONS */}
      {(tab === "Overview" || tab === "Applications") && (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-[var(--brand-blue)]">Admission Application Tracker</h3>
              <span className="text-xs text-muted-foreground">3 applications active</span>
            </div>

            <div className="space-y-3.5">
              {APPLICATIONS.map((a) => (
                <div key={a.id} className="p-4 rounded-xl border border-border bg-white hover:border-[var(--brand-blue)] transition">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-lg bg-[var(--brand-sky)]/30 flex items-center justify-center text-[var(--brand-blue)]">
                        <Icon name="school" size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-[var(--brand-blue)]">{a.school}</span>
                        <div className="text-[11px] text-muted-foreground">{a.stage} • Due: {a.date}</div>
                      </div>
                    </div>
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full text-white font-bold"
                      style={{ background: a.color }}
                    >
                      {a.status}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary/15 p-2 rounded-lg mt-2 flex items-center gap-2">
                    <Icon name="info" size={15} className="text-[var(--brand-blue)] shrink-0" />
                    <span>{a.notes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
            <h3 className="font-bold text-base text-[var(--brand-blue)] mb-1">Search & View Activity</h3>
            <p className="text-xs text-muted-foreground mb-4">Your school exploration history</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#64707C" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#64707C" }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(165,206,234,0.2)" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
                />
                <Bar dataKey="v" fill="var(--brand-blue)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TAB: SAVED SCHOOLS */}
      {(tab === "Overview" || tab === "Saved") && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[var(--brand-blue)]">Saved Wishlist Schools</h3>
              <p className="text-xs text-muted-foreground">Schools you've bookmarked for your family</p>
            </div>
            {savedSchools.length > 0 && (
              <Link to="/compare" className="text-xs font-semibold text-[var(--brand-blue)] hover:underline">
                Compare All Saved →
              </Link>
            )}
          </div>

          {savedSchools.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSchools.map((s) => (
                <div key={s.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-md transition flex flex-col justify-between">
                  <div className="flex">
                    <ImageWithFallback
                      src={unsplash(s.photo, 240, 200)}
                      alt={s.name}
                      className="w-28 object-cover shrink-0"
                    />
                    <div className="p-3.5 flex-1 min-w-0">
                      <Link to={`/school/${s.id}`} className="hover:underline font-bold text-sm text-[var(--brand-blue)] truncate block">
                        {s.name}
                      </Link>
                      <div className="text-[11px] text-muted-foreground truncate mt-0.5">{s.location}</div>
                      <div className="mt-2">
                        <Rating value={s.rating} size={12} />
                      </div>
                      <div className="text-xs font-bold text-[var(--brand-blue)] mt-1.5">
                        ${s.startingFees}<span className="text-[10px] text-muted-foreground font-normal">/term</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-3.5 py-2 bg-secondary/10 border-t border-border flex items-center justify-between text-xs">
                    <button
                      onClick={() => {
                        toggle(s.id);
                        toast.info(ids.includes(s.id) ? "Removed from compare" : "Added to compare");
                      }}
                      className="text-[var(--brand-blue)] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Icon name="balance" size={14} />
                      {ids.includes(s.id) ? "In Compare" : "+ Compare"}
                    </button>
                    <button
                      onClick={() => {
                        toggleFavorite(s.id);
                        toast.success(`Removed ${s.name} from wishlist`);
                      }}
                      className="text-rose-500 hover:text-rose-700 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <Icon name="favorite_border" size={32} className="text-muted-foreground/50 mx-auto" />
              <p className="text-sm font-semibold mt-2">No saved schools yet</p>
              <p className="text-xs text-muted-foreground mt-0.5">Click the heart icon on any school card to save it here.</p>
              <Link
                to="/search"
                className="inline-block mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white"
                style={{ background: "var(--brand-blue)" }}
              >
                Browse Schools
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB: MY REVIEWS */}
      {tab === "My" && (
        <div className="space-y-4 mt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-[var(--brand-blue)]">Reviews You've Published</h3>
            <span className="text-xs text-muted-foreground">Showing verified parent contributions</span>
          </div>

          <div className="space-y-3">
            {REVIEWS.slice(0, 2).map((r) => (
              <div key={r.id} className="bg-card rounded-2xl border border-border p-5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-[var(--brand-blue)]">{r.school}</h4>
                    <div className="text-[11px] text-muted-foreground">Submitted {r.date}</div>
                  </div>
                  <Rating value={r.rating} showValue={false} size={14} />
                </div>
                <div className="font-semibold text-xs mt-2 text-foreground">{r.title}</div>
                <p className="text-xs text-muted-foreground mt-1">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
