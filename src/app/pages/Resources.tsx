import { useState } from "react";
import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { RESOURCES, unsplash, Resource } from "../lib/data";
import { toast } from "sonner";

const CATEGORIES = ["All", "Guides", "Curriculum", "Finance", "Early Years"];

export function Resources() {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [readingArticle, setReadingArticle] = useState<Resource | null>(null);

  const filtered = RESOURCES.filter((r) => {
    const matchesCat = cat === "All" || r.category === cat;
    const matchesSearch =
      !search ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = RESOURCES[0];

  const handleShare = (r: Resource, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${window.location.origin}/resources#${r.id}`);
      toast.success("Article link copied!");
    } else {
      toast.info(`Article: ${r.title}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Banner */}
      <div style={{ background: "var(--brand-blue)" }} className="text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 text-xs mb-4 font-semibold tracking-wide">
            <Icon name="menu_book" size={16} /> Knowledge & Guidance Hub
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem,4vw,2.8rem)" }} className="font-extrabold leading-tight">
            Zimbabwe Education Resources
          </h1>
          <p className="text-white/80 max-w-xl mx-auto mt-3 text-sm leading-relaxed">
            Expert guides, curriculum comparisons, school fees navigation, and practical advice curated for Zimbabwean parents.
          </p>

          {/* Article Search Box */}
          <div className="mt-8 max-w-md mx-auto relative">
            <Icon name="search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search guides (e.g. ZIMSEC, fees, boarding)..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white text-foreground text-xs outline-none shadow-md placeholder:text-muted-foreground font-medium"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="close" size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Featured Hero Article */}
        {!search && cat === "All" && (
          <div
            onClick={() => setReadingArticle(featured)}
            className="group grid md:grid-cols-2 gap-6 bg-card rounded-3xl border border-border overflow-hidden mb-12 hover:shadow-xl transition cursor-pointer shadow-2xs"
          >
            <div className="h-64 md:h-auto overflow-hidden bg-secondary/30 relative">
              <ImageWithFallback
                src={unsplash(featured.image, 800, 500)}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--brand-mustard)] text-[var(--brand-text)] font-bold shadow-xs">
                  Featured Guide
                </span>
              </div>
            </div>

            <div className="p-8 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <span>{featured.category}</span>
                <span>•</span>
                <span>{featured.readTime}</span>
              </div>
              <h2 className="mt-3 text-xl sm:text-2xl font-bold text-[var(--brand-blue)] group-hover:underline leading-snug">
                {featured.title}
              </h2>
              <p className="text-muted-foreground mt-3 text-xs sm:text-sm leading-relaxed">
                {featured.excerpt}
              </p>
              <div className="flex items-center gap-1.5 mt-6 text-xs font-bold text-[var(--brand-blue)]">
                <span>Read Full Guide</span>
                <Icon name="arrow_forward" size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* Category Pills Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                  cat === c
                    ? "bg-[var(--brand-blue)] text-white shadow-xs"
                    : "bg-white border border-border text-foreground hover:bg-secondary/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="text-xs text-muted-foreground font-medium">
            Showing {filtered.length} guides
          </div>
        </div>

        {/* Article Cards Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <div
                key={r.id}
                onClick={() => setReadingArticle(r)}
                className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition cursor-pointer flex flex-col justify-between shadow-2xs hover:-translate-y-1 duration-200"
              >
                <div>
                  <div className="h-48 overflow-hidden bg-secondary/30 relative">
                    <ImageWithFallback
                      src={unsplash(r.image, 600, 360)}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <button
                      onClick={(e) => handleShare(r, e)}
                      className="absolute top-3 right-3 size-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-muted-foreground hover:text-foreground flex items-center justify-center transition shadow-xs"
                      title="Share guide"
                    >
                      <Icon name="share" size={15} />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-secondary/50 text-[var(--brand-blue)] font-bold text-[10px]">
                        {r.category}
                      </span>
                      <span>•</span>
                      <span>{r.readTime}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[var(--brand-blue)] mt-2.5 group-hover:underline line-clamp-2 leading-snug">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {r.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 border-t border-border flex items-center justify-between text-xs font-semibold text-[var(--brand-blue)]">
                  <span>Read Article</span>
                  <Icon name="arrow_forward" size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border p-12 text-center">
            <Icon name="search_off" size={36} className="text-muted-foreground/50 mx-auto" />
            <h3 className="text-base font-bold mt-3 text-foreground">No resources matched "{search}"</h3>
            <p className="text-xs text-muted-foreground mt-1">Try searching for "curriculum", "fees", or reset your category filter.</p>
            <button
              onClick={() => { setSearch(""); setCat("All"); }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white"
              style={{ background: "var(--brand-blue)" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* FULL ARTICLE READER MODAL */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setReadingArticle(null)} />
          <div className="relative bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--brand-sky)]/30 text-[var(--brand-blue)]">
                {readingArticle.category} • {readingArticle.readTime}
              </span>
              <button
                onClick={() => setReadingArticle(null)}
                className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden aspect-16/9 mb-6 bg-secondary/30">
              <ImageWithFallback
                src={unsplash(readingArticle.image, 1000, 560)}
                alt={readingArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-2xl font-extrabold text-[var(--brand-blue)] leading-tight mb-4">
              {readingArticle.title}
            </h2>

            <div className="prose text-xs sm:text-sm text-muted-foreground space-y-4 leading-relaxed">
              <p className="text-foreground font-medium text-sm sm:text-base leading-relaxed">
                {readingArticle.excerpt}
              </p>
              <p>
                When evaluating schools in Zimbabwe, families are often faced with diverse considerations ranging from academic track record and examination board accreditation to pastoral welfare, extracurricular sporting infrastructure, and long-term financial commitments.
              </p>
              <div className="p-4 rounded-xl bg-secondary/20 border border-border my-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[var(--brand-blue)] mb-1.5">
                  Key Recommendations for Zimbabwean Families:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs text-foreground">
                  <li>Visit prospective campuses in person during Open Days to observe classroom interaction.</li>
                  <li>Compare starting levies vs hidden termly costs (uniforms, boarding maintenance, and examination registration).</li>
                  <li>Consider the learner's emotional and social fit alongside pure academic pass rates.</li>
                </ul>
              </div>
              <p>
                School Finder Zimbabwe continues to gather verified insights and parent testimonials from all ten provinces to assist you in making the best educational choice for your children.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  toast.success("Article saved to your reading list!");
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-blue)] hover:underline"
              >
                <Icon name="bookmark" size={16} />
                Save Guide
              </button>
              <Link
                to="/search"
                onClick={() => setReadingArticle(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                style={{ background: "var(--brand-blue)" }}
              >
                Explore Schools Mentioned
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
