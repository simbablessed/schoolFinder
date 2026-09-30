import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Icon } from "./Icon";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getAllSchools, unsplash, PROVINCES } from "../lib/data";
import { useCompare } from "../lib/compare";
import { motion, AnimatePresence } from "motion/react";

export function SpotlightSearch() {
  const { isSpotlightOpen, closeSpotlight, dataVersion, ids, toggle } = useCompare();
  const [query, setQuery] = useState("");
  const [schools, setSchools] = useState(() => getAllSchools());
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setSchools(getAllSchools());
  }, [dataVersion]);

  useEffect(() => {
    if (isSpotlightOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isSpotlightOpen]);

  if (!isSpotlightOpen) return null;

  const q = query.toLowerCase().trim();

  const filteredSchools = q
    ? schools.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.location.toLowerCase().includes(q) ||
          s.province.toLowerCase().includes(q) ||
          s.type.toLowerCase().includes(q) ||
          s.curriculum.some((c) => c.toLowerCase().includes(q))
      ).slice(0, 6)
    : schools.slice(0, 4);

  const matchedProvinces = q
    ? PROVINCES.filter((p) => p.name.toLowerCase().includes(q))
    : [];

  const handleSelectSchool = (id: string) => {
    closeSpotlight();
    navigate(`/school/${id}`);
  };

  const handleSearchFilter = (filterType: string, value: string) => {
    closeSpotlight();
    navigate(`/search?${filterType}=${encodeURIComponent(value)}`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[80vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Search Input Box */}
          <div className="p-4 border-b border-border flex items-center gap-3 bg-secondary/10">
            <Icon name="search" size={22} className="text-[var(--brand-blue)] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search schools, cities, curricula (e.g. Arundel, Cambridge, Bulawayo)..."
              className="flex-1 bg-transparent text-foreground text-base outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="size-6 rounded-full hover:bg-secondary/40 text-muted-foreground flex items-center justify-center transition"
              >
                <Icon name="close" size={16} />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-semibold text-muted-foreground bg-white border border-border shadow-2xs">
              ESC
            </kbd>
          </div>

          {/* Quick Filter Chips (when query is empty) */}
          {!query && (
            <div className="px-4 py-2.5 bg-secondary/5 border-b border-border flex items-center gap-2 overflow-x-auto text-xs">
              <span className="text-muted-foreground shrink-0 font-medium">Quick find:</span>
              <button
                onClick={() => handleSearchFilter("boarding", "true")}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition shrink-0 font-medium"
              >
                🏠 Boarding Schools
              </button>
              <button
                onClick={() => handleSearchFilter("curriculum", "Cambridge")}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition shrink-0 font-medium"
              >
                🎓 Cambridge
              </button>
              <button
                onClick={() => handleSearchFilter("province", "Harare")}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition shrink-0 font-medium"
              >
                📍 Harare
              </button>
              <button
                onClick={() => handleSearchFilter("province", "Bulawayo")}
                className="px-2.5 py-1 rounded-full bg-white border border-border hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)] transition shrink-0 font-medium"
              >
                📍 Bulawayo
              </button>
            </div>
          )}

          {/* Results List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Matched Provinces if any */}
            {matchedProvinces.length > 0 && (
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                  Provinces
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {matchedProvinces.map((prov) => (
                    <button
                      key={prov.name}
                      onClick={() => handleSearchFilter("province", prov.name)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-secondary/30 text-left transition group"
                    >
                      <div className="flex items-center gap-2">
                        <Icon name="location_on" size={16} className="text-[var(--brand-blue)]" />
                        <span className="text-sm font-semibold group-hover:text-[var(--brand-blue)]">
                          {prov.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{prov.schools} schools</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* School Results */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1.5 flex items-center justify-between">
                <span>{q ? "Matching Schools" : "Top Featured Schools"}</span>
                <span className="text-[10px] font-normal lowercase">{filteredSchools.length} results</span>
              </div>
              {filteredSchools.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  <Icon name="search_off" size={28} className="mx-auto mb-2 opacity-50" />
                  No schools found matching &ldquo;{query}&rdquo;.
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        closeSpotlight();
                        navigate("/list-your-school");
                      }}
                      className="text-xs font-semibold text-[var(--brand-blue)] hover:underline"
                    >
                      Can&apos;t find your school? List it now &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredSchools.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSchool(s.id)}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-secondary/25 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-secondary/30">
                          <ImageWithFallback
                            src={unsplash(s.photo, 80, 80)}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-foreground group-hover:text-[var(--brand-blue)] truncate">
                              {s.name}
                            </span>
                            {s.verified && (
                              <Icon name="verified" size={14} fill className="text-[var(--brand-blue)] shrink-0" />
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
                            <span>{s.location}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold">{s.passRate}% Pass Rate</span>
                            <span>•</span>
                            <span>${s.startingFees}/term</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => toggle(s.id)}
                          className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition ${
                            ids.includes(s.id)
                              ? "bg-[var(--brand-mustard)] border-[var(--brand-mustard)] text-[var(--brand-text)] font-semibold"
                              : "border-border hover:bg-secondary/40 text-muted-foreground"
                          }`}
                          title={ids.includes(s.id) ? "Remove from comparison" : "Add to comparison"}
                        >
                          <Icon name="balance" size={14} />
                          <span className="hidden sm:inline">
                            {ids.includes(s.id) ? "Added" : "Compare"}
                          </span>
                        </button>
                        <Icon name="chevron_right" size={16} className="text-muted-foreground group-hover:text-[var(--brand-blue)] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick System Navigation Links */}
            <div className="border-t border-border pt-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                Quick Shortcuts
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs">
                <button
                  onClick={() => {
                    closeSpotlight();
                    navigate("/search");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/25 text-left text-muted-foreground hover:text-foreground transition font-medium"
                >
                  <Icon name="manage_search" size={16} className="text-[var(--brand-blue)]" />
                  Advanced Filter Search
                </button>
                <button
                  onClick={() => {
                    closeSpotlight();
                    navigate("/compare");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/25 text-left text-muted-foreground hover:text-foreground transition font-medium"
                >
                  <Icon name="balance" size={16} className="text-[var(--brand-mustard)]" />
                  Side-by-Side Comparison
                </button>
                <button
                  onClick={() => {
                    closeSpotlight();
                    navigate("/list-your-school");
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/25 text-left text-muted-foreground hover:text-foreground transition font-medium"
                >
                  <Icon name="add_business" size={16} className="text-emerald-600" />
                  List Your School Free
                </button>
              </div>
            </div>
          </div>

          {/* Footer bar */}
          <div className="px-4 py-2.5 bg-secondary/15 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Tip: Press</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-border text-[10px] font-mono">
                Ctrl + K
              </kbd>
              <span>anywhere to reopen</span>
            </div>
            <button
              onClick={closeSpotlight}
              className="text-xs font-semibold text-[var(--brand-blue)] hover:underline"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
