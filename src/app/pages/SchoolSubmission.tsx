import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { toast } from "sonner";
import { saveCustomSchool, School } from "../lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Step 1 – Basic Info
  schoolName: string;
  type: string;
  level: string;
  yearEstablished: string;
  registrationNumber: string;
  motto: string;
  description: string;
  // Step 2 – Location & Contact
  province: string;
  city: string;
  suburb: string;
  streetAddress: string;
  phone: string;
  altPhone: string;
  email: string;
  whatsapp: string;
  website: string;
  // Step 3 – Academic
  curriculum: string[];
  subjects: string;
  languageOfInstruction: string;
  studentCount: string;
  teacherCount: string;
  classSize: string;
  oLevelPassRate: string;
  aLevelPassRate: string;
  // Step 4 – Facilities
  facilities: string[];
  boardingType: string;
  feesMin: string;
  feesMax: string;
  feesCurrency: string;
  bursariesAvailable: boolean;
  // Step 5 – Media & Contact Person
  logoPreview: string;
  photosPreviews: string[];
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  agreeTerms: boolean;
}

const INITIAL: FormData = {
  schoolName: "", type: "", level: "", yearEstablished: "", registrationNumber: "", motto: "", description: "",
  province: "", city: "", suburb: "", streetAddress: "", phone: "", altPhone: "", email: "", whatsapp: "", website: "",
  curriculum: [], subjects: "", languageOfInstruction: "English", studentCount: "", teacherCount: "", classSize: "",
  oLevelPassRate: "", aLevelPassRate: "",
  facilities: [], boardingType: "none", feesMin: "", feesMax: "", feesCurrency: "USD", bursariesAvailable: false,
  logoPreview: "", photosPreviews: [], contactName: "", contactTitle: "", contactEmail: "", contactPhone: "", agreeTerms: false,
};

// ─── Constants ────────────────────────────────────────────────────────────────

const STEPS = [
  { icon: "school", label: "Basic Info" },
  { icon: "location_on", label: "Location & Contact" },
  { icon: "menu_book", label: "Academic" },
  { icon: "sports_soccer", label: "Facilities & Fees" },
  { icon: "photo_camera", label: "Media & Submit" },
];

const PROVINCES = ["Harare", "Bulawayo", "Manicaland", "Mashonaland Central", "Mashonaland East", "Mashonaland West", "Masvingo", "Matabeleland North", "Matabeleland South", "Midlands"];
const SCHOOL_TYPES = ["Government", "Private", "Mission", "International", "Special Needs"];
const SCHOOL_LEVELS = ["Primary", "Secondary", "Combined (Primary & Secondary)", "Early Childhood Development", "Tertiary/College"];
const CURRICULA = ["ZIMSEC O-Level", "ZIMSEC A-Level", "Cambridge IGCSE", "Cambridge A-Level", "International Baccalaureate (IB)", "British Curriculum", "American Curriculum", "Montessori"];
const ALL_FACILITIES = [
  { id: "library", icon: "local_library", label: "Library" },
  { id: "computer_lab", icon: "computer", label: "Computer Lab" },
  { id: "science_lab", icon: "science", label: "Science Lab" },
  { id: "sports_field", icon: "sports_soccer", label: "Sports Field" },
  { id: "swimming_pool", icon: "pool", label: "Swimming Pool" },
  { id: "chapel", icon: "church", label: "Chapel / Hall" },
  { id: "clinic", icon: "local_hospital", label: "School Clinic" },
  { id: "cafeteria", icon: "restaurant", label: "Cafeteria" },
  { id: "wifi", icon: "wifi", label: "Wi-Fi Campus" },
  { id: "transport", icon: "directions_bus", label: "Transport" },
  { id: "music", icon: "music_note", label: "Music Room" },
  { id: "art", icon: "palette", label: "Art Studio" },
];

