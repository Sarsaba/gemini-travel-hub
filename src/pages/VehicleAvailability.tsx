import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Bus, AlertCircle, CheckCircle, Clock, Plus, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  plateNumber: string;
  capacity: number;
  booked: number;
  location: string;
  status: "Available" | "Full" | "Maintenance";
  supplier: string;
  pricePerDay: number;
}

const initialVehicles: Vehicle[] = [
  { id: 1, name: "Toyota Hiace Grandia", type: "Van", plateNumber: "ABC 1234", capacity: 12, booked: 4, location: "Boracay", status: "Available", supplier: "Palawan Adventures Transport", pricePerDay: 4500 },
  { id: 2, name: "Hino Tour Bus", type: "Bus", plateNumber: "DEF 5678", capacity: 40, booked: 28, location: "Manila", status: "Available", supplier: "Manila Express Transport", pricePerDay: 15000 },
  { id: 3, name: "Toyota Coaster", type: "Coaster", plateNumber: "GHI 9012", capacity: 25, booked: 5, location: "Cebu", status: "Available", supplier: "Palawan Adventures Transport", pricePerDay: 8000 },
  { id: 4, name: "Toyota Fortuner", type: "SUV", plateNumber: "JKL 3456", capacity: 7, booked: 7, location: "Palawan", status: "Full", supplier: "Palawan Adventures Transport", pricePerDay: 3500 },
];

const statusConfig = {
  Available: { icon: CheckCircle, color: "text-success", bg: "bg-success/20" },
  Full: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/20" },
  Maintenance: { icon: Clock, color: "text-accent", bg: "bg-accent/20" },
};

