import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Icon } from "./Icon";
import { PROVINCES, SCHOOL_TYPES, getAllSchools, unsplash } from "../lib/data";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function SearchBar({ compact = false }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [province, setProvince] = useState("");
  const [type, setType] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allSchools = getAllSchools();
  const suggestions = q.trim().length > 1
    ? allSchools.filter(s =>
        s.name.toLowerCase().includes(q.toLowerCase()) ||
        s.location.toLowerCase().includes(q.toLowerCase()) ||
        s.type.toLowerCase().includes(q.toLowerCase())
      ).slice(0, 4)
    : [];


  const submit = () => {
    setShowDropdown(false);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (province) params.set("province", province);
    if (type) params.set("type", type);
    navigate(`/search?${params.toString()}`);
  };

  const handleSelectSchool = (schoolId: string) => {
    setShowDropdown(false);
    navigate(`/school/${schoolId}`);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <div
        className={`bg-white rounded-2xl shadow-xl border border-border p-2 flex flex-col md:flex-row gap-2 ${
          compact ? "" : "md:items-stretch"
        } transition-shadow focus-within:shadow-2xl focus-within:border-[var(--brand-blue)]`}
      >
        {/* Search Input with Clear Button */}
        <div className="flex items-center gap-2 flex-1 px-3 relative">
          <Icon name="search" className="text-muted-foreground shrink-0" size={20} />
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
              if (e.key === "Escape") setShowDropdown(false);
            }}
            placeholder="Search by school name, city, or curriculum..."
            className="w-full py-3 outline-none bg-transparent text-sm placeholder:text-muted-foreground text-foreground"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                setShowDropdown(false);
              }}
              className="text-muted-foreground hover:text-foreground p-1 rounded-full"
              title="Clear search"
            >
              <Icon name="close" size={16} />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-border my-2" />

        {/* Province Selector */}
        <div className="flex items-center gap-2 px-3 md:min-w-[170px] border-t md:border-t-0 border-border">
          <Icon name="map" className="text-muted-foreground shrink-0" size={19} />
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full py-2.5 outline-none bg-transparent text-sm cursor-pointer text-foreground font-medium"
          >
            <option value="">All 10 Provinces</option>
            {PROVINCES.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-border my-2" />

        {/* Type Selector */}
        <div className="flex items-center gap-2 px-3 md:min-w-[160px] border-t md:border-t-0 border-border">
          <Icon name="category" className="text-muted-foreground shrink-0" size={19} />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full py-2.5 outline-none bg-transparent text-sm cursor-pointer text-foreground font-medium"
          >
            <option value="">All School Types</option>
            {SCHOOL_TYPES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Search Submit Button */}
        <button
          onClick={submit}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm transition-all hover:opacity-95 active:scale-[0.98] shrink-0 font-semibold text-white shadow-xs"
          style={{ background: "var(--brand-blue)" }}
        >
          <Icon name="search" size={18} />
          <span>Explore</span>
        </button>
      </div>

      {/* Live Suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-border shadow-2xl overflow-hidden z-50 text-left animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-4 py-2 bg-secondary/20 border-b border-border flex items-center justify-between text-xs text-muted-foreground font-semibold">
            <span>Matching Schools</span>
            <span>Press Enter to search all</span>
          </div>
          <div className="divide-y divide-border">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onClick={() => handleSelectSchool(s.id)}
                className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-secondary/30 transition text-left group"
              >
                <div className="size-11 rounded-lg overflow-hidden shrink-0 border border-border">
                  <ImageWithFallback
                    src={unsplash(s.photo, 100, 100)}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm text-[var(--brand-blue)] group-hover:underline truncate">
                      {s.name}
                    </span>
                    {s.verified && (
                      <Icon name="verified" size={14} fill className="text-[var(--brand-mustard)] shrink-0" />
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span className="truncate">{s.location}</span>
                    <span>•</span>
                    <span className="shrink-0">{s.type}</span>
                    <span>•</span>
                    <span className="font-medium text-foreground">${s.startingFees}/term</span>
                  </div>
                </div>
                <Icon name="arrow_forward" size={16} className="text-muted-foreground group-hover:text-[var(--brand-blue)] transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
          </div>
          <button
            onClick={submit}
            className="w-full py-2.5 px-4 bg-muted/40 hover:bg-muted text-xs text-center font-medium text-[var(--brand-blue)] block transition"
          >
            View all results for "{q}" →
          </button>
        </div>
      )}

      {/* Popular Fast Tags */}
      {!compact && (
        <div className="flex items-center gap-2 mt-3.5 flex-wrap justify-center text-xs text-muted-foreground">
          <span className="font-medium">Popular:</span>
          {[
            { label: "Boarding Schools", query: "type=Boarding+School" },
            { label: "Cambridge High Schools", query: "q=Cambridge" },
            { label: "Harare Top Rated", query: "province=Harare" },
            { label: "Bulawayo", query: "province=Bulawayo" },
            { label: "Primary Schools", query: "type=Primary+School" },
          ].map((tag) => (
            <button
              key={tag.label}
              onClick={() => navigate(`/search?${tag.query}`)}
              className="px-2.5 py-1 rounded-full bg-white/80 hover:bg-white text-[var(--brand-text)] border border-border/80 shadow-2xs hover:border-[var(--brand-blue)] transition text-[11px] font-medium"
            >
              {tag.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
