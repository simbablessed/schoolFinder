import { useState, useEffect } from "react";
import { Icon } from "../components/Icon";
import { Rating } from "../components/Rating";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { REVIEWS, unsplash, getAllSchools } from "../lib/data";
import { useAuth } from "../lib/auth";
import { api } from "../lib/api";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const VIEWS = [
  { m: "May", v: 780 },
  { m: "Jun", v: 920 },
  { m: "Jul", v: 1050 },
  { m: "Aug", v: 1340 },
  { m: "Sep", v: 1680 },
  { m: "Oct", v: 2150 },
];

const SOURCES = [
  { name: "Direct Search", value: 52, color: "#10367D" },
  { name: "Province Browse", value: 24, color: "#A5CEEA" },
  { name: "Compare Tool", value: 15, color: "#FFB800" },
  { name: "Direct Link", value: 9, color: "#2E7D32" },
];

interface EnquiryItem {
  id: string;
  parent: string;
  email: string;
  phone: string;
  interest: string;
  date: string;
  status: "New" | "Contacted" | "Interview" | "Enrolled";
}

const INITIAL_ENQUIRIES: EnquiryItem[] = [
  { id: "e1", parent: "Chipo Ncube", email: "chipo.n@gmail.com", phone: "+263 77 212 3456", interest: "Form 1 Admission (2027)", date: "Today", status: "New" },
  { id: "e2", parent: "Farai Dube", email: "farai.dube@zimcorp.co.zw", phone: "+263 71 890 1234", interest: "Boarding House Vacancies", date: "Yesterday", status: "Contacted" },
  { id: "e3", parent: "Rutendo Sibanda", email: "r.sibanda@yahoo.co.uk", phone: "+263 77 567 8901", interest: "Fees & Sports Bursary Scheme", date: "2 days ago", status: "Interview" },
  { id: "e4", parent: "Blessing Chikowore", email: "bchikowore@hotmail.com", phone: "+263 78 345 6789", interest: "Cambridge A-Level Sciences", date: "4 days ago", status: "Enrolled" },
];

function Stat({ icon, label, value, delta, accent }: { icon: string; label: string; value: string; delta: string; accent?: boolean }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-2xs hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <div
          className="size-10 rounded-xl flex items-center justify-center"
          style={{ background: accent ? "rgba(255,184,0,0.18)" : "rgba(165,206,234,0.35)", color: accent ? "#8a6400" : "var(--brand-blue)" }}
        >
          <Icon name={icon} size={22} />
        </div>
        <span className="text-xs flex items-center gap-0.5 text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          <Icon name="trending_up" size={14} />
          {delta}
        </span>
      </div>
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)", fontSize: "1.8rem" }} className="mt-3">
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5 font-medium">{label}</div>
    </div>
  );
}

