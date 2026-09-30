import { Link } from "react-router";
import { SearchBar } from "../components/SearchBar";
import { SchoolCard } from "../components/SchoolCard";
import { Icon } from "../components/Icon";
import { Rating } from "../components/Rating";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAllSchools, School, PROVINCES, SCHOOL_TYPES, REVIEWS, RESOURCES, unsplash } from "../lib/data";
import { useCompare } from "../lib/compare";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import praisePhoto from "../../imports/1780656185522.png";
import simbarashePhoto from "../../imports/1772867710682.png";
import tobokaPhoto from "../../imports/1763563325238.jpg";

function SectionHead({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-8">
      <div>
        {eyebrow && (
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider mb-2" style={{ color: "var(--brand-mustard)", fontWeight: 700 }}>
            <span className="size-1.5 rounded-full" style={{ background: "var(--brand-mustard)" }} />
            {eyebrow}
          </div>
        )}
        <h2 style={{ fontSize: "1.75rem" }}>{title}</h2>
        {subtitle && <p className="text-muted-foreground mt-1.5 max-w-2xl">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const MotionLink = motion.create(Link);

function FeaturedSchoolsStrip({ schools }: { schools: School[] }) {

  const stripRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  function scroll(dir: 1 | -1) {
    stripRef.current?.scrollBy({ left: dir * 260, behavior: "smooth" });
  }

  function onScroll() {
    const el = stripRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  };

  return (
    <section ref={sectionRef} className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div
          className="flex items-end justify-between flex-wrap gap-y-3 gap-6 mb-10"
          variants={headerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <div>
            <h2 style={{ fontSize: "1.75rem" }}>Featured Schools</h2>
            <p className="text-muted-foreground mt-1.5 max-w-md">Verified schools chosen for their strong academics, facilities and parent satisfaction.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <motion.button
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              whileTap={{ scale: 0.9 }}
              className="size-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30"
            >
              <Icon name="arrow_back" size={18} />
            </motion.button>
            <motion.button
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className="size-10 rounded-full flex items-center justify-center disabled:opacity-30"
              style={{ background: "var(--brand-blue)", color: "#fff" }}
            >
              <Icon name="arrow_forward" size={18} />
            </motion.button>
          </div>
        </motion.div>

        {/* Horizontal strip */}
        <motion.div
          ref={stripRef}
          onScroll={onScroll}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {schools.map((s) => (
            /* Outer — stagger entrance only, no hover variants here */
            <motion.div key={s.id} variants={cardVariants} className="shrink-0">
              {/* Inner — hover state only, isolated from stagger names */}
              <motion.div
                initial="rest"
                whileHover="hovered"
                className="relative flex flex-col justify-between rounded-2xl overflow-hidden cursor-pointer"
                style={{ width: 230, height: 340, border: "1px solid var(--border)" }}
              >
                <Link to={`/school/${s.id}`} className="absolute inset-0 z-20" aria-label={s.name} />

                {/* Photo — subtle on rest, full on hover; touch devices see a hint always */}
                <motion.div
                  className="absolute inset-0"
                  variants={{ rest: { opacity: 0.18 }, hovered: { opacity: 1 } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <ImageWithFallback src={unsplash(s.photo, 460, 680)} alt={s.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/55" />
                </motion.div>

                {/* White bg — slightly transparent at rest so photo peeks through */}
                <motion.div
                  className="absolute inset-0 bg-white"
                  variants={{ rest: { opacity: 0.82 }, hovered: { opacity: 0 } }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />

                <div className="relative z-10 flex flex-col justify-between h-full p-6">
                  <div>
                    <motion.p
                      className="text-xs uppercase tracking-widest mb-3"
                      style={{ fontWeight: 600 }}
                      variants={{ rest: { color: "var(--muted-foreground)" }, hovered: { color: "rgba(255,255,255,0.65)" } }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.type}
                    </motion.p>
                    <motion.h3
                      style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.25rem", lineHeight: 1.2, letterSpacing: "-0.01em" }}
                      variants={{ rest: { color: "var(--brand-blue)" }, hovered: { color: "#ffffff" } }}
                      transition={{ duration: 0.3 }}
                    >
                      {s.name}
                    </motion.h3>
                  </div>

                  <div>
                    <motion.div
                      className="mb-5"
                      variants={{ rest: { borderColor: "var(--border)" }, hovered: { borderColor: "rgba(255,255,255,0.3)" } }}
                      transition={{ duration: 0.3 }}
                      style={{ borderTopWidth: 1, borderTopStyle: "solid" }}
                    />
                    <motion.span
                      className="inline-flex items-center gap-1.5 text-sm"
                      style={{ fontWeight: 600 }}
                      variants={{ rest: { color: "var(--brand-blue)" }, hovered: { color: "var(--brand-mustard)" } }}
                      transition={{ duration: 0.3 }}
                    >
                      More Information <Icon name="arrow_forward" size={15} />
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}

          {/* View all card */}
          <motion.div variants={cardVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 22 }} className="shrink-0">
            <Link
              to="/search"
              className="group size-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-border hover:border-[var(--brand-blue)] transition-colors"
              style={{ width: 230, height: 340, display: "flex" }}
            >
              <motion.div
                whileHover={{ rotate: -45 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="size-12 rounded-full border border-border flex items-center justify-center mb-3"
                style={{ color: "var(--brand-blue)" }}
              >
                <Icon name="arrow_forward" size={20} />
              </motion.div>
              <p className="text-sm" style={{ fontWeight: 600, color: "var(--brand-blue)" }}>View all schools</p>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const r = REVIEWS[active];

  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1);
      setActive((i) => (i + 1) % REVIEWS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  function goTo(idx: number) {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }

  return (
    <section className="py-16 overflow-hidden" style={{ background: "#fff" }}>

      {/* Header + centered content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-y-3 mb-8">
          <div>
            <h2 style={{ fontSize: "1.75rem" }}>Latest Parent Reviews</h2>
            <p className="text-muted-foreground mt-1.5">Honest experiences shared by parents and guardians across Zimbabwe.</p>
          </div>
          <Link to="/search" className="text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
            View all <Icon name="arrow_forward" size={16} />
          </Link>
        </div>

        {/* Centered: large photo + text side by side */}
        <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-10" style={{ minHeight: 380 }}>

          {/* Large photo — NO border radius */}
          <div className="relative overflow-hidden shrink-0 bg-gray-100 w-full md:w-60 h-64 md:h-[380px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={r.id + "-img"}
                custom={direction}
                initial={{ x: direction * 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }}
                className="absolute inset-0"
              >
                <ImageWithFallback
                  src={unsplash(r.avatar, 480, 760)}
                  alt={r.author}
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Text content */}
          <div className="flex flex-col justify-center py-2 w-full md:w-[400px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={r.id + "-text"}
                custom={direction}
                initial={{ opacity: 0, y: direction * 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction * -24 }}
                transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] as const }}
              >
                <div className="mb-2" style={{ color: "var(--brand-mustard)", fontWeight: 700, fontSize: "0.95rem" }}>
                  #{active + 1}
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-text)", fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)", textTransform: "uppercase", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                  {r.author}
                </h3>
                <div className="flex items-center gap-2 mt-2 mb-5">
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{r.role}</span>
                  <span className="size-1 rounded-full inline-block" style={{ background: "var(--border)" }} />
                  <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>{r.school}</span>
                </div>
                <p style={{ color: "var(--muted-foreground)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: 380 }}>
                  {r.body}
                </p>
                <div className="mt-6">
                  <Rating value={r.rating} showValue={false} size={16} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Full-width thumbnail strip — spans edge to edge, scrollable left→right */}
      <div
        className="w-full overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        <div className="flex gap-3 justify-center px-6" style={{ minWidth: "100%" }}>
          {REVIEWS.map((rev, i) => (
            <button
              key={rev.id}
              onClick={() => goTo(i)}
              className="relative overflow-hidden shrink-0 focus:outline-none transition-all duration-300"
              style={{
                width: i === active ? 88 : 68,
                height: i === active ? 106 : 84,
                opacity: i === active ? 1 : 0.45,
                outline: i === active ? "2.5px solid var(--brand-blue)" : "2.5px solid transparent",
                outlineOffset: "2px",
              }}
            >
              <ImageWithFallback
                src={unsplash(rev.avatar, 176, 212)}
                alt={rev.author}
                className="w-full h-full object-cover object-top"
              />
            </button>
          ))}
        </div>
      </div>

    </section>
  );
}

function TopRatedSection({ schools }: { schools: School[] }) {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16" style={{ background: "#f7f8fa" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-end justify-between flex-wrap gap-y-3 mb-8">
          <div>
            <h2 style={{ fontSize: "1.75rem" }}>Top Rated Schools</h2>
            <p className="text-muted-foreground mt-1.5">The highest-rated schools according to real parent reviews.</p>
          </div>
          <Link to="/search" className="text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
            View all <Icon name="arrow_forward" size={16} />
          </Link>
        </div>

        {/* Accordion */}
        <div
          className="flex gap-3 overflow-x-auto rounded-2xl"
          style={{ height: "clamp(180px,28vw,220px)", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        >
          {schools.map((s, i) => {
            const isActive = i === active;
            const num = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={s.id}
                layout
                animate={{ flex: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 35 }}
                onClick={() => setActive(i)}
                className="relative overflow-hidden rounded-2xl cursor-pointer"
                style={{
                  background: isActive ? "var(--brand-blue)" : "#fff",
                  border: isActive ? "none" : "1px solid #e5e7eb",
                  minWidth: 200,
                }}
                initial={false}
              >
                {/* Active: school photo overlay */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key="photo"
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ImageWithFallback
                        src={unsplash(s.photo, 800, 600)}
                        alt={s.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0" style={{ background: "rgba(16,54,125,0.72)" }} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Active layout */}
                {isActive ? (
                  <motion.div
                    className="relative h-full flex flex-col justify-between p-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: inView ? 1 : 0 }}
                    transition={{ duration: 0.35, delay: 0.15 }}
                  >
                    {/* Large number top-left */}
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.5rem", lineHeight: 1, color: "var(--brand-mustard)", opacity: 0.9 }}>
                      {num}
                    </div>

                    {/* Bottom info */}
                    <div>
                      <div className="inline-block px-2 py-0.5 rounded-full text-xs mb-2" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 600 }}>
                        {s.type}
                      </div>
                      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "#fff", lineHeight: 1.25 }} className="mb-1 line-clamp-1">
                        {s.name}
                      </div>
                      <div className="flex items-center gap-1 text-white/70 text-xs mb-2">
                        <Icon name="location_on" size={12} />
                        {s.location}
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <Rating value={s.rating} count={s.reviews} light size={14} />
                      </div>
                      <Link
                        to={`/school/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs transition hover:opacity-90"
                        style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}
                      >
                        View Details <Icon name="arrow_forward" size={13} />
                      </Link>
                    </div>
                  </motion.div>
                ) : (
                  /* Inactive layout */
                  <div className="h-full flex flex-col justify-between p-4">
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2rem", lineHeight: 1, color: "var(--brand-mustard)", opacity: 0.7 }}>
                      {num}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--brand-text)" }} className="mb-1 line-clamp-2">
                        {s.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                        <Icon name="location_on" size={12} />
                        <span className="line-clamp-1">{s.location}</span>
                      </div>
                      <div className="flex items-center gap-1 mb-4">
                        <Icon name="star" size={13} fill style={{ color: "var(--brand-mustard)" }} />
                        <span className="text-xs font-semibold">{s.rating.toFixed(1)}</span>
                      </div>
                      <Link
                        to={`/school/${s.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs transition hover:gap-2"
                        style={{ color: "var(--brand-blue)", fontWeight: 600 }}
                      >
                        View <Icon name="arrow_forward" size={12} />
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const TEAM = [
  {
    id: "t1",
    name: "Praise Mukunga",
    role: "Founder / Digital Marketing",
    bio: "Praise is the founder of SchoolFinder. A certified digital marketer (Uncommon.org) and Digital Marketing Instructor, she brings expertise in social media, graphic design and SEO. She has experience in sales and tech education.",
    photo: "",
    localPhoto: praisePhoto,
  },
  {
    id: "t2",
    name: "Simbarashe Mahlaulo",
    role: "Software Developer",
    bio: "Simbarashe is the software developer behind SchoolFinder, building the platform's technology from the ground up to help Zimbabwean families discover the right schools.",
    photo: "",
    localPhoto: simbarashePhoto,
  },
  {
    id: "t3",
    name: "Toboka Ndlovu",
    role: "Product Design",
    bio: "Toboka shapes the look and feel of SchoolFinder, crafting intuitive experiences that make it easy for every Zimbabwean family to find and compare schools.",
    photo: "",
    localPhoto: tobokaPhoto,
  },
];

function TeamCard({ member }: { member: typeof TEAM[0] }) {
  const [active, setActive] = useState(false);
  const src = "localPhoto" in member && member.localPhoto
    ? member.localPhoto as string
    : unsplash((member as { photo: string }).photo, 600, 880);

  return (
    <motion.div
      initial="rest"
      whileHover="hovered"
      animate={active ? "hovered" : "rest"}
      onClick={() => setActive((v) => !v)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-80 md:h-[440px]"
    >
      <ImageWithFallback
        src={src}
        alt={member.name}
        className="absolute inset-0 w-full h-full object-cover object-top"
      />

      <motion.div
        className="absolute inset-0"
        variants={{
          rest: { background: "linear-gradient(to top, rgba(16,54,125,0.92) 0%, rgba(16,54,125,0.3) 50%, transparent 100%)" },
          hovered: { background: "linear-gradient(to top, rgba(16,54,125,0.97) 0%, rgba(16,54,125,0.65) 60%, rgba(16,54,125,0.2) 100%)" },
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
        <div className="inline-block self-start px-2.5 py-0.5 rounded-full text-xs mb-3"
          style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}>
          {member.role}
        </div>

        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.3rem", color: "#fff", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
          {member.name}
        </h3>

        {/* Bio: always visible on mobile; motion-revealed on desktop */}
        <p className="md:hidden text-sm leading-relaxed mt-3 line-clamp-3" style={{ color: "rgba(255,255,255,0.78)" }}>
          {member.bio}
        </p>
        <motion.p
          className="hidden md:block text-sm leading-relaxed overflow-hidden"
          style={{ color: "rgba(255,255,255,0.75)" }}
          variants={{ rest: { opacity: 0, height: 0, marginTop: 0 }, hovered: { opacity: 1, height: "auto", marginTop: 12 } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {member.bio}
        </motion.p>

        {/* Tap hint — only on mobile when card is not yet active */}
        <p className="md:hidden text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          {active ? "Tap to close" : "Tap to read more"}
        </p>
      </div>
    </motion.div>
  );
}

function TeamSection() {
  return (
    <section style={{ background: "var(--brand-blue)" }} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-end justify-between flex-wrap gap-y-3 mb-12">
          <div>
            <h2 style={{ color: "#fff", fontSize: "1.75rem" }}>Our Team</h2>
            <p className="mt-1.5" style={{ color: "rgba(255,255,255,0.6)" }}>
              The people behind School Finder Zimbabwe.
            </p>
          </div>
          <div className="hidden md:block h-px flex-1 ml-10" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {TEAM.map((member) => <TeamCard key={member.id} member={member} />)}
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const { dataVersion } = useCompare();
  const allSchools = getAllSchools();
  const featured = allSchools.filter((s) => s.featured).slice(0, 6);
  const topRated = [...allSchools].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const [email, setEmail] = useState("");

  return (
    <div>
      {/* HERO */}
      <section className="bg-white overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 lg:py-28 flex flex-col items-center text-center">
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--brand-blue)", fontSize: "clamp(2.4rem, 5vw, 3.5rem)", lineHeight: 1.1, letterSpacing: "-0.02em" }}>
            Discover the best school<br />for your child's future.
          </h1>

          <p className="mt-5 text-muted-foreground leading-relaxed max-w-xl" style={{ fontSize: "1.05rem" }}>
            Find, compare and review schools across all 10 provinces of Zimbabwe from primary to boarding, all in one place.
          </p>

          <div className="w-full max-w-2xl mt-8">
            <SearchBar />
          </div>
        </div>

        {/* Bottom border */}
        <div className="border-t border-border" />
      </section>

      {/* FEATURED SCHOOLS */}
      <FeaturedSchoolsStrip schools={featured} />

      {/* BROWSE BY PROVINCE */}
      <section className="py-16" style={{ background: "rgba(165,206,234,0.12)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between flex-wrap gap-y-3 mb-8">
            <div>
              <h2 style={{ fontSize: "1.75rem" }}>Browse by Province</h2>
              <p className="text-muted-foreground mt-1.5">Explore schools in every corner of Zimbabwe.</p>
            </div>
            <Link to="/search" className="text-sm flex items-center gap-1 hover:gap-2 transition-all shrink-0" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
              View all <Icon name="arrow_forward" size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PROVINCES.slice(0, 4).map((p) => (
              <Link key={p.name} to={`/search?province=${encodeURIComponent(p.name)}`} className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition" style={{ height: 220 }}>
                <ImageWithFallback src={unsplash(p.image, 400, 300)} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/45" />
                <div className="absolute bottom-0 left-0 p-4 text-white">
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{p.name}</div>
                  <div className="text-xs text-white/80">{p.schools} schools</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY TYPE — bento grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-end justify-between flex-wrap gap-y-3 gap-6 mb-8">
          <div className="text-left">
            <h2 style={{ fontSize: "1.75rem" }}>Browse by School Type</h2>
            <p className="text-muted-foreground mt-1.5">From early learning to technical colleges find the right fit.</p>
          </div>
          <Link to="/search" className="inline-flex items-center gap-1 text-sm shrink-0 hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
            View all <Icon name="arrow_forward" size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[220px]">

          {/* Row 1 — [img] [text] [img] [dark] */}
          <div className="rounded-2xl overflow-hidden">
            <ImageWithFallback src={unsplash("photo-1580582932707-520aed937b7b", 400, 440)} alt="Primary school" className="w-full h-full object-cover" />
          </div>

          <Link to="/search?type=Primary+School" className="group rounded-2xl border border-border bg-white p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--brand-blue)", lineHeight: 1.2 }}>Primary<br />School</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Foundation years built on curiosity, care, and strong academics.</p>
            </div>
            <span className="text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
              More Information <Icon name="arrow_forward" size={15} />
            </span>
          </Link>

          <div className="rounded-2xl overflow-hidden">
            <ImageWithFallback src={unsplash("photo-1509062522246-3755977927d7", 400, 440)} alt="Secondary school" className="w-full h-full object-cover" />
          </div>

          <Link to="/search?type=International+School" className="group rounded-2xl p-6 flex flex-col justify-between hover:opacity-90 transition" style={{ background: "var(--brand-blue)" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#fff", lineHeight: 1.2 }}>International<br />School</h3>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>World-class curricula preparing students for a global stage.</p>
            </div>
            <span className="text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--brand-mustard)", fontWeight: 600 }}>
              More Information <Icon name="arrow_forward" size={15} />
            </span>
          </Link>

          {/* Row 2 — [dark] [img] [text] [img] */}
          <Link to="/search?type=Boarding+School" className="group rounded-2xl p-6 flex flex-col justify-between hover:opacity-90 transition" style={{ background: "var(--brand-blue)" }}>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "#fff", lineHeight: 1.2 }}>Boarding<br />School</h3>
              <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>Full immersion learning environments with weekend activities.</p>
            </div>
            <span className="text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--brand-mustard)", fontWeight: 600 }}>
              More Information <Icon name="arrow_forward" size={15} />
            </span>
          </Link>

          <div className="rounded-2xl overflow-hidden">
            <ImageWithFallback src={unsplash("photo-1541339907198-e08756dedf3f", 400, 440)} alt="High school" className="w-full h-full object-cover" />
          </div>

          <Link to="/search?type=Technical+College" className="group rounded-2xl border border-border bg-white p-6 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--brand-blue)", lineHeight: 1.2 }}>Technical<br />College</h3>
              <p className="text-sm text-muted-foreground mt-3 leading-relaxed">Hands-on vocational training for tomorrow's skilled workforce.</p>
            </div>
            <span className="text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
              More Information <Icon name="arrow_forward" size={15} />
            </span>
          </Link>

          <div className="rounded-2xl overflow-hidden">
            <ImageWithFallback src={unsplash("photo-1562774053-701939374585", 400, 440)} alt="Early learning" className="w-full h-full object-cover" />
          </div>

        </div>
      </section>

      {/* TOP RATED */}
      <TopRatedSection schools={topRated} />

      {/* LATEST REVIEWS */}
      <ReviewsSection />

      {/* RESOURCES — justified bento grid */}
      <section className="py-16" style={{ background: "#f7f8fa" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header — same style as Top Rated Schools */}
          <div className="flex items-end justify-between flex-wrap gap-y-3 mb-8">
            <div>
              <h2 style={{ fontSize: "1.75rem" }}>Educational Resources</h2>
              <p className="text-muted-foreground mt-1.5">Guides and insights to help you make informed decisions.</p>
            </div>
            <Link to="/resources" className="text-sm flex items-center gap-1 hover:gap-2 transition-all" style={{ color: "var(--brand-blue)", fontWeight: 600 }}>
              View all <Icon name="arrow_forward" size={16} />
            </Link>
          </div>

          {/* Bento grid — resource cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[240px]">
            {/* Large card — spans 2 cols on lg */}
            <Link to="/resources" className="group relative rounded-2xl overflow-hidden lg:col-span-2">
              <ImageWithFallback
                src={unsplash(RESOURCES[0].image, 900, 480)}
                alt={RESOURCES[0].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}>{RESOURCES[0].category}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{RESOURCES[0].readTime}</span>
                </div>
                <div className="text-white font-semibold leading-snug" style={{ fontSize: "1.05rem" }}>{RESOURCES[0].title}</div>
              </div>
            </Link>

            {/* Small card */}
            <Link to="/resources" className="group relative rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={unsplash(RESOURCES[1].image, 500, 480)}
                alt={RESOURCES[1].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}>{RESOURCES[1].category}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{RESOURCES[1].readTime}</span>
                </div>
                <div className="text-sm text-white font-semibold leading-snug line-clamp-2">{RESOURCES[1].title}</div>
              </div>
            </Link>

            {/* Small card */}
            <Link to="/resources" className="group relative rounded-2xl overflow-hidden">
              <ImageWithFallback
                src={unsplash(RESOURCES[2].image, 500, 480)}
                alt={RESOURCES[2].title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, transparent 55%)" }} />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}>{RESOURCES[2].category}</span>
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>{RESOURCES[2].readTime}</span>
                </div>
                <div className="text-sm text-white font-semibold leading-snug line-clamp-2">{RESOURCES[2].title}</div>
              </div>
            </Link>

            {/* Info / CTA cell */}
            <Link
              to="/resources"
              className="rounded-2xl flex flex-col justify-between p-6 lg:col-span-2 group hover:opacity-90 transition"
              style={{ background: "var(--brand-blue)" }}
            >
              <Icon name="menu_book" size={28} style={{ color: "var(--brand-mustard)" }} />
              <div>
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.7)" }}>Explore all guides, curriculum breakdowns and admission tips.</p>
                <span className="inline-flex items-center gap-2 text-sm" style={{ color: "var(--brand-mustard)", fontWeight: 700 }}>
                  Browse all resources <Icon name="arrow_forward" size={15} />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* TEAM */}
      <TeamSection />

      {/* NEWSLETTER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 md:p-14 text-center" style={{ background: "var(--brand-blue)" }}>
          <div className="relative">
            <h2 style={{ color: "#fff", fontSize: "1.75rem" }}>Stay ahead on school admissions</h2>
            <p className="text-white/75 mt-2 max-w-lg mx-auto">Get open-day alerts, new school listings and admission tips straight to your inbox.</p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) { toast.success("You're subscribed! Watch your inbox."); setEmail(""); } }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mt-7"
            >
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl bg-white/95 outline-none text-sm text-foreground placeholder:text-muted-foreground" />
              <button type="submit" className="px-6 py-3 rounded-xl text-sm transition hover:opacity-90" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 600 }}>
                Subscribe
              </button>
            </form>
            <p className="text-white/50 text-xs mt-3">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
