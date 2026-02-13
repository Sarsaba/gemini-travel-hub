import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import { Building2, Car, FileText, Plus, Search, Users, Eye, Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

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
  dtiRegistration?: string;
}

interface Partner {
  id: number;
  name: string;
  investment: string;
  contractStart: string;
  contractEnd: string;
  status: "Active" | "Pending" | "Expired";
  share: string;
  contractDetails?: string;
}

const initialSuppliers: Supplier[] = [
  { id: 1, name: "Paradise Hotel Boracay", type: "Hotel", location: "Boracay", availability: "25 rooms available", slots: 25, maxSlots: 50, contact: "+63 912 345 6789", status: "Active", dtiRegistration: "DTI-2024-001234" },
  { id: 2, name: "Island Van Rentals", type: "Vehicle", location: "Cebu", availability: "8 vans available", slots: 8, maxSlots: 15, contact: "+63 917 654 3210", status: "Active", dtiRegistration: "DTI-2023-005678" },
  { id: 3, name: "Palawan Beach Resort", type: "Hotel", location: "Palawan", availability: "12 rooms available", slots: 12, maxSlots: 30, contact: "+63 918 111 2222", status: "Active", dtiRegistration: "DTI-2024-009012" },
  { id: 4, name: "Metro Bus Services", type: "Vehicle", location: "Manila", availability: "3 buses available", slots: 3, maxSlots: 10, contact: "+63 915 333 4444", status: "Inactive", dtiRegistration: "DTI-2022-003456" },
];

const initialPartners: Partner[] = [
  { id: 1, name: "JK Investments Corp", investment: "₱500,000", contractStart: "2025-01-01", contractEnd: "2026-12-31", status: "Active", share: "15%", contractDetails: "Partnership agreement for Boracay and Palawan tour operations. Revenue sharing at 15% of net tour profits." },
  { id: 2, name: "Traveler's Fund LLC", investment: "₱1,200,000", contractStart: "2025-06-01", contractEnd: "2027-05-31", status: "Active", share: "25%", contractDetails: "Major investment partner for nationwide tour expansion. 25% share includes marketing co-investment." },
  { id: 3, name: "Pacific Ventures", investment: "₱300,000", contractStart: "2024-01-01", contractEnd: "2025-12-31", status: "Pending", share: "10%", contractDetails: "Seed investment for adventure tour line. Contract renewal pending review." },
];