export function SchoolDashboard() {
  const { user } = useAuth();
  const allSchools = getAllSchools();
  const targetSchoolId = user.schoolId || "prince-edward";
  const currentSchool = allSchools.find((s) => s.id === targetSchoolId) || allSchools[0];

  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES);
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [enquiryFilter, setEnquiryFilter] = useState<string>("All");

  const [schoolData, setSchoolData] = useState({
    name: currentSchool.name,
    fees: currentSchool.startingFees,
    passRate: currentSchool.passRate,
    motto: currentSchool.motto || "Firm Foundation",
    phone: currentSchool.phone || "+263 242 790 600",
  });

  // When user or school changes, update state and load real enquiries from API
  useEffect(() => {
    const s = allSchools.find((sch) => sch.id === targetSchoolId) || allSchools[0];
    setSchoolData({
      name: s.name,
      fees: s.startingFees,
      passRate: s.passRate,
      motto: s.motto || "Firm Foundation",
      phone: s.phone || "+263 242 790 600",
    });

    api.enquiries.list(targetSchoolId).then((data) => {
      if (data && data.length > 0) {
        setEnquiries(
          data.map((e) => ({
            id: e.id,
            parent: e.parentName,
            email: e.parentEmail,
            phone: e.parentPhone || "+263 77 000 0000",
            interest: e.interest,
            date: e.date,
            status: e.status as any,
          }))
        );
      }
    });
  }, [targetSchoolId]);

  const initials = schoolData.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  const filteredEnquiries = enquiryFilter === "All"
    ? enquiries
    : enquiries.filter((e) => e.status === enquiryFilter);

  const updateStatus = async (id: string, newStatus: EnquiryItem["status"]) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    await api.enquiries.updateStatus(id, newStatus as any);
    toast.success(`Updated enquiry status to "${newStatus}"`);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.schools.update(targetSchoolId, {
      name: schoolData.name,
      startingFees: Number(schoolData.fees),
      passRate: Number(schoolData.passRate),
      motto: schoolData.motto,
      phone: schoolData.phone,
    });
    setEditProfileOpen(false);
    toast.success("School profile updated in Neon/Cloudflare & saved locally!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-card rounded-3xl border border-border p-6 shadow-2xs">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-2xl overflow-hidden border-2 border-white shadow-md bg-[var(--brand-blue)] flex items-center justify-center shrink-0">
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#fff", fontSize: "1.5rem" }}>
              {initials}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 style={{ fontSize: "1.6rem" }} className="font-extrabold text-[var(--brand-blue)]">
                {schoolData.name}
              </h1>
              <span className="flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-[var(--brand-mustard)] text-[var(--brand-text)] font-bold">
                <Icon name="verified" size={13} fill /> Verified Admin
              </span>
            </div>
            <p className="text-muted-foreground text-xs mt-0.5">
              Official Headmaster & Bursar Portal • {user.email || "admin@princeedward.co.zw"} • {currentSchool.province} Province
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setEditProfileOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition hover:opacity-90"
            style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
          >
            <Icon name="edit" size={16} />
            Edit Profile & Fees
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon="visibility" label="Profile Views (Last 30d)" value="2,150" delta="+28%" />
        <Stat icon="mail" label="New Parent Enquiries" value="48" delta="+16%" accent />
        <Stat icon="star" label="Parent Rating" value="4.8 / 5.0" delta="+0.2" />
        <Stat icon="balance" label="Added to Comparison" value="380" delta="+34%" />
      </div>

      {/* Interactive Charts: Views Over Time & Traffic Sources */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-[var(--brand-blue)]">Profile Views & Search Impressions</h3>
              <p className="text-xs text-muted-foreground">Monthly analytics for current academic term</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              +44% vs previous term
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={VIEWS}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: "#64707C" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#64707C" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0" }}
              />
              <Line
                type="monotone"
                dataKey="v"
                stroke="var(--brand-blue)"
                strokeWidth={3}
                dot={{ r: 4, fill: "var(--brand-mustard)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources Pie */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[var(--brand-blue)] mb-1">Discovery Channels</h3>
            <p className="text-xs text-muted-foreground mb-4">How parents locate your listing</p>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={SOURCES} dataKey="value" innerRadius={48} outerRadius={76} paddingAngle={4}>
                  {SOURCES.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-border">
            {SOURCES.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
                <span className="font-bold text-foreground">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiries Pipeline Table & Latest Reviews */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-6 shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-base text-[var(--brand-blue)]">Parent Admission Enquiries</h3>
              <p className="text-xs text-muted-foreground">Manage prospective applicants</p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-secondary/20 p-1 rounded-xl text-xs">
              {["All", "New", "Contacted", "Interview"].map((f) => (
                <button
                  key={f}
                  onClick={() => setEnquiryFilter(f)}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    enquiryFilter === f ? "bg-white text-[var(--brand-blue)] font-bold shadow-2xs" : "text-muted-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-secondary/15 border-b border-border">
                <tr className="text-left text-muted-foreground">
                  <th className="p-3 font-bold">Parent Name</th>
                  <th className="p-3 font-bold">Interest</th>
                  <th className="p-3 font-bold">Date</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEnquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-secondary/10 transition">
                    <td className="p-3 font-bold text-foreground">{e.parent}</td>
                    <td className="p-3 text-muted-foreground">{e.interest}</td>
                    <td className="p-3 text-muted-foreground">{e.date}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          e.status === "New"
                            ? "bg-amber-100 text-amber-800"
                            : e.status === "Contacted"
                            ? "bg-blue-100 text-blue-800"
                            : e.status === "Interview"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {e.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => setSelectedEnquiry(e)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--brand-blue)] text-white text-[11px] font-semibold hover:opacity-90 shadow-2xs"
                      >
                        Respond
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Latest Verified Parent Reviews */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-[var(--brand-blue)]">Recent Parent Feedback</h3>
            <span className="text-xs text-muted-foreground">Verified</span>
          </div>

          <div className="space-y-3.5">
            {REVIEWS.slice(0, 3).map((r) => (
              <div key={r.id} className="p-3.5 rounded-xl border border-border bg-white">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-foreground">{r.author}</span>
                  <Rating value={r.rating} showValue={false} size={13} />
                </div>
                <div className="text-[11px] font-semibold text-[var(--brand-blue)] mt-1">{r.title}</div>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESPOND TO ENQUIRY MODAL */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setSelectedEnquiry(null)} />
          <div className="relative bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-8 max-w-md w-full z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-base text-[var(--brand-blue)]">Applicant Enquiry Details</h3>
                <p className="text-xs text-muted-foreground">{selectedEnquiry.parent}</p>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground">
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-secondary/15 space-y-1.5">
                <div><span className="text-muted-foreground">Email:</span> <a href={`mailto:${selectedEnquiry.email}`} className="font-semibold text-[var(--brand-blue)] hover:underline">{selectedEnquiry.email}</a></div>
                <div><span className="text-muted-foreground">Phone:</span> <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-[var(--brand-blue)] hover:underline">{selectedEnquiry.phone}</a></div>
                <div><span className="text-muted-foreground">Interest:</span> <span className="font-semibold">{selectedEnquiry.interest}</span></div>
              </div>

              <div>
                <label className="font-bold block mb-1">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Contacted", "Interview", "Enrolled"] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => updateStatus(selectedEnquiry.id, st)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition ${
                        selectedEnquiry.status === st
                          ? "bg-[var(--brand-blue)] text-white border-[var(--brand-blue)]"
                          : "border-border hover:bg-secondary/20"
                      }`}
                    >
                      Mark as {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <label className="font-bold block mb-1">Quick Direct Reply</label>
                <textarea
                  rows={3}
                  placeholder={`Hi ${selectedEnquiry.parent}, thank you for your interest in Prince Edward School...`}
                  className="w-full p-2.5 rounded-xl border border-border text-xs outline-none focus:border-[var(--brand-blue)] resize-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  toast.success(`Message sent to ${selectedEnquiry.email}!`);
                  setSelectedEnquiry(null);
                }}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs"
                style={{ background: "var(--brand-blue)" }}
              >
                Send Message & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {editProfileOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setEditProfileOpen(false)} />
          <div className="relative bg-white rounded-3xl border border-border shadow-2xl p-6 sm:p-8 max-w-lg w-full z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-border mb-4">
              <div>
                <h3 className="font-bold text-base text-[var(--brand-blue)]">Edit School Profile</h3>
                <p className="text-xs text-muted-foreground">Keep your school's info up-to-date</p>
              </div>
              <button onClick={() => setEditProfileOpen(false)} className="p-1 rounded-lg hover:bg-secondary/40 text-muted-foreground">
                <Icon name="close" size={20} />
              </button>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold block mb-1">School Name</label>
                <input
                  value={schoolData.name}
                  onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">Starting Term Fee (USD)</label>
                  <input
                    type="number"
                    value={schoolData.fees}
                    onChange={(e) => setSchoolData({ ...schoolData, fees: +e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">Pass Rate (%)</label>
                  <input
                    type="number"
                    value={schoolData.passRate}
                    onChange={(e) => setSchoolData({ ...schoolData, passRate: +e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-border"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">School Motto</label>
                <input
                  value={schoolData.motto}
                  onChange={(e) => setSchoolData({ ...schoolData, motto: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Admissions Contact Phone</label>
                <input
                  value={schoolData.phone}
                  onChange={(e) => setSchoolData({ ...schoolData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-border"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProfileOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border font-medium hover:bg-secondary/20"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl font-semibold text-white shadow-xs"
                  style={{ background: "var(--brand-blue)" }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
