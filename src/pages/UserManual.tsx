import AppLayout from "@/components/AppLayout";
import { BookOpen, ArrowRight, Database, Users, Building2, Bus, FileCheck, Megaphone, CalendarCheck, Globe, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ModuleDoc {
  id: string;
  title: string;
  icon: React.ElementType;
  path: string;
  description: string;
  dataSource: string[];
  features: string[];
  dataFlow: { from: string; to: string; description: string }[];
  aiIntegration?: string;
}

const modules: ModuleDoc[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Globe,
    path: "/",
    description: "Central overview of the entire back-office system. Shows key metrics, recent agent requests, destination alerts, seasonal pricing summary, active campaigns, and partner summary.",
    dataSource: [
      "Agent Requests → sourced from HR Department (Travel Agent & Staff Management module)",
      "Destination Alerts → sourced from PAGASA / local disaster risk agencies",
      "Seasonal Pricing → sourced from Marketing & Promotions module",
      "Active Campaigns → sourced from Marketing & Promotions module",
      "Partner Summary → sourced from Vendor Portal (Partners tab)",
    ],
    features: [
      "View active agents, suppliers, vehicles, and visa application counts",
      "Monitor recent agent/staff requests and their approval status",
      "Track destination alerts and calamity warnings",
      "See seasonal pricing at a glance",
      "Overview of active marketing campaigns",
      "Partner investment summary",
    ],
    dataFlow: [
      { from: "HR Department", to: "Dashboard", description: "Agent request submissions and approval statuses" },
      { from: "Vendor Portal", to: "Dashboard", description: "Supplier count and partner investment totals" },
      { from: "Marketing Module", to: "Dashboard", description: "Campaign status and seasonal pricing data" },
      { from: "PAGASA / NDRRMC", to: "Dashboard", description: "Weather alerts and calamity warnings for destinations" },
    ],
  },
  {
    id: "agents",
    title: "Travel Agents & Staff Management",
    icon: Users,
    path: "/agents",
    description: "Manage travel agents, tour guides, and staff. Track performance metrics including star ratings, years of experience, and tours completed. Request new agents/staff through HR.",
    dataSource: [
      "Agent Profiles → sourced from HR Department onboarding records",
      "Star Ratings → sourced from customer feedback / post-tour surveys",
      "Experience Data → sourced from HR employment records",
      "Tours Completed → sourced from Tour Resources module (completed tour assignments)",
      "Agent Requests → submitted to HR Department for approval",
    ],
    features: [
      "View all agents/staff with profile cards (name, role, rating, experience, tours, specialization)",
      "Search agents by name or role",
      "Request new agent/staff → sends request to HR Department",
      "AI-powered agent recommendation based on tour requirements",
      "Filter by status: Active, Pending, On Leave",
    ],
    dataFlow: [
      { from: "HR Department", to: "Agent Profiles", description: "Employee records, onboarding data, employment history" },
      { from: "Customer Surveys", to: "Star Ratings", description: "Post-tour feedback ratings from customers" },
      { from: "Tour Resources", to: "Tours Completed", description: "Completed tour assignments tracked per agent" },
      { from: "Agent Request Form", to: "HR Department", description: "New staff/agent request with name, role, specialization, and reason" },
    ],
    aiIntegration: "Gemini AI recommends the best agent for a tour based on ratings, experience, specialization, and availability. Example: 'Beach tour in Boracay for 30 people' → AI suggests the agent with highest rating and relevant specialization.",
  },
  {
    id: "suppliers",
    title: "Vendor Portal (Suppliers & Partners)",
    icon: Building2,
    path: "/suppliers",
    description: "Centralized vendor portal managing all third-party suppliers (hotels, vehicle providers) and business partners (investors). Includes contract management, availability tracking, and legitimacy verification.",
    dataSource: [
      "Supplier Data → sourced from vendor applications with DTI/SEC registration proof",
      "Hotel Availability → sourced from hotel partner systems (rooms available vs. total)",
      "Vehicle Availability → linked to Vehicle Availability module",
      "Partner Contracts → sourced from legal/partnership agreements",
      "Partner Investment → sourced from finance department records",
    ],
    features: [
      "Add new suppliers with DTI/SEC registration upload for legitimacy",
      "Track hotel room and vehicle availability with slot limits",
      "Add business partners with contract details and investment amounts",
      "View and manage partner contracts",
      "AI-powered supplier recommendation based on tour needs",
      "Categorized view: Hotels vs. Vehicles vs. Partners",
    ],
    dataFlow: [
      { from: "Vendor Application", to: "Supplier Database", description: "New supplier submits DTI/SEC registration, contact info, and service details" },
      { from: "Hotel Systems", to: "Room Availability", description: "Real-time room count synced from partner hotels" },
      { from: "Legal Department", to: "Partner Contracts", description: "Contract letters, share percentages, and terms" },
      { from: "Finance Department", to: "Investment Records", description: "Partner investment amounts and profit share tracking" },
    ],
    aiIntegration: "Gemini AI recommends the best supplier (hotel/vehicle) for a tour based on availability, location, capacity, and pricing. Example: 'Need hotel for 20 guests in Palawan for 3 nights' → AI suggests the best available hotel.",
  },
  {
    id: "vehicles",
    title: "Vehicle Availability Tracking",
    icon: Bus,
    path: "/vehicles",
    description: "Real-time tracking of all vehicles (buses, vans, coasters) with seat capacity limits. Prevents overbooking by showing exact booked vs. available slots.",
    dataSource: [
      "Vehicle Fleet → sourced from Vendor Portal (Vehicle suppliers)",
      "Booking Data → sourced from Tour Resources module (tour assignments)",
      "Maintenance Status → sourced from vehicle supplier maintenance reports",
    ],
    features: [
      "View all vehicles with capacity bars (booked/total seats)",
      "Status indicators: Available, Full, Under Maintenance",
      "Slot limit enforcement — system stops bookings when capacity is reached",
      "Summary cards: Available, Fully Booked, Under Maintenance counts",
    ],
    dataFlow: [
      { from: "Vendor Portal", to: "Vehicle List", description: "Registered vehicle suppliers and their fleet" },
      { from: "Tour Bookings", to: "Seat Count", description: "Each tour booking updates the booked seat count" },
      { from: "Supplier Reports", to: "Maintenance Status", description: "Vehicle suppliers report maintenance schedules" },
    ],
  },
  {
    id: "visa",
    title: "Visa Assistance Module",
    icon: FileCheck,
    path: "/visa",
    description: "Tracks customer visa applications and verifies legal documents before departure. Checks passport validity, required documents (bank statements, employment certificates, flight itineraries), and flags issues.",
    dataSource: [
      "Customer Data → sourced from booking/reservation system (customer profiles)",
      "Document Uploads → sourced from customer submissions (scanned documents)",
      "Passport Validity → sourced from customer's passport copy (expiry date check)",
      "Visa Requirements → sourced from embassy/consulate requirements per destination",
    ],
    features: [
      "Document verification checklist: Verified, Pending, Missing status per document",
      "Passport expiry warning — alerts if passport expires within 6 months of travel",
      "Upload documents for each application",
      "Review application status: Approved, Under Review, Incomplete, Rejected",
      "Legitimacy check before customer departure clearance",
    ],
    dataFlow: [
      { from: "Customer Booking", to: "Visa Application", description: "Customer's travel details trigger visa requirement check" },
      { from: "Customer Upload", to: "Document Verification", description: "Customer uploads passport, bank statement, etc. for staff review" },
      { from: "Embassy Requirements", to: "Checklist", description: "Required documents list based on destination country" },
      { from: "Staff Review", to: "Application Status", description: "Staff verifies each document and updates status" },
    ],
  },
  {
    id: "marketing",
    title: "Marketing & Promotions Management",
    icon: Megaphone,
    path: "/marketing",
    description: "Manages seasonal pricing strategies, destination tracking (calamity alerts), and marketing campaigns. Ensures pricing reflects demand and alerts cancel affected tours.",
    dataSource: [
      "Seasonal Data → sourced from historical booking trends and tourism calendar",
      "Weather/Calamity Alerts → sourced from PAGASA, NDRRMC, local government units",
      "Campaign Data → created by marketing team based on seasonal strategies",
      "Pricing Strategy → based on demand analysis (high season = premium, off-season = discounted)",
    ],
    features: [
      "Seasonal pricing matrix: Season × Location × Price Level with reasoning",
      "Destination tracking with calamity alerts — auto-cancels affected tours",
      "Campaign management: Create, schedule, and track promotional campaigns",
      "Discount code management for seasonal promos",
      "Marketing basis documentation — every strategy has a documented reason",
    ],
    dataFlow: [
      { from: "Tourism Calendar", to: "Seasonal Pricing", description: "Peak/off-peak seasons determine pricing strategy" },
      { from: "PAGASA / NDRRMC", to: "Destination Alerts", description: "Typhoon signals, heavy rainfall advisories, volcanic alerts" },
      { from: "Alert System", to: "Tour Cancellation", description: "High-severity alerts auto-cancel tours in affected locations" },
      { from: "Marketing Team", to: "Campaigns", description: "Create seasonal promos with discounts and target dates" },
    ],
  },
  {
    id: "tour-resources",
    title: "Tour Availability & Resource Planning",
    icon: CalendarCheck,
    path: "/tour-resources",
    description: "Monitors tour capacity and resource allocation. Ensures no overbooking by tracking slots, assigned vehicles, and guides per tour.",
    dataSource: [
      "Tour Schedule → sourced from operations team planning",
      "Vehicle Assignment → sourced from Vehicle Availability module",
      "Guide Assignment → sourced from Agent & Staff Management module",
      "Booking Count → sourced from customer bookings/reservations",
    ],
    features: [
      "View all tours with capacity progress bars",
      "Status tracking: Open, Almost Full, Full, Cancelled",
      "Vehicle and guide assignment per tour",
      "Overbooking prevention — stops bookings at max capacity",
      "Summary: Total, Open, Almost Full, Full/Cancelled counts",
    ],
    dataFlow: [
      { from: "Operations Team", to: "Tour Schedule", description: "Creates tour itineraries with dates, destinations, and slot limits" },
      { from: "Vehicle Module", to: "Vehicle Assignment", description: "Available vehicles assigned to tours based on capacity match" },
      { from: "Agent Module", to: "Guide Assignment", description: "Available guides/agents assigned based on specialization" },
      { from: "Customer Bookings", to: "Slot Count", description: "Each booking increments the booked count until max is reached" },
    ],
  },
];