const VehicleAvailability = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [addOpen, setAddOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Form
  const [vName, setVName] = useState("");
  const [vType, setVType] = useState("Van");
  const [vPlate, setVPlate] = useState("");
  const [vCapacity, setVCapacity] = useState("");
  const [vAvail, setVAvail] = useState("");
  const [vLocation, setVLocation] = useState("");
  const [vSupplier, setVSupplier] = useState("");
  const [vPrice, setVPrice] = useState("");
  const [vStatus, setVStatus] = useState("Available");

  const filtered = vehicles.filter((v) => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) || v.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || v.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const limitedCount = vehicles.filter((v) => {
    const remaining = v.capacity - v.booked;
    return remaining > 0 && remaining <= v.capacity * 0.3;
  }).length;

  const handleAdd = () => {
    if (!vName.trim() || !vCapacity) {
      toast({ title: "Missing Fields", description: "Vehicle name and capacity are required.", variant: "destructive" });
      return;
    }
    const cap = parseInt(vCapacity) || 0;
    const avail = parseInt(vAvail) || cap;
    const newVehicle: Vehicle = {
      id: vehicles.length + 1, name: vName, type: vType, plateNumber: vPlate,
      capacity: cap, booked: cap - avail, location: vLocation, status: vStatus as any,
      supplier: vSupplier, pricePerDay: parseFloat(vPrice) || 0,
    };
    setVehicles((prev) => [...prev, newVehicle]);
    setVName(""); setVType("Van"); setVPlate(""); setVCapacity(""); setVAvail(""); setVLocation(""); setVSupplier(""); setVPrice(""); setVStatus("Available");
    setAddOpen(false);
    toast({ title: "Vehicle Added", description: `${vName} has been registered.` });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Vehicle Availability</h1>
            <p className="text-sm text-muted-foreground mt-1">Track vehicle slots and capacity limits</p>
            <p className="text-[10px] text-primary mt-0.5">📌 Vehicle data from Supplier Portal • Booking data from Core 1</p>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddOpen(true)}>
            <Plus className="w-4 h-4" /> Add Vehicle
          </Button>
        </div>

        {limitedCount > 0 && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-accent" />
            <p className="text-xs text-foreground">{limitedCount} vehicle(s) have limited slots remaining. Consider managing bookings to avoid overbooking.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{vehicles.filter((v) => v.status === "Available").length}</p>
            <p className="text-xs text-muted-foreground">Available</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{vehicles.filter((v) => v.status === "Full").length}</p>
            <p className="text-xs text-muted-foreground">Fully Booked</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{vehicles.filter((v) => v.status === "Maintenance").length}</p>
            <p className="text-xs text-muted-foreground">Under Maintenance</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 bg-secondary border-border" placeholder="Search vehicles..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option><option>Available</option><option>Full</option><option>Maintenance</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((vehicle) => {
            const StatusIcon = statusConfig[vehicle.status].icon;
            const pct = (vehicle.booked / vehicle.capacity) * 100;
            const remaining = vehicle.capacity - vehicle.booked;

            return (
              <div key={vehicle.id} className="glass-card p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <Bus className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{vehicle.name}</h3>
                      <p className="text-xs text-muted-foreground">{vehicle.type} • {vehicle.plateNumber} • {vehicle.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusConfig[vehicle.status].color}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[vehicle.status].bg} ${statusConfig[vehicle.status].color}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Seat Occupancy</p>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{vehicle.location}</span>
                    <span className="text-foreground">{vehicle.booked}/{vehicle.capacity} seats booked</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2.5">
                    <div className={`h-2.5 rounded-full transition-all ${pct >= 100 ? "bg-destructive" : pct >= 75 ? "bg-accent" : "bg-primary"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className={`text-lg font-bold ${remaining === 0 ? "text-destructive" : "text-success"}`}>{remaining}</p>
                      <p className="text-[10px] text-muted-foreground">slots left</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">₱{vehicle.pricePerDay.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">per day</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setSelectedVehicle(vehicle); setViewOpen(true); }}>
                    <Eye className="w-3 h-3" /> View
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Source: Vendor Portal — {vehicle.supplier}</p>
              </div>
            );
          })}
        </div>

        {/* Add Vehicle Dialog */}
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">Add New Vehicle</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Vehicle will be linked to supplier from Vendor Portal.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Supplier</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={vSupplier} onChange={(e) => setVSupplier(e.target.value)}>
                    <option value="">Select supplier</option>
                    <option>Manila Express Transport</option>
                    <option>Palawan Adventures Transport</option>
                  </select>
                </div>
                <div><label className="text-xs text-muted-foreground">Vehicle Type *</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={vType} onChange={(e) => setVType(e.target.value)}>
                    <option>Van</option><option>Bus</option><option>Coaster</option><option>SUV</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Vehicle Name *</label><Input className="mt-1 bg-secondary border-border" value={vName} onChange={(e) => setVName(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Plate Number</label><Input className="mt-1 bg-secondary border-border" value={vPlate} onChange={(e) => setVPlate(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="text-xs text-muted-foreground">Total Capacity (Seats) *</label><Input className="mt-1 bg-secondary border-border" type="number" value={vCapacity} onChange={(e) => setVCapacity(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Available Slots *</label><Input className="mt-1 bg-secondary border-border" type="number" value={vAvail} onChange={(e) => setVAvail(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Price/Day (₱)</label><Input className="mt-1 bg-secondary border-border" type="number" value={vPrice} onChange={(e) => setVPrice(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Location</label><Input className="mt-1 bg-secondary border-border" placeholder="City/Area" value={vLocation} onChange={(e) => setVLocation(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Status</label>
                  <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={vStatus} onChange={(e) => setVStatus(e.target.value)}>
                    <option>Available</option><option>Full</option><option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground">Date</label><Input className="mt-1 bg-secondary border-border" type="date" /></div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAdd}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Vehicle Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader><DialogTitle className="text-foreground">Vehicle Details</DialogTitle></DialogHeader>
            {selectedVehicle && (
              <div className="space-y-3 mt-2">
                <div className="flex items-center gap-3">
                  <Bus className="w-8 h-8 text-primary" />
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedVehicle.name}</h3>
                    <p className="text-xs text-muted-foreground">{selectedVehicle.type} • {selectedVehicle.plateNumber}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Supplier</p><p className="text-sm text-foreground">{selectedVehicle.supplier}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Location</p><p className="text-sm text-foreground">{selectedVehicle.location}</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Capacity</p><p className="text-sm font-bold text-foreground">{selectedVehicle.capacity} seats</p></div>
                  <div className="p-3 rounded-md bg-secondary/50"><p className="text-[10px] text-muted-foreground">Price/Day</p><p className="text-sm font-bold text-primary">₱{selectedVehicle.pricePerDay.toLocaleString()}</p></div>
                </div>
                <p className="text-[10px] text-muted-foreground">Source: Vendor Portal — Supplier fleet data</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default VehicleAvailability;
