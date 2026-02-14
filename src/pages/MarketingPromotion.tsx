import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Sun, CloudRain, AlertTriangle, Megaphone, TrendingUp, TrendingDown, MapPin, Plus, CheckCircle, XCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface SeasonalStrategy {
  id: number;
  season: string;
  location: string;
  pricing: "Premium" | "Moderate" | "Discounted";
  reason: string;
  icon: "sun" | "rain" | "holiday";
}

interface DestinationAlert {
  id: number;
  location: string;
  title: string;
  description: string;
  alertType: "Weather" | "Health" | "Calamity";
  severity: "High" | "Medium" | "Low";
  status: "Active" | "Resolved";
  startDate: string;
  endDate: string;
  affectedTours: number;
}

interface Campaign {
  id: number;
  name: string;
  season: string;
  location: string;
  pricing: string;
  discount: string;
  discountCode: string;
  description: string;
  status: "Active" | "Scheduled" | "Ended";
  startDate: string;
  endDate: string;
  hasAlert: boolean;
}

const initialStrategies: SeasonalStrategy[] = [
  { id: 1, season: "Summer", location: "Boracay", pricing: "Premium", reason: "Peak season, high demand", icon: "sun" },
  { id: 2, season: "Rainy", location: "Boracay", pricing: "Discounted", reason: "Low season, attract visitors", icon: "rain" },
  { id: 3, season: "Summer", location: "Palawan", pricing: "Premium", reason: "Best weather, peak tourism", icon: "sun" },
  { id: 4, season: "Holiday", location: "Baguio", pricing: "Premium", reason: "Christmas season popular", icon: "holiday" },
];

const initialAlerts: DestinationAlert[] = [
  { id: 1, location: "Batanes", title: "Typhoon Warning", description: "Signal Number 3", alertType: "Weather", severity: "Medium", status: "Active", startDate: "2026-02-01", endDate: "2026-02-04", affectedTours: 2 },
  { id: 2, location: "Palawan", title: "Virus Outbreak", description: "Spread quickly — immediate action required", alertType: "Health", severity: "High", status: "Active", startDate: "2026-02-13", endDate: "2026-03-01", affectedTours: 5 },
  { id: 3, location: "Cebu", title: "Typhoon Warning", description: "Signal Number 4", alertType: "Calamity", severity: "High", status: "Active", startDate: "2026-02-14", endDate: "2026-02-16", affectedTours: 3 },
  { id: 4, location: "Boracay", title: "Typhoon Warning Near Visayas Region", description: "A tropical storm is expected to pass near the Visayas region. Tours may experience delays.", alertType: "Weather", severity: "Medium", status: "Active", startDate: "2026-02-15", endDate: "2026-02-20", affectedTours: 4 },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: "Valentine's Day", season: "Holiday", location: "Boracay", pricing: "Premium (High Demand)", discount: "5% OFF", discountCode: "VAL5", description: "Day for love", status: "Active", startDate: "2026-02-01", endDate: "2026-02-14", hasAlert: true },
  { id: 2, name: "Summer Boracay Getaway 2026", season: "Summer", location: "Boracay", pricing: "Premium (High Demand)", discount: "30% OFF", discountCode: "SUMMER30", description: "Best beach deals this summer", status: "Scheduled", startDate: "2026-03-01", endDate: "2026-05-31", hasAlert: true },
  { id: 3, name: "Rainy Season Deals - Boracay", season: "Rainy", location: "Boracay", pricing: "Discounted", discount: "30% OFF", discountCode: "RAINY30", description: "Discounted rates to attract visitors during rainy season", status: "Active", startDate: "2026-06-01", endDate: "2026-08-31", hasAlert: true },
];

const pricingColors: Record<string, string> = { Premium: "text-destructive", Moderate: "text-accent", Discounted: "text-success" };

