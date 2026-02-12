import AppLayout from "@/components/AppLayout";
import { FileCheck, AlertTriangle, CheckCircle, Clock, Upload, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VisaApplication {
  id: number;
  customerName: string;
  destination: string;
  visaType: string;
  passportExpiry: string;
  documents: { name: string; status: "Verified" | "Pending" | "Missing" }[];
  overallStatus: "Approved" | "Under Review" | "Incomplete" | "Rejected";
  submittedDate: string;
}

const applications: VisaApplication[] = [
  {
    id: 1, customerName: "Mark Rivera", destination: "Japan", visaType: "Tourist",
    passportExpiry: "2028-05-15", submittedDate: "2026-01-20",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Bank Statement", status: "Verified" },
      { name: "Hotel Booking", status: "Verified" },
      { name: "Flight Itinerary", status: "Verified" },
    ],
    overallStatus: "Approved",
  },
  {
    id: 2, customerName: "Lisa Cruz", destination: "South Korea", visaType: "Tourist",
    passportExpiry: "2027-11-30", submittedDate: "2026-02-01",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Bank Statement", status: "Pending" },
      { name: "Employment Certificate", status: "Missing" },
      { name: "Flight Itinerary", status: "Verified" },
    ],
    overallStatus: "Incomplete",
  },
  {
    id: 3, customerName: "David Tan", destination: "USA", visaType: "Business",
    passportExpiry: "2026-03-10", submittedDate: "2026-02-05",
    documents: [
      { name: "Passport Copy", status: "Verified" },
      { name: "Invitation Letter", status: "Pending" },
      { name: "Bank Statement", status: "Verified" },
      { name: "Travel Insurance", status: "Missing" },
    ],
    overallStatus: "Under Review",
  },
];

const statusStyles = {
  Approved: "bg-success/20 text-success",
  "Under Review": "bg-info/20 text-info",
  Incomplete: "bg-accent/20 text-accent",
  Rejected: "bg-destructive/20 text-destructive",
};

const docStatusIcon = {
  Verified: <CheckCircle className="w-3.5 h-3.5 text-success" />,
  Pending: <Clock className="w-3.5 h-3.5 text-accent" />,
  Missing: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
};

const VisaAssistance = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visa Assistance Module</h1>
          <p className="text-sm text-muted-foreground mt-1">Verify legal documents and track visa applications before departure</p>
        </div>

        <div className="space-y-4">
          {applications.map((app) => {
            const passportDate = new Date(app.passportExpiry);
            const now = new Date();
            const monthsUntilExpiry = (passportDate.getFullYear() - now.getFullYear()) * 12 + (passportDate.getMonth() - now.getMonth());
            const passportWarning = monthsUntilExpiry < 6;

            return (
              <div key={app.id} className="glass-card p-5 animate-fade-in">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{app.customerName}</h3>
                    <p className="text-xs text-muted-foreground">{app.destination} • {app.visaType} Visa • Submitted {app.submittedDate}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[app.overallStatus]}`}>
                    {app.overallStatus}
                  </span>
                </div>

                {passportWarning && (
                  <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20 mb-4">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <p className="text-xs text-destructive">Passport expires on {app.passportExpiry} — less than 6 months remaining!</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {app.documents.map((doc, i) => (
                    <div key={i} className="p-3 rounded-md bg-secondary/50 flex items-center gap-2">
                      {docStatusIcon[doc.status]}
                      <div>
                        <p className="text-xs font-medium text-foreground">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">{doc.status}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1">
                    <Eye className="w-3 h-3" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1">
                    <Upload className="w-3 h-3" />
                    Upload Document
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default VisaAssistance;
