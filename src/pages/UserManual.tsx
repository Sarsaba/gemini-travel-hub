import AppLayout from "@/components/AppLayout";
import { BookOpen, ArrowRight, Database, Users, Building2, Bus, FileCheck, Megaphone, CalendarCheck, Globe, Sparkles, ChevronDown, ChevronUp, Server, Link2, ShieldCheck } from "lucide-react";
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
  integratedWith: string[];
  doesNotHandle: string[];
}

const modules: ModuleDoc[] = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: Globe,
    path: "/",
    description: "Central overview of the entire back-office system. Shows key metrics, top performing agents, active campaigns, destination alerts, seasonal pricing, partner summary, and system integration status.",
    dataSource: [
      "Agent Data → HR4 System (performance tracking, employee records)",
      "Supplier/Partner Data → Vendor Portal (DTI/SEC verified suppliers)",
      "Campaign Data → Marketing Module (seasonal demand strategy)",
      "Destination Alerts → PAGASA / NDRRMC / Local Government Units",
      "Investment Data → Financial System (partner investment tracking)",
      "Tour Data → Core 1 (booking counts, tour status)",
    ],
    features: [
      "AI-powered supplier/agent recommendation on dashboard",
      "Top performing agents with ratings from customer surveys",
      "Active campaigns overview with discount codes",
      "Destination alert banner for active travel advisories",
      "System Integration Map showing Core 1, HR4, Financial, Administrative connections",
      "Process Boundaries card showing what Core 2 does NOT handle",
    ],
    dataFlow: [
      { from: "HR4 System", to: "Dashboard — Agent Stats", description: "Agent count, performance data, pending requests" },
      { from: "Vendor Portal", to: "Dashboard — Supplier Stats", description: "Supplier count, partner investment totals" },
      { from: "Marketing Module", to: "Dashboard — Campaigns", description: "Active campaign status, seasonal pricing" },
      { from: "PAGASA / NDRRMC", to: "Dashboard — Alerts", description: "Weather alerts, calamity warnings" },
      { from: "Core 1", to: "Dashboard — Tour Data", description: "Tour completion counts, booking statistics" },
      { from: "Financial System", to: "Dashboard — Investments", description: "Partner investment totals, revenue sharing" },
    ],
    integratedWith: ["Core 1 — Tour booking data", "HR4 — Agent/staff records", "Financial — Investment tracking", "Administrative — Compliance status"],
    doesNotHandle: ["Tour creation (Core 1)", "Revenue tracking (Financial)", "Employee hiring process (HR4)", "Company policies (Administrative)"],
  },
  {
    id: "agents",
    title: "Travel Agent & Staff Management",
    icon: Users,
    path: "/agents",
    description: "Manage travel agents, tour guides, and staff with tabs for active agents and recruitment requests. Track performance including star ratings, experience, tours completed. Submit requests to HR4 or directly add agents.",
    dataSource: [
      "Agent Profiles → HR4 System (onboarding records, employment history)",
      "Star Ratings → Customer Surveys (post-tour feedback — linked to Core 1)",
      "Experience Data → HR4 System (employment records, years of service)",
      "Tours Completed → Core 1 (completed tour assignments per agent)",
      "Contact Info → HR4 System (email, phone from employee records)",
    ],
    features: [
      "Tabs: Agents & Staff / Requests — organized workflow",
      "Agent cards with name, role, rating, experience, tours, email, phone",
      "Submit Request to HR4 — with cover letter, resume upload, profile photo, portfolio URL",
      "Add Agent directly — for existing employees with HR4 sync",
      "Role filter: Travel Agent, Tour Guide, Staff",
      "AI-powered agent recommendation for tour assignments",
      "View detailed agent profile with all HR4 data sources",
      "Approve/Reject requests (HR4 approval simulation)",
    ],
    dataFlow: [
      { from: "HR4 System", to: "Agent Profiles", description: "Employee records, onboarding data, contact information" },
      { from: "Customer Surveys (via Core 1)", to: "Star Ratings", description: "Post-tour customer feedback ratings" },
      { from: "Core 1 — Tour Records", to: "Tours Completed", description: "Completed tour count tracked per agent" },
      { from: "Request Form", to: "HR4 System", description: "Staff request with cover letter, resume, and portfolio submitted for HR4 approval" },
      { from: "HR4 Approval", to: "Administrative", description: "Approved requests go through administrative compliance check" },
    ],
    aiIntegration: "Gemini AI recommends the best agent for a tour based on ratings, experience, specialization, and availability.",
    integratedWith: ["HR4 — Employee records, request approval", "Core 1 — Tour completion data", "Administrative — Compliance verification"],
    doesNotHandle: ["Salary/commission calculation (Financial)", "Employment contracts (HR4)", "Tour assignment (Core 1)"],
  },
  {
    id: "suppliers",
    title: "Supplier & Partner Management (Vendor Portal)",
    icon: Building2,
    path: "/suppliers",
    description: "Centralized vendor portal with three tabs: Suppliers (hotels & vehicles with DTI/SEC verification), Hotel Availability (room types with pricing and occupancy), and Partners (investors/affiliates with contract management).",
    dataSource: [
      "Supplier Data → Vendor Applications (DTI/SEC registration proof required)",
      "Hotel Room Data → Hotel Partner Systems (room types, pricing, occupancy)",
      "Vehicle Data → Vehicle suppliers (fleet data, seat capacity)",
      "Partner Data → Legal Department (contract letters, terms)",
      "Investment Data → Financial System (investment amounts, profit sharing)",
    ],
    features: [
      "Supplier table view with contact person, email, phone, rating, contract end date",
      "DTI/SEC registration requirement for legitimacy verification",
      "Hotel Availability tab with room types (Standard, Deluxe, Suite, Family), pricing per night, occupancy bars",
      "Add Hotel Room form linked to supplier",
      "Partner Management with company name, partnership type (Investor/Affiliate), email, phone",
      "Partner summary cards: total partners, active, total investment",
      "View Contract dialog with full partnership details",
      "Contract document upload for partners",
      "AI-powered supplier recommendation",
    ],
    dataFlow: [
      { from: "Vendor Application", to: "Supplier Database", description: "DTI/SEC registration, contact info, service details — verified before activation" },
      { from: "Hotel Systems", to: "Room Availability", description: "Room count, pricing, and occupancy synced from partner hotels" },
      { from: "Legal Department", to: "Partner Contracts", description: "Contract letters, share percentages, terms, and conditions" },
      { from: "Financial System", to: "Investment Records", description: "Partner investment amounts and profit share tracking" },
      { from: "Supplier Data", to: "Core 1", description: "Available suppliers/rooms shared with Core 1 for tour packaging" },
    ],
    aiIntegration: "Gemini AI recommends the best supplier for a tour based on availability, location, capacity, and pricing.",
    integratedWith: ["Financial — Investment & profit share tracking", "Legal — Contract verification", "Core 1 — Supplier availability for tour packaging", "Administrative — DTI/SEC compliance"],
    doesNotHandle: ["Payment processing (Financial)", "Tour package creation (Core 1)", "Legal contract drafting (Administrative)"],
  },
  {
    id: "vehicles",
    title: "Vehicle Availability Tracking",
    icon: Bus,
    path: "/vehicles",
    description: "Real-time tracking of all vehicles with seat capacity limits and overbooking prevention. Add vehicles linked to suppliers with plate numbers, pricing, and location.",
    dataSource: [
      "Vehicle Fleet → Vendor Portal (vehicle suppliers and their fleet)",
      "Booking Data → Core 1 (tour booking seat assignments)",
      "Maintenance Status → Vehicle supplier maintenance reports",
      "Pricing → Supplier agreements (daily rates)",
    ],
    features: [
      "Vehicle cards with name, type, plate number, supplier, seat occupancy bar, price/day",
      "Add Vehicle form with supplier selection, vehicle type, plate number, capacity, price, location",
      "Status indicators: Available, Full, Under Maintenance",
      "Overbooking warning for vehicles with limited slots",
      "Search and filter by status",
      "View vehicle details dialog",
    ],
    dataFlow: [
      { from: "Vendor Portal", to: "Vehicle List", description: "Registered vehicle suppliers and their fleet data" },
      { from: "Core 1 — Tour Bookings", to: "Seat Count", description: "Each booking updates booked seat count" },
      { from: "Supplier Reports", to: "Maintenance Status", description: "Maintenance schedules from vehicle suppliers" },
    ],
    integratedWith: ["Vendor Portal — Supplier fleet data", "Core 1 — Booking seat assignments"],
    doesNotHandle: ["Vehicle procurement (Administrative)", "Payment to suppliers (Financial)"],
  },
  {
    id: "visa",
    title: "Visa Assistance Module",
    icon: FileCheck,
    path: "/visa",
    description: "Tracks customer visa applications with document verification, passport validity checks, and departure clearance. Create new applications with passport details, travel dates, and supporting document uploads.",
    dataSource: [
      "Customer Data → Core 1 (booking/reservation system, customer profiles)",
      "Document Uploads → Customer submissions (scanned documents, photos)",
      "Passport Validity → Customer passport copy (expiry date verification)",
      "Visa Requirements → Embassy/consulate requirements per destination",
    ],
    features: [
      "New Visa Application form with customer name, destination, passport number, passport expiry, travel/return dates",
      "Supporting document file uploads (passport photo, bank statement)",
      "Document verification checklist: Verified, Pending, Missing per document",
      "Passport expiry warning — alerts if < 6 months from travel date",
      "Clear for Departure button — only enabled when all documents verified",
      "Summary cards: total, pending review, verified, cleared for departure",
      "Search by name, passport number, or destination",
      "Legitimacy check criteria displayed in review dialog",
      "Verification notes per application",
    ],
    dataFlow: [
      { from: "Core 1 — Customer Booking", to: "Visa Application", description: "Customer travel details trigger visa requirement check" },
      { from: "Customer Upload", to: "Document Verification", description: "Passport, bank statement, etc. uploaded for staff review" },
      { from: "Embassy Requirements", to: "Document Checklist", description: "Required documents list based on destination country" },
      { from: "Staff Review", to: "Application Status", description: "Staff verifies each document and updates status" },
      { from: "Clearance", to: "Core 1", description: "Departure clearance status sent back to booking system" },
    ],
    integratedWith: ["Core 1 — Customer booking data, departure clearance", "Administrative — Legal compliance"],
    doesNotHandle: ["Visa fee payment (Financial)", "Embassy communication (Administrative)", "Flight booking (Core 1)"],
  },
  {
    id: "marketing",
    title: "Marketing & Promotions Management",
    icon: Megaphone,
    path: "/marketing",
    description: "Manages seasonal campaigns with discount codes, destination alerts with alert types (Weather/Health/Calamity), and seasonal pricing strategies. Alerts can cancel affected tours.",
    dataSource: [
      "Seasonal Data → Historical booking trends and tourism calendar",
      "Weather/Calamity Alerts → PAGASA, NDRRMC, Local Government Units",
      "Campaign Data → Marketing team based on seasonal strategies",
      "Pricing Strategy → Demand analysis (peak = premium, off-peak = discounted)",
    ],
    features: [
      "Campaign management with name, location, season, pricing strategy, discount %, discount code, description, target audience, banner image",
      "Seasonal Pricing Strategy Guide — visual cards per season/location",
      "Destination Alerts with alert type (Weather/Health/Calamity), severity (High/Medium/Low), start/end dates",
      "Mark as Resolved button for alerts",
      "Cancel All Affected Tours button for critical alerts — notifies Core 1",
      "Alert statistics: total, active, critical, tours affected",
      "Campaign search and season filter",
      "Alert Active badges on campaigns with active destination alerts",
    ],
    dataFlow: [
      { from: "Tourism Calendar", to: "Seasonal Pricing", description: "Peak/off-peak seasons determine pricing strategy" },
      { from: "PAGASA / NDRRMC", to: "Destination Alerts", description: "Typhoon signals, health advisories, calamity warnings" },
      { from: "Alert System", to: "Core 1 — Tour Cancellation", description: "High-severity alerts trigger tour cancellation notification to Core 1" },
      { from: "Marketing Team", to: "Campaigns", description: "Create seasonal promos with discounts and target dates" },
      { from: "Campaign Data", to: "Core 1", description: "Discount codes shared with Core 1 booking system" },
    ],
    integratedWith: ["Core 1 — Tour cancellation notifications, discount code sharing", "Administrative — Campaign compliance"],
    doesNotHandle: ["Campaign budget allocation (Financial)", "Social media management (External)", "Tour rescheduling (Core 1)"],
  },
  {
    id: "tour-resources",
    title: "Tour Availability & Resource Planning",
    icon: CalendarCheck,
    path: "/tour-resources",
    description: "Monitors tour capacity and resource allocation. Ensures no overbooking by tracking slots, assigned vehicles, and guides per tour. NOTE: Tour creation is handled by Core 1 — this module only monitors and prevents overbooking.",
    dataSource: [
      "Tour Schedule → Core 1 — Operations team planning (tour itineraries)",
      "Vehicle Assignment → Vehicle Availability module (available vehicles)",
      "Guide Assignment → Agent & Staff Management module (available guides)",
      "Booking Count → Core 1 — Customer bookings/reservations",
    ],
    features: [
      "View all tours with capacity progress bars",
      "Status tracking: Open, Almost Full, Full, Cancelled",
      "Vehicle and guide assignment per tour",
      "Overbooking prevention — stops bookings at max capacity",
      "Summary: Total, Open, Almost Full, Full/Cancelled counts",
    ],
    dataFlow: [
      { from: "Core 1 — Operations", to: "Tour Schedule", description: "Tour itineraries with dates, destinations, and slot limits" },
      { from: "Vehicle Module", to: "Vehicle Assignment", description: "Available vehicles assigned based on capacity match" },
      { from: "Agent Module", to: "Guide Assignment", description: "Available guides assigned based on specialization" },
      { from: "Core 1 — Bookings", to: "Slot Count", description: "Each booking increments the booked count until max" },
    ],
    integratedWith: ["Core 1 — Tour schedule and booking data", "Vehicle Module — Fleet assignment", "Agent Module — Guide assignment"],
    doesNotHandle: ["Tour creation/editing (Core 1)", "Customer booking process (Core 1)", "Revenue per tour (Financial)"],
  },
];

