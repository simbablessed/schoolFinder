import { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { SchoolCard } from "../components/SchoolCard";
import { Icon } from "../components/Icon";
import { getAllSchools, PROVINCES, SCHOOL_TYPES } from "../lib/data";
import { useCompare } from "../lib/compare";
import { toast } from "sonner";

const GENDERS = ["Co-ed", "Boys", "Girls"];
const CURRICULA = ["Cambridge", "ZIMSEC", "IGCSE"];
const PAGE_SIZE = 6;

export function Search() {
  const { dataVersion } = useCompare();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [province, setProvince] = useState(params.get("province") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [genders, setGenders] = useState<string[]>([]);
  const [curricula, setCurricula] = useState<string[]>([]);
  const [boarding, setBoarding] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(2500);
  const [sort, setSort] = useState("rating");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    setQ(params.get("q") || "");
    setProvince(params.get("province") || "");
    setType(params.get("type") || "");
  }, [params]);

  const allSchools = useMemo(() => getAllSchools(), [dataVersion]);

  const results = useMemo(() => {
    let list = allSchools.filter((s) => {

      if (q) {
        const query = q.toLowerCase();
        const matchesName = s.name.toLowerCase().includes(query);
        const matchesDesc = s.description.toLowerCase().includes(query);
        const matchesLoc = s.location.toLowerCase().includes(query);
        const matchesCurriculum = s.curriculum.some((c) => c.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesLoc && !matchesCurriculum) return false;
      }
      if (province && s.province !== province) return false;
      if (type && s.type !== type) return false;
      if (genders.length && !genders.includes(s.gender)) return false;
      if (boarding && !s.boarding) return false;
      if (verifiedOnly && !s.verified) return false;
      if (curricula.length && !curricula.some((c) => s.curriculum.includes(c))) return false;
      if (s.rating < minRating) return false;
      if (s.startingFees > maxFee) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "pass-rate") return b.passRate - a.passRate;
      if (sort === "fee-low") return a.startingFees - b.startingFees;
      if (sort === "fee-high") return b.startingFees - a.startingFees;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });

    return list;
  }, [q, province, type, genders, boarding, verifiedOnly, curricula, minRating, maxFee, sort]);

  useEffect(() => setPage(1), [q, province, type, genders, boarding, verifiedOnly, curricula, minRating, maxFee, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const paged = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleGender = (g: string) =>
    setGenders((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const toggleCurriculum = (c: string) =>
    setCurricula((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));

  const clearAll = () => {
    setQ("");
    setProvince("");
    setType("");
    setGenders([]);
    setCurricula([]);
    setBoarding(false);
    setVerifiedOnly(false);
    setMinRating(0);
    setMaxFee(2500);
    setParams({});
    toast.info("All search filters reset");
  };

  const hasActiveFilters = Boolean(
    q || province || type || genders.length || curricula.length || boarding || verifiedOnly || minRating > 0 || maxFee < 2500
  );

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Icon name="tune" size={20} className="text-[var(--brand-blue)]" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }} className="text-base">
            Refine Search
          </span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold transition"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Province Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1.5">
          Province
        </label>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-[var(--brand-blue)] font-medium"
        >
          <option value="">All 10 Provinces</option>
          {PROVINCES.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({p.schools})
            </option>
          ))}
        </select>
      </div>

      {/* School Type */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-1.5">
          School Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm outline-none focus:border-[var(--brand-blue)] font-medium"
        >
          <option value="">All School Types</option>
          {SCHOOL_TYPES.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Curriculum Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-2">
          Curriculum Offered
        </label>
        <div className="flex flex-wrap gap-1.5">
          {CURRICULA.map((c) => {
            const active = curricula.includes(c);
            return (
              <button
                key={c}
                type="button"
                onClick={() => toggleCurriculum(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  active
                    ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)] shadow-xs"
                    : "bg-white text-muted-foreground border-border hover:border-[var(--brand-blue)]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender & Boarding */}
      <div>
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold block mb-2">
          Preferences
        </label>
        <div className="space-y-2">
          {GENDERS.map((g) => (
            <label key={g} className="flex items-center gap-2.5 text-sm cursor-pointer select-none text-foreground/90">
              <input
                type="checkbox"
                checked={genders.includes(g)}
                onChange={() => toggleGender(g)}
                className="accent-[var(--brand-blue)] size-4 rounded"
              />
              <span>{g}</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none text-foreground/90 pt-1">
            <input
              type="checkbox"
              checked={boarding}
              onChange={(e) => setBoarding(e.target.checked)}
              className="accent-[var(--brand-blue)] size-4 rounded"
            />
            <span>Boarding Facilities Available</span>
          </label>
          <label className="flex items-center gap-2.5 text-sm cursor-pointer select-none text-foreground/90">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="accent-[var(--brand-blue)] size-4 rounded"
            />
            <span className="flex items-center gap-1">
              Verified Schools Only
              <Icon name="verified" size={14} fill className="text-[var(--brand-mustard)]" />
            </span>
          </label>
        </div>
      </div>

      {/* Max Fee Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <label className="uppercase tracking-wider text-muted-foreground font-bold">
            Max Fee:
          </label>
          <span className="font-bold text-[var(--brand-blue)]">
            ${maxFee.toLocaleString()}/term
          </span>
        </div>
        <input
          type="range"
          min={500}
          max={2500}
          step={50}
          value={maxFee}
          onChange={(e) => setMaxFee(+e.target.value)}
          className="w-full accent-[var(--brand-mustard)] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>$500</span>
          <span>$1,500</span>
          <span>$2,500+</span>
        </div>
      </div>

      {/* Min Rating Slider */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <label className="uppercase tracking-wider text-muted-foreground font-bold">
            Minimum Rating:
          </label>
          <span className="font-bold text-[var(--brand-blue)] flex items-center gap-1">
            <Icon name="star" size={13} fill className="text-[var(--brand-mustard)]" />
            {minRating > 0 ? `${minRating.toFixed(1)}+` : "Any"}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={5}
          step={0.5}
          value={minRating}
          onChange={(e) => setMinRating(+e.target.value)}
          className="w-full accent-[var(--brand-mustard)] cursor-pointer"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header Search Banner */}
      <div style={{ background: "rgba(165,206,234,0.18)" }} className="border-b border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3 font-medium">
            <Link to="/" className="hover:text-[var(--brand-blue)]">Home</Link>
            <Icon name="chevron_right" size={14} />
            <span style={{ color: "var(--brand-blue)", fontWeight: 600 }}>Explore Schools</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 style={{ fontSize: "2rem" }} className="leading-tight font-extrabold text-[var(--brand-blue)]">
                Find Your Ideal School
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Explore accredited institutions with verified fees, curricula, and parent reviews.
              </p>
            </div>
          </div>

          {/* Quick search input */}
          <div className="mt-5 flex items-center gap-2 bg-white rounded-2xl border border-border px-3.5 py-1.5 shadow-sm max-w-2xl focus-within:border-[var(--brand-blue)] focus-within:shadow-md transition">
            <Icon name="search" className="text-muted-foreground shrink-0" size={20} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by school name, location, or subject..."
              className="w-full py-2.5 outline-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground font-medium"
            />
            {q && (
              <button onClick={() => setQ("")} className="p-1 text-muted-foreground hover:text-foreground">
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[280px_1fr] gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-22 shadow-xs">
            {FilterPanel}
          </div>
        </aside>

        {/* Results Stream */}
        <div>
          {/* Active Filter Tags */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mb-4 pb-3 border-b border-border">
              <span className="text-xs text-muted-foreground font-medium">Active filters:</span>
              {q && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  "{q}" <button onClick={() => setQ("")} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              {province && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  {province} <button onClick={() => setProvince("")} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  {type} <button onClick={() => setType("")} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              {boarding && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  Boarding <button onClick={() => setBoarding(false)} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              {verifiedOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  Verified Only <button onClick={() => setVerifiedOnly(false)} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              {curricula.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  {c} <button onClick={() => toggleCurriculum(c)} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              ))}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-border text-xs font-medium">
                  ★ {minRating}+ <button onClick={() => setMinRating(0)} className="hover:text-rose-500"><Icon name="close" size={12} /></button>
                </span>
              )}
              <button
                onClick={clearAll}
                className="text-xs text-rose-600 hover:underline font-semibold ml-1"
              >
                Reset all
              </button>
            </div>
          )}

          {/* Results Header: Count, Mobile filter button, View toggle, Sort */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="text-sm text-muted-foreground">
              Showing <span style={{ color: "var(--brand-blue)", fontWeight: 700 }}>{results.length}</span> schools found
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-sm font-medium shadow-xs"
              >
                <Icon name="tune" size={18} />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="size-2 rounded-full bg-[var(--brand-mustard)]" />
                )}
              </button>

              {/* View Mode Toggle: Grid vs List */}
              <div className="flex items-center rounded-xl border border-border bg-white p-0.5 shadow-2xs">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "grid" ? "bg-[var(--brand-blue)] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Grid view"
                >
                  <Icon name="grid_view" size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === "list" ? "bg-[var(--brand-blue)] text-white" : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="List view"
                >
                  <Icon name="view_list" size={18} />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2 rounded-xl border border-border bg-white text-sm outline-none cursor-pointer font-medium shadow-2xs text-foreground"
              >
                <option value="rating">Top Rated</option>
                <option value="pass-rate">Highest Pass Rate</option>
                <option value="fee-low">Fees: Low to High</option>
                <option value="fee-high">Fees: High to Low</option>
                <option value="name">Name (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Results Render */}
          {paged.length ? (
            <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
              {paged.map((s) => (
                <SchoolCard key={s.id} school={s} viewMode={viewMode} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border shadow-xs px-4">
              <div className="size-16 rounded-full bg-secondary/30 flex items-center justify-center mx-auto text-muted-foreground">
                <Icon name="search_off" size={32} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-foreground">No schools matched your criteria</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Try widening your fee range, removing specific filters, or searching across all provinces.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <button
                  onClick={clearAll}
                  className="px-4 py-2.5 rounded-xl text-sm text-white font-medium shadow-xs"
                  style={{ background: "var(--brand-blue)" }}
                >
                  Reset All Filters
                </button>
                <button
                  onClick={() => {
                    clearAll();
                    setProvince("Harare");
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm border border-border hover:bg-secondary/20 font-medium"
                >
                  Browse Harare
                </button>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-12">
              <button
                disabled={page === 1}
                onClick={() => {
                  setPage((p) => p - 1);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
                className="size-9 rounded-xl border border-border bg-white flex items-center justify-center disabled:opacity-40 hover:bg-secondary/40 transition shadow-2xs"
              >
                <Icon name="chevron_left" size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPage(p);
                    window.scrollTo({ top: 200, behavior: "smooth" });
                  }}
                  className={`size-9 rounded-xl text-sm font-semibold transition ${
                    p === page
                      ? "bg-[var(--brand-blue)] text-white shadow-xs"
                      : "bg-white border border-border hover:bg-secondary/30 text-foreground"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => {
                  setPage((p) => p + 1);
                  window.scrollTo({ top: 200, behavior: "smooth" });
                }}
                className="size-9 rounded-xl border border-border bg-white flex items-center justify-center disabled:opacity-40 hover:bg-secondary/40 transition shadow-2xs"
              >
                <Icon name="chevron_right" size={20} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter slide-over drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-84 max-w-[88%] bg-card p-6 overflow-y-auto shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-border mb-4">
                <span className="font-bold text-base text-[var(--brand-blue)]">Search Filters</span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>
              {FilterPanel}
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl text-white text-sm font-semibold shadow-xs"
                style={{ background: "var(--brand-blue)" }}
              >
                Show {results.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
