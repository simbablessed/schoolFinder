import { useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCompare } from "../lib/compare";
import { getAllSchools, unsplash } from "../lib/data";
import { motion, AnimatePresence } from "motion/react";
import { MobileBottomNav } from "./MobileBottomNav";
import { SpotlightSearch } from "./SpotlightSearch";

const MAX = 6;

function CompareBar() {
  const { ids, toggle, clear, dataVersion, openSpotlight } = useCompare();
  const allSchools = getAllSchools();
  const selected = allSchools.filter((s) => ids.includes(s.id));

  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 30 }}
          className="fixed bottom-[56px] md:bottom-0 left-0 right-0 z-40 md:z-50 border-t border-white/10 shadow-2xl"
          style={{ background: "var(--brand-blue)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">

            {/* Left: icon + count */}
            <div className="shrink-0 flex items-center gap-3">
              <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: "var(--brand-mustard)" }}>
                <Icon name="balance" size={22} style={{ color: "var(--brand-text)" }} />
              </div>
              <div>
                <div className="text-white text-sm" style={{ fontWeight: 700 }}>
                  {selected.length} / {MAX} selected
                </div>
                <button
                  onClick={clear}
                  className="text-xs transition hover:text-white"
                  style={{ color: "rgba(255,255,255,0.6)" }}
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* School thumbnail chips */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {selected.map((s) => (
                <motion.div
                  key={s.id}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="flex items-center gap-2 shrink-0 px-2 py-1.5 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                >
                  <div className="size-8 rounded-lg overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={unsplash(s.photo, 80, 80)}
                      alt={s.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs text-white max-w-[100px] truncate" style={{ fontWeight: 500 }}>
                    {s.name}
                  </span>
                  <button
                    onClick={() => toggle(s.id)}
                    className="size-5 rounded-full flex items-center justify-center transition hover:bg-white/20 shrink-0"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                    aria-label={`Remove ${s.name}`}
                  >
                    <Icon name="close" size={14} />
                  </button>
                </motion.div>
              ))}

              {/* Interactive Empty slots */}
              {Array.from({ length: MAX - selected.length }).map((_, i) => (
                <button
                  key={`empty-${i}`}
                  onClick={openSpotlight}
                  className="size-10 rounded-xl shrink-0 border-2 border-dashed flex items-center justify-center transition-all hover:scale-105 hover:border-white/70 hover:bg-white/10 cursor-pointer"
                  style={{ borderColor: "rgba(255,255,255,0.3)" }}
                  title="Click to search and add a school"
                  aria-label="Add school to comparison"
                >
                  <Icon name="add" size={18} style={{ color: "rgba(255,255,255,0.7)" }} />
                </button>
              ))}
            </div>


            {/* CTA */}
            <Link
              to={ids.length >= 2 ? "/compare" : "#"}
              onClick={(e) => ids.length < 2 && e.preventDefault()}
              className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition"
              style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700, opacity: ids.length >= 2 ? 1 : 0.5 }}
              title={ids.length < 2 ? "Select at least 2 schools to compare" : undefined}
            >
              Compare now
              <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Layout() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  const { ids } = useCompare();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main
        className="flex-1 flex flex-col"
        style={{
          paddingBottom: ids.length > 0 ? "140px" : "64px",
        }}
      >
        <Outlet />
      </main>
      <Footer />
      <CompareBar />
      <MobileBottomNav />
      <SpotlightSearch />
    </div>
  );
}

