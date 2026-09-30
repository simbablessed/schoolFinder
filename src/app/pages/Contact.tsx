import { useState } from "react";
import { Icon } from "../components/Icon";
import { toast } from "sonner";

const INFO = [
  { icon: "call", label: "Helpline", value: "+263 242 700 900", href: "tel:+263242700900" },
  { icon: "chat", label: "WhatsApp Support", value: "+263 77 100 2000", href: "https://wa.me/263771002000" },
  { icon: "mail", label: "Official Email", value: "hello@schoolfinder.co.zw", href: "mailto:hello@schoolfinder.co.zw" },
  { icon: "location_on", label: "Harare Headquarters", value: "12 Sam Nujoma St, Harare, Zimbabwe", href: null },
];

const FAQS = [
  { q: "How do schools get verified on the platform?", a: "Our team verifies schools against Ministry of Primary and Secondary Education registration documents and contacts the administration directly to authenticate fees, facilities, and contact persons." },
  { q: "Is listing free for Zimbabwean schools?", a: "Yes, basic profile listings for all government, mission, and independent schools in Zimbabwe are 100% free of charge to promote national educational transparency." },
  { q: "How often are fee schedules updated?", a: "Schools update their fees each term. Parents and school bursars can also submit fee amendments directly for prompt verification." },
  { q: "Can parents write reviews for any school?", a: "Yes, genuine parents, guardians, and alumni can submit reviews. All reviews undergo moderation to ensure community guidelines and authenticity standards." },
];

export function Contact() {
  const [form, setForm] = useState({ name: "", email: "", category: "General Support", subject: "", message: "" });
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message received! A team member will respond within 24 hours.");
    setForm({ name: "", email: "", category: "General Support", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-sky)]/30 text-[var(--brand-blue)] text-xs font-bold mb-3">
          <Icon name="support_agent" size={16} /> We're Here to Assist
        </div>
        <h1 style={{ fontSize: "clamp(2rem,4vw,2.75rem)" }} className="font-extrabold text-[var(--brand-blue)] leading-tight">
          Connect with School Finder Zimbabwe
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto text-xs sm:text-sm">
          Have an inquiry, feedback on a school listing, or want to partner with us? Reach our Harare team today.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.3fr] gap-8 mb-16">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-3.5">
            {INFO.map((i) => (
              <div key={i.label} className="bg-card rounded-2xl border border-border p-4.5 shadow-2xs">
                <div
                  className="size-9 rounded-xl flex items-center justify-center mb-2.5 text-[var(--brand-blue)]"
                  style={{ background: "rgba(165,206,234,0.35)" }}
                >
                  <Icon name={i.icon} size={20} />
                </div>
                <div className="text-[11px] text-muted-foreground font-medium">{i.label}</div>
                {i.href ? (
                  <a href={i.href} target="_blank" rel="noreferrer" className="text-xs font-bold text-[var(--brand-blue)] hover:underline block mt-0.5">
                    {i.value}
                  </a>
                ) : (
                  <div className="text-xs font-bold text-foreground mt-0.5">{i.value}</div>
                )}
              </div>
            ))}
          </div>

          {/* Quick WhatsApp CTA Card */}
          <div
            className="rounded-2xl p-6 text-white shadow-xs relative overflow-hidden flex flex-col justify-between"
            style={{ background: "var(--brand-blue)" }}
          >
            <div>
              <div className="flex items-center gap-2 font-bold text-base">
                <Icon name="chat" size={22} className="text-[var(--brand-mustard)]" />
                Need Rapid Assistance?
              </div>
              <p className="text-xs text-white/80 mt-2 leading-relaxed">
                Connect directly with our admissions helpdesk via WhatsApp for immediate guidance on school deadlines, placement, and verified fees.
              </p>
            </div>
            <a
              href="https://wa.me/263771002000"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition hover:opacity-95 shadow-sm"
              style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
            >
              <Icon name="chat" size={16} />
              Open WhatsApp Chat
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-6 sm:p-8 shadow-2xs space-y-4">
          <h3 className="font-bold text-base text-[var(--brand-blue)]">Send Us a Direct Message</h3>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Full Name *</label>
              <input
                required
                value={form.name}
                onChange={set("name")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background outline-none focus:border-[var(--brand-blue)] text-xs font-medium"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Email Address *</label>
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background outline-none focus:border-[var(--brand-blue)] text-xs font-medium"
                placeholder="you@email.com"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Inquiry Department</label>
              <select
                value={form.category}
                onChange={set("category")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background outline-none focus:border-[var(--brand-blue)] text-xs font-medium"
              >
                <option>General Support</option>
                <option>School Verification & Claim</option>
                <option>Report Fee Update</option>
                <option>Partnership & Advertising</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-foreground block mb-1">Subject *</label>
              <input
                required
                value={form.subject}
                onChange={set("subject")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background outline-none focus:border-[var(--brand-blue)] text-xs font-medium"
                placeholder="How can we assist?"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground block mb-1">Your Message *</label>
            <textarea
              required
              value={form.message}
              onChange={set("message")}
              rows={5}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-input-background outline-none focus:border-[var(--brand-blue)] text-xs font-medium resize-none"
              placeholder="Write your question, school feedback, or partnership proposal..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold transition hover:opacity-95 shadow-xs"
            style={{ background: "var(--brand-mustard)", color: "var(--brand-text)" }}
          >
            Submit Message
          </button>
        </form>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-[var(--brand-blue)]">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground mt-1">Quick answers to common questions about our platform.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-card rounded-2xl border border-border overflow-hidden transition shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
              >
                <span className="font-bold text-xs sm:text-sm text-foreground">{faq.q}</span>
                <Icon
                  name={openFaq === idx ? "expand_less" : "expand_more"}
                  size={20}
                  className="text-muted-foreground shrink-0"
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