// ─── Shared field components ──────────────────────────────────────────────────

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm" style={{ fontWeight: 600, color: "var(--brand-text)" }}>
        {label}{required && <span style={{ color: "var(--brand-mustard)" }}> *</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text", ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm outline-none transition focus:ring-2"
      style={{ color: "var(--brand-text)" } as React.CSSProperties}
      onFocus={e => (e.target.style.borderColor = "var(--brand-blue)", e.target.style.boxShadow = "0 0 0 3px rgba(16,54,125,0.10)")}
      onBlur={e => (e.target.style.borderColor = "", e.target.style.boxShadow = "")}
      {...rest}
    />
  );
}

function Select({ value, onChange, children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm outline-none transition appearance-none cursor-pointer"
      style={{ color: "var(--brand-text)" } as React.CSSProperties}
      onFocus={e => (e.target.style.borderColor = "var(--brand-blue)", e.target.style.boxShadow = "0 0 0 3px rgba(16,54,125,0.10)")}
      onBlur={e => (e.target.style.borderColor = "", e.target.style.boxShadow = "")}
      {...rest}
    >
      {children}
    </select>
  );
}

function Textarea({ value, onChange, placeholder, rows = 4, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      value={value as string}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-sm outline-none transition resize-none"
      style={{ color: "var(--brand-text)" } as React.CSSProperties}
      onFocus={e => (e.target.style.borderColor = "var(--brand-blue)", e.target.style.boxShadow = "0 0 0 3px rgba(16,54,125,0.10)")}
      onBlur={e => (e.target.style.borderColor = "", e.target.style.boxShadow = "")}
      {...rest}
    />
  );
}