const UserManual = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>("dashboard");

  const toggleModule = (id: string) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Manual</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete guide to TravelOps Core 2 — module descriptions, data flow, and system navigation
          </p>
        </div>

        {/* System Overview */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">TravelOps Core 2: Back-Office & Agency Management</h2>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI • Travel and Tours Management System</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This system is the back-office management platform for a Philippine travel agency. It covers agent/staff management, 
            vendor portal (suppliers & partners), vehicle tracking, visa assistance, marketing & promotions, and tour resource planning. 
            AI-powered recommendations help select the best agents and suppliers for each tour.
          </p>
          <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-medium">📌 Important: All data in this system has a documented source. No data is entered without basis — 
            agent requests come from HR, suppliers must provide DTI/SEC registration, visa documents are verified for legitimacy, 
            and marketing strategies are based on seasonal demand analysis.</p>
          </div>
        </div>

        {/* System Navigation Map */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">System Navigation Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <a
                  key={mod.id}
                  href={mod.path}
                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                >
                  <Icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="text-xs font-medium text-foreground">{mod.title}</p>
                    <p className="text-[10px] text-muted-foreground">{mod.path}</p>
                  </div>
                  <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Data Flow Overview */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Data Flow Overview</h2>
          <div className="space-y-2">
            {[
              { from: "HR Department", to: "Agent & Staff Management", desc: "Employee onboarding, agent profiles, request approvals" },
              { from: "Vendor Applications (DTI/SEC)", to: "Vendor Portal → Suppliers", desc: "Supplier registration with legitimacy proof" },
              { from: "Legal / Finance", to: "Vendor Portal → Partners", desc: "Partnership contracts, investment records, share percentages" },
              { from: "Vehicle Suppliers", to: "Vehicle Availability", desc: "Fleet data, seat capacity, maintenance schedules" },
              { from: "Customer Submissions", to: "Visa Assistance", desc: "Passport copies, bank statements, supporting documents" },
              { from: "PAGASA / NDRRMC", to: "Marketing → Destination Tracking", desc: "Weather alerts, calamity warnings for tour destinations" },
              { from: "Tourism Calendar / Demand Data", to: "Marketing → Seasonal Pricing", desc: "Peak/off-peak seasons drive pricing strategies" },
              { from: "Operations Team", to: "Tour Resources", desc: "Tour scheduling, vehicle and guide assignments" },
              { from: "Gemini AI Engine", to: "Agent & Supplier Recommendations", desc: "AI analyzes ratings, experience, availability to recommend best match" },
            ].map((flow, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-secondary/30">
                <span className="text-xs font-medium text-primary min-w-[160px]">{flow.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium text-accent min-w-[180px]">{flow.to}</span>
                <span className="text-xs text-muted-foreground">— {flow.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Module Details */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Module Details</h2>
          {modules.map((mod) => {
            const Icon = mod.icon;
            const isExpanded = expandedModule === mod.id;

            return (
              <div key={mod.id} className="glass-card overflow-hidden animate-fade-in">
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{mod.title}</h3>
                      <p className="text-xs text-muted-foreground">{mod.path}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4 animate-fade-in">
                    {/* Description */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                      <p className="text-sm text-foreground leading-relaxed">{mod.description}</p>
                    </div>

                    {/* AI Integration */}
                    {mod.aiIntegration && (
                      <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                          <p className="text-xs font-medium text-primary">Gemini AI Integration</p>
                        </div>
                        <p className="text-xs text-foreground">{mod.aiIntegration}</p>
                      </div>
                    )}

                    {/* Data Sources */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        <Database className="w-3 h-3 inline mr-1" />
                        Data Sources & Basis
                      </p>
                      <div className="space-y-1">
                        {mod.dataSource.map((src, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 rounded-md bg-secondary/30">
                            <span className="text-primary text-xs mt-0.5">•</span>
                            <p className="text-xs text-foreground">{src}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Features & Capabilities</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {mod.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-2 p-2">
                            <span className="text-success text-xs mt-0.5">✓</span>
                            <p className="text-xs text-foreground">{feat}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Data Flow */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Data Flow Diagram</p>
                      <div className="space-y-2">
                        {mod.dataFlow.map((flow, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/50">
                            <span className="text-xs font-medium text-primary min-w-[120px]">{flow.from}</span>
                            <ArrowRight className="w-3 h-3 text-accent flex-shrink-0" />
                            <span className="text-xs font-medium text-accent min-w-[120px]">{flow.to}</span>
                            <span className="text-xs text-muted-foreground hidden md:inline">— {flow.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Reports Section */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">Reports Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { title: "Agent Performance Report", desc: "Ratings, tours completed, and experience per agent", source: "Agent & Staff Management" },
              { title: "Supplier Availability Report", desc: "Room/vehicle availability across all suppliers", source: "Vendor Portal" },
              { title: "Vehicle Utilization Report", desc: "Booked vs. available seats across all vehicles", source: "Vehicle Availability" },
              { title: "Visa Application Status Report", desc: "Document verification status per application", source: "Visa Assistance" },
              { title: "Marketing Campaign Report", desc: "Campaign performance, discount usage, seasonal impact", source: "Marketing & Promotions" },
              { title: "Tour Capacity Report", desc: "Booking status, overbooking prevention logs", source: "Tour Resources" },
            ].map((report, i) => (
              <div key={i} className="p-3 rounded-md bg-secondary/30">
                <p className="text-xs font-medium text-foreground">{report.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{report.desc}</p>
                <p className="text-[10px] text-primary mt-1">Source: {report.source}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default UserManual;
