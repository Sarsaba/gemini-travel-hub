import AppLayout from "@/components/AppLayout";
import { Bus, AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Vehicle {
  id: number;
  name: string;
  type: string;
  capacity: number;
  booked: number;
  location: string;
  status: "Available" | "Full" | "Maintenance";
  supplier: string;
}

const vehicles: Vehicle[] = [
  { id: 1, name: "Tourist Bus A", type: "Bus", capacity: 40, booked: 32, location: "Boracay Route", status: "Available", supplier: "Metro Bus Services" },
  { id: 2, name: "Tourist Bus B", type: "Bus", capacity: 40, booked: 40, location: "Palawan Route", status: "Full", supplier: "Metro Bus Services" },
  { id: 3, name: "Van #1", type: "Van", capacity: 12, booked: 8, location: "Cebu City Tour", status: "Available", supplier: "Island Van Rentals" },
  { id: 4, name: "Van #2", type: "Van", capacity: 12, booked: 12, location: "Cebu Island Hop", status: "Full", supplier: "Island Van Rentals" },
  { id: 5, name: "Van #3", type: "Van", capacity: 12, booked: 0, location: "Unassigned", status: "Maintenance", supplier: "Island Van Rentals" },
  { id: 6, name: "Coaster #1", type: "Coaster", capacity: 25, booked: 18, location: "Manila Day Tour", status: "Available", supplier: "Pacific Transport" },
];

const statusConfig = {
  Available: { icon: CheckCircle, color: "text-success", bg: "bg-success/20" },
  Full: { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/20" },
  Maintenance: { icon: Clock, color: "text-accent", bg: "bg-accent/20" },
};

const VehicleAvailability = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Vehicle Availability</h1>
          <p className="text-sm text-muted-foreground mt-1">Track vehicle capacity and slot limits in real-time</p>
        </div>

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

        <div className="space-y-3">
          {vehicles.map((vehicle) => {
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
                      <p className="text-xs text-muted-foreground">{vehicle.type} • {vehicle.supplier}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`w-4 h-4 ${statusConfig[vehicle.status].color}`} />
                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[vehicle.status].bg} ${statusConfig[vehicle.status].color}`}>
                      {vehicle.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{vehicle.location}</span>
                      <span className="text-foreground">{vehicle.booked}/{vehicle.capacity} seats booked</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all ${pct >= 100 ? "bg-destructive" : pct >= 75 ? "bg-accent" : "bg-primary"}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className={`text-lg font-bold ${remaining === 0 ? "text-destructive" : "text-success"}`}>{remaining}</p>
                    <p className="text-[10px] text-muted-foreground">slots left</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default VehicleAvailability;
