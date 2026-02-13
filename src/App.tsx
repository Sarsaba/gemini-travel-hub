import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AgentStaffManagement from "./pages/AgentStaffManagement";
import SupplierPartnerManagement from "./pages/SupplierPartnerManagement";
import VehicleAvailability from "./pages/VehicleAvailability";
import VisaAssistance from "./pages/VisaAssistance";
import MarketingPromotion from "./pages/MarketingPromotion";
import TourResources from "./pages/TourResources";
import UserManual from "./pages/UserManual";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/agents" element={<AgentStaffManagement />} />
          <Route path="/suppliers" element={<SupplierPartnerManagement />} />
          <Route path="/vehicles" element={<VehicleAvailability />} />
          <Route path="/visa" element={<VisaAssistance />} />
          <Route path="/marketing" element={<MarketingPromotion />} />
          <Route path="/tour-resources" element={<TourResources />} />
          <Route path="/user-manual" element={<UserManual />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
