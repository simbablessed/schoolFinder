import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { unsplash } from "../lib/data";
import { motion } from "motion/react";
import { useState } from "react";
import praisePhoto from "../../imports/1780656185522.png";
import simbarashePhoto from "../../imports/1772867710682.png";
import tobokaPhoto from "../../imports/1763563325238.jpg";

const VALUES = [
  { icon: "verified_user", title: "Trust", body: "Every listing is verified so families can decide with confidence." },
  { icon: "visibility", title: "Transparency", body: "Clear fees, honest reviews and real data — no hidden surprises." },
  { icon: "diversity_3", title: "Inclusivity", body: "Serving every community across all ten provinces of Zimbabwe." },
  { icon: "workspace_premium", title: "Excellence", body: "Highlighting the schools shaping the nation's future leaders." },
];
const STATS = [["1,800+", "Verified schools"], ["24,000+", "Parent reviews"], ["50,000+", "Families served"], ["10", "Provinces covered"]];

const TEAM = [
  {
    id: "t1",
    name: "Praise Mukunga",
    role: "Founder / Digital Marketing",
    bio: "Praise is the founder of SchoolFinder. A certified digital marketer (Uncommon.org) and Digital Marketing Instructor, she brings expertise in social media, graphic design and SEO. She has experience in sales and tech education.",
    localPhoto: praisePhoto as string,
  },
  {
    id: "t2",
    name: "Simbarashe Mahlaulo",
    role: "Software Developer",
    bio: "Simbarashe is the software developer behind SchoolFinder, building the platform's technology from the ground up to help Zimbabwean families discover the right schools.",
    localPhoto: simbarashePhoto as string,
  },
  {
    id: "t3",
    name: "Toboka Ndlovu",
    role: "Product Design",
    bio: "Toboka shapes the look and feel of SchoolFinder, crafting intuitive experiences that make it easy for every Zimbabwean family to find and compare schools.",
    localPhoto: tobokaPhoto as string,
  },
];

function AboutTeamCard({ member }: { member: typeof TEAM[0] }) {
  const [active, setActive] = useState(false);
  return (
    <motion.div
      initial="rest"
      whileHover="hovered"
      animate={active ? "hovered" : "rest"}
      onClick={() => setActive((v) => !v)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer h-80 md:h-[440px]"
    >
      <ImageWithFallback
        src={member.localPhoto}
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

        <p className="md:hidden text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          {active ? "Tap to close" : "Tap to read more"}
        </p>
      </div>
    </motion.div>
  );
}

export function About() {
  return (
    <div>
      <div style={{ background: "var(--brand-blue)" }} className="text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem,4vw,3rem)" }}>Empowering every family's education choice</h1>
          <p className="text-white/80 max-w-2xl mx-auto mt-4 text-lg">School Finder Zimbabwe was built on a simple belief: choosing a school should be transparent, informed and stress-free for every parent.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="rounded-2xl overflow-hidden h-80"><ImageWithFallback src={unsplash("photo-1541339907198-e08756dedf3f", 800, 600)} alt="Students" className="w-full h-full object-cover" /></div>
          <div>
            <div className="text-xs uppercase tracking-wider mb-2" style={{ color: "var(--brand-mustard)", fontWeight: 700 }}>Our story</div>
            <h2 style={{ fontSize: "1.75rem" }}>Bringing clarity to school choice</h2>
            <p className="text-muted-foreground mt-4 leading-relaxed">For too long, Zimbabwean families relied on word of mouth and scattered information to make one of the most important decisions of their lives. We created a single, trusted platform where parents can discover schools, compare them fairly, and learn from the real experiences of other families.</p>
            <p className="text-muted-foreground mt-3 leading-relaxed">Today we partner with schools nationwide to bring transparency, accurate information and a stronger voice to parents and guardians everywhere.</p>
          </div>
        </div>
      </div>

      <div style={{ background: "rgba(165,206,234,0.15)" }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map(([v, l]) => (
            <div key={l}><div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)", fontSize: "2.25rem" }}>{v}</div><div className="text-sm text-muted-foreground mt-1">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10"><h2 style={{ fontSize: "1.75rem" }}>Our values</h2><p className="text-muted-foreground mt-2">The principles that guide everything we build.</p></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="bg-card rounded-xl border border-border p-6 text-center">
              <div className="size-14 rounded-2xl mx-auto flex items-center justify-center mb-4" style={{ background: "rgba(255,184,0,0.15)", color: "#8a6400" }}><Icon name={v.icon} size={28} /></div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>{v.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{v.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team — matches landing page design */}
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
            {TEAM.map((member) => (
              <AboutTeamCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="rounded-2xl p-10 text-center text-white" style={{ background: "var(--brand-blue)" }}>
          <h2 style={{ color: "#fff", fontSize: "1.6rem" }}>Are you a school? Join our platform</h2>
          <p className="text-white/75 mt-2 max-w-lg mx-auto">Reach thousands of prospective families and manage your profile with powerful insights.</p>
          <Link to="/list-your-school" className="inline-flex items-center gap-1.5 mt-6 px-6 py-3 rounded-xl text-sm" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 600 }}>List your school <Icon name="arrow_forward" size={18} /></Link>
        </div>
      </div>
    </div>
  );
}
