import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { FileCheck, AlertTriangle, CheckCircle, Clock, Upload, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface VisaDocument {
  name: string;
  status: "Verified" | "Pending" | "Missing";
}

interface VisaApplication {
  id: number;
  customerName: string;
  destination: string;
  visaType: string;
  passportExpiry: string;
  documents: VisaDocument[];
  overallStatus: "Approved" | "Under Review" | "Incomplete" | "Rejected";
  submittedDate: string;
}

const initialApplications: VisaApplication[] = [
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

const statusStyles: Record<string, string> = {
  Approved: "bg-success/20 text-success",
  "Under Review": "bg-info/20 text-info",
  Incomplete: "bg-accent/20 text-accent",
  Rejected: "bg-destructive/20 text-destructive",
};

const docStatusIcon: Record<string, React.ReactNode> = {
  Verified: <CheckCircle className="w-3.5 h-3.5 text-success" />,
  Pending: <Clock className="w-3.5 h-3.5 text-accent" />,
  Missing: <AlertTriangle className="w-3.5 h-3.5 text-destructive" />,
};

const VisaAssistance = () => {
  const [applications, setApplications] = useState<VisaApplication[]>(initialApplications);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

  const handleReview = (app: VisaApplication) => {
    setSelectedApp(app);
    setReviewOpen(true);
  };

  const handleUploadClick = (app: VisaApplication) => {
    setSelectedApp(app);
    setUploadOpen(true);
  };

  const handleVerifyDoc = (appId: number, docIndex: number) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newDocs = [...app.documents];
        newDocs[docIndex] = { ...newDocs[docIndex], status: "Verified" };
        const allVerified = newDocs.every((d) => d.status === "Verified");
        return { ...app, documents: newDocs, overallStatus: allVerified ? "Approved" : app.overallStatus };
      })
    );
    toast({ title: "Document Verified", description: "Document status updated to Verified." });
  };

  const handleUploadDoc = (appId: number, docIndex: number) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newDocs = [...app.documents];
        newDocs[docIndex] = { ...newDocs[docIndex], status: "Pending" };
        return { ...app, documents: newDocs, overallStatus: "Under Review" };
      })
    );
    setUploadOpen(false);
    toast({ title: "Document Uploaded", description: "Document submitted for staff review and legitimacy check." });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visa Assistance Module</h1>
          <p className="text-sm text-muted-foreground mt-1">Verify legal documents and track visa applications before departure</p>
          <p className="text-[10px] text-primary mt-0.5">📌 All documents are checked for legitimacy • Passport expiry must be &gt; 6 months before travel</p>
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
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1" onClick={() => handleReview(app)}>
                    <Eye className="w-3 h-3" />
                    Review
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1" onClick={() => handleUploadClick(app)}>
                    <Upload className="w-3 h-3" />
                    Upload Document
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Source: Customer Submission • Verified by Staff</p>
              </div>
            );
          })}
        </div>

        {/* Review Dialog */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Application Review — Legitimacy Check</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-4 mt-2">
                <div className="p-3 rounded-md bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-bold text-foreground">{selectedApp.customerName}</p>
                  <p className="text-xs text-muted-foreground mt-1">{selectedApp.destination} • {selectedApp.visaType} Visa</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Document Verification</p>
                  <div className="space-y-2">
                    {selectedApp.documents.map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-md bg-secondary/30">
                        <div className="flex items-center gap-2">
                          {docStatusIcon[doc.status]}
                          <div>
                            <p className="text-xs font-medium text-foreground">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">{doc.status}</p>
                          </div>
                        </div>
                        {doc.status !== "Verified" && (
                          <Button size="sm" variant="outline" className="text-[10px] h-7 border-border text-foreground" onClick={() => handleVerifyDoc(selectedApp.id, i)}>
                            Mark Verified
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                  <p className="text-xs text-primary font-medium">Legitimacy Check Criteria:</p>
                  <ul className="text-xs text-foreground mt-1 space-y-1">
                    <li>• Passport must be valid for at least 6 months from travel date</li>
                    <li>• Bank statement must show sufficient funds for the trip</li>
                    <li>• All supporting documents must be original or certified true copies</li>
                    <li>• Employment certificate must be recent (within 3 months)</li>
                  </ul>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Upload Dialog */}
        <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Upload Document</DialogTitle>
            </DialogHeader>
            {selectedApp && (
              <div className="space-y-3 mt-2">
                <p className="text-xs text-muted-foreground">Select a missing or pending document to upload for {selectedApp.customerName}:</p>
                {selectedApp.documents.map((doc, i) => (
                  doc.status !== "Verified" && (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full justify-start text-xs border-border text-foreground gap-2"
                      onClick={() => handleUploadDoc(selectedApp.id, i)}
                    >
                      <Upload className="w-3 h-3" />
                      Upload {doc.name} (currently: {doc.status})
                    </Button>
                  )
                ))}
                <p className="text-[10px] text-muted-foreground">Documents will be reviewed by staff for legitimacy before approval.</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default VisaAssistance;
