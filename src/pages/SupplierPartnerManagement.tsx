import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import { Building2, Car, FileText, Plus, Search, Users, Eye, Upload, Mail, Phone, Star } from "lucide-react";
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
  contactPerson: string;
  email: string;
  phone: string;
  rating: number;
  slots: number;
  maxSlots: number;
  status: "Active" | "Pending" | "Inactive";
  dtiRegistration: string;
  contractEnd: string;
}

interface HotelRoom {
  id: number;
  supplierId: number;
  hotelName: string;
  roomType: string;
  location: string;
  totalRooms: number;
  availableRooms: number;
  pricePerNight: number;
  status: "Available" | "Limited" | "Fully Booked";
}

interface Partner {
  id: number;
  name: string;
  companyName: string;
  partnerType: "Investor" | "Affiliate";
  email: string;
  phone: string;
  investment: string;
  profitShare: string;
  contractStart: string;
  contractEnd: string;
  status: "Active" | "Pending" | "Expired";
  contractDetails: string;
}

const initialSuppliers: Supplier[] = [
  { id: 1, name: "Paradise Resort Hotels", type: "Hotel", location: "Boracay", contactPerson: "Maria Santos", email: "maria@paradiseresort.ph", phone: "+63 912 345 6789", rating: 4.8, slots: 35, maxSlots: 50, status: "Active", dtiRegistration: "DTI-2024-001234", contractEnd: "2025-12-31" },
  { id: 2, name: "Cebu Grand Hotel", type: "Hotel", location: "Cebu", contactPerson: "John Reyes", email: "john@cebugrand.com", phone: "+63 923 456 7890", rating: 4.5, slots: 23, maxSlots: 65, status: "Active", dtiRegistration: "DTI-2023-005678", contractEnd: "2026-02-28" },
  { id: 3, name: "Manila Express Transport", type: "Vehicle", location: "Manila", contactPerson: "Carlos Mendoza", email: "carlos@manilaexpress.ph", phone: "+63 934 567 8901", rating: 0, slots: 10, maxSlots: 20, status: "Pending", dtiRegistration: "DTI-2024-009012", contractEnd: "" },
  { id: 4, name: "Palawan Adventures Transport", type: "Vehicle", location: "Palawan", contactPerson: "Ana Cruz", email: "ana@palawantransport.com", phone: "+63 945 678 9012", rating: 4.7, slots: 8, maxSlots: 15, status: "Active", dtiRegistration: "DTI-2024-003456", contractEnd: "2025-12-31" },
];

const initialRooms: HotelRoom[] = [
  { id: 1, supplierId: 1, hotelName: "Paradise Resort", roomType: "Standard", location: "Boracay", totalRooms: 50, availableRooms: 35, pricePerNight: 3500, status: "Available" },
  { id: 2, supplierId: 1, hotelName: "Paradise Resort", roomType: "Deluxe", location: "Boracay", totalRooms: 30, availableRooms: 8, pricePerNight: 5500, status: "Limited" },
  { id: 3, supplierId: 2, hotelName: "Cebu Grand", roomType: "Suite", location: "Cebu", totalRooms: 20, availableRooms: 15, pricePerNight: 8000, status: "Available" },
  { id: 4, supplierId: 2, hotelName: "Cebu Grand", roomType: "Family", location: "Cebu", totalRooms: 15, availableRooms: 0, pricePerNight: 6500, status: "Fully Booked" },
];

const initialPartners: Partner[] = [
  { id: 1, name: "Juan dela Cruz", companyName: "JDC Investments", partnerType: "Investor", email: "juan@jdcinvestments.ph", phone: "+63 917 111 2222", investment: "₱500,000", profitShare: "15%", contractStart: "2025-01-01", contractEnd: "2026-12-31", status: "Active", contractDetails: "Investment partner for Boracay and Palawan tour operations. Revenue sharing at 15% of net tour profits." },
  { id: 2, name: "Maria Clara Reyes", companyName: "Clara Travel Co.", partnerType: "Affiliate", email: "maria@claratravel.com", phone: "+63 918 222 3333", investment: "₱250,000", profitShare: "8%", contractStart: "2024-06-01", contractEnd: "2025-02-28", status: "Active", contractDetails: "Affiliate partner for local tour referrals. 8% commission on referred bookings." },
];

