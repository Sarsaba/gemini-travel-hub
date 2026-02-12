import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Sun, CloudRain, AlertTriangle, Megaphone, TrendingUp, TrendingDown, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SeasonalStrategy {
  id: number;
  season: string;
  location: string;
  pricing: "High" | "Moderate" | "Discounted";
  reason: string;
  icon: "sun" | "rain";
}

interface DestinationAlert {
  id: number;
  location: string;
  alert: string;
  severity: "high" | "medium" | "low";
  affectedTours: number;
  date: string;
}

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: "Active" | "Scheduled" | "Ended";
  startDate: string;
  endDate: string;
  discount?: string;
}

const strategies: SeasonalStrategy[] = [
  { id: 1, season: "Summer", location: "Boracay", pricing: "High", reason: "Peak season — high demand, premium pricing", icon: "sun" },
  { id: 2, season: "Rainy", location: "Boracay", pricing: "Discounted", reason: "Off-season discount to maintain bookings and keep the destination active", icon: "rain" },
  { id: 3, season: "Summer", location: "Palawan", pricing: "High", reason: "Top beach destination in peak season", icon: "sun" },
  { id: 4, season: "Rainy", location: "Palawan", pricing: "Moderate", reason: "Still popular but reduced demand", icon: "rain" },
  { id: 5, season: "Summer", location: "Cebu", pricing: "Moderate", reason: "Good demand, competitive pricing", icon: "sun" },
];

const alerts: DestinationAlert[] = [
  { id: 1, location: "Boracay", alert: "Typhoon Signal #3 — All tours cancelled", severity: "high", affectedTours: 12, date: "2026-02-10" },
  { id: 2, location: "Cebu", alert: "Heavy rainfall advisory", severity: "medium", affectedTours: 4, date: "2026-02-11" },
  { id: 3, location: "Palawan", alert: "All clear — operations normal", severity: "low", affectedTours: 0, date: "2026-02-12" },
];

const campaigns: Campaign[] = [
  { id: 1, name: "Summer Splash 2026", type: "Seasonal Promo", status: "Scheduled", startDate: "2026-03-01", endDate: "2026-05-31", discount: "20% off" },
  { id: 2, name: "Rainy Day Deals", type: "Off-Season Hook", status: "Active", startDate: "2026-01-15", endDate: "2026-03-15", discount: "35% off" },
  { id: 3, name: "Valentine's Getaway", type: "Event Promo", status: "Ended", startDate: "2026-02-01", endDate: "2026-02-14", discount: "15% off" },
];

const pricingColors = { High: "text-destructive", Moderate: "text-accent", Discounted: "text-success" };
const pricingIcons = { High: TrendingUp, Moderate: TrendingDown, Discounted: TrendingDown };

const MarketingPromotion = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing & Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">Seasonal pricing, destination tracking, and campaign management</p>
        </div>

        <Tabs defaultValue="seasonal" className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="seasonal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sun className="w-4 h-4 mr-2" /> Seasonal Pricing
            </TabsTrigger>
            <TabsTrigger value="tracking" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" /> Destination Tracking
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Megaphone className="w-4 h-4 mr-2" /> Campaigns
            </TabsTrigger>
          </TabsList>

          <TabsContent value="seasonal" className="space-y-3">
            {strategies.map((s) => {
              const PriceIcon = pricingIcons[s.pricing];
              return (
                <div key={s.id} className="glass-card p-5 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.icon === "sun" ? "bg-accent/20" : "bg-info/20"}`}>
                        {s.icon === "sun" ? <Sun className="w-5 h-5 text-accent" /> : <CloudRain className="w-5 h-5 text-info" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{s.season} • {s.location}</h3>
                        <p className="text-xs text-muted-foreground">{s.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <PriceIcon className={`w-4 h-4 ${pricingColors[s.pricing]}`} />
                      <span className={`text-sm font-bold ${pricingColors[s.pricing]}`}>{s.pricing}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="tracking" className="space-y-3">
            {alerts.map((a) => (
              <div key={a.id} className={`glass-card p-5 animate-fade-in ${a.severity === "high" ? "border-destructive/30" : ""}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className={`w-5 h-5 ${a.severity === "high" ? "text-destructive" : a.severity === "medium" ? "text-accent" : "text-success"}`} />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{a.location}</h3>
                      <p className="text-xs text-muted-foreground">{a.alert}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.date} • {a.affectedTours} tour{a.affectedTours !== 1 ? "s" : ""} affected</p>
                    </div>
                  </div>
                  {a.severity === "high" && (
                    <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive">Tours Cancelled</span>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex justify-end">
              <Button className="gradient-primary text-primary-foreground border-0 gap-2">
                <Plus className="w-4 h-4" /> Create Campaign
              </Button>
            </div>
            {campaigns.map((c) => (
              <div key={c.id} className="glass-card p-5 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                    <p className="text-xs text-muted-foreground">{c.type} • {c.startDate} to {c.endDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {c.discount && <span className="text-xs font-bold text-primary">{c.discount}</span>}
                    <span className={`text-xs px-2 py-1 rounded-full ${c.status === "Active" ? "bg-success/20 text-success" : c.status === "Scheduled" ? "bg-info/20 text-info" : "bg-muted text-muted-foreground"}`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MarketingPromotion;
