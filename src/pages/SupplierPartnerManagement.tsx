import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import { Building2, Car, FileText, Plus, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Supplier {
  id: number;
  name: string;
  type: "Hotel" | "Vehicle";
  location: string;
  availability: string;
  slots?: number;
  maxSlots?: number;
  contact: string;
  status: "Active" | "Inactive";
}

interface Partner {
  id: number;
  name: string;
  investment: string;
  contractStart: string;
  contractEnd: string;
  status: "Active" | "Pending" | "Expired";
  share: string;
}

const suppliers: Supplier[] = [
  { id: 1, name: "Paradise Hotel Boracay", type: "Hotel", location: "Boracay", availability: "25 rooms available", slots: 25, maxSlots: 50, contact: "+63 912 345 6789", status: "Active" },
  { id: 2, name: "Island Van Rentals", type: "Vehicle", location: "Cebu", availability: "8 vans available", slots: 8, maxSlots: 15, contact: "+63 917 654 3210", status: "Active" },
  { id: 3, name: "Palawan Beach Resort", type: "Hotel", location: "Palawan", availability: "12 rooms available", slots: 12, maxSlots: 30, contact: "+63 918 111 2222", status: "Active" },
  { id: 4, name: "Metro Bus Services", type: "Vehicle", location: "Manila", availability: "3 buses available", slots: 3, maxSlots: 10, contact: "+63 915 333 4444", status: "Inactive" },
];

const partners: Partner[] = [
  { id: 1, name: "JK Investments Corp", investment: "₱500,000", contractStart: "2025-01-01", contractEnd: "2026-12-31", status: "Active", share: "15%" },
  { id: 2, name: "Traveler's Fund LLC", investment: "₱1,200,000", contractStart: "2025-06-01", contractEnd: "2027-05-31", status: "Active", share: "25%" },
  { id: 3, name: "Pacific Ventures", investment: "₱300,000", contractStart: "2024-01-01", contractEnd: "2025-12-31", status: "Pending", share: "10%" },
];

const SupplierPartnerManagement = () => {
  const [search, setSearch] = useState("");

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage suppliers and business partners</p>
        </div>

        <AIRecommendPanel type="supplier" />

        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" />
              Suppliers
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              Partners
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suppliers" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 bg-secondary border-border" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2">
                <Plus className="w-4 h-4" />
                Add Supplier
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {suppliers
                .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
                .map((supplier) => (
                  <div key={supplier.id} className="glass-card p-5 animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${supplier.type === "Hotel" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                          {supplier.type === "Hotel" ? <Building2 className="w-5 h-5" /> : <Car className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">{supplier.name}</h3>
                          <p className="text-xs text-muted-foreground">{supplier.location}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${supplier.status === "Active" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                        {supplier.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{supplier.availability}</span>
                        <span className="text-foreground font-medium">{supplier.slots}/{supplier.maxSlots}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="h-2 rounded-full gradient-primary transition-all"
                          style={{ width: `${((supplier.slots || 0) / (supplier.maxSlots || 1)) * 100}%` }}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <div className="flex justify-end">
              <Button className="gradient-primary text-primary-foreground border-0 gap-2">
                <Plus className="w-4 h-4" />
                Add Partner
              </Button>
            </div>

            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner.id} className="glass-card p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{partner.name}</h3>
                      <p className="text-xs text-muted-foreground">Investment Partner • {partner.share} share</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${partner.status === "Active" ? "bg-success/20 text-success" : partner.status === "Pending" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}>
                      {partner.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Investment</p>
                      <p className="text-sm font-bold text-foreground">{partner.investment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contract Start</p>
                      <p className="text-sm text-foreground">{partner.contractStart}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contract End</p>
                      <p className="text-sm text-foreground">{partner.contractEnd}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1">
                      <FileText className="w-3 h-3" />
                      View Contract
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SupplierPartnerManagement;
