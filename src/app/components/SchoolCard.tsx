import { Link } from "react-router";
import { School, unsplash } from "../lib/data";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Icon } from "./Icon";
import { Rating } from "./Rating";
import { useCompare } from "../lib/compare";
import { toast } from "sonner";

export function SchoolCard({ school, viewMode = "grid" }: { school: School; viewMode?: "grid" | "list" }) {
  const { ids, has, toggle, hasFavorite, toggleFavorite } = useCompare();
  const selected = has(school.id);
  const isFav = hasFavorite(school.id);

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/school/${school.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("School link copied to clipboard!");
    } else {
      toast.info(`Share link: ${url}`);
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(school.id);
    toast.success(isFav ? `Removed ${school.name} from saved` : `Saved ${school.name} to your portal!`);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selected && ids.length >= 6) {
      toast.warning("Maximum 6 schools can be compared at once. Please remove one first.");
      return;
    }
    toggle(school.id);
    if (!selected) {
      toast.success(`Added ${school.name} to comparison! (${Math.min(ids.length + 1, 6)}/6)`);
    } else {
      toast.info(`Removed ${school.name} from comparison.`);
    }
  };


  if (viewMode === "list") {
    return (
      <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row">
        {/* Thumbnail Image */}
        <div className="relative md:w-72 h-52 md:h-auto shrink-0 overflow-hidden bg-secondary/30">
          <ImageWithFallback
            src={unsplash(school.photo, 600, 400)}
            alt={school.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent md:hidden" />

          {/* Action buttons on image */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {school.verified && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-[var(--brand-blue)] shadow-xs">
                <Icon name="verified" size={13} fill className="text-[var(--brand-mustard)]" />
                Verified
              </span>
            )}
            {school.passRate >= 95 && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-bold shadow-xs">
                <Icon name="trending_up" size={13} />
                {school.passRate}% Pass
              </span>
            )}
          </div>

          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            <button
              onClick={handleToggleFavorite}
              className={`size-8 rounded-full flex items-center justify-center transition shadow-xs ${
                isFav ? "bg-rose-500 text-white" : "bg-white/90 backdrop-blur hover:bg-white text-muted-foreground hover:text-rose-500"
              }`}
              title={isFav ? "Remove from saved" : "Save school"}
            >
              <Icon name="favorite" size={16} fill={isFav} />
            </button>
            <button
              onClick={handleShare}
              className="size-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-muted-foreground hover:text-foreground flex items-center justify-center transition shadow-xs"
              title="Share school"
            >
              <Icon name="share" size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link to={`/school/${school.id}`} className="hover:underline">
                  <h3 className="text-lg font-bold text-[var(--brand-blue)] leading-tight">{school.name}</h3>
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
                  <Icon name="location_on" size={15} className="text-muted-foreground" />
                  <span>{school.location}</span>
                  <span>•</span>
                  <span>Est. {school.founded}</span>
                </div>
              </div>

              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs cursor-pointer transition select-none ${
                  selected
                    ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)] font-semibold"
                    : "bg-secondary/20 hover:bg-secondary/40 text-[var(--brand-blue)] border-border font-medium"
                }`}
                onClick={handleToggleCompare}
                title={selected ? "Remove from comparison" : "Add to comparison"}
              >
                <Icon name={selected ? "check_circle" : "balance"} size={15} fill={selected} />
                <span>{selected ? "In Compare" : "Compare"}</span>
              </button>

            </div>

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Rating value={school.rating} count={school.reviews} size={15} />
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary/50 text-[var(--brand-blue)] font-medium">
                  {school.type}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                  {school.gender}
                </span>
                {school.boarding && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-medium border border-amber-200">
                    Boarding
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3 line-clamp-2 leading-relaxed">
              {school.description}
            </p>

            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground font-medium">Curricula:</span>
              {school.curriculum.map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded bg-muted/70 text-foreground font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-border">
            <div>
              <span className="text-xs text-muted-foreground">Starting fees</span>
              <div style={{ color: "var(--brand-blue)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                ${school.startingFees}
                <span className="text-xs text-muted-foreground font-normal"> /term</span>
              </div>
            </div>
            <Link
              to={`/school/${school.id}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm text-white transition-all hover:opacity-90 active:scale-98 shadow-xs"
              style={{ background: "var(--brand-blue)", fontWeight: 600 }}
            >
              View Details
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid Mode (Default)
  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      <div className="relative h-48 bg-secondary/30 overflow-hidden">
        <ImageWithFallback
          src={unsplash(school.photo, 600, 400)}
          alt={school.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Action badges top left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {school.verified && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[11px] font-bold text-[var(--brand-blue)] shadow-xs">
              <Icon name="verified" size={13} fill className="text-[var(--brand-mustard)]" />
              Verified
            </span>
          )}
          {school.passRate >= 95 && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
              <Icon name="trending_up" size={12} />
              {school.passRate}% Pass
            </span>
          )}
        </div>

        {/* Favorite & Share buttons top right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleToggleFavorite}
            className={`size-8 rounded-full flex items-center justify-center transition shadow-xs ${
              isFav ? "bg-rose-500 text-white" : "bg-white/90 backdrop-blur hover:bg-white text-muted-foreground hover:text-rose-500"
            }`}
            title={isFav ? "Remove from saved" : "Save school"}
          >
            <Icon name="favorite" size={16} fill={isFav} />
          </button>
          <button
            onClick={handleShare}
            className="size-8 rounded-full bg-white/90 backdrop-blur hover:bg-white text-muted-foreground hover:text-foreground flex items-center justify-center transition shadow-xs"
            title="Share school"
          >
            <Icon name="share" size={15} />
          </button>
        </div>

        {/* Compare Tag Bottom Right */}
        <button
          type="button"
          className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs shadow-xs transition z-20 cursor-pointer ${
            selected
              ? "bg-[var(--brand-blue)] text-white font-semibold"
              : "bg-white/95 backdrop-blur hover:bg-white text-[var(--brand-blue)] font-medium hover:scale-105"
          }`}
          onClick={handleToggleCompare}
          title={selected ? "Remove from comparison" : "Add to comparison"}
        >
          <Icon name={selected ? "check_circle" : "balance"} size={14} fill={selected} />
          <span>{selected ? "In Compare" : "Compare"}</span>
        </button>


        {/* Monogram School Crest */}
        <div
          className="absolute -bottom-6 left-4 size-14 rounded-2xl border-2 border-white shadow-md z-10 flex items-center justify-center shrink-0"
          style={{ background: "var(--brand-blue)" }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              color: "#fff",
              fontSize: "1.1rem",
              letterSpacing: "-0.02em",
            }}
          >
            {school.name
              .split(" ")
              .slice(0, 2)
              .map((w: string) => w[0])
              .join("")
              .toUpperCase()}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-8 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/school/${school.id}`} className="hover:underline">
            <h3 className="leading-tight font-bold text-foreground text-base group-hover:text-[var(--brand-blue)] transition">
              {school.name}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <Icon name="location_on" size={15} />
          <span className="truncate">{school.location}</span>
        </div>

        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-secondary/60 text-[var(--brand-blue)] font-medium">
            {school.type}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {school.gender}
          </span>
          {school.boarding && (
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 font-medium">
              Boarding
            </span>
          )}
        </div>

        <div className="mt-2.5">
          <Rating value={school.rating} count={school.reviews} size={14} />
        </div>

        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 flex-1 leading-relaxed">
          {school.description}
        </p>

        {/* Footer info & CTA */}
        <div className="flex items-end justify-between mt-4 pt-3 border-t border-border">
          <div>
            <div className="text-[11px] text-muted-foreground">Starting fees</div>
            <div style={{ color: "var(--brand-blue)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
              ${school.startingFees}
              <span className="text-[11px] text-muted-foreground font-normal"> /term</span>
            </div>
          </div>
          <Link
            to={`/school/${school.id}`}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs text-white transition-all hover:opacity-90 active:scale-98 shadow-xs font-semibold"
            style={{ background: "var(--brand-blue)" }}
          >
            Details
            <Icon name="arrow_forward" size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