const systemIntegrations = [
  {
    system: "Core 1 — Tour Creation & Booking",
    color: "text-primary",
    receives: ["Tour schedules, booking counts, customer data"],
    sends: ["Supplier availability, agent recommendations, discount codes, tour cancellation alerts, departure clearance"],
    boundary: "Core 2 does NOT create tours or process bookings. It only monitors capacity and provides data.",
  },
  {
    system: "HR4 — Human Resource Management",
    color: "text-accent",
    receives: ["Employee records, agent profiles, employment history, contact info"],
    sends: ["Staff requests (with cover letter, resume), new agent entries"],
    boundary: "Core 2 does NOT handle hiring contracts, salary, or benefits. It only requests and tracks agents.",
  },
  {
    system: "Financial — Reporting & Analytics",
    color: "text-success",
    receives: ["Revenue data for campaign ROI, commission rates"],
    sends: ["Partner investment data, profit share percentages, campaign discount amounts"],
    boundary: "Core 2 does NOT calculate revenue, process payments, or generate financial reports.",
  },
  {
    system: "Administrative — Operations",
    color: "text-info",
    receives: ["Company policies, compliance requirements, audit standards"],
    sends: ["DTI/SEC verification status, contract compliance data, alert action logs"],
    boundary: "Core 2 does NOT set policies or handle legal proceedings. It ensures data has verified basis.",
  },
];