const SupplierPartnerManagement = () => {
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [rooms, setRooms] = useState<HotelRoom[]>(initialRooms);
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All");

  const [addSupplierOpen, setAddSupplierOpen] = useState(false);
  const [addPartnerOpen, setAddPartnerOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const [viewSupplierOpen, setViewSupplierOpen] = useState(false);
  const [viewContractOpen, setViewContractOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  // Supplier form
  const [supName, setSupName] = useState("");
  const [supType, setSupType] = useState("Hotel");
  const [supLocation, setSupLocation] = useState("");
  const [supContact, setSupContact] = useState("");
  const [supEmail, setSupEmail] = useState("");
  const [supPhone, setSupPhone] = useState("");
  const [supRating, setSupRating] = useState("");
  const [supSlots, setSupSlots] = useState("");
  const [supDti, setSupDti] = useState("");
  const [supContractEnd, setSupContractEnd] = useState("");
  const [supStatus, setSupStatus] = useState("Pending");

  // Room form
  const [roomSupplier, setRoomSupplier] = useState("");
  const [roomName, setRoomName] = useState("");
  const [roomType, setRoomType] = useState("Standard");
  const [roomLocation, setRoomLocation] = useState("");
  const [roomTotal, setRoomTotal] = useState("");
  const [roomAvail, setRoomAvail] = useState("");
  const [roomPrice, setRoomPrice] = useState("");

  // Partner form
  const [partName, setPartName] = useState("");
  const [partCompany, setPartCompany] = useState("");
  const [partType, setPartType] = useState("Investor");
  const [partEmail, setPartEmail] = useState("");
  const [partPhone, setPartPhone] = useState("");
  const [partInvestment, setPartInvestment] = useState("");
  const [partShare, setPartShare] = useState("");
  const [partContractStart, setPartContractStart] = useState("");
  const [partContractEnd, setPartContractEnd] = useState("");
  const [partDetails, setPartDetails] = useState("");

  const filteredSuppliers = suppliers.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.location.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || s.status === statusFilter;
    const matchType = typeFilter === "All" || s.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const handleAddSupplier = () => {
    if (!supName.trim() || !supDti.trim()) {
      toast({ title: "Missing Fields", description: "Name and DTI registration are required for legitimacy verification.", variant: "destructive" });
      return;
    }
    const maxSlots = parseInt(supSlots) || 10;
    const newSupplier: Supplier = {
      id: suppliers.length + 1, name: supName, type: supType as "Hotel" | "Vehicle", location: supLocation,
      contactPerson: supContact, email: supEmail, phone: supPhone, rating: parseFloat(supRating) || 0,
      slots: maxSlots, maxSlots, status: supStatus as any, dtiRegistration: supDti, contractEnd: supContractEnd,
    };
    setSuppliers((prev) => [...prev, newSupplier]);
    setSupName(""); setSupType("Hotel"); setSupLocation(""); setSupContact(""); setSupEmail(""); setSupPhone("");
    setSupRating(""); setSupSlots(""); setSupDti(""); setSupContractEnd(""); setSupStatus("Pending");
    setAddSupplierOpen(false);
    toast({ title: "Supplier Added", description: `${supName} registered with DTI: ${supDti}` });
  };

  const handleAddRoom = () => {
    if (!roomName.trim() || !roomAvail.trim()) {
      toast({ title: "Missing Fields", description: "Hotel name and available rooms are required.", variant: "destructive" });
      return;
    }
    const total = parseInt(roomTotal) || 0;
    const avail = parseInt(roomAvail) || 0;
    const newRoom: HotelRoom = {
      id: rooms.length + 1, supplierId: parseInt(roomSupplier) || 1, hotelName: roomName, roomType,
      location: roomLocation, totalRooms: total, availableRooms: avail, pricePerNight: parseFloat(roomPrice) || 0,
      status: avail === 0 ? "Fully Booked" : avail < total * 0.3 ? "Limited" : "Available",
    };
    setRooms((prev) => [...prev, newRoom]);
    setRoomSupplier(""); setRoomName(""); setRoomType("Standard"); setRoomLocation(""); setRoomTotal(""); setRoomAvail(""); setRoomPrice("");
    setAddRoomOpen(false);
    toast({ title: "Room Added", description: `${roomName} - ${roomType} room created.` });
  };

  const handleAddPartner = () => {
    if (!partName.trim() || !partInvestment.trim() || !partContractStart || !partContractEnd) {
      toast({ title: "Missing Fields", description: "Name, investment, and contract dates are required.", variant: "destructive" });
      return;
    }
    const newPartner: Partner = {
      id: partners.length + 1, name: partName, companyName: partCompany, partnerType: partType as "Investor" | "Affiliate",
      email: partEmail, phone: partPhone, investment: partInvestment, profitShare: partShare || "0%",
      contractStart: partContractStart, contractEnd: partContractEnd, status: "Pending", contractDetails: partDetails || "Pending review.",
    };
    setPartners((prev) => [...prev, newPartner]);
    setPartName(""); setPartCompany(""); setPartType("Investor"); setPartEmail(""); setPartPhone("");
    setPartInvestment(""); setPartShare(""); setPartContractStart(""); setPartContractEnd(""); setPartDetails("");
    setAddPartnerOpen(false);
    toast({ title: "Partner Added", description: `${partName} partnership pending contract approval.` });
  };

  const totalInvestment = partners.reduce((sum, p) => {
    const num = parseInt(p.investment.replace(/[^0-9]/g, "")) || 0;
    return sum + num;
  }, 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Supplier & Partner Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage suppliers, hotel availability, and business partners</p>
          <p className="text-[10px] text-primary mt-0.5">📌 Suppliers require DTI/SEC proof • Partners require signed contract • Data flows to Financial System</p>
        </div>

        <AIRecommendPanel type="supplier" />

        <Tabs defaultValue="suppliers" className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="suppliers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Building2 className="w-4 h-4 mr-2" /> Suppliers
            </TabsTrigger>
            <TabsTrigger value="hotels" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Hotel Availability
            </TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" /> Partners
            </TabsTrigger>
          </TabsList>

          {/* SUPPLIERS TAB */}
          <TabsContent value="suppliers" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 bg-secondary border-border" placeholder="Search suppliers..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>All</option><option>Hotel</option><option>Vehicle</option>
              </select>
              <select className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>All Status</option><option>Active</option><option>Pending</option><option>Inactive</option>
              </select>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddSupplierOpen(true)}>
                <Plus className="w-4 h-4" /> Add Supplier
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Supplier</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Location</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Contact Person</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Rating</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Contract Ends</th>
                    <th className="text-left py-3 px-4 text-xs text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.map((s) => (
                    <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.type === "Hotel" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                            {s.type === "Hotel" ? <Building2 className="w-4 h-4" /> : <Car className="w-4 h-4" />}
                          </div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${s.status === "Active" ? "bg-success/20 text-success" : s.status === "Pending" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.location}</td>
                      <td className="py-3 px-4 text-xs text-foreground">{s.contactPerson}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.email}</td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.phone}</td>
                      <td className="py-3 px-4">
                        {s.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-accent fill-accent" />
                            <span className="text-xs font-bold text-foreground">{s.rating} / 5.0</span>
                          </div>
                        ) : <span className="text-xs text-muted-foreground">—</span>}
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">{s.contractEnd || "—"}</td>
                      <td className="py-3 px-4">
                        <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setSelectedSupplier(s); setViewSupplierOpen(true); }}>
                          <Eye className="w-3 h-3" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-muted-foreground">Source: Vendor Applications • DTI/SEC Registration verified</p>
          </TabsContent>

          {/* HOTEL AVAILABILITY TAB */}
          <TabsContent value="hotels" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Hotel Availability</h3>
                <p className="text-xs text-muted-foreground">Track room availability and bookings</p>
              </div>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddRoomOpen(true)}>
                <Plus className="w-4 h-4" /> Add Hotel Room
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map((room) => {
                const occupancy = Math.round(((room.totalRooms - room.availableRooms) / room.totalRooms) * 100);
                return (
                  <div key={room.id} className="glass-card p-5 animate-fade-in">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{room.hotelName} - {room.roomType}</h3>
                        <p className="text-xs text-muted-foreground">{room.location}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        room.status === "Available" ? "bg-success/20 text-success" : room.status === "Limited" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                      }`}>
                        {room.status}
                      </span>
                    </div>
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Room Occupancy</p>
                      <div className="w-full bg-secondary rounded-full h-2 mb-1">
                        <div className={`h-2 rounded-full transition-all ${occupancy >= 100 ? "bg-destructive" : occupancy >= 70 ? "bg-accent" : "bg-primary"}`} style={{ width: `${occupancy}%` }} />
                      </div>
                      <p className="text-xs text-foreground font-medium">{occupancy}%</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <p className="text-[10px] text-muted-foreground">Available</p>
                        <p className="text-sm font-bold text-foreground">{room.availableRooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Total Rooms</p>
                        <p className="text-sm font-bold text-foreground">{room.totalRooms}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-muted-foreground">Price/night</p>
                        <p className="text-sm font-bold text-primary">₱{room.pricePerNight.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground">Source: Hotel Partner Systems — Room availability synced from suppliers</p>
          </TabsContent>

          {/* PARTNERS TAB */}
          <TabsContent value="partners" className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-foreground">Partner Management</h3>
                <p className="text-xs text-muted-foreground">Manage business partners and investors (Kasosyo)</p>
              </div>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddPartnerOpen(true)}>
                <Plus className="w-4 h-4" /> Add Partner
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{partners.length}</p>
                <p className="text-xs text-muted-foreground">Total Partners</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-success">{partners.filter((p) => p.status === "Active").length}</p>
                <p className="text-xs text-muted-foreground">Active Partners</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-primary">₱{totalInvestment.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Investment</p>
              </div>
            </div>

            <div className="space-y-4">
              {partners.map((partner) => (
                <div key={partner.id} className="glass-card p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                        {partner.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{partner.name}</h3>
                        <p className="text-xs text-muted-foreground">{partner.companyName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary">{partner.partnerType}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${partner.status === "Active" ? "bg-success/20 text-success" : partner.status === "Pending" ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"}`}>
                        {partner.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {partner.email}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {partner.phone}</div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Investment</p>
                      <p className="text-sm font-bold text-foreground">{partner.investment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit Share</p>
                      <p className="text-sm font-bold text-primary">{partner.profitShare}</p>
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
                      <FileText className="w-3 h-3" /> View Contract
                    </Button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">Source: Legal Department — Contract verified • Financial System — Investment tracked</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Add Supplier Dialog */}
        <Dialog open={addSupplierOpen} onOpenChange={setAddSupplierOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Supplier</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">DTI/SEC registration required for legitimacy. Data syncs with Financial System.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Supplier Name *</label><Input className="mt-1 bg-secondary border-border" value={supName} onChange={(e) => setSupName(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Type *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={supType} onChange={(e) => setSupType(e.target.value)}>
                    <option>Hotel</option><option>Vehicle</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Contact Person</label><Input className="mt-1 bg-secondary border-border" value={supContact} onChange={(e) => setSupContact(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Location</label><Input className="mt-1 bg-secondary border-border" placeholder="City/Area" value={supLocation} onChange={(e) => setSupLocation(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Email</label><Input className="mt-1 bg-secondary border-border" type="email" value={supEmail} onChange={(e) => setSupEmail(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Phone</label><Input className="mt-1 bg-secondary border-border" value={supPhone} onChange={(e) => setSupPhone(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Rating (1-5)</label><Input className="mt-1 bg-secondary border-border" type="number" min="0" max="5" step="0.1" value={supRating} onChange={(e) => setSupRating(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Status</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={supStatus} onChange={(e) => setSupStatus(e.target.value)}>
                    <option>Pending</option><option>Active</option>
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground">Total Capacity</label><Input className="mt-1 bg-secondary border-border" type="number" value={supSlots} onChange={(e) => setSupSlots(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Contract End</label><Input className="mt-1 bg-secondary border-border" type="date" value={supContractEnd} onChange={(e) => setSupContractEnd(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">DTI/SEC Reg. No. *</label><Input className="mt-1 bg-secondary border-border" placeholder="DTI-2024-XXXXXX" value={supDti} onChange={(e) => setSupDti(e.target.value)} /></div>
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddSupplier}>Register Supplier</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Hotel Room Dialog */}
        <Dialog open={addRoomOpen} onOpenChange={setAddRoomOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">Add Hotel Room</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><label className="text-xs text-muted-foreground">Supplier</label>
                <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={roomSupplier} onChange={(e) => setRoomSupplier(e.target.value)}>
                  <option value="">Select supplier</option>
                  {suppliers.filter((s) => s.type === "Hotel").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Hotel Name *</label><Input className="mt-1 bg-secondary border-border" value={roomName} onChange={(e) => setRoomName(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Room Type *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    <option>Standard</option><option>Deluxe</option><option>Suite</option><option>Family</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Location</label><Input className="mt-1 bg-secondary border-border" placeholder="City/Area" value={roomLocation} onChange={(e) => setRoomLocation(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Total Rooms</label><Input className="mt-1 bg-secondary border-border" type="number" value={roomTotal} onChange={(e) => setRoomTotal(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Available Rooms *</label><Input className="mt-1 bg-secondary border-border" type="number" value={roomAvail} onChange={(e) => setRoomAvail(e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Price/Night (₱)</label><Input className="mt-1 bg-secondary border-border" type="number" value={roomPrice} onChange={(e) => setRoomPrice(e.target.value)} /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddRoom}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Partner Dialog */}
        <Dialog open={addPartnerOpen} onOpenChange={setAddPartnerOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">Add New Partner</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Contract document required. Investment data syncs with Financial System.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Partner Name *</label><Input className="mt-1 bg-secondary border-border" value={partName} onChange={(e) => setPartName(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Company Name</label><Input className="mt-1 bg-secondary border-border" value={partCompany} onChange={(e) => setPartCompany(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Email</label><Input className="mt-1 bg-secondary border-border" type="email" value={partEmail} onChange={(e) => setPartEmail(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Phone</label><Input className="mt-1 bg-secondary border-border" value={partPhone} onChange={(e) => setPartPhone(e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Partnership Type *</label>
                <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={partType} onChange={(e) => setPartType(e.target.value)}>
                  <option>Investor</option><option>Affiliate</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Investment Amount (₱) *</label><Input className="mt-1 bg-secondary border-border" value={partInvestment} onChange={(e) => setPartInvestment(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Profit Share (%)</label><Input className="mt-1 bg-secondary border-border" value={partShare} onChange={(e) => setPartShare(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Contract Start *</label><Input className="mt-1 bg-secondary border-border" type="date" value={partContractStart} onChange={(e) => setPartContractStart(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Contract End *</label><Input className="mt-1 bg-secondary border-border" type="date" value={partContractEnd} onChange={(e) => setPartContractEnd(e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Contract Document</label><Input className="mt-1 bg-secondary border-border" type="file" accept=".pdf,.doc,.docx" /></div>
              <div><label className="text-xs text-muted-foreground">Notes</label><textarea className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground min-h-[60px]" value={partDetails} onChange={(e) => setPartDetails(e.target.value)} /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddPartner}>Create Partner</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Supplier Dialog */}
        <Dialog open={viewSupplierOpen} onOpenChange={setViewSupplierOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">Supplier Details</DialogTitle></DialogHeader>
            {selectedSupplier && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedSupplier.type === "Hotel" ? "bg-primary/20 text-primary" : "bg-accent/20 text-accent"}`}>
                    {selectedSupplier.type === "Hotel" ? <Building2 className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedSupplier.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedSupplier.type} • {selectedSupplier.location}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Contact Person</p><p className="text-sm text-foreground">{selectedSupplier.contactPerson}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Email</p><p className="text-sm text-foreground">{selectedSupplier.email}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Phone</p><p className="text-sm text-foreground">{selectedSupplier.phone}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">DTI Registration</p><p className="text-sm text-success">✓ {selectedSupplier.dtiRegistration}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Rating</p><div className="flex items-center gap-1"><Star className="w-3 h-3 text-accent fill-accent" /><span className="text-sm font-bold text-foreground">{selectedSupplier.rating} / 5.0</span></div></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Contract Ends</p><p className="text-sm text-foreground">{selectedSupplier.contractEnd || "N/A"}</p></div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* View Contract Dialog */}
        <Dialog open={viewContractOpen} onOpenChange={setViewContractOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">Partnership Contract</DialogTitle></DialogHeader>
            {selectedPartner && (
              <div className="space-y-3 mt-2">
                <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Partner</p><p className="text-sm font-bold text-foreground">{selectedPartner.name} — {selectedPartner.companyName}</p></div>
                <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Type</p><p className="text-sm text-primary">{selectedPartner.partnerType}</p></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Investment</p><p className="text-sm font-bold text-foreground">{selectedPartner.investment}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Profit Share</p><p className="text-sm font-bold text-primary">{selectedPartner.profitShare}</p></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Contract Start</p><p className="text-sm text-foreground">{selectedPartner.contractStart}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Contract End</p><p className="text-sm text-foreground">{selectedPartner.contractEnd}</p></div>
                </div>
                <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Contract Details</p><p className="text-sm text-foreground">{selectedPartner.contractDetails}</p></div>
                <p className="text-[10px] text-muted-foreground">Source: Legal Department — Contract verified • Financial System — Investment tracked</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default SupplierPartnerManagement;