function CheckChip({ checked, onChange, label, icon }: { checked: boolean; onChange: () => void; label: string; icon?: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition text-sm"
      style={{
        borderColor: checked ? "var(--brand-blue)" : "var(--border)",
        background: checked ? "rgba(16,54,125,0.07)" : "white",
        color: checked ? "var(--brand-blue)" : "var(--brand-text)",
        fontWeight: checked ? 600 : 400,
      }}
    >
      {icon && <Icon name={icon} size={16} fill={checked} />}
      {label}
      {checked && <Icon name="check_circle" size={15} fill style={{ color: "var(--brand-blue)" }} />}
    </button>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field label="School Name" required>
            <Input value={data.schoolName} onChange={e => set("schoolName", e.target.value)} placeholder="e.g. Prince Edward School" />
          </Field>
        </div>
        <Field label="School Type" required>
          <Select value={data.type} onChange={e => set("type", e.target.value)}>
            <option value="">Select type…</option>
            {SCHOOL_TYPES.map(t => <option key={t}>{t}</option>)}
          </Select>
        </Field>
        <Field label="School Level" required>
          <Select value={data.level} onChange={e => set("level", e.target.value)}>
            <option value="">Select level…</option>
            {SCHOOL_LEVELS.map(l => <option key={l}>{l}</option>)}
          </Select>
        </Field>
        <Field label="Year Established">
          <Input value={data.yearEstablished} onChange={e => set("yearEstablished", e.target.value)} placeholder="e.g. 1967" type="number" min="1800" max="2026" />
        </Field>
        <Field label="Ministry Registration Number" hint="ZOU/MOE registration or equivalent">
          <Input value={data.registrationNumber} onChange={e => set("registrationNumber", e.target.value)} placeholder="e.g. MOE/2022/HRE/0123" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="School Motto">
            <Input value={data.motto} onChange={e => set("motto", e.target.value)} placeholder="e.g. Excellence Through Hard Work" />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="School Description" required hint="Write a compelling overview of your school — vision, ethos, and what makes it unique (150–500 words).">
            <Textarea value={data.description} onChange={e => set("description", e.target.value)} placeholder="Tell parents and students about your school's history, values, and community…" rows={6} />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Province" required>
          <Select value={data.province} onChange={e => set("province", e.target.value)}>
            <option value="">Select province…</option>
            {PROVINCES.map(p => <option key={p}>{p}</option>)}
          </Select>
        </Field>
        <Field label="City / Town" required>
          <Input value={data.city} onChange={e => set("city", e.target.value)} placeholder="e.g. Harare" />
        </Field>
        <Field label="Suburb / Area">
          <Input value={data.suburb} onChange={e => set("suburb", e.target.value)} placeholder="e.g. Borrowdale" />
        </Field>
        <Field label="Street Address">
          <Input value={data.streetAddress} onChange={e => set("streetAddress", e.target.value)} placeholder="e.g. 14 Churchill Avenue" />
        </Field>
      </div>

      <div className="border-t border-border pt-5 grid sm:grid-cols-2 gap-5">
        <Field label="Main Phone Number" required>
          <Input value={data.phone} onChange={e => set("phone", e.target.value)} placeholder="+263 77 000 0000" type="tel" />
        </Field>
        <Field label="Alternative Phone">
          <Input value={data.altPhone} onChange={e => set("altPhone", e.target.value)} placeholder="+263 24 2 000000" type="tel" />
        </Field>
        <Field label="Official Email Address" required>
          <Input value={data.email} onChange={e => set("email", e.target.value)} placeholder="info@yourschool.ac.zw" type="email" />
        </Field>
        <Field label="WhatsApp Number">
          <Input value={data.whatsapp} onChange={e => set("whatsapp", e.target.value)} placeholder="+263 77 000 0000" type="tel" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="School Website" hint="Include https:// if applicable">
            <Input value={data.website} onChange={e => set("website", e.target.value)} placeholder="https://www.yourschool.ac.zw" type="url" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function Step3({ data, set, toggle }: { data: FormData; set: (k: keyof FormData, v: string) => void; toggle: (k: "curriculum", v: string) => void }) {
  return (
    <div className="space-y-6">
      <Field label="Curricula Offered" required hint="Select all that apply">
        <div className="flex flex-wrap gap-2 mt-1">
          {CURRICULA.map(c => (
            <CheckChip key={c} checked={data.curriculum.includes(c)} onChange={() => toggle("curriculum", c)} label={c} />
          ))}
        </div>
      </Field>

      <Field label="Language of Instruction">
        <Select value={data.languageOfInstruction} onChange={e => set("languageOfInstruction", e.target.value)}>
          <option>English</option>
          <option>Shona</option>
          <option>Ndebele</option>
          <option>English & Shona</option>
          <option>English & Ndebele</option>
        </Select>
      </Field>

      <Field label="Key Subjects Offered" hint="List the main subjects — separate with commas">
        <Textarea value={data.subjects} onChange={e => set("subjects", e.target.value)} placeholder="Mathematics, English, Science, History, Geography, Commerce, Art, Music…" rows={3} />
      </Field>

      <div className="grid sm:grid-cols-3 gap-5">
        <Field label="Total Learners Enrolled">
          <Input value={data.studentCount} onChange={e => set("studentCount", e.target.value)} placeholder="e.g. 850" type="number" min="0" />
        </Field>
        <Field label="Total Teaching Staff">
          <Input value={data.teacherCount} onChange={e => set("teacherCount", e.target.value)} placeholder="e.g. 45" type="number" min="0" />
        </Field>
        <Field label="Average Class Size">
          <Input value={data.classSize} onChange={e => set("classSize", e.target.value)} placeholder="e.g. 32" type="number" min="0" />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="O-Level Pass Rate (%)" hint="Most recent academic year">
          <Input value={data.oLevelPassRate} onChange={e => set("oLevelPassRate", e.target.value)} placeholder="e.g. 94" type="number" min="0" max="100" />
        </Field>
        <Field label="A-Level Pass Rate (%)" hint="Leave blank if not applicable">
          <Input value={data.aLevelPassRate} onChange={e => set("aLevelPassRate", e.target.value)} placeholder="e.g. 88" type="number" min="0" max="100" />
        </Field>
      </div>
    </div>
  );
}

function Step4({ data, set, toggle, setBool }: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  toggle: (k: "facilities", v: string) => void;
  setBool: (k: keyof FormData, v: boolean) => void;
}) {
  return (
    <div className="space-y-6">
      <Field label="Available Facilities" hint="Select all facilities your school has">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1">
          {ALL_FACILITIES.map(f => (
            <CheckChip
              key={f.id}
              checked={data.facilities.includes(f.id)}
              onChange={() => toggle("facilities", f.id)}
              label={f.label}
              icon={f.icon}
            />
          ))}
        </div>
      </Field>

      <Field label="Boarding Availability">
        <Select value={data.boardingType} onChange={e => set("boardingType", e.target.value)}>
          <option value="none">Day School Only</option>
          <option value="full">Full Boarding Available</option>
          <option value="weekly">Weekly Boarding</option>
          <option value="both">Day & Boarding Options</option>
        </Select>
      </Field>

      <div className="border-t border-border pt-5">
        <p className="text-sm mb-4" style={{ fontWeight: 600, color: "var(--brand-text)" }}>Annual School Fees</p>
        <div className="grid sm:grid-cols-3 gap-5">
          <Field label="Currency">
            <Select value={data.feesCurrency} onChange={e => set("feesCurrency", e.target.value)}>
              <option value="USD">USD (US Dollar)</option>
              <option value="ZWG">ZWG (Zimbabwe Gold)</option>
              <option value="ZAR">ZAR (South African Rand)</option>
            </Select>
          </Field>
          <Field label="Fees From" hint="Minimum annual fees">
            <Input value={data.feesMin} onChange={e => set("feesMin", e.target.value)} placeholder="e.g. 800" type="number" min="0" />
          </Field>
          <Field label="Fees To" hint="Maximum annual fees">
            <Input value={data.feesMax} onChange={e => set("feesMax", e.target.value)} placeholder="e.g. 2500" type="number" min="0" />
          </Field>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-white">
        <button
          type="button"
          onClick={() => setBool("bursariesAvailable", !data.bursariesAvailable)}
          className="size-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition border"
          style={{
            borderColor: data.bursariesAvailable ? "var(--brand-blue)" : "var(--border)",
            background: data.bursariesAvailable ? "var(--brand-blue)" : "white",
          }}
        >
          {data.bursariesAvailable && <Icon name="check" size={14} style={{ color: "white" }} />}
        </button>
        <div>
          <p className="text-sm" style={{ fontWeight: 600 }}>Bursaries / Scholarships Available</p>
          <p className="text-xs text-muted-foreground mt-0.5">Check this if your school offers financial assistance or merit-based scholarships to learners.</p>
        </div>
      </div>
    </div>
  );
}

function Step5({
  data, set, setBool, onFileSelect, onPhotosSelect,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  setBool: (k: keyof FormData, v: boolean) => void;
  onFileSelect: (preview: string) => void;
  onPhotosSelect: (previews: string[]) => void;
}) {
  const logoRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef<HTMLInputElement>(null);

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => onFileSelect(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handlePhotos(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, 6);
    const previews: string[] = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => {
        previews.push(ev.target?.result as string);
        if (++loaded === files.length) onPhotosSelect(previews);
      };
      reader.readAsDataURL(file);
    });
  }

  return (
    <div className="space-y-6">
      {/* Logo */}
      <Field label="School Logo" hint="PNG or SVG, square, at least 300×300px recommended">
        <div className="flex items-center gap-4">
          <div
            className="size-20 rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition hover:border-[var(--brand-blue)]"
            onClick={() => logoRef.current?.click()}
          >
            {data.logoPreview
              ? <img src={data.logoPreview} className="w-full h-full object-cover" alt="Logo preview" />
              : <Icon name="add_photo_alternate" size={28} style={{ color: "var(--muted-foreground)" }} />}
          </div>
          <div>
            <button type="button" onClick={() => logoRef.current?.click()} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary/40 transition" style={{ fontWeight: 500 }}>
              {data.logoPreview ? "Change Logo" : "Upload Logo"}
            </button>
            <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG, SVG — max 5 MB</p>
          </div>
        </div>
        <input ref={logoRef} type="file" accept="image/*" className="hidden" onChange={handleLogo} />
      </Field>

      {/* Photos */}
      <Field label="School Photos" hint="Upload up to 6 photos of your campus, facilities, classrooms, etc.">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer transition hover:border-[var(--brand-blue)]"
              onClick={() => photosRef.current?.click()}
            >
              {data.photosPreviews[i]
                ? <img src={data.photosPreviews[i]} className="w-full h-full object-cover" alt={`Photo ${i + 1}`} />
                : <Icon name="add_a_photo" size={20} style={{ color: "var(--muted-foreground)" }} />}
            </div>
          ))}
        </div>
        <button type="button" onClick={() => photosRef.current?.click()} className="mt-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary/40 transition" style={{ fontWeight: 500 }}>
          Select Photos
        </button>
        <input ref={photosRef} type="file" accept="image/*" multiple className="hidden" onChange={handlePhotos} />
      </Field>

      {/* Contact Person */}
      <div className="border-t border-border pt-5">
        <p className="text-sm mb-4" style={{ fontWeight: 600, color: "var(--brand-text)" }}>Submission Contact Person</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Full Name" required>
            <Input value={data.contactName} onChange={e => set("contactName", e.target.value)} placeholder="e.g. Mrs. Chipo Moyo" />
          </Field>
          <Field label="Job Title / Role" required>
            <Input value={data.contactTitle} onChange={e => set("contactTitle", e.target.value)} placeholder="e.g. School Principal" />
          </Field>
          <Field label="Email Address" required>
            <Input value={data.contactEmail} onChange={e => set("contactEmail", e.target.value)} placeholder="principal@yourschool.ac.zw" type="email" />
          </Field>
          <Field label="Phone Number" required>
            <Input value={data.contactPhone} onChange={e => set("contactPhone", e.target.value)} placeholder="+263 77 000 0000" type="tel" />
          </Field>
        </div>
      </div>

      {/* Terms */}
      <div
        className="flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition"
        style={{ borderColor: data.agreeTerms ? "var(--brand-blue)" : "var(--border)", background: data.agreeTerms ? "rgba(16,54,125,0.04)" : "white" }}
        onClick={() => setBool("agreeTerms", !data.agreeTerms)}
      >
        <div
          className="size-5 mt-0.5 rounded flex items-center justify-center shrink-0 transition border"
          style={{ borderColor: data.agreeTerms ? "var(--brand-blue)" : "var(--border)", background: data.agreeTerms ? "var(--brand-blue)" : "white" }}
        >
          {data.agreeTerms && <Icon name="check" size={14} style={{ color: "white" }} />}
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed select-none">
          I confirm that the information submitted is accurate and I am authorised to list this school on School Finder Zimbabwe.
          I agree to the{" "}
          <a href="/about" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--brand-blue)" }} onClick={e => e.stopPropagation()}>Terms of Service</a>
          {" "}and{" "}
          <a href="/about" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--brand-blue)" }} onClick={e => e.stopPropagation()}>Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({
  schoolId,
  schoolName,
  onReset,
}: {
  schoolId: string | null;
  schoolName: string;
  onReset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-6 max-w-lg mx-auto">
      <div className="size-20 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700">
        <Icon name="check_circle" size={44} fill />
      </div>
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3">
          <Icon name="verified" size={14} fill />
          Live in Directory
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--brand-blue)", fontSize: "1.75rem" }}>
          {schoolName ? `“${schoolName}” is Live!` : "Submission Received!"}
        </h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          Your school profile is now published in School Finder Zimbabwe. Parents can discover your fees, curriculum, pass rates, and send admission enquiries directly.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
        {schoolId && (
          <Link
            to={`/school/${schoolId}`}
            className="flex-1 px-5 py-3 rounded-xl text-sm font-bold text-[var(--brand-text)] flex items-center justify-center gap-2 shadow-xs transition hover:scale-[1.02]"
            style={{ background: "var(--brand-mustard)" }}
          >
            <span>View Live Profile</span>
            <Icon name="arrow_forward" size={16} />
          </Link>
        )}
        <Link
          to="/search"
          className="flex-1 px-5 py-3 rounded-xl text-sm text-white flex items-center justify-center gap-2 transition hover:opacity-90 font-medium"
          style={{ background: "var(--brand-blue)" }}
        >
          <Icon name="search" size={16} />
          <span>Browse in Search</span>
        </Link>
      </div>

      <button
        onClick={onReset}
        className="text-xs text-muted-foreground hover:text-foreground underline transition"
      >
        Submit another school listing
      </button>
    </div>
  );
}


