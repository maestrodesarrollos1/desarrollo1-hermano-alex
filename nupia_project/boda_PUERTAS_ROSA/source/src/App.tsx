import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import LanguageRedirect from "@/components/LanguageRedirect";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Moderation from "./pages/Moderation";
import NotFound from "./pages/NotFound";
import WeddingGame from "./pages/WeddingGame";
import { templateValues } from "@/config/template-values";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="w-full overflow-x-hidden">
          <BrowserRouter>
            <ScrollToTop />
            <LanguageRedirect />
            <Routes>
              <Route path="/" element={<Navigate to="/es" replace />} />
              <Route path="/es" element={<Index />} />
              <Route path="/es/juego" element={<WeddingGame />} />
              <Route path="/es/moderación" element={<Moderation />} />
              <Route path="/es/moderacion" element={<Moderation />} />
              <Route path="/val" element={<Index />} />
              <Route path="/eng" element={<Index />} />
              <Route path="/ru" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {templateValues.sections.cookies ? <CookieConsent /> : null}
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