const UserManual = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>("dashboard");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Manual</h1>
          <p className="text-sm text-muted-foreground mt-1">Complete guide to Core 2 — module descriptions, data flow, system integrations, and process boundaries</p>
        </div>

        {/* System Overview */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">TravelOps Core 2: Back-Office & Agency Management</h2>
              <p className="text-xs text-muted-foreground">Powered by Gemini AI • Integrated with Core 1, HR4, Financial & Administrative Systems</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Core 2 is the back-office management platform for a Philippine travel agency. It handles agent/staff management,
            vendor portal (suppliers & partners), vehicle tracking, visa assistance, marketing & promotions, and tour resource planning.
            AI-powered recommendations help select the best agents and suppliers for each tour.
          </p>
          <div className="mt-4 p-3 rounded-md bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary font-medium">📌 Data Provenance Policy: All data has a documented source. Agent requests come from HR4,
            suppliers must provide DTI/SEC registration, visa documents are verified for legitimacy, marketing strategies are based on seasonal demand analysis,
            and partner investments are tracked through the Financial System.</p>
          </div>
          <div className="mt-3 p-3 rounded-md bg-accent/10 border border-accent/20">
            <p className="text-xs text-accent font-medium">⚠️ Process Boundaries: Core 2 does NOT handle tour creation (Core 1), revenue tracking (Financial),
            employee hiring contracts (HR4), or company policies (Administrative). These are separate systems to prevent process overlap.</p>
          </div>
        </div>

        {/* System Integration Map */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">System Integration Map — Core 2 Connections</h2>
          </div>
          <p className="text-[10px] text-muted-foreground mb-4">Shows what data Core 2 receives from and sends to each integrated system. Boundaries prevent process overlap.</p>

          <div className="space-y-4">
            {systemIntegrations.map((int, i) => (
              <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-3">
                  <Link2 className="w-4 h-4 text-success" />
                  <h3 className={`text-sm font-bold ${int.color}`}>{int.system}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">← RECEIVES FROM</p>
                    {int.receives.map((r, j) => <p key={j} className="text-xs text-foreground">• {r}</p>)}
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1">→ SENDS TO</p>
                    {int.sends.map((s, j) => <p key={j} className="text-xs text-foreground">• {s}</p>)}
                  </div>
                  <div>
                    <p className="text-[10px] text-destructive font-medium mb-1">🚫 BOUNDARY</p>
                    <p className="text-xs text-muted-foreground">{int.boundary}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Map */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold text-foreground mb-4">System Navigation Map</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((mod) => {
              const Icon = mod.icon;
              return (
                <a key={mod.id} href={mod.path} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group">
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
              { from: "HR4 System", to: "Agent & Staff Management", desc: "Employee onboarding, agent profiles, request approvals" },
              { from: "Vendor Applications (DTI/SEC)", to: "Vendor Portal → Suppliers", desc: "Supplier registration with legitimacy proof" },
              { from: "Legal / Financial", to: "Vendor Portal → Partners", desc: "Partnership contracts, investment records, share percentages" },
              { from: "Vehicle Suppliers", to: "Vehicle Availability", desc: "Fleet data, seat capacity, pricing, maintenance schedules" },
              { from: "Customer Submissions (Core 1)", to: "Visa Assistance", desc: "Passport copies, bank statements, supporting documents" },
              { from: "PAGASA / NDRRMC", to: "Marketing → Destination Alerts", desc: "Weather alerts, calamity warnings, health advisories" },
              { from: "Tourism Calendar / Demand Data", to: "Marketing → Seasonal Pricing", desc: "Peak/off-peak seasons drive pricing strategies" },
              { from: "Core 1 — Operations", to: "Tour Resources", desc: "Tour scheduling, vehicle and guide assignments" },
              { from: "Gemini AI Engine", to: "Agent & Supplier Recommendations", desc: "AI analyzes ratings, experience, availability to recommend best match" },
              { from: "Core 2 → Core 1", to: "Tour Cancellation Notifications", desc: "Critical alerts trigger tour cancellation in Core 1" },
              { from: "Core 2 → Financial", to: "Investment Data", desc: "Partner investment amounts synced to Financial System" },
            ].map((flow, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-md bg-secondary/30">
                <span className="text-xs font-medium text-primary min-w-[180px]">{flow.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-xs font-medium text-accent min-w-[200px]">{flow.to}</span>
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
                  onClick={() => setExpandedModule(isExpanded ? null : mod.id)}
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
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 space-y-4">
                    <p className="text-sm text-muted-foreground">{mod.description}</p>

                    {mod.aiIntegration && (
                      <div className="flex items-start gap-2 p-3 rounded-md bg-primary/10 border border-primary/20">
                        <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-medium text-primary">Gemini AI Integration</p>
                          <p className="text-xs text-foreground">{mod.aiIntegration}</p>
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">📊 Data Sources</p>
                      <div className="space-y-1">
                        {mod.dataSource.map((ds, i) => (
                          <p key={i} className="text-xs text-foreground pl-3 border-l-2 border-primary/30">{ds}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">✅ Features</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                        {mod.features.map((f, i) => (
                          <p key={i} className="text-xs text-foreground">• {f}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">🔄 Data Flow</p>
                      <div className="space-y-1.5">
                        {mod.dataFlow.map((df, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 rounded-md bg-secondary/30">
                            <span className="text-[10px] font-medium text-primary min-w-[140px]">{df.from}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-[10px] font-medium text-accent min-w-[120px]">{df.to}</span>
                            <span className="text-[10px] text-muted-foreground">— {df.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 rounded-md bg-success/5 border border-success/20">
                        <p className="text-xs font-medium text-success mb-2">🔗 Integrated With</p>
                        {mod.integratedWith.map((iw, i) => (
                          <p key={i} className="text-xs text-foreground">• {iw}</p>
                        ))}
                      </div>
                      <div className="p-3 rounded-md bg-destructive/5 border border-destructive/20">
                        <p className="text-xs font-medium text-destructive mb-2">🚫 Does NOT Handle</p>
                        {mod.doesNotHandle.map((dnh, i) => (
                          <p key={i} className="text-xs text-foreground">• {dnh}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default UserManual;
