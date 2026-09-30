import { Link } from "react-router";
import { Icon } from "../components/Icon";

export function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="text-center max-w-md">
        <div className="relative inline-block">
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(5rem,18vw,9rem)", color: "var(--brand-blue)", lineHeight: 1 }}>404</div>
          <div className="absolute -top-2 -right-6 size-14 rounded-2xl flex items-center justify-center rotate-12" style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}><Icon name="school" size={30} fill /></div>
        </div>
        <h1 className="mt-4" style={{ fontSize: "1.5rem" }}>This page has gone off to class</h1>
        <p className="text-muted-foreground mt-2">The page you're looking for doesn't exist or may have been moved. Let's get you back on track.</p>
        <div className="flex items-center justify-center gap-3 mt-7">
          <Link to="/" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-white text-sm" style={{ background: "var(--brand-blue)", fontWeight: 500 }}><Icon name="home" size={18} /> Back home</Link>
          <Link to="/search" className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-border text-sm" style={{ fontWeight: 500, color: "var(--brand-blue)" }}><Icon name="search" size={18} /> Find schools</Link>
        </div>
      </div>
    </div>
  );
}
