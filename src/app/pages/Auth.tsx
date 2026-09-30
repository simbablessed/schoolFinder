import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { unsplash } from "../lib/data";
import { useAuth, TEMP_ACCOUNTS } from "../lib/auth";
import { useCompare } from "../lib/compare";
import { toast } from "sonner";

export function Auth({ mode }: { mode: "login" | "register" }) {
  const isReg = mode === "register";
  const [role, setRole] = useState<"parent" | "school">("parent");
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@princeedward.co.zw");
  const [password, setPassword] = useState("demo1234");
  const [activeTab, setActiveTab] = useState<"temp" | "custom">("temp");

  const { loginWithTempCredentials, loginWithCustom, isClerkEnabled } = useAuth();
  const { switchRole } = useCompare();
  const navigate = useNavigate();

  const handleSelectTempAccount = (tempEmail: string) => {
    setEmail(tempEmail);
    setPassword("demo1234");
    const account = TEMP_ACCOUNTS[tempEmail];
    if (account) {
      setName(account.name);
      setRole(account.role === "school" ? "school" : "parent");
    }
  };

  const handleOneClickLogin = (tempEmail: string) => {
    handleSelectTempAccount(tempEmail);
    const account = TEMP_ACCOUNTS[tempEmail];
    loginWithTempCredentials(tempEmail);
    if (account?.role === "school") {
      switchRole("school");
      navigate("/school-dashboard");
    } else {
      switchRole("parent");
      navigate("/dashboard");
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReg) {
      loginWithCustom(email, role, name, role === "school" ? "prince-edward" : undefined);
      switchRole(role);
      toast.success("Account created successfully!");
      navigate(role === "school" ? "/school-dashboard" : "/dashboard");
    } else {
      const success = loginWithTempCredentials(email);
      if (email.startsWith("admin@") || role === "school") {
        switchRole("school");
        navigate("/school-dashboard");
      } else {
        switchRole("parent");
        navigate("/dashboard");
      }
    }
  };

  return (
    <div className="grid lg:grid-cols-2 flex-1 min-h-[calc(100vh-4rem)]">
      {/* Form Container */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className="size-9 rounded-xl flex items-center justify-center text-white shadow-2xs"
              style={{ background: "var(--brand-blue)" }}
            >
              <Icon name="school" size={22} fill />
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--brand-blue)" }}>
              School Finder Zimbabwe
            </div>
          </div>

          <h1 style={{ fontSize: "1.75rem" }} className="font-extrabold text-[var(--brand-blue)]">
            {isReg ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground text-xs mt-1">
            {isReg
              ? "Join families and schools discovering Zimbabwe's premier education portal."
              : "Sign in with your temporary credentials or Clerk account."}
          </p>

          {/* Quick Temp Credentials Showcase */}
          <div className="my-6 p-4 rounded-3xl bg-secondary/15 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[var(--brand-blue)] flex items-center gap-1.5">
                <Icon name="bolt" size={16} className="text-[var(--brand-mustard)]" />
                Temp Credentials (1-Click Instant Testing)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Ready
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-normal mb-3">
              Click any role to test full dashboards with live Zimbabwean school accounts:
            </p>

            {/* School Admin Temp Credentials */}
            <div className="mb-3">
              <div className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Icon name="corporate_fare" size={14} className="text-[var(--brand-blue)]" />
                School Admin Logins:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleOneClickLogin("admin@princeedward.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-[var(--brand-blue)] hover:bg-blue-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-[var(--brand-blue)] group-hover:underline truncate">
                    🏫 Prince Edward
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">admin@princeedward.co.zw</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOneClickLogin("admin@arundel.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-[var(--brand-blue)] hover:bg-blue-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-[var(--brand-blue)] group-hover:underline truncate">
                    🏫 Arundel School
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">admin@arundel.co.zw</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOneClickLogin("admin@peterhouse.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-[var(--brand-blue)] hover:bg-blue-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-[var(--brand-blue)] group-hover:underline truncate">
                    🏫 Peterhouse Boys
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">admin@peterhouse.co.zw</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOneClickLogin("admin@stgeorges.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-[var(--brand-blue)] hover:bg-blue-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-[var(--brand-blue)] group-hover:underline truncate">
                    🏫 St. George's
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">admin@stgeorges.co.zw</div>
                </button>
              </div>
            </div>

            {/* Parent Temp Credentials */}
            <div>
              <div className="text-[11px] font-bold text-foreground mb-1.5 flex items-center gap-1">
                <Icon name="family_restroom" size={14} className="text-amber-600" />
                Parents Logins:
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleOneClickLogin("parent@demo.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-amber-400 hover:bg-amber-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-foreground group-hover:underline truncate">
                    👨‍👩‍👧 Tendai Moyo
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">parent@demo.co.zw</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOneClickLogin("chipo.ncube@zimfamily.co.zw")}
                  className="p-2 rounded-xl bg-white border border-border hover:border-amber-400 hover:bg-amber-50/60 text-left transition shadow-2xs group cursor-pointer"
                >
                  <div className="font-bold text-foreground group-hover:underline truncate">
                    👩‍👦 Chipo Ncube
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">chipo.ncube@zimfamily.co.zw</div>
                </button>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-border/80 text-center">
              <Link
                to="/search"
                className="text-xs text-[var(--brand-blue)] font-bold hover:underline inline-flex items-center gap-1"
              >
                <span>Continue as Guest Explorer (No login needed)</span>
                <Icon name="arrow_forward" size={13} />
              </Link>
            </div>
          </div>

          {/* Role selection if registering */}
          {isReg && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {(["parent", "school"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className="p-3 rounded-2xl border text-xs text-left transition cursor-pointer"
                  style={
                    role === r
                      ? { borderColor: "var(--brand-blue)", background: "rgba(16,54,125,0.06)", fontWeight: 700 }
                      : { borderColor: "var(--border)" }
                  }
                >
                  <Icon
                    name={r === "parent" ? "family_restroom" : "corporate_fare"}
                    style={{ color: "var(--brand-blue)" }}
                  />
                  <div className="mt-1 font-semibold">{r === "parent" ? "I'm a Parent" : "I'm a School"}</div>
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-3.5">
            {isReg && (
              <div>
                <label className="text-xs font-bold text-foreground">
                  {role === "school" ? "School Name" : "Full Name"}
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-input-background outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
                  placeholder={role === "school" ? "e.g. Prince Edward School" : "e.g. Tendai Moyo"}
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-foreground">Email Address</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-border bg-input-background outline-none focus:ring-2 focus:ring-[var(--brand-blue)] font-mono"
                placeholder="e.g. admin@princeedward.co.zw"
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">Password</label>
                {!isReg && (
                  <button
                    type="button"
                    onClick={() => toast.info("For temp accounts, any password or 'demo1234' works!")}
                    className="text-[11px] text-[var(--brand-blue)] hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative mt-1">
                <input
                  required
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 text-xs rounded-xl border border-border bg-input-background outline-none focus:ring-2 focus:ring-[var(--brand-blue)] font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <Icon name={show ? "visibility_off" : "visibility"} size={16} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold transition hover:opacity-90 shadow-2xs cursor-pointer mt-2"
              style={{ background: "var(--brand-blue)" }}
            >
              {isReg ? "Create Account & Sign In" : "Sign In with Credentials"}
            </button>
          </form>

          {/* Toggle between Login and Register */}
          <p className="text-center text-xs text-muted-foreground mt-5">
            {isReg ? "Already have an account? " : "Want to register a new school or parent? "}
            <Link
              to={isReg ? "/login" : "/register"}
              className="font-bold text-[var(--brand-blue)] hover:underline"
            >
              {isReg ? "Log in" : "Sign up"}
            </Link>
          </p>

          {/* Cloudflare, Neon & Clerk Stack Badge */}
          <div className="mt-8 pt-4 border-t border-border flex items-center justify-center gap-3 text-[10px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-emerald-500" />
              Neon Postgres
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-amber-500" />
              Cloudflare Edge
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="size-2 rounded-full bg-blue-500" />
              Clerk Auth Ready
            </span>
          </div>
        </div>
      </div>

      {/* Visual Side Banner */}
      <div className="hidden lg:block relative" style={{ background: "var(--brand-blue)" }}>
        <ImageWithFallback
          src={unsplash("photo-1523240795612-9a054b0db644", 900, 1200)}
          alt="Students"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0" style={{ background: "rgba(16,54,125,0.78)" }} />
        <div className="relative h-full flex flex-col justify-end p-12 text-white">
          <Icon name="format_quote" size={48} style={{ color: "var(--brand-mustard)" }} />
          <p
            className="text-2xl mt-2"
            style={{ fontFamily: "var(--font-display)", fontWeight: 700, lineHeight: 1.4 }}
          >
            Finding the right school for our children in Zimbabwe has never been this transparent, fast, and organized.
          </p>
          <div className="mt-4 text-white/80 font-medium">
            — Chipo Ncube, parent in Bulawayo & Harare
          </div>
        </div>
      </div>
    </div>
  );
}
