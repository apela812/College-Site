import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Layout
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Applicants from "@/pages/Applicants";
import Students from "@/pages/Students";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Schedule from "@/pages/Schedule";
import Announcements from "@/pages/Announcements";
import Contacts from "@/pages/Contacts";
import Auth from "@/pages/Auth";
import AdminPanel from "@/pages/AdminPanel";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/auth" component={Auth} />
          <Route path="/admin" component={() => <ProtectedRoute component={AdminPanel} requiredRoles={['admin', 'dean']} />} />
          <Route path="/about" component={About} />
          <Route path="/applicants" component={Applicants} />
          <Route path="/students" component={Students} />
          <Route path="/news" component={News} />
          <Route path="/news/:id" component={NewsDetail} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/announcements" component={Announcements} />
          <Route path="/contacts" component={Contacts} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="almetmed-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <LanguageSelector />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
