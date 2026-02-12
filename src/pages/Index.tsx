import AppLayout from "@/components/AppLayout";
import StatCard from "@/components/StatCard";
import { Users, Building2, Bus, FileCheck, Megaphone, CalendarCheck, UserPlus, AlertTriangle } from "lucide-react";

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Back-Office & Agency Management Overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Agents" value={12} icon={Users} subtitle="3 pending requests" variant="primary" />
          <StatCard title="Suppliers" value={28} icon={Building2} subtitle="Hotels & Vehicles" variant="default" />
          <StatCard title="Vehicles Available" value={45} icon={Bus} subtitle="8 fully booked" variant="accent" />
          <StatCard title="Visa Applications" value={18} icon={FileCheck} subtitle="5 under review" variant="success" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Recent Agent Requests</h2>
            <div className="space-y-3">
              {[
                { name: "Maria Santos", role: "Travel Agent", status: "Pending" },
                { name: "Juan Dela Cruz", role: "Tour Guide", status: "Approved" },
                { name: "Ana Reyes", role: "Travel Agent", status: "Pending" },
              ].map((req, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                      {req.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{req.name}</p>
                      <p className="text-xs text-muted-foreground">{req.role}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      req.status === "Approved"
                        ? "bg-success/20 text-success"
                        : "bg-accent/20 text-accent"
                    }`}
                  >
                    {req.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Destination Alerts</h2>
            <div className="space-y-3">
              {[
                { location: "Boracay", alert: "Typhoon Warning", severity: "high" },
                { location: "Palawan", alert: "All Clear", severity: "low" },
                { location: "Cebu", alert: "Heavy Rain Advisory", severity: "medium" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle
                      className={`w-4 h-4 ${
                        item.severity === "high"
                          ? "text-destructive"
                          : item.severity === "medium"
                          ? "text-accent"
                          : "text-success"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.location}</p>
                      <p className="text-xs text-muted-foreground">{item.alert}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Seasonal Pricing</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Summer • Boracay</span>
                <span className="text-destructive font-medium">High Demand</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rainy • Boracay</span>
                <span className="text-success font-medium">Discounted</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Summer • Palawan</span>
                <span className="text-accent font-medium">Moderate</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Active Campaigns</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Summer Splash Sale</span>
                <span className="text-success font-medium">Active</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Rainy Day Deals</span>
                <span className="text-info font-medium">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Partner Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Active Partners</span>
                <span className="text-foreground font-medium">5</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pending Contracts</span>
                <span className="text-accent font-medium">2</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Total Investment</span>
                <span className="text-primary font-medium">₱2.4M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
