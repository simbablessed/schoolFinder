import { useState } from "react";
import { Link, useParams } from "react-router";
import { Icon } from "../components/Icon";
import { Rating } from "../components/Rating";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { getAllSchools, REVIEWS, unsplash, Review } from "../lib/data";
import { useCompare } from "../lib/compare";
import { api } from "../lib/api";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const TABS = ["Overview", "Admissions", "Fees Calculator", "Curriculum", "Facilities", "Uniform", "Gallery", "Reviews", "Contact"];
const GALLERY = [
  "photo-1580582932707-520aed937b7b",
  "photo-1523050854058-8df90110c9f1",
  "photo-1509062522246-3755977927d7",
  "photo-1554224155-6726b3ff858f",
  "photo-1541339907198-e08756dedf3f",
  "photo-1562774053-701939374585",
];

function Stat({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-4.5 shadow-2xs hover:shadow-sm transition">
      <div
        className="size-9 rounded-xl flex items-center justify-center mb-2.5"
        style={{ background: "rgba(165,206,234,0.35)", color: "var(--brand-blue)" }}
      >
        <Icon name={icon} size={20} />
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--brand-blue)", fontSize: "1.3rem" }}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

export function SchoolDetails() {
  const { id } = useParams();
  const { dataVersion } = useCompare();
  const allSchools = getAllSchools();
  const school = allSchools.find((s) => s.id === id) || allSchools[0];

  const [tab, setTab] = useState("Overview");
  const { has, toggle, hasFavorite, toggleFavorite } = useCompare();

  // Reviews state with user additions
  const initialReviews = REVIEWS.filter((r) => r.school === school.name).length
    ? REVIEWS.filter((r) => r.school === school.name)
    : REVIEWS;
  const [reviewsList, setReviewsList] = useState<Review[]>(initialReviews);

  // Modals state
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    parentName: "",
    phone: "",
    email: "",
    studentName: "",
    grade: "Form 1",
    entryYear: "2027",
    boarding: school.boarding ? "boarding" : "day",
    message: "",
  });

  // Review form state
  const [newReview, setNewReview] = useState({
    author: "",
    role: "Parent",
    rating: 5,
    title: "",
    body: "",
  });

  // Fee calculator options
  const [calcPeriod, setCalcPeriod] = useState<"term" | "year">("term");
  const [includeBoarding, setIncludeBoarding] = useState(school.boarding);
  const [includeTransport, setIncludeTransport] = useState(false);
  const [includeMeals, setIncludeMeals] = useState(false);
  const [includeUniform, setIncludeUniform] = useState(false);

  const termMultiplier = calcPeriod === "year" ? 3 : 1;
  const devLevy = 150;
  const boardingFee = includeBoarding ? 600 : 0;
  const transportFee = includeTransport ? 180 : 0;
  const mealsFee = includeMeals ? 120 : 0;
  const uniformFee = includeUniform ? (calcPeriod === "year" ? 280 : 280 / 3) : 0;

  const totalCalculated =
    (school.startingFees + devLevy + boardingFee + transportFee + mealsFee) * termMultiplier +
    (includeUniform ? 280 : 0);

  const isFavorite = hasFavorite(school.id);
  const isCompared = has(school.id);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    confetti({ particleCount: 75, spread: 60, origin: { y: 0.7 } });
    const refNumber = "SF-" + Math.floor(100000 + Math.random() * 900000);
    toast.success(`Enquiry received! Ref #${refNumber} routed to ${school.name} admissions.`);

    // Persist to Neon / Cloudflare / local API
    await api.enquiries.create({
      schoolId: school.id,
      parentName: enquiryForm.parentName,
      parentEmail: enquiryForm.email,
      parentPhone: enquiryForm.phone,
      interest: `${enquiryForm.grade} (${enquiryForm.entryYear}) - ${enquiryForm.boarding}`,
      notes: `Student: ${enquiryForm.studentName || 'Not specified'}. ${enquiryForm.message}`,
    });

    setEnquiryOpen(false);
    setEnquiryForm({
      parentName: "",
      phone: "",
      email: "",
      studentName: "",
      grade: "Form 1",
      entryYear: "2027",
      boarding: school.boarding ? "boarding" : "day",
      message: "",
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.title || !newReview.body || !newReview.author) {
      toast.error("Please fill in all review fields");
      return;
    }
    const created: Review = {
      id: "rev-" + Date.now(),
      schoolId: school.id,
      author: newReview.author,
      role: newReview.role,
      rating: newReview.rating,
      school: school.name,
      title: newReview.title,
      body: newReview.body,
      date: "Just now",
      avatar: "photo-1534528741775-53994a69daeb",
    };

    // Persist to Neon / Cloudflare / local API
    await api.reviews.create({
      schoolId: school.id,
      school: school.name,
      author: newReview.author,
      role: newReview.role,
      rating: newReview.rating,
      title: newReview.title,
      body: newReview.body,
    });

    setReviewsList([created, ...reviewsList]);
    confetti({ particleCount: 50, spread: 50 });
    toast.success("Thank you! Your verified review has been published.");
    setReviewModalOpen(false);
    setNewReview({ author: "", role: "Parent", rating: 5, title: "", body: "" });
  };

  const handleDownloadProspectus = () => {
    toast.success(`Prospectus for ${school.name} downloaded successfully!`);
  };

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Hero Banner with Vignette and School Crest */}
      <div className="relative h-80 md:h-[420px] bg-secondary/30">
        <ImageWithFallback
          src={unsplash(school.photo, 1600, 700)}
          alt={school.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />

        {/* Top Floating Controls */}
        <div className="absolute top-6 left-0 right-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
            <nav className="flex items-center gap-1.5 text-xs text-white/80 backdrop-blur-xs bg-black/30 px-3 py-1.5 rounded-full font-medium">
              <Link to="/" className="hover:text-white transition">Home</Link>
              <Icon name="chevron_right" size={14} />
              <Link to="/search" className="hover:text-white transition">Schools</Link>
              <Icon name="chevron_right" size={14} />
              <span className="text-white truncate max-w-[140px] sm:max-w-none">{school.name}</span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toggleFavorite(school.id);
                  toast.success(isFavorite ? `Removed from saved` : `Saved ${school.name} to favorites`);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                  isFavorite ? "bg-rose-500 text-white" : "bg-white/80 hover:bg-white text-foreground"
                }`}
              >
                <Icon name="favorite" size={15} fill={isFavorite} />
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </button>

              <button
                onClick={() => {
                  toggle(school.id);
                  toast.info(isCompared ? "Removed from comparison" : "Added to comparison");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition ${
                  isCompared ? "bg-[var(--brand-mustard)] text-[var(--brand-text)]" : "bg-white/80 hover:bg-white text-foreground"
                }`}
              >
                <Icon name="balance" size={15} />
                <span>{isCompared ? "In Compare" : "Compare"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Hero School Title & Details */}
        <div className="absolute bottom-0 left-0 right-0 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div
                className="size-20 sm:size-24 rounded-2xl border-3 border-white shadow-xl flex items-center justify-center shrink-0 overflow-hidden"
                style={{ background: "var(--brand-blue)" }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff", fontSize: "1.8rem" }}>
                  {school.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("")}
                </span>
              </div>
              <div className="text-white">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 style={{ color: "#fff", fontSize: "clamp(1.5rem,3.2vw,2.4rem)" }} className="font-extrabold leading-tight">
                    {school.name}
                  </h1>
                  {school.verified && (
                    <span
                      className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs shadow-xs"
                      style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 700 }}
                    >
                      <Icon name="verified" size={14} fill /> Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-white/90 text-xs sm:text-sm flex-wrap font-medium">
                  <span className="flex items-center gap-1"><Icon name="location_on" size={16} />{school.location}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Icon name="school" size={16} />{school.type}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Icon name="groups" size={16} />{school.gender}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Icon name="trending_up" size={16} />{school.passRate}% Pass Rate</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons in hero */}
            <div className="hidden md:flex items-center gap-2.5">
              <button
                onClick={handleDownloadProspectus}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/20 hover:bg-white/30 text-white backdrop-blur transition flex items-center gap-1.5"
              >
                <Icon name="download" size={16} />
                Prospectus
              </button>
              <button
                onClick={() => setEnquiryOpen(true)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 shadow-md flex items-center gap-1.5"
                style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
              >
                <Icon name="mail" size={18} />
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <div className="text-[11px] text-muted-foreground">Starting fee</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)", fontSize: "1.15rem" }}>
            ${school.startingFees}
            <span className="text-xs text-muted-foreground font-normal"> /term</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEnquiryOpen(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-90 shadow-sm"
            style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
          >
            Enquire Now
          </button>
        </div>
      </div>

      {/* Main Grid: Tabs + Content & Sticky Sidebar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-8 grid lg:grid-cols-[1fr_320px] gap-8">
        <div>
          {/* Scrollable Tabs */}
          <div className="relative mb-8">
            <div className="flex gap-1.5 overflow-x-auto border-b border-border pb-1" style={{ scrollbarWidth: "none" }}>
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-3 text-sm whitespace-nowrap rounded-t-xl transition font-medium ${
                    tab === t
                      ? "text-[var(--brand-blue)] font-bold bg-white border-t border-x border-border -mb-1"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                  }`}
                >
                  {t}
                  {tab === t && (
                    <span
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                      style={{ background: "var(--brand-mustard)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {tab === "Overview" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
                <h3 className="text-lg font-bold text-[var(--brand-blue)] mb-2.5">About {school.name}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {school.description} Established in {school.founded}, {school.name} has long stood as an institution of character, discipline, and scholarly achievement in {school.province}. It empowers young learners to discover their unique strengths while instilling lifelong ethical values.
                </p>
              </div>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <Stat icon="groups" label="Student Body" value={school.students.toLocaleString()} />
                <Stat icon="calendar_month" label="Founded" value={String(school.founded)} />
                <Stat icon="trending_up" label="National Pass Rate" value={`${school.passRate}%`} />
                <Stat icon="star" label="Overall Rating" value={`${school.rating.toFixed(1)} / 5.0`} />
              </div>

              {/* Curricula preview */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-bold text-[var(--brand-blue)]">Curricula & Examination Boards</h3>
                  <button onClick={() => setTab("Curriculum")} className="text-xs text-[var(--brand-blue)] hover:underline font-semibold">
                    View syllabus →
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {school.curriculum.map((c) => (
                    <span
                      key={c}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-2xs"
                      style={{ background: "rgba(165,206,234,0.35)", color: "var(--brand-blue)" }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              {/* Featured Campus Highlights */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
                <h3 className="text-base font-bold text-[var(--brand-blue)] mb-3">Campus Infrastructure</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {school.facilities.map((f) => (
                    <div key={f} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/15 text-xs font-semibold text-foreground">
                      <Icon name="check_circle" size={16} fill className="text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADMISSIONS */}
          {tab === "Admissions" && (
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-2xs">
              <div>
                <h3 className="text-lg font-bold text-[var(--brand-blue)]">Admissions & Enrollment Process</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Step-by-step guidance for prospective families applying for 2026/2027 intake.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Inquiry & Campus Tour", desc: "Submit an online enquiry or attend our scheduled termly Open Day to experience the campus." },
                  { title: "Application Submission", desc: "Complete the enrollment application and provide prior academic transcripts and birth certificate." },
                  { title: "Entrance Assessment & Interview", desc: "Prospective learners sit our diagnostic entrance examination followed by a student & parent interview." },
                  { title: "Offer & Registration", desc: "Successful candidates receive a formal letter of acceptance and secure their place with a commitment deposit." },
                ].map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 rounded-xl border border-border/80 bg-white">
                    <div
                      className="size-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 text-white shadow-2xs"
                      style={{ background: "var(--brand-blue)" }}
                    >
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-[var(--brand-blue)]">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800 text-sm">
                <Icon name="event_available" size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold">Applications are currently OPEN for 2027 intake.</span>
                  <div className="text-xs mt-0.5 text-emerald-700">Early applications are encouraged due to high demand.</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEnquiryOpen(true)}
                  className="px-6 py-3 rounded-xl text-sm font-semibold shadow-xs"
                  style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
                >
                  Start Online Application / Enquiry
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: FEES CALCULATOR */}
          {tab === "Fees Calculator" && (
            <div className="space-y-6">
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--brand-blue)]">Interactive Fee Estimator</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Customize your options to estimate total termly or annual educational costs.</p>
                  </div>
                  {/* Period Switcher */}
                  <div className="flex items-center rounded-xl bg-secondary/30 p-1 border border-border">
                    <button
                      onClick={() => setCalcPeriod("term")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        calcPeriod === "term" ? "bg-white text-[var(--brand-blue)] shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Per Term
                    </button>
                    <button
                      onClick={() => setCalcPeriod("year")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                        calcPeriod === "year" ? "bg-white text-[var(--brand-blue)] shadow-xs" : "text-muted-foreground"
                      }`}
                    >
                      Full Year (3 Terms)
                    </button>
                  </div>
                </div>

                {/* Add-ons Configuration */}
                <div className="grid sm:grid-cols-2 gap-3.5 my-6">
                  {school.boarding && (
                    <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white cursor-pointer hover:border-[var(--brand-blue)] transition">
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={includeBoarding}
                          onChange={(e) => setIncludeBoarding(e.target.checked)}
                          className="accent-[var(--brand-blue)] size-4"
                        />
                        <span className="text-xs font-semibold text-foreground">Boarding & Lodging</span>
                      </div>
                      <span className="text-xs font-bold text-[var(--brand-blue)]">
                        +${boardingFee * termMultiplier}
                      </span>
                    </label>
                  )}

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white cursor-pointer hover:border-[var(--brand-blue)] transition">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeTransport}
                        onChange={(e) => setIncludeTransport(e.target.checked)}
                        className="accent-[var(--brand-blue)] size-4"
                      />
                      <span className="text-xs font-semibold text-foreground">School Bus Route</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--brand-blue)]">
                      +${180 * termMultiplier}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white cursor-pointer hover:border-[var(--brand-blue)] transition">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeMeals}
                        onChange={(e) => setIncludeMeals(e.target.checked)}
                        className="accent-[var(--brand-blue)] size-4"
                      />
                      <span className="text-xs font-semibold text-foreground">Hot Lunch Catering</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--brand-blue)]">
                      +${120 * termMultiplier}
                    </span>
                  </label>

                  <label className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-white cursor-pointer hover:border-[var(--brand-blue)] transition">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={includeUniform}
                        onChange={(e) => setIncludeUniform(e.target.checked)}
                        className="accent-[var(--brand-blue)] size-4"
                      />
                      <span className="text-xs font-semibold text-foreground">Full Uniform Starter Kit</span>
                    </div>
                    <span className="text-xs font-bold text-[var(--brand-blue)]">+$280 (Once-off)</span>
                  </label>
                </div>

                {/* Breakdown Summary Table */}
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs">
                    <thead className="bg-secondary/25 border-b border-border">
                      <tr>
                        <th className="p-3 text-left font-bold text-foreground">Component</th>
                        <th className="p-3 text-right font-bold text-foreground">Estimated Amount (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3 font-medium">Core Academic Tuition</td>
                        <td className="p-3 text-right font-semibold">${school.startingFees * termMultiplier}</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Campus Development Levy</td>
                        <td className="p-3 text-right font-semibold">${devLevy * termMultiplier}</td>
                      </tr>
                      {includeBoarding && (
                        <tr>
                          <td className="p-3 font-medium">Boarding Residence & Housemaster Support</td>
                          <td className="p-3 text-right font-semibold">${boardingFee * termMultiplier}</td>
                        </tr>
                      )}
                      {includeTransport && (
                        <tr>
                          <td className="p-3 font-medium">Daily Shuttle Transport</td>
                          <td className="p-3 text-right font-semibold">${transportFee * termMultiplier}</td>
                        </tr>
                      )}
                      {includeMeals && (
                        <tr>
                          <td className="p-3 font-medium">Nutritional Dining Scheme</td>
                          <td className="p-3 text-right font-semibold">${mealsFee * termMultiplier}</td>
                        </tr>
                      )}
                      {includeUniform && (
                        <tr>
                          <td className="p-3 font-medium">Uniform & Sports Kit Bundle</td>
                          <td className="p-3 text-right font-semibold">$280</td>
                        </tr>
                      )}
                      <tr className="bg-[var(--brand-mustard)]/15 font-bold text-sm">
                        <td className="p-4 text-[var(--brand-blue)]">Estimated Total ({calcPeriod === "year" ? "Full Academic Year" : "Single Term"})</td>
                        <td className="p-4 text-right text-[var(--brand-blue)] font-extrabold text-base">
                          ${Math.round(totalCalculated).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-muted-foreground mt-3 italic">
                  * Note: Figures are estimates based on published 2026 school fees schedules. Special elective fees (e.g. musical instruments, Cambridge external exam registration) are billed separately.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CURRICULUM */}
          {tab === "Curriculum" && (
            <div className="space-y-4">
              {school.curriculum.map((c) => (
                <div key={c} className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="size-8 rounded-lg bg-[var(--brand-sky)]/30 flex items-center justify-center text-[var(--brand-blue)]">
                      <Icon name="menu_book" size={18} />
                    </div>
                    <h3 className="font-bold text-base text-[var(--brand-blue)]">{c} Syllabus</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Accredited syllabus designed to develop rigorous critical analysis, creative problem solving, and depth of subject mastery. Learners are prepared for international university matriculation as well as local tertiary entry.
                  </p>
                  <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs font-semibold text-[var(--brand-blue)]">
                    <Icon name="verified" size={15} fill className="text-[var(--brand-mustard)]" />
                    <span>Official Approved Examination Centre</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FACILITIES */}
          {tab === "Facilities" && (
            <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
              <h3 className="text-base font-bold text-[var(--brand-blue)] mb-4">Campus Amenities & Infrastructure</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {school.facilities.map((f) => (
                  <div key={f} className="p-3 rounded-xl border border-border bg-white flex items-center gap-2.5 shadow-2xs">
                    <Icon name="check_circle" fill size={18} className="text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: UNIFORM */}
          {tab === "Uniform" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Academic Formal Uniform", desc: "Tailored school blazer, official necktie, crisp collared shirts, formal trousers/skirt and polished black lace-up shoes." },
                { title: "Sporting & Athletic Kit", desc: "Inter-house athletic polo, colour-coded shorts, rugby/hockey tracksuits, and non-marking court trainers." },
                { title: "Winter Outerwear", desc: "Embroidered V-neck pullover sweater, fleece-lined waterproof jacket, and branded winter scarf." },
                { title: "Stockists & Uniform Shop", desc: "Available directly on campus at the Bursar's Shop and at authorized downtown retail outfitters in town." },
              ].map((item) => (
                <div key={item.title} className="bg-card rounded-2xl border border-border p-5 shadow-2xs">
                  <div className="size-9 rounded-xl flex items-center justify-center mb-3 bg-secondary/30 text-[var(--brand-blue)]">
                    <Icon name="checkroom" size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-[var(--brand-blue)]">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 7: GALLERY */}
          {tab === "Gallery" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-[var(--brand-blue)]">Campus Life & Activities</h3>
                <span className="text-xs text-muted-foreground">Click any photo to zoom</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {GALLERY.map((g, idx) => (
                  <div
                    key={idx}
                    onClick={() => setLightboxImg(g)}
                    className="rounded-xl overflow-hidden cursor-pointer aspect-4/3 relative group shadow-2xs"
                  >
                    <ImageWithFallback
                      src={unsplash(g, 600, 450)}
                      alt={`${school.name} gallery ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Icon name="zoom_in" size={28} className="text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: REVIEWS */}
          {tab === "Reviews" && (
            <div className="space-y-6">
              {/* Rating Summary Card */}
              <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center sm:pr-6 sm:border-r border-border shrink-0">
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "3.2rem", color: "var(--brand-blue)", lineHeight: 1 }}>
                    {school.rating.toFixed(1)}
                  </div>
                  <div className="mt-2">
                    <Rating value={school.rating} showValue={false} size={18} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 font-medium">{reviewsList.length} reviews verified</div>
                </div>

                {/* Rating Distribution */}
                <div className="flex-1 w-full space-y-1.5">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <div key={n} className="flex items-center gap-2 text-xs">
                      <span className="w-3 font-semibold text-muted-foreground">{n}</span>
                      <Icon name="star" size={13} fill className="text-[var(--brand-mustard)]" />
                      <div className="flex-1 h-2 rounded-full bg-secondary/30 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[var(--brand-mustard)]"
                          style={{ width: `${n === 5 ? 72 : n === 4 ? 20 : n === 3 ? 6 : 2}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-muted-foreground">{n === 5 ? "72%" : n === 4 ? "20%" : "5%"}</span>
                    </div>
                  ))}
                </div>

                <div className="shrink-0">
                  <button
                    onClick={() => setReviewModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                    style={{ background: "var(--brand-blue)" }}
                  >
                    Write a Review
                  </button>
                </div>
              </div>

              {/* Reviews Stream */}
              <div className="space-y-3.5">
                {reviewsList.map((r) => (
                  <div key={r.id} className="bg-card rounded-2xl border border-border p-5 shadow-2xs">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ImageWithFallback
                          src={unsplash(r.avatar, 80, 80)}
                          alt={r.author}
                          className="size-10 rounded-full object-cover border border-border"
                        />
                        <div>
                          <div className="font-bold text-sm text-foreground">{r.author}</div>
                          <div className="text-[11px] text-muted-foreground">{r.role} • {r.date}</div>
                        </div>
                      </div>
                      <Rating value={r.rating} showValue={false} size={15} />
                    </div>
                    <div className="font-semibold text-sm mt-3 text-[var(--brand-blue)]">{r.title}</div>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{r.body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: CONTACT */}
          {tab === "Contact" && (
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: "call", label: "Admissions Phone", value: "+263 242 700 900", href: "tel:+263242700900" },
                { icon: "mail", label: "Official Admissions Email", value: `admissions@${school.id}.co.zw`, href: `mailto:admissions@${school.id}.co.zw` },
                { icon: "language", label: "School Portal & Website", value: `www.${school.id}.co.zw`, href: `https://www.${school.id}.co.zw` },
                { icon: "location_on", label: "Physical Address", value: school.location, href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-3.5 shadow-2xs">
                  <div className="size-10 rounded-xl flex items-center justify-center shrink-0 bg-secondary/30 text-[var(--brand-blue)]">
                    <Icon name={icon} size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
                    {href ? (
                      <a href={href} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[var(--brand-blue)] hover:underline truncate block">
                        {value}
                      </a>
                    ) : (
                      <div className="text-xs font-semibold text-foreground truncate">{value}</div>
                    )}
                  </div>
                </div>
              ))}

              {/* Map Preview */}
              <div className="sm:col-span-2 rounded-2xl overflow-hidden border border-border h-64 relative bg-secondary/30 shadow-2xs">
                <ImageWithFallback
                  src={unsplash("photo-1524661135-423995f22d0b", 1000, 400)}
                  alt="School Location Map"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="bg-white rounded-full p-3 shadow-xl">
                    <Icon name="location_on" fill size={28} className="text-rose-600" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md text-xs font-bold text-[var(--brand-blue)]">
                  {school.location}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Sticky Right Sidebar */}
        <aside className="hidden lg:block space-y-4">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-22 shadow-xs">
            <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Starting Fees</div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)", fontSize: "2rem" }}>
              ${school.startingFees}
              <span className="text-xs text-muted-foreground font-normal"> /term</span>
            </div>

            <div className="mt-3">
              <Rating value={school.rating} count={school.reviews} size={15} />
            </div>

            {/* CTAs */}
            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => setEnquiryOpen(true)}
                className="w-full py-3.5 rounded-xl text-sm font-semibold transition hover:opacity-95 shadow-xs flex items-center justify-center gap-2"
                style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
              >
                <Icon name="mail" size={18} />
                Request Admission Info
              </button>

              <button
                onClick={() => {
                  toggle(school.id);
                  toast.info(isCompared ? "Removed from comparison" : "Added to comparison");
                }}
                className="w-full py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary/30 transition flex items-center justify-center gap-1.5 text-[var(--brand-blue)]"
              >
                <Icon name={isCompared ? "check" : "balance"} size={16} />
                {isCompared ? "Remove from Compare" : "Add to Comparison"}
              </button>

              <button
                onClick={handleDownloadProspectus}
                className="w-full py-2.5 rounded-xl border border-border text-xs font-semibold hover:bg-secondary/30 transition flex items-center justify-center gap-1.5 text-muted-foreground"
              >
                <Icon name="download" size={16} />
                Download Prospectus (PDF)
              </button>
            </div>

            {/* Quick Stats list */}
            <div className="border-t border-border mt-6 pt-4 space-y-3 text-xs">
              {[
                { icon: "groups", text: `${school.students.toLocaleString()} Learners` },
                { icon: "history_edu", text: `Founded ${school.founded}` },
                { icon: "night_shelter", text: school.boarding ? "Boarding & Day Scholars" : "Day Scholars Only" },
                { icon: "trending_up", text: `${school.passRate}% Exam Pass Rate` },
              ].map(({ icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-foreground font-medium">
                  <Icon name={icon} size={17} className="text-[var(--brand-blue)]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ENQUIRY MODAL */}
      {enquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEnquiryOpen(false)} />
          <div className="relative bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-lg text-[var(--brand-blue)]">Request Admission Info</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{school.name} Admissions Office</p>
              </div>
              <button onClick={() => setEnquiryOpen(false)} className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground">
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleEnquirySubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Parent / Guardian Name *</label>
                  <input
                    required
                    value={enquiryForm.parentName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, parentName: e.target.value })}
                    placeholder="e.g. Tendai Moyo"
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Phone / WhatsApp *</label>
                  <input
                    required
                    type="tel"
                    value={enquiryForm.phone}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, phone: e.target.value })}
                    placeholder="+263 77 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Email Address *</label>
                <input
                  required
                  type="email"
                  value={enquiryForm.email}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, email: e.target.value })}
                  placeholder="parent@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Learner's Name</label>
                  <input
                    value={enquiryForm.studentName}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, studentName: e.target.value })}
                    placeholder="Learner's full name"
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Intended Entry Level</label>
                  <select
                    value={enquiryForm.grade}
                    onChange={(e) => setEnquiryForm({ ...enquiryForm, grade: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)] bg-white"
                  >
                    <option>Grade 1</option>
                    <option>Form 1</option>
                    <option>Form 2 / Form 3</option>
                    <option>Lower 6th (A-Level)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Notes / Questions</label>
                <textarea
                  rows={3}
                  value={enquiryForm.message}
                  onChange={(e) => setEnquiryForm({ ...enquiryForm, message: e.target.value })}
                  placeholder="Ask about boarding vacancies, sports scholarships, or admission deadlines..."
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold shadow-xs"
                style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
              >
                Send Admission Enquiry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setReviewModalOpen(false)} />
          <div className="relative bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-8 max-w-md w-full z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-lg text-[var(--brand-blue)]">Write a School Review</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Share honest feedback for {school.name}</p>
              </div>
              <button onClick={() => setReviewModalOpen(false)} className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground">
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              {/* Star selector */}
              <div>
                <label className="text-xs font-bold text-foreground block mb-1.5">Rating (1 to 5 Stars)</label>
                <div className="flex items-center gap-1 text-[var(--brand-mustard)]">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Icon name="star" size={26} fill={star <= newReview.rating} />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-foreground ml-2">{newReview.rating} / 5</span>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Your Name *</label>
                  <input
                    required
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    placeholder="e.g. Farai Dube"
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-foreground block mb-1">Your Relationship</label>
                  <select
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)] bg-white"
                  >
                    <option>Parent of current learner</option>
                    <option>Guardian</option>
                    <option>Alumnus / Old Scholar</option>
                    <option>Current Student</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Review Headline *</label>
                <input
                  required
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="e.g. Dedicated teachers and wonderful rugby culture"
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-foreground block mb-1">Detailed Review *</label>
                <textarea
                  required
                  rows={4}
                  value={newReview.body}
                  onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                  placeholder="Share details on academics, sports, discipline, boarding care, or communication with parents..."
                  className="w-full px-3 py-2 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold text-white shadow-xs"
                style={{ background: "var(--brand-blue)" }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR GALLERY */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition"
          >
            <Icon name="close" size={24} />
          </button>
          <div className="max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl">
            <ImageWithFallback
              src={unsplash(lightboxImg, 1400, 900)}
              alt="Enlarged campus preview"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
