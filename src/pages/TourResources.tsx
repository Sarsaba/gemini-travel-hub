import AppLayout from "@/components/AppLayout";
import { CalendarCheck, Users, Bus, AlertCircle, CheckCircle } from "lucide-react";

interface TourResource {
  id: number;
  tourName: string;
  destination: string;
  date: string;
  maxSlots: number;
  booked: number;
  vehicle: string;
  vehicleCapacity: number;
  guide: string;
  status: "Open" | "Almost Full" | "Full" | "Cancelled";
}

const tours: TourResource[] = [
  { id: 1, tourName: "Boracay Beach Getaway", destination: "Boracay", date: "2026-03-15", maxSlots: 40, booked: 32, vehicle: "Tourist Bus A", vehicleCapacity: 40, guide: "Juan Dela Cruz", status: "Almost Full" },
  { id: 2, tourName: "Palawan Island Hopping", destination: "Palawan", date: "2026-03-20", maxSlots: 25, booked: 25, vehicle: "Coaster #1", vehicleCapacity: 25, guide: "Maria Santos", status: "Full" },
  { id: 3, tourName: "Cebu Heritage Walk", destination: "Cebu", date: "2026-03-22", maxSlots: 12, booked: 5, vehicle: "Van #1", vehicleCapacity: 12, guide: "Carlos Garcia", status: "Open" },
  { id: 4, tourName: "Manila Food Tour", destination: "Manila", date: "2026-03-25", maxSlots: 15, booked: 0, vehicle: "Van #3", vehicleCapacity: 15, guide: "TBA", status: "Cancelled" },
];

const statusStyles = {
  Open: { color: "text-success", bg: "bg-success/20" },
  "Almost Full": { color: "text-accent", bg: "bg-accent/20" },
  Full: { color: "text-destructive", bg: "bg-destructive/20" },
  Cancelled: { color: "text-muted-foreground", bg: "bg-muted" },
};

const TourResources = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tour Availability & Resource Planning</h1>
          <p className="text-sm text-muted-foreground mt-1">Monitor tour capacity and resource allocation — no overbooking</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{tours.length}</p>
            <p className="text-xs text-muted-foreground">Total Tours</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{tours.filter((t) => t.status === "Open").length}</p>
            <p className="text-xs text-muted-foreground">Open</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{tours.filter((t) => t.status === "Almost Full").length}</p>
            <p className="text-xs text-muted-foreground">Almost Full</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{tours.filter((t) => t.status === "Full" || t.status === "Cancelled").length}</p>
            <p className="text-xs text-muted-foreground">Full / Cancelled</p>
          </div>
        </div>

        <div className="space-y-4">
          {tours.map((tour) => {
            const pct = (tour.booked / tour.maxSlots) * 100;
            const remaining = tour.maxSlots - tour.booked;

            return (
              <div key={tour.id} className={`glass-card p-5 animate-fade-in ${tour.status === "Cancelled" ? "opacity-60" : ""}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{tour.tourName}</h3>
                    <p className="text-xs text-muted-foreground">{tour.destination} • {tour.date}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[tour.status].bg} ${statusStyles[tour.status].color}`}>
                    {tour.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Bookings</span>
                    <span className="text-foreground">{tour.booked}/{tour.maxSlots} slots • {remaining} remaining</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-destructive" : pct >= 80 ? "bg-accent" : "bg-primary"}`}
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Bus className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vehicle</p>
                      <p className="text-xs font-medium text-foreground">{tour.vehicle} ({tour.vehicleCapacity} seats)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Guide</p>
                      <p className="text-xs font-medium text-foreground">{tour.guide}</p>
                    </div>
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

export default TourResources;