// ─── Main Page ────────────────────────────────────────────────────────────────

export function SchoolSubmission() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [createdSchoolId, setCreatedSchoolId] = useState<string | null>(null);

  function set(k: keyof FormData, v: string) {
    setData(prev => ({ ...prev, [k]: v }));
  }

  function setBool(k: keyof FormData, v: boolean) {
    setData(prev => ({ ...prev, [k]: v }));
  }

  function toggle(k: "curriculum" | "facilities", v: string) {
    setData(prev => {
      const arr = prev[k] as string[];
      return { ...prev, [k]: arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v] };
    });
  }

  function validateStep(): boolean {
    if (step === 0 && (!data.schoolName || !data.type || !data.level || !data.description)) {
      toast.error("Please fill in School Name, Type, Level, and Description.");
      return false;
    }
    if (step === 1 && (!data.province || !data.city || !data.phone || !data.email)) {
      toast.error("Please fill in Province, City, Phone, and Email.");
      return false;
    }
    if (step === 2 && data.curriculum.length === 0) {
      toast.error("Please select at least one curriculum.");
      return false;
    }
    if (step === 4 && (!data.contactName || !data.contactTitle || !data.contactEmail || !data.contactPhone)) {
      toast.error("Please complete all Contact Person fields.");
      return false;
    }
    if (step === 4 && !data.agreeTerms) {
      toast.error("Please agree to the Terms of Service before submitting.");
      return false;
    }
    return true;
  }

  function next() {
    if (!validateStep()) return;
    setStep(s => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep(s => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleSubmit() {
    if (!validateStep()) return;
    setSubmitting(true);

    const slug =
      data.schoolName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") ||
      `school-${Date.now()}`;

    const newSchool: School = {
      id: slug,
      name: data.schoolName,
      logo: "photo-1599305445671-ac291c95aaa9",
      photo: data.photosPreviews[0] || "photo-1580582932707-520aed937b7b",
      location: `${data.suburb ? data.suburb + ", " : ""}${data.city}, ${data.province}`,
      province: data.province,
      type: data.type || "High School",
      gender: "Co-ed",
      boarding: data.boardingType !== "none",
      rating: 4.8,
      reviews: 1,
      verified: true,
      description: data.description,
      startingFees: parseInt(data.feesMin) || 850,
      founded: parseInt(data.yearEstablished) || 2012,
      students: parseInt(data.studentCount) || 500,
      passRate: parseInt(data.oLevelPassRate) || 94,
      curriculum: data.curriculum.length > 0 ? data.curriculum : ["ZIMSEC", "Cambridge"],
      facilities:
        data.facilities.length > 0
          ? data.facilities.map((f) => {
              const matched = ALL_FACILITIES.find((x) => x.id === f);
              return matched ? matched.label : f;
            })
          : ["Library", "Science Labs", "Sports Field"],
      featured: true,
    };

    saveCustomSchool(newSchool);
    setCreatedSchoolId(slug);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success(`${data.schoolName} is now live in the directory!`);
    }, 600);
  }

  const stepProps = { data, set };

  return (
    <div className="min-h-screen" style={{ background: "var(--brand-bg)" }}>
      {/* Hero banner */}
      <div className="py-12 px-4" style={{ background: "var(--brand-blue)" }}>
        <div className="max-w-3xl mx-auto text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-xs" style={{ background: "rgba(255,184,0,0.25)", color: "var(--brand-mustard)", fontWeight: 600 }}>
            <Icon name="verified" size={14} fill />
            Free School Listing
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
            List Your School on School Finder Zimbabwe
          </h1>
          <p className="mt-3 text-white/75 max-w-xl mx-auto">
            Reach thousands of parents and students across Zimbabwe. Listing is completely free — just fill in your school's details below.
          </p>
          {/* Stats strip */}
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {[
              { icon: "search", label: "Monthly Searches", value: "12,000+" },
              { icon: "family_restroom", label: "Families Reached", value: "8,500+" },
              { icon: "school", label: "Schools Listed", value: "340+" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.4rem" }}>{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {submitted ? (
          <div className="bg-white rounded-2xl border border-border p-8">
            <SuccessScreen
              schoolId={createdSchoolId}
              schoolName={data.schoolName}
              onReset={() => {
                setData(INITIAL);
                setStep(0);
                setSubmitted(false);
                setCreatedSchoolId(null);
              }}
            />
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-0 mb-8 overflow-x-auto pb-2">
              {STEPS.map((s, i) => (
                <div key={s.label} className="flex items-center shrink-0">
                  <button
                    type="button"
                    onClick={() => i < step && setStep(i)}
                    className="flex flex-col items-center gap-1.5 group"
                    style={{ cursor: i < step ? "pointer" : "default" }}
                  >
                    <div
                      className="size-10 rounded-full flex items-center justify-center transition"
                      style={{
                        background: i < step ? "var(--brand-blue)" : i === step ? "var(--brand-blue)" : "white",
                        border: i > step ? "2px solid var(--border)" : "none",
                        color: i <= step ? "white" : "var(--muted-foreground)",
                      }}
                    >
                      {i < step
                        ? <Icon name="check" size={18} style={{ color: "white" }} />
                        : <Icon name={s.icon} size={18} fill={i === step} />}
                    </div>
                    <span className="text-[10px] whitespace-nowrap" style={{ fontWeight: i === step ? 600 : 400, color: i === step ? "var(--brand-blue)" : "var(--muted-foreground)" }}>
                      {s.label}
                    </span>
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className="h-0.5 w-10 sm:w-16 mx-1 mb-4 rounded-full" style={{ background: i < step ? "var(--brand-blue)" : "var(--border)" }} />
                  )}
                </div>
              ))}
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl border border-border p-6 sm:p-8">
              <div className="mb-7">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="size-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,54,125,0.10)", color: "var(--brand-blue)" }}>
                    <Icon name={STEPS[step].icon} size={18} fill />
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--brand-blue)", fontSize: "1.2rem" }}>
                    {STEPS[step].label}
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
              </div>

              {step === 0 && <Step1 {...stepProps} />}
              {step === 1 && <Step2 {...stepProps} />}
              {step === 2 && <Step3 {...stepProps} toggle={toggle} />}
              {step === 3 && <Step4 {...stepProps} toggle={toggle} setBool={setBool} />}
              {step === 4 && (
                <Step5
                  {...stepProps}
                  setBool={setBool}
                  onFileSelect={preview => setData(p => ({ ...p, logoPreview: preview }))}
                  onPhotosSelect={previews => setData(p => ({ ...p, photosPreviews: previews }))}
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-3">
                <button
                  type="button"
                  onClick={back}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border text-sm transition hover:bg-secondary/40 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ fontWeight: 500 }}
                >
                  <Icon name="arrow_back" size={16} />
                  Back
                </button>

                <div className="text-xs text-muted-foreground hidden sm:block">
                  {Math.round(((step) / STEPS.length) * 100)}% complete
                </div>

                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm text-white transition hover:opacity-90"
                    style={{ background: "var(--brand-blue)", fontWeight: 500 }}
                  >
                    Continue
                    <Icon name="arrow_forward" size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ background: "var(--brand-mustard)", color: "var(--brand-text)", fontWeight: 600 }}
                  >
                    <Icon name={submitting ? "hourglass_empty" : "send"} size={16} />
                    {submitting ? "Submitting…" : "Submit Listing"}
                  </button>
                )}
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
              {[
                { icon: "lock", label: "Secure & Private" },
                { icon: "verified", label: "Reviewed by Our Team" },
                { icon: "volunteer_activism", label: "Free Forever" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-1.5">
                  <Icon name={b.icon} size={16} fill style={{ color: "var(--brand-blue)" }} />
                  {b.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