const SupplierPartnerManagement = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);

  // Dialog states
  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [viewSupplierOpen, setViewSupplierOpen] = useState(false);
  const [viewContractOpen, setViewContractOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Add Supplier form
  const [supName, setSupName] = useState("");
  const [supType, setSupType] = useState("");
  const [supLocation, setSupLocation] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supSlots, setSupSlots] = useState("");
  const [supDti, setSupDti] = useState("");

  // Add Partner form
  const [partName, setPartName] = useState("");
  const [partInvestment, setPartInvestment] = useState("");
  const [partShare, setPartShare] = useState("");
  const [partContractStart, setPartContractStart] = useState("");
  const [partContractEnd, setPartContractEnd] = useState("");
  const [partDetails, setPartDetails] = useState("");

  const handleAddSupplier = () => {
    if (!supName.trim() || !supType.trim() || !supDti.trim()) {
      toast({ title: "Missing Fields", description: "Name, type, and DTI registration are required for legitimacy verification.", variant: "destructive" });
      return;
    }
    const maxSlots = parseInt(supSlots) || 10;
    const newSupplier: Supplier = {
      id: suppliers.length + 1,
      name: supName,
      type: supType as "Hotel" | "Vehicle",
      location: supLocation,
      availability: `${maxSlots} ${supType === "Hotel" ? "rooms" : "units"} available`,
      slots: maxSlots,
      maxSlots,
      contact: supContact,
      status: "Active",
      dtiRegistration: supDti,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    setSupName(""); setSupType(""); setSupLocation(""); setSupContact(""); setSupSlots(""); setSupDti("");
    setAddSupplierOpen(false);
    toast({ title: "Supplier Added", description: `${supName} has been registered with DTI verification.` });
  };

  const handleAddPartner = () => {
    if (!partName.trim() || !partInvestment.trim() || !partContractStart.trim() || !partContractEnd.trim()) {
      toast({ title: "Missing Fields", description: "Name, investment, and contract dates are required.", variant: "destructive" });
      return;
    }
    const newPartner: Partner = {
      id: partners.length + 1,
      name: partName,
      investment: partInvestment,
      contractStart: partContractStart,
      contractEnd: partContractEnd,
      status: "Pending",
      share: partShare || "0%",
      contractDetails: partDetails || "Contract details pending review.",
    };
    setPartners((prev) => [...prev, newPartner]);
    setPartName(""); setPartInvestment(""); setPartShare(""); setPartContractStart(""); setPartContractEnd(""); setPartDetails("");
    setAddPartnerOpen(false);
    toast({ title: "Partner Added", description: `${partName} partnership is pending contract approval.` });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vendor Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage suppliers and business partners</p>
          <p className="text-[10px] text-primary mt-0.5">📌 Suppliers require DTI/SEC registration proof • Partners require signed contract</p>
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
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddSupplierOpen(true)}>
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

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">{supplier.contact}</p>
                        {supplier.dtiRegistration && (
                          <p className="text-[10px] text-success mt-0.5">✓ DTI: {supplier.dtiRegistration}</p>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setSelectedSupplier(supplier); setViewSupplierOpen(true); }}>
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="partners" className="space-y-4">
            <div className="flex justify-end">
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddPartnerOpen(true)}>
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
                    <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1" onClick={() => { setSelectedPartner(partner); setViewContractOpen(true); }}>
                      <FileText className="w-3 h-3" />
                      View Contract
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Source: Legal / Finance Department</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Supplier Dialog */}
        <Dialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Supplier</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">DTI/SEC registration is required to verify supplier legitimacy.</p>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-muted-foreground">Supplier Name *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. Paradise Hotel" value={supName} onChange={(e) => setSupName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Type *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="Hotel / Vehicle" value={supType} onChange={(e) => setSupType(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Location</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. Boracay" value={supLocation} onChange={(e) => setSupLocation(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Contact</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="+63 9XX XXX XXXX" value={supContact} onChange={(e) => setSupContact(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Total Slots/Capacity</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. 50" type="number" value={supSlots} onChange={(e) => setSupSlots(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">DTI/SEC Registration No. *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. DTI-2024-001234" value={supDti} onChange={(e) => setSupDti(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddSupplier}>
                Register Supplier
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Partner Dialog */}
        <Dialog open={addPartnerOpen} onOpenChange={setAddPartnerOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add Business Partner</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">Partnership contracts require legal review and signed agreement.</p>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-muted-foreground">Partner Name *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. JK Investments Corp" value={partName} onChange={(e) => setPartName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Investment Amount *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. ₱500,000" value={partInvestment} onChange={(e) => setPartInvestment(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Revenue Share %</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. 15%" value={partShare} onChange={(e) => setPartShare(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Contract Start *</label>
                  <Input className="mt-1 bg-secondary border-border" type="date" value={partContractStart} onChange={(e) => setPartContractStart(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Contract End *</label>
                  <Input className="mt-1 bg-secondary border-border" type="date" value={partContractEnd} onChange={(e) => setPartContractEnd(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Contract Details</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="Brief description of partnership terms" value={partDetails} onChange={(e) => setPartDetails(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddPartner}>
                Submit Partnership
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Supplier Dialog */}
        <Dialog open={viewSupplierOpen} onOpenChange={setViewSupplierOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Supplier Details</DialogTitle>
            </DialogHeader>
            {selectedSupplier && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedSupplier.type === "Hotel" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                    {selectedSupplier.type === "Hotel" ? <Building2 className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedSupplier.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedSupplier.type} • {selectedSupplier.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Availability</p>
                    <p className="text-sm font-bold text-foreground">{selectedSupplier.slots}/{selectedSupplier.maxSlots}</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Status</p>
                    <p className={`text-sm font-bold ${selectedSupplier.status === "Active" ? "text-success" : "text-muted-foreground"}`}>{selectedSupplier.status}</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Contact</p>
                    <p className="text-sm text-foreground">{selectedSupplier.contact}</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">DTI Registration</p>
                    <p className="text-sm text-success">{selectedSupplier.dtiRegistration || "Not provided"}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">Data Source: Vendor Application with DTI/SEC Registration Proof</p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Contract Dialog */}
        <Dialog open={viewContractOpen} onOpenChange={setViewContractOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Partnership Contract</DialogTitle>
            </DialogHeader>
            {selectedPartner && (
              <div className="space-y-3 mt-2">
                <div className="p-4 rounded-md bg-secondary/50 border border-border">
                  <h3 className="text-sm font-bold text-foreground mb-2">CONTRACT AGREEMENT</h3>
                  <p className="text-xs text-muted-foreground mb-3">Between TravelOps Agency and {selectedPartner.name}</p>
                  <div className="space-y-2 text-xs text-foreground">
                    <p><strong>Partner:</strong> {selectedPartner.name}</p>
                    <p><strong>Investment:</strong> {selectedPartner.investment}</p>
                    <p><strong>Revenue Share:</strong> {selectedPartner.share}</p>
                    <p><strong>Contract Period:</strong> {selectedPartner.contractStart} to {selectedPartner.contractEnd}</p>
                    <p><strong>Status:</strong> {selectedPartner.status}</p>
                    <p className="mt-3"><strong>Terms:</strong> {selectedPartner.contractDetails}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground">Source: Legal Department — Signed Partnership Agreement</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default SupplierPartnerManagement;
