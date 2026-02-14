import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import StatCard from "@/components/StatCard";
import { Users, Building2, Bus, FileCheck, Megaphone, AlertTriangle, Star, TrendingUp, Link2, Server } from "lucide-react";

const Dashboard = () => {
  const topAgents = [
    { name: "Michelle Garcia", rating: 4.9, tours: 85, specialization: "International Tours" },
    { name: "Russel Santillan", rating: 4.8, tours: 40, specialization: "Beach Destinations" },
    { name: "Roberto Villanueva", rating: 4.7, tours: 120, specialization: "Historical Tours" },
  ];

  const activeCampaigns = [
    { name: "Valentine's Day Promo", season: "Holiday", discount: "5% OFF", status: "Active" },
    { name: "Summer Boracay Getaway 2026", season: "Summer", discount: "30% OFF", status: "Scheduled" },
    { name: "Rainy Season Deals - Boracay", season: "Rainy", discount: "30% OFF", status: "Active" },
  ];

  const integrations = [
    { system: "Core 1", desc: "Tour Creation & Booking Management", status: "Connected", items: ["Tour packages", "Customer bookings", "Pricing data"] },
    { system: "HR4", desc: "Human Resource Management", status: "Connected", items: ["Agent profiles", "Staff requests", "Employment records"] },
    { system: "Financial", desc: "Financial Reporting & Analytics", status: "Connected", items: ["Revenue data", "Commission calculations", "Partner investments"] },
    { system: "Administrative", desc: "Administrative Operations", status: "Connected", items: ["Company policies", "Compliance records", "Audit trails"] },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Back-Office & Agency Management Overview</p>
          <p className="text-[10px] text-primary mt-0.5">📌 Integrated with Core 1, HR4, Financial & Administrative Systems</p>
        </div>

        {/* Active Destination Alerts Banner */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div>
            <p className="text-sm font-medium text-foreground">Active Destination Alerts</p>
            <p className="text-xs text-muted-foreground">2 location(s) have travel advisories — Check Marketing & Promos for details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Suppliers" value={4} icon={Building2} subtitle="Hotels & Vehicles" variant="primary" />
          <StatCard title="Travel Agents" value={4} icon={Users} subtitle="From HR4 System" variant="default" />
          <StatCard title="Active Partners" value={2} icon={TrendingUp} subtitle="₱750,000 total investment" variant="accent" />
          <StatCard title="Pending Visas" value={1} icon={FileCheck} subtitle="Under review" variant="success" />
        </div>

        {/* AI Recommendation */}
        <AIRecommendPanel type="supplier" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Performing Agents */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Top Performing Agents</h2>
            <p className="text-[10px] text-muted-foreground mb-3">Source: HR4 System — Performance tracking & customer surveys</p>
            <div className="space-y-3">
              {topAgents.map((agent, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.specialization}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="text-sm font-bold text-foreground">{agent.rating}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{agent.tours} tours completed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Campaigns */}
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Active Campaigns</h2>
            <p className="text-[10px] text-muted-foreground mb-3">Source: Marketing Module — Seasonal demand strategy</p>
            <div className="space-y-3">
              {activeCampaigns.map((camp, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{camp.name}</p>
                    <p className="text-xs text-muted-foreground">{camp.season}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{camp.discount}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${camp.status === "Active" ? "bg-success/20 text-success" : "bg-info/20 text-info"}`}>
                      {camp.status}
                    </span>
                  </div>
                </div>
              ))}
              <a href="/marketing" className="text-xs text-primary hover:underline">View All Campaigns →</a>
            </div>
          </div>
        </div>

        {/* Destination Alerts */}
        <div className="glass-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Destination Alerts</h2>
          <p className="text-[10px] text-muted-foreground mb-3">Source: PAGASA / NDRRMC / Local Government Units</p>
          <div className="space-y-3">
            {[
              { location: "Boracay", alert: "Typhoon Warning Near Visayas Region", severity: "high", type: "Weather" },
              { location: "Palawan", alert: "All Clear — Operations Normal", severity: "low", type: "Clear" },
              { location: "Cebu", alert: "Heavy Rain Advisory", severity: "medium", type: "Weather" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle
                    className={`w-4 h-4 ${
                      item.severity === "high" ? "text-destructive" : item.severity === "medium" ? "text-accent" : "text-success"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.location}</p>
                    <p className="text-xs text-muted-foreground">{item.alert}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.severity === "high" ? "bg-destructive/20 text-destructive" : item.severity === "medium" ? "bg-accent/20 text-accent" : "bg-success/20 text-success"
                }`}>
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Integration Map */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Server className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">System Integration Map</h2>
          </div>
          <p className="text-[10px] text-muted-foreground mb-3">Core 2 connects to the following systems. Data flows are documented to prevent process overlap.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {integrations.map((int, i) => (
              <div key={i} className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <Link2 className="w-3 h-3 text-success" />
                  <span className="text-xs font-bold text-foreground">{int.system}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-success/20 text-success ml-auto">{int.status}</span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{int.desc}</p>
                <div className="space-y-1">
                  {int.items.map((item, j) => (
                    <p key={j} className="text-[10px] text-foreground">• {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Seasonal Pricing</h2>
            <p className="text-[10px] text-muted-foreground mb-2">Source: Marketing Module — Tourism calendar</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Summer • Boracay</span>
                <span className="text-destructive font-medium">Premium (High Demand)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rainy • Boracay</span>
                <span className="text-success font-medium">Discounted</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Summer • Palawan</span>
                <span className="text-destructive font-medium">Premium (High Demand)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Holiday • Baguio</span>
                <span className="text-destructive font-medium">Premium (Christmas)</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Partner Summary</h2>
            <p className="text-[10px] text-muted-foreground mb-2">Source: Financial System — Investment records</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active Partners</span>
                <span className="text-foreground font-medium">2</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Investment</span>
                <span className="text-primary font-medium">₱750,000</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pending Contracts</span>
                <span className="text-accent font-medium">0</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Process Boundaries</h2>
            <p className="text-[10px] text-muted-foreground mb-2">Core 2 scope — no overlap with other systems</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tour Creation</span>
                <span className="text-info font-medium">→ Core 1</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Revenue Tracking</span>
                <span className="text-info font-medium">→ Financial</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Employee Hiring</span>
                <span className="text-info font-medium">→ HR4</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Company Policies</span>
                <span className="text-info font-medium">→ Administrative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
