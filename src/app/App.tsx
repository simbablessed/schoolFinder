import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from "./components/ui/sonner";
import { CompareProvider } from "./lib/compare";
import { AuthProvider } from "./lib/auth";
import { Layout } from "./components/Layout";
import { Icon } from "./components/Icon";

// Eagerly load Landing for instant first paint
import { Landing } from "./pages/Landing";

// Code-split heavy routes for optimal performance and fast navigation
const Search = lazy(() => import("./pages/Search").then((m) => ({ default: m.Search })));
const SchoolDetails = lazy(() => import("./pages/SchoolDetails").then((m) => ({ default: m.SchoolDetails })));
const Compare = lazy(() => import("./pages/Compare").then((m) => ({ default: m.Compare })));
const SchoolSubmission = lazy(() => import("./pages/SchoolSubmission").then((m) => ({ default: m.SchoolSubmission })));
const SchoolDashboard = lazy(() => import("./pages/SchoolDashboard").then((m) => ({ default: m.SchoolDashboard })));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard").then((m) => ({ default: m.ParentDashboard })));
const Resources = lazy(() => import("./pages/Resources").then((m) => ({ default: m.Resources })));
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const Auth = lazy(() => import("./pages/Auth").then((m) => ({ default: m.Auth })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

function PageLoader() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] p-8 text-center animate-in fade-in duration-200">
      <div className="size-12 rounded-2xl flex items-center justify-center text-white shadow-md animate-pulse" style={{ background: "var(--brand-blue)" }}>
        <Icon name="school" size={26} fill />
      </div>
      <div className="mt-4 flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-[var(--brand-mustard)] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="size-2 rounded-full bg-[var(--brand-mustard)] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="size-2 rounded-full bg-[var(--brand-mustard)] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
      <p className="text-xs text-muted-foreground mt-2 font-medium">Loading School Finder Zimbabwe...</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CompareProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/search" element={<Search />} />
                <Route path="/school/:id" element={<SchoolDetails />} />
                <Route path="/compare" element={<Compare />} />
                <Route path="/list-your-school" element={<SchoolSubmission />} />
                <Route path="/school-dashboard" element={<SchoolDashboard />} />
                <Route path="/dashboard" element={<ParentDashboard />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Auth mode="login" />} />
                <Route path="/register" element={<Auth mode="register" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </CompareProvider>
    </AuthProvider>
  );
}
