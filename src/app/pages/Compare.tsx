import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Rating } from "../components/Rating";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAllSchools, unsplash, School } from "../lib/data";
import { useCompare } from "../lib/compare";
import { toast } from "sonner";

const PRESETS = [
  { label: "Harare Boys Colleges", ids: ["prince-edward", "st-georges"] },
  { label: "Leading Girls & Co-ed", ids: ["arundel", "peterhouse", "gateway"] },
  { label: "Bulawayo Classics", ids: ["petra-college", "cbc"] },
];

export function Compare() {
  const { ids, toggle, clear, add, dataVersion } = useCompare();
  const [highlightDiff, setHighlightDiff] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerProvince, setPickerProvince] = useState<string>("All");

  const allSchools = getAllSchools();
  const schools = allSchools.filter((s) => ids.includes(s.id));
  const availableSchools = allSchools.filter((s) => !ids.includes(s.id));
  const filteredAvailableSchools = availableSchools.filter((s) => {
    const matchesQuery =
      pickerQuery.trim() === "" ||
      s.name.toLowerCase().includes(pickerQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(pickerQuery.toLowerCase()) ||
      s.curriculum.some((c) => c.toLowerCase().includes(pickerQuery.toLowerCase()));
    const matchesProvince =
      pickerProvince === "All" || s.province.toLowerCase() === pickerProvince.toLowerCase();
    return matchesQuery && matchesProvince;
  });

  // Close picker on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPickerOpen) {
        setIsPickerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPickerOpen]);


  // Metrics for "Best in Class"
  const highestRating = Math.max(...(schools.length ? schools.map((s) => s.rating) : [0]));
  const highestPassRate = Math.max(...(schools.length ? schools.map((s) => s.passRate) : [0]));
  const lowestFee = Math.min(...(schools.length ? schools.map((s) => s.startingFees) : [99999]));

  const loadPreset = (presetIds: string[]) => {
    clear();
    presetIds.forEach((id) => add(id));
    toast.success("Loaded preset comparison!");
  };

  const handlePrint = () => {
    window.print();
  };

  const ROWS: {
    label: string;
    icon: string;
    isDiff?: (schools: School[]) => boolean;
    render: (s: School) => React.ReactNode;
  }[] = [
    {
      label: "Rating & Reviews",
      icon: "star",
      isDiff: (sc) => new Set(sc.map((x) => x.rating)).size > 1,
      render: (s) => (
        <div className="flex items-center gap-2">
          <Rating value={s.rating} count={s.reviews} size={15} />
          {s.rating === highestRating && schools.length > 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
              Top
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Location",
      icon: "location_on",
      isDiff: (sc) => new Set(sc.map((x) => x.province)).size > 1,
      render: (s) => <span>{s.location}</span>,
    },
    {
      label: "Starting Fees",
      icon: "payments",
      isDiff: (sc) => new Set(sc.map((x) => x.startingFees)).size > 1,
      render: (s) => (
        <div className="flex items-center gap-2">
          <span style={{ fontWeight: 800, color: "var(--brand-blue)", fontFamily: "var(--font-display)", fontSize: "1.05rem" }}>
            ${s.startingFees.toLocaleString()}
            <span className="text-xs text-muted-foreground font-normal"> /term</span>
          </span>
          {s.startingFees === lowestFee && schools.length > 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Lowest
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Exam Pass Rate",
      icon: "trending_up",
      isDiff: (sc) => new Set(sc.map((x) => x.passRate)).size > 1,
      render: (s) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-secondary/40 overflow-hidden" style={{ maxWidth: 80 }}>
            <div className="h-full rounded-full bg-[var(--brand-blue)]" style={{ width: `${s.passRate}%` }} />
          </div>
          <span className="text-xs font-bold">{s.passRate}%</span>
          {s.passRate === highestPassRate && schools.length > 1 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Best
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Boarding Options",
      icon: "night_shelter",
      isDiff: (sc) => new Set(sc.map((x) => x.boarding)).size > 1,
      render: (s) =>
        s.boarding ? (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-[var(--brand-blue)] font-semibold border border-blue-200">
            <Icon name="check_circle" size={13} fill className="text-[var(--brand-blue)]" /> Boarding & Day
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full text-muted-foreground bg-muted">
            <Icon name="cancel" size={13} /> Day Scholar Only
          </span>
        ),
    },
    {
      label: "Gender Profile",
      icon: "groups",
      isDiff: (sc) => new Set(sc.map((x) => x.gender)).size > 1,
      render: (s) => <span className="font-medium text-xs">{s.gender}</span>,
    },
    {
      label: "School Type",
      icon: "school",
      isDiff: (sc) => new Set(sc.map((x) => x.type)).size > 1,
      render: (s) => <span className="text-xs font-medium">{s.type}</span>,
    },
    {
      label: "Learner Population",
      icon: "group",
      render: (s) => <span className="text-xs">{s.students.toLocaleString()} Learners</span>,
    },
    {
      label: "Year Founded",
      icon: "history_edu",
      render: (s) => <span className="text-xs">{s.founded}</span>,
    },
    {
      label: "Curricula",
      icon: "menu_book",
      render: (s) => (
        <div className="flex flex-wrap gap-1">
          {s.curriculum.map((c) => (
            <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary/50 text-[var(--brand-blue)] font-semibold">
              {c}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: "Key Facilities",
      icon: "apartment",
      render: (s) => (
        <div className="flex flex-wrap gap-1">
          {s.facilities.map((f) => (
            <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {f}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4 font-medium">
          <Link to="/" className="hover:text-[var(--brand-blue)] transition">Home</Link>
          <Icon name="chevron_right" size={14} />
          <Link to="/search" className="hover:text-[var(--brand-blue)] transition">Schools</Link>
          <Icon name="chevron_right" size={14} />
          <span style={{ color: "var(--brand-blue)", fontWeight: 600 }}>Compare Tool</span>
        </nav>

        {/* Header with Title and Control Buttons */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 style={{ fontSize: "2rem" }} className="font-extrabold text-[var(--brand-blue)] leading-tight">
              Compare Schools Side-by-Side
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {schools.length > 0
                ? `Analyzing ${schools.length} institution${schools.length > 1 ? "s" : ""} on fees, pass rates, curricula, and facilities.`
                : "Select schools to examine key academic and financial differences."}
            </p>
          </div>

          {/* Quick presets or actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            {schools.length > 0 && (
              <div className="flex items-center rounded-xl bg-secondary/30 p-1 border border-border">
                <button
                  onClick={() => setViewMode("cards")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === "cards"
                      ? "bg-white text-[var(--brand-blue)] shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Card View (ideal for mobile)"
                >
                  <Icon name="grid_view" size={15} />
                  <span>Cards</span>
                </button>
                <button
                  onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    viewMode === "table"
                      ? "bg-white text-[var(--brand-blue)] shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Table View (side-by-side criteria)"
                >
                  <Icon name="table_chart" size={15} />
                  <span>Table</span>
                </button>
              </div>
            )}

            {schools.length > 1 && (
              <button
                onClick={() => setHighlightDiff(!highlightDiff)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  highlightDiff
                    ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                    : "bg-white border-border text-foreground hover:bg-secondary/20"
                }`}
              >
                <Icon name="difference" size={16} />
                <span>Highlight Differences</span>
              </button>
            )}


            {schools.length > 0 && (
              <>
                {schools.length < 6 && (
                  <button
                    onClick={() => setIsPickerOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white shadow-2xs hover:opacity-90 transition cursor-pointer"
                    style={{ background: "var(--brand-blue)" }}
                  >
                    <Icon name="add" size={16} /> Add School ({schools.length}/6)
                  </button>
                )}
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-border text-foreground hover:bg-secondary/20 transition"
                  title="Print comparison"
                >
                  <Icon name="print" size={16} />
                  Print
                </button>
                <button
                  onClick={() => {
                    clear();
                    toast.info("Cleared all compared schools");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-white border border-border hover:bg-rose-50 transition"
                >
                  <Icon name="delete" size={16} /> Clear All
                </button>
              </>
            )}
          </div>
        </div>

        {/* Popular Comparison Presets Bar */}
        <div className="bg-white rounded-2xl border border-border p-3.5 mb-8 flex flex-wrap items-center gap-2 text-xs shadow-2xs">
          <span className="font-bold text-[var(--brand-blue)] flex items-center gap-1">
            <Icon name="auto_awesome" size={16} className="text-[var(--brand-mustard)]" />
            Popular Comparisons:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => loadPreset(p.ids)}
              className="px-3 py-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-foreground font-medium transition"
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {schools.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-border text-center px-4 shadow-xs">
            <div className="size-18 rounded-2xl bg-secondary/30 flex items-center justify-center text-[var(--brand-blue)] mb-4">
              <Icon name="balance" size={36} />
            </div>
            <h2 className="text-xl font-bold text-foreground">No schools selected yet</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Choose one of the popular comparisons above, or browse schools and click the <strong>Compare</strong> button on any school card.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <Link
                to="/search"
                className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-xs"
                style={{ background: "var(--brand-blue)" }}
              >
                Browse All Schools
              </Link>
              <button
                onClick={() => loadPreset(["prince-edward", "st-georges"])}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-border bg-white hover:bg-secondary/20"
              >
                Try Sample Comparison
              </button>
            </div>
          </div>
        ) : viewMode === "cards" ? (
          /* Cards Comparison Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((s) => {
              const isBestPass = s.passRate === highestPassRate && schools.length > 1;
              const isLowestFee = s.startingFees === lowestFee && schools.length > 1;
              const isTopRating = s.rating === highestRating && schools.length > 1;

              return (
                <div
                  key={s.id}
                  className="bg-white rounded-3xl border border-border overflow-hidden shadow-xs hover:shadow-md transition flex flex-col"
                >
                  {/* Photo & Badges */}
                  <div className="relative aspect-16/9 bg-secondary/30">
                    <ImageWithFallback
                      src={unsplash(s.photo, 600, 340)}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => toggle(s.id)}
                      className="absolute top-3 right-3 size-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition shadow-xs"
                      title={`Remove ${s.name}`}
                    >
                      <Icon name="close" size={16} />
                    </button>

                    <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                      {isLowestFee && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold shadow-xs">
                          💰 Lowest Fee
                        </span>
                      )}
                      {isBestPass && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold shadow-xs">
                          🏆 Best Pass Rate ({s.passRate}%)
                        </span>
                      )}
                      {isTopRating && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold shadow-xs">
                          ⭐ Top Rated ({s.rating})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <Link to={`/school/${s.id}`} className="hover:underline">
                          <h3 className="font-extrabold text-lg text-[var(--brand-blue)] leading-tight">
                            {s.name}
                          </h3>
                        </Link>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Icon name="location_on" size={13} />
                          <span>{s.location}</span>
                        </div>
                      </div>
                      {s.verified && (
                        <Icon name="verified" size={18} fill className="text-[var(--brand-blue)] shrink-0" />
                      )}
                    </div>

                    {/* Highlights Strip */}
                    <div className="grid grid-cols-3 gap-2 my-4 p-3 rounded-2xl bg-secondary/20 text-center">
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase">Rating</div>
                        <div className="text-sm font-bold text-foreground mt-0.5 flex items-center justify-center gap-1">
                          <Icon name="star" size={14} fill className="text-amber-500" />
                          <span>{s.rating}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase">Fee/Term</div>
                        <div className="text-sm font-extrabold text-[var(--brand-blue)] mt-0.5">
                          ${s.startingFees}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-muted-foreground font-semibold uppercase">Pass Rate</div>
                        <div className="text-sm font-bold text-emerald-600 mt-0.5">
                          {s.passRate}%
                        </div>
                      </div>
                    </div>

                    {/* Criteria specifications */}
                    <div className="space-y-2 text-xs flex-1">
                      <div className="flex items-center justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon name="night_shelter" size={15} /> Boarding
                        </span>
                        <span className="font-semibold text-foreground">
                          {s.boarding ? "Boarding & Day" : "Day Only"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon name="groups" size={15} /> Gender
                        </span>
                        <span className="font-semibold text-foreground">{s.gender}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon name="school" size={15} /> School Type
                        </span>
                        <span className="font-semibold text-foreground">{s.type}</span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-border/60">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Icon name="group" size={15} /> Learners
                        </span>
                        <span className="font-semibold text-foreground">{s.students.toLocaleString()}</span>
                      </div>

                      <div className="pt-2">
                        <span className="text-[11px] font-bold text-muted-foreground block mb-1">Curricula:</span>
                        <div className="flex flex-wrap gap-1">
                          {s.curriculum.map((c) => (
                            <span key={c} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary/50 text-[var(--brand-blue)] font-semibold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-[11px] font-bold text-muted-foreground block mb-1">Facilities:</span>
                        <div className="flex flex-wrap gap-1">
                          {s.facilities.slice(0, 4).map((f) => (
                            <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              {f}
                            </span>
                          ))}
                          {s.facilities.length > 4 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                              +{s.facilities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-5 pt-4 border-t border-border flex items-center gap-2">
                      <Link
                        to={`/school/${s.id}`}
                        className="flex-1 text-center py-2.5 px-3 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-2xs"
                        style={{ background: "var(--brand-blue)" }}
                      >
                        View Full Profile
                      </Link>
                      <button
                        onClick={() => toggle(s.id)}
                        className="px-3 py-2.5 rounded-xl text-xs font-semibold border border-border hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Remove from comparison"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Add more schools slot */}
            {schools.length < 6 && (
              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="min-h-[360px] rounded-3xl border-2 border-dashed border-border hover:border-[var(--brand-blue)] flex flex-col items-center justify-center p-6 text-center text-muted-foreground hover:text-[var(--brand-blue)] transition group bg-secondary/5 hover:bg-secondary/10 cursor-pointer"
              >
                <div className="size-14 rounded-2xl bg-white border border-border flex items-center justify-center mb-3 shadow-xs group-hover:scale-110 transition-transform text-[var(--brand-blue)]">
                  <Icon name="add" size={28} />
                </div>
                <h4 className="font-bold text-base text-foreground group-hover:text-[var(--brand-blue)]">
                  Add Another School
                </h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
                  Compare up to 6 schools at once side-by-side ({schools.length}/6 selected)
                </p>
                <span className="mt-3 text-xs font-semibold px-3 py-1 rounded-full bg-white border border-border group-hover:border-[var(--brand-blue)] group-hover:bg-blue-50 text-[var(--brand-blue)] transition">
                  + Choose School
                </span>
              </button>
            )}
          </div>
        ) : (
          /* Comparison Table Container */
          <div className="bg-white rounded-3xl border border-border shadow-xs overflow-hidden">
            <div className="md:hidden px-4 py-2 bg-amber-50 text-amber-900 border-b border-amber-200 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1 font-medium">
                <Icon name="swipe" size={16} /> Swipe table left & right
              </span>
              <button onClick={() => setViewMode("cards")} className="font-bold underline text-[var(--brand-blue)]">
                Switch to Cards
              </button>
            </div>
            {/* Horizontal Scroll wrapper */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left">
                {/* School Headers */}
                <thead>
                  <tr className="border-b border-border bg-secondary/15">
                    <th className="p-5 w-52 text-xs font-bold uppercase tracking-wider text-muted-foreground sticky left-0 bg-secondary/15 z-20">
                      Criteria
                    </th>
                    {schools.map((s) => (
                      <th key={s.id} className="p-5 w-64 min-w-[240px] align-top">
                        <div className="flex flex-col justify-between h-full">
                          <div className="relative mb-3 rounded-xl overflow-hidden aspect-16/9 bg-secondary/30 border border-border">
                            <ImageWithFallback
                              src={unsplash(s.photo, 400, 225)}
                              alt={s.name}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => toggle(s.id)}
                              className="absolute top-2 right-2 size-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition"
                              title={`Remove ${s.name}`}
                            >
                              <Icon name="close" size={14} />
                            </button>
                          </div>
                          <div>
                            <Link to={`/school/${s.id}`} className="hover:underline">
                              <h3 className="font-bold text-base text-[var(--brand-blue)] leading-tight">
                                {s.name}
                              </h3>
                            </Link>
                            <div className="text-xs text-muted-foreground mt-0.5">{s.location}</div>
                          </div>
                          <div className="mt-3 pt-2">
                            <Link
                              to={`/school/${s.id}`}
                              className="block text-center py-2 px-3 rounded-xl text-xs font-semibold text-white transition hover:opacity-90 shadow-2xs"
                              style={{ background: "var(--brand-blue)" }}
                            >
                              View School Profile
                            </Link>
                          </div>
                        </div>
                      </th>
                    ))}
                    {schools.length < 6 && (
                      <th className="p-5 w-48 text-center align-middle bg-secondary/5">
                        <button
                          type="button"
                          onClick={() => setIsPickerOpen(true)}
                          className="w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-border hover:border-[var(--brand-blue)] text-muted-foreground hover:text-[var(--brand-blue)] transition group cursor-pointer bg-white/60 hover:bg-white"
                        >
                          <div className="size-10 rounded-xl bg-secondary/30 group-hover:bg-blue-50 flex items-center justify-center mb-1 text-[var(--brand-blue)] transition">
                            <Icon name="add" size={22} />
                          </div>
                          <span className="text-xs font-bold text-foreground group-hover:text-[var(--brand-blue)]">Add School</span>
                          <span className="text-[11px] text-muted-foreground mt-0.5">{schools.length}/6 selected</span>
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* Rows */}
                <tbody className="divide-y divide-border">
                  {ROWS.map((row) => {
                    const isDifferent = row.isDiff ? row.isDiff(schools) : false;
                    const rowHighlight = highlightDiff && isDifferent;

                    return (
                      <tr
                        key={row.label}
                        className={`transition ${rowHighlight ? "bg-amber-50/70" : "hover:bg-secondary/10"}`}
                      >
                        {/* Row header */}
                        <td className="p-4 pl-5 font-bold text-xs text-[var(--brand-blue)] sticky left-0 bg-white z-10 border-r border-border">
                          <div className="flex items-center gap-2">
                            <Icon name={row.icon} size={17} className="text-muted-foreground" />
                            <span>{row.label}</span>
                          </div>
                        </td>

                        {/* Values per school */}
                        {schools.map((s) => (
                          <td key={s.id} className="p-4 text-xs text-foreground align-middle border-r border-border/60 last:border-r-0">
                            {row.render(s)}
                          </td>
                        ))}

                        {schools.length < 6 && <td className="bg-secondary/5" />}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* In-page School Picker Dialog Modal */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => {
            setIsPickerOpen(false);
            setPickerQuery("");
          }}
        >
          <div
            className="bg-white rounded-3xl border border-border shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
            role="dialog"
            aria-modal="true"
            aria-label="Add school to comparison"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between bg-secondary/10">
              <div>
                <h3 className="font-extrabold text-lg text-[var(--brand-blue)] flex items-center gap-2">
                  <Icon name="compare_arrows" size={22} />
                  Add School to Compare ({schools.length}/6)
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select an institution to compare side-by-side with your existing choices.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsPickerOpen(false);
                  setPickerQuery("");
                }}
                className="size-8 rounded-full bg-secondary/30 hover:bg-secondary/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition cursor-pointer"
                aria-label="Close modal"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Modal Filter Controls */}
            <div className="p-4 border-b border-border bg-white flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Icon
                  name="search"
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search school name, location, or curriculum..."
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  className="w-full pl-10 pr-12 py-2 text-xs rounded-xl border border-border bg-secondary/15 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] transition"
                  autoFocus
                />
                {pickerQuery && (
                  <button
                    onClick={() => setPickerQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Province Selector */}
              <select
                value={pickerProvince}
                onChange={(e) => setPickerProvince(e.target.value)}
                aria-label="Filter by province"
                className="px-3 py-2 text-xs rounded-xl border border-border bg-secondary/15 font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] cursor-pointer"
              >
                <option value="All">All Provinces</option>
                <option value="Harare">Harare</option>
                <option value="Bulawayo">Bulawayo</option>
                <option value="Mashonaland East">Mashonaland East</option>
                <option value="Manicaland">Manicaland</option>
                <option value="Midlands">Midlands</option>
                <option value="Masvingo">Masvingo</option>
                <option value="Matabeleland North">Matabeleland North</option>
                <option value="Matabeleland South">Matabeleland South</option>
              </select>
            </div>

            {/* Modal School List */}
            <div className="p-4 overflow-y-auto space-y-2.5 max-h-[50vh]">
              {filteredAvailableSchools.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  <Icon name="school" size={40} className="mx-auto mb-2 opacity-30" />
                  <p className="font-semibold text-sm">No schools found</p>
                  <p className="text-xs mt-1">
                    {availableSchools.length === 0
                      ? "You have already added all available schools to compare."
                      : "Try a different search term or province filter."}
                  </p>
                </div>
              ) : (
                filteredAvailableSchools.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-2xl border border-border hover:border-[var(--brand-blue)] bg-white hover:bg-secondary/5 transition flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="size-14 rounded-xl overflow-hidden bg-secondary/30 shrink-0 border border-border/80">
                        <ImageWithFallback
                          src={unsplash(s.photo, 100, 100)}
                          alt={s.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-sm text-[var(--brand-blue)] truncate">
                          {s.name}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Icon name="location_on" size={13} /> {s.location}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-emerald-700">
                            ${s.startingFees.toLocaleString()}/term
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-blue-700">{s.passRate}% pass</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 font-medium">
                            {s.type}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/30 font-medium">
                            {s.curriculum.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        add(s.id);
                        toast.success(`Added ${s.name} to comparison!`);
                        if (schools.length + 1 >= 6) {
                          setIsPickerOpen(false);
                        }
                      }}
                      className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white transition hover:opacity-90 shadow-2xs cursor-pointer"
                      style={{ background: "var(--brand-blue)" }}
                    >
                      <Icon name="add" size={15} />
                      <span>Add</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-border bg-secondary/10 flex items-center justify-between text-xs text-muted-foreground">
              <span>Currently comparing {schools.length} of max 6 schools</span>
              <div className="flex items-center gap-2">
                <Link
                  to="/search"
                  onClick={() => setIsPickerOpen(false)}
                  className="text-[var(--brand-blue)] hover:underline font-semibold"
                >
                  Explore all in search →
                </Link>
                <button
                  onClick={() => {
                    setIsPickerOpen(false);
                    setPickerQuery("");
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-border bg-white text-foreground hover:bg-secondary/20 font-medium transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