const MarketingPromotion = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [alerts, setAlerts] = useState<DestinationAlert[]>(initialAlerts);
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [addAlertOpen, setAddAlertOpen] = useState(false);
  const [searchCampaign, setSearchCampaign] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("All Seasons");

  // Campaign form
  const [campName, setCampName] = useState("");
  const [campLocation, setCampLocation] = useState("");
  const [campSeason, setCampSeason] = useState("Summer");
  const [campPricing, setCampPricing] = useState("Premium (High Demand)");
  const [campStatus, setCampStatus] = useState("Active");
  const [campDiscount, setCampDiscount] = useState("");
  const [campCode, setCampCode] = useState("");
  const [campStart, setCampStart] = useState("");
  const [campEnd, setCampEnd] = useState("");
  const [campDesc, setCampDesc] = useState("");
  const [campAudience, setCampAudience] = useState("");

  // Alert form
  const [alertLocation, setAlertLocation] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDesc, setAlertDesc] = useState("");
  const [alertType, setAlertType] = useState("Weather");
  const [alertSeverity, setAlertSeverity] = useState("Medium");
  const [alertStatus, setAlertStatus] = useState("Active");
  const [alertStart, setAlertStart] = useState("");
  const [alertEnd, setAlertEnd] = useState("");

  const handleCreateCampaign = () => {
    if (!campName.trim() || !campLocation.trim()) {
      toast({ title: "Missing Fields", description: "Campaign name and target location are required.", variant: "destructive" });
      return;
    }
    const newCampaign: Campaign = {
      id: campaigns.length + 1, name: campName, season: campSeason, location: campLocation,
      pricing: campPricing, discount: campDiscount, discountCode: campCode, description: campDesc,
      status: campStatus as any, startDate: campStart, endDate: campEnd, hasAlert: false,
    };
    setCampaigns((prev) => [...prev, newCampaign]);
    setCampName(""); setCampLocation(""); setCampSeason("Summer"); setCampPricing("Premium (High Demand)");
    setCampStatus("Active"); setCampDiscount(""); setCampCode(""); setCampStart(""); setCampEnd(""); setCampDesc(""); setCampAudience("");
    setCreateCampaignOpen(false);
    toast({ title: "Campaign Created", description: `${campName} has been created.` });
  };

  const handleAddAlert = () => {
    if (!alertLocation.trim() || !alertTitle.trim()) {
      toast({ title: "Missing Fields", description: "Location and alert title are required.", variant: "destructive" });
      return;
    }
    const newAlert: DestinationAlert = {
      id: alerts.length + 1, location: alertLocation, title: alertTitle, description: alertDesc,
      alertType: alertType as any, severity: alertSeverity as any, status: alertStatus as any,
      startDate: alertStart, endDate: alertEnd,
      affectedTours: alertSeverity === "High" ? Math.floor(Math.random() * 8) + 3 : Math.floor(Math.random() * 4) + 1,
    };
    setAlerts((prev) => [...prev, newAlert]);
    setAlertLocation(""); setAlertTitle(""); setAlertDesc(""); setAlertType("Weather"); setAlertSeverity("Medium"); setAlertStatus("Active"); setAlertStart(""); setAlertEnd("");
    setAddAlertOpen(false);
    toast({ title: "Alert Created", description: `Destination alert for ${alertLocation} has been posted.` });
  };

  const handleResolveAlert = (id: number) => {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status: "Resolved" as const } : a));
    toast({ title: "Alert Resolved", description: "Destination alert marked as resolved." });
  };

  const handleCancelAffectedTours = (id: number) => {
    toast({ title: "Tours Cancelled", description: "All tours to this location have been marked as cancelled. Notification sent to Core 1." });
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(searchCampaign.toLowerCase());
    const matchSeason = seasonFilter === "All Seasons" || c.season === seasonFilter;
    return matchSearch && matchSeason;
  });

  const criticalAlerts = alerts.filter((a) => a.severity === "High" && a.status === "Active");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketing & Promotions</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage seasonal campaigns and pricing strategies</p>
          <p className="text-[10px] text-primary mt-0.5">📌 Pricing from seasonal demand analysis • Alerts from PAGASA/NDRRMC • Campaign data syncs with Core 1</p>
        </div>

        <Tabs defaultValue="campaigns" className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Megaphone className="w-4 h-4 mr-2" /> Campaigns
            </TabsTrigger>
            <TabsTrigger value="seasonal" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sun className="w-4 h-4 mr-2" /> Seasonal Pricing
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <AlertTriangle className="w-4 h-4 mr-2" /> Destination Alerts
            </TabsTrigger>
          </TabsList>

          {/* CAMPAIGNS TAB */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 bg-secondary border-border" placeholder="Search campaigns..." value={searchCampaign} onChange={(e) => setSearchCampaign(e.target.value)} />
              </div>
              <select className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground" value={seasonFilter} onChange={(e) => setSeasonFilter(e.target.value)}>
                <option>All Seasons</option><option>Summer</option><option>Rainy</option><option>Holiday</option>
              </select>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setCreateCampaignOpen(true)}>
                <Plus className="w-4 h-4" /> New Campaign
              </Button>
            </div>

            {filteredCampaigns.map((c) => (
              <div key={c.id} className="glass-card p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                      {c.hasAlert && <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent">Alert Active</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{c.season} • {c.startDate} to {c.endDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status === "Active" ? "bg-success/20 text-success" : c.status === "Scheduled" ? "bg-info/20 text-info" : "bg-muted text-muted-foreground"}`}>
                    {c.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-foreground">{c.location}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.pricing}</span>
                </div>
                <div className="flex items-center gap-4">
                  {c.discount && <span className="text-sm font-bold text-primary">% {c.discount}</span>}
                  {c.discountCode && <span className="text-xs text-muted-foreground">Code: {c.discountCode}</span>}
                </div>
                {c.description && <p className="text-xs text-muted-foreground mt-2">{c.description}</p>}
                <p className="text-[10px] text-muted-foreground mt-2">Source: Marketing Team — Based on seasonal demand strategy</p>
              </div>
            ))}
          </TabsContent>

          {/* SEASONAL PRICING TAB */}
          <TabsContent value="seasonal" className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Seasonal Pricing Strategy Guide</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {initialStrategies.map((s) => (
                <div key={s.id} className="glass-card p-5 animate-fade-in text-center">
                  <div className={`w-10 h-10 rounded-lg mx-auto flex items-center justify-center mb-3 ${s.icon === "sun" ? "bg-accent/20" : s.icon === "rain" ? "bg-info/20" : "bg-primary/20"}`}>
                    {s.icon === "sun" ? <Sun className="w-5 h-5 text-accent" /> : s.icon === "rain" ? <CloudRain className="w-5 h-5 text-info" /> : <Megaphone className="w-5 h-5 text-primary" />}
                  </div>
                  <h4 className="text-sm font-bold text-foreground">{s.season}</h4>
                  <p className="text-xs text-muted-foreground mb-2">{s.location}</p>
                  <p className={`text-sm font-bold ${pricingColors[s.pricing]}`}>{s.pricing} Price</p>
                  <p className="text-[10px] text-muted-foreground mt-2">{s.reason}</p>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground">Basis: Historical booking trends & tourism demand calendar • No overlap with Core 1 pricing</p>
          </TabsContent>

          {/* DESTINATION ALERTS TAB */}
          <TabsContent value="alerts" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Destination Alerts</h3>
                <p className="text-xs text-muted-foreground">Track calamities and travel advisories</p>
              </div>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddAlertOpen(true)}>
                <Plus className="w-4 h-4" /> Create Alert
              </Button>
            </div>

            {criticalAlerts.length > 0 && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-foreground">Critical Alerts Active</p>
                  <p className="text-xs text-muted-foreground">{criticalAlerts.map((a) => a.location).join(", ")} — Immediate action required. Tours may be cancelled.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{alerts.length}</p>
                <p className="text-xs text-muted-foreground">Total Alerts</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-accent">{alerts.filter((a) => a.status === "Active").length}</p>
                <p className="text-xs text-muted-foreground">Active Alerts</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{alerts.filter((a) => a.severity === "High").length}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-info">{alerts.reduce((sum, a) => sum + a.affectedTours, 0)}</p>
                <p className="text-xs text-muted-foreground">Tours Affected</p>
              </div>
            </div>

            <div className="space-y-3">
              {alerts.map((a) => (
                <div key={a.id} className={`glass-card p-5 animate-fade-in ${a.severity === "High" && a.status === "Active" ? "border-destructive/30" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className={`w-5 h-5 ${a.severity === "High" ? "text-destructive" : a.severity === "Medium" ? "text-accent" : "text-success"}`} />
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                        <p className="text-xs text-muted-foreground">{a.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${a.severity === "High" ? "bg-destructive/20 text-destructive" : a.severity === "Medium" ? "bg-accent/20 text-accent" : "bg-success/20 text-success"}`}>
                        {a.severity}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${a.status === "Active" ? "bg-info/20 text-info" : "bg-muted text-muted-foreground"}`}>
                        {a.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{a.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                    <span>Type: {a.alertType}</span>
                    <span>From: {a.startDate}</span>
                    <span>To: {a.endDate}</span>
                    <span className="text-destructive font-medium">{a.affectedTours} tours affected</span>
                  </div>
                  {a.status === "Active" && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs border-border text-foreground gap-1" onClick={() => handleResolveAlert(a.id)}>
                        <CheckCircle className="w-3 h-3" /> Mark as Resolved
                      </Button>
                      {a.severity === "High" && (
                        <Button size="sm" variant="outline" className="text-xs border-destructive/50 text-destructive gap-1" onClick={() => handleCancelAffectedTours(a.id)}>
                          <XCircle className="w-3 h-3" /> Cancel All Affected Tours
                        </Button>
                      )}
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">Source: PAGASA / NDRRMC / Local Government Unit</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Campaign Dialog */}
        <Dialog open={createCampaignOpen} onOpenChange={setCreateCampaignOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">Create New Campaign</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><label className="text-xs text-muted-foreground">Campaign Name *</label><Input className="mt-1 bg-secondary border-border" value={campName} onChange={(e) => setCampName(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Target Location *</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. Boracay, Cebu" value={campLocation} onChange={(e) => setCampLocation(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Season *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={campSeason} onChange={(e) => setCampSeason(e.target.value)}>
                    <option>Summer</option><option>Rainy</option><option>Holiday</option>
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground">Pricing Strategy</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={campPricing} onChange={(e) => setCampPricing(e.target.value)}>
                    <option>Premium (High Demand)</option><option>Moderate</option><option>Discounted</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground">Status</label>
                <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={campStatus} onChange={(e) => setCampStatus(e.target.value)}>
                  <option>Active</option><option>Scheduled</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Discount Percentage</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. 30% OFF" value={campDiscount} onChange={(e) => setCampDiscount(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Discount Code</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. SUMMER30" value={campCode} onChange={(e) => setCampCode(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Start Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={campStart} onChange={(e) => setCampStart(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">End Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={campEnd} onChange={(e) => setCampEnd(e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Description</label><textarea className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground min-h-[60px]" value={campDesc} onChange={(e) => setCampDesc(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Target Audience</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. Families, Couples" value={campAudience} onChange={(e) => setCampAudience(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Banner Image</label><Input className="mt-1 bg-secondary border-border" type="file" accept="image/*" /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleCreateCampaign}>Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Alert Dialog */}
        <Dialog open={addAlertOpen} onOpenChange={setAddAlertOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">Create New Alert</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Source: PAGASA / NDRRMC / Local Government reports</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Location *</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. Boracay, Cebu" value={alertLocation} onChange={(e) => setAlertLocation(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Alert Type *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={alertType} onChange={(e) => setAlertType(e.target.value)}>
                    <option>Weather</option><option>Health</option><option>Calamity</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Severity *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={alertSeverity} onChange={(e) => setAlertSeverity(e.target.value)}>
                    <option>Low</option><option>Medium</option><option>High</option>
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground">Status</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={alertStatus} onChange={(e) => setAlertStatus(e.target.value)}>
                    <option>Active</option><option>Resolved</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground">Alert Title *</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. Typhoon Warning in Boracay" value={alertTitle} onChange={(e) => setAlertTitle(e.target.value)} /></div>
              <div><label className="text-xs text-muted-foreground">Description</label><textarea className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground min-h-[60px]" placeholder="Provide details about the alert" value={alertDesc} onChange={(e) => setAlertDesc(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Start Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={alertStart} onChange={(e) => setAlertStart(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Expected End Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={alertEnd} onChange={(e) => setAlertEnd(e.target.value)} /></div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddAlert}>Create Alert</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default MarketingPromotion;
