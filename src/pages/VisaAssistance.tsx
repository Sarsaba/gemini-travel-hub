import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { FileCheck, AlertTriangle, CheckCircle, Clock, Upload, Eye, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  passportNumber: string;
  passportExpiry: string;
  travelDate: string;
  returnDate: string;
  documents: VisaDocument[];
  overallStatus: "Approved" | "Under Review" | "Incomplete" | "Rejected" | "Cleared";
  submittedDate: string;
  notes: string;
}

const initialApplications: VisaApplication[] = [
  {
    id: 1, customerName: "Jose Rizal Jr.", destination: "Japan", visaType: "Tourist",
    passportNumber: "P1234567A", passportExpiry: "2028-05-15", travelDate: "2026-12-01", returnDate: "2026-12-10",
    submittedDate: "2026-01-20", notes: "All documents verified. Ready for departure clearance.",
    documents: [
      { name: "Bank Statement", status: "Verified" },
      { name: "Employment Certificate", status: "Verified" },
      { name: "ITR", status: "Verified" },
      { name: "Bank Certificate", status: "Verified" },
    ],
    overallStatus: "Under Review",
  },
  {
    id: 2, customerName: "Gabriela Silang", destination: "South Korea", visaType: "Tourist",
    passportNumber: "P9876543B", passportExpiry: "2025-08-20", travelDate: "2026-11-15", returnDate: "2026-11-22",
    submittedDate: "2026-02-01", notes: "Waiting for employment certificate verification.",
    documents: [
      { name: "Bank Statement", status: "Verified" },
      { name: "Employment Certificate", status: "Pending" },
      { name: "Flight Itinerary", status: "Verified" },
      { name: "Hotel Booking", status: "Verified" },
    ],
    overallStatus: "Cleared",
  },
];

const statusStyles: Record<string, string> = {
  Approved: "bg-success/20 text-success",
  Cleared: "bg-success/20 text-success",
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
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<VisaApplication | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Create form
  const [newName, setNewName] = useState("");
  const [newDest, setNewDest] = useState("");
  const [newVisaType, setNewVisaType] = useState("Tourist");
  const [newPassport, setNewPassport] = useState("");
  const [newPassportExpiry, setNewPassportExpiry] = useState("");
  const [newTravelDate, setNewTravelDate] = useState("");
  const [newReturnDate, setNewReturnDate] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const filtered = applications.filter((a) => {
    const matchSearch = a.customerName.toLowerCase().includes(search.toLowerCase()) || a.passportNumber.toLowerCase().includes(search.toLowerCase()) || a.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All Status" || a.overallStatus === statusFilter;
    return matchSearch && matchStatus;
  });

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

  const handleClearDeparture = (appId: number) => {
    setApplications((prev) => prev.map((app) => app.id === appId ? { ...app, overallStatus: "Cleared" as const } : app));
    toast({ title: "Cleared for Departure", description: "Customer has been cleared for departure." });
  };

  const handleCreateApplication = () => {
    if (!newName.trim() || !newDest.trim() || !newPassport.trim() || !newPassportExpiry) {
      toast({ title: "Missing Fields", description: "Customer name, destination, passport number, and passport expiry are required.", variant: "destructive" });
      return;
    }
    const newApp: VisaApplication = {
      id: applications.length + 1, customerName: newName, destination: newDest, visaType: newVisaType,
      passportNumber: newPassport, passportExpiry: newPassportExpiry, travelDate: newTravelDate, returnDate: newReturnDate,
      submittedDate: new Date().toISOString().split("T")[0], notes: newNotes,
      documents: [
        { name: "Passport Copy", status: "Missing" },
        { name: "Bank Statement", status: "Missing" },
        { name: "Employment Certificate", status: "Missing" },
        { name: "Flight Itinerary", status: "Missing" },
      ],
      overallStatus: "Incomplete",
    };
    setApplications((prev) => [...prev, newApp]);
    setNewName(""); setNewDest(""); setNewVisaType("Tourist"); setNewPassport(""); setNewPassportExpiry(""); setNewTravelDate(""); setNewReturnDate(""); setNewNotes("");
    setCreateOpen(false);
    toast({ title: "Application Created", description: `Visa application for ${newName} has been created.` });
  };

  const totalApps = applications.length;
  const pendingReview = applications.filter((a) => a.overallStatus === "Under Review").length;
  const verified = applications.filter((a) => a.overallStatus === "Approved").length;
  const cleared = applications.filter((a) => a.overallStatus === "Cleared").length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Visa Assistance Module</h1>
            <p className="text-sm text-muted-foreground mt-1">Verify documents and clear customers for departure</p>
            <p className="text-[10px] text-primary mt-0.5">📌 All documents checked for legitimacy • Passport expiry must be &gt; 6 months • Data from Customer Bookings (Core 1)</p>
          </div>
          <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" /> New Visa Application
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{totalApps}</p>
            <p className="text-xs text-muted-foreground">Total Applications</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-info">{pendingReview}</p>
            <p className="text-xs text-muted-foreground">Pending Review</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-accent">{verified}</p>
            <p className="text-xs text-muted-foreground">Verified</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-2xl font-bold text-success">{cleared}</p>
            <p className="text-xs text-muted-foreground">Cleared for Departure</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input className="pl-9 bg-secondary border-border" placeholder="Search by name, passport, or destination..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>All Status</option><option>Under Review</option><option>Incomplete</option><option>Approved</option><option>Cleared</option><option>Rejected</option>
          </select>
        </div>

        <div className="space-y-4">
          {filtered.map((app) => {
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                  <div className="p-2 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Passport</p>
                    <p className="text-xs font-medium text-foreground">{app.passportNumber}</p>
                  </div>
                  <div className="p-2 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Passport Expiry</p>
                    <p className="text-xs font-medium text-foreground">{app.passportExpiry}</p>
                  </div>
                  <div className="p-2 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Travel Date</p>
                    <p className="text-xs font-medium text-foreground">{app.travelDate || "—"}</p>
                  </div>
                  <div className="p-2 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Return Date</p>
                    <p className="text-xs font-medium text-foreground">{app.returnDate || "—"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-2">Supporting Documents</p>
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
                </div>

                {app.notes && <p className="text-xs text-muted-foreground mt-3 italic">Notes: {app.notes}</p>}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1" onClick={() => { setSelectedApp(app); setReviewOpen(true); }}>
                    <Eye className="w-3 h-3" /> Review
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs border-border text-foreground gap-1" onClick={() => { setSelectedApp(app); setUploadOpen(true); }}>
                    <Upload className="w-3 h-3" /> Upload Document
                  </Button>
                  {app.overallStatus !== "Cleared" && app.documents.every((d) => d.status === "Verified") && (
                    <Button size="sm" className="gradient-primary text-primary-foreground border-0 text-xs gap-1" onClick={() => handleClearDeparture(app.id)}>
                      <CheckCircle className="w-3 h-3" /> Clear for Departure
                    </Button>
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Source: Customer Submission (Core 1) • Verified by Staff • Embassy requirements per destination</p>
              </div>
            );
          })}
        </div>

        {/* Create Application Dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">New Visa Application</DialogTitle></DialogHeader>
            <p className="text-xs text-muted-foreground">Customer data from Core 1 booking system. Documents verified by staff.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Customer Name *</label><Input className="mt-1 bg-secondary border-border" value={newName} onChange={(e) => setNewName(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Destination Country *</label><Input className="mt-1 bg-secondary border-border" placeholder="e.g. Japan" value={newDest} onChange={(e) => setNewDest(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Passport Number *</label><Input className="mt-1 bg-secondary border-border" placeholder="P1234567A" value={newPassport} onChange={(e) => setNewPassport(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Passport Expiry *</label><Input className="mt-1 bg-secondary border-border" type="date" value={newPassportExpiry} onChange={(e) => setNewPassportExpiry(e.target.value)} /></div>
              </div>
              <div><label className="text-xs text-muted-foreground">Visa Type</label>
                <select className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground" value={newVisaType} onChange={(e) => setNewVisaType(e.target.value)}>
                  <option>Tourist</option><option>Business</option><option>Student</option><option>Work</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-muted-foreground">Travel Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={newTravelDate} onChange={(e) => setNewTravelDate(e.target.value)} /></div>
                <div><label className="text-xs text-muted-foreground">Return Date</label><Input className="mt-1 bg-secondary border-border" type="date" value={newReturnDate} onChange={(e) => setNewReturnDate(e.target.value)} /></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Supporting Documents</p>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-[10px] text-muted-foreground">Passport Photo</label><Input className="mt-1 bg-secondary border-border" type="file" accept="image/*,.pdf" /></div>
                  <div><label className="text-[10px] text-muted-foreground">Bank Statement</label><Input className="mt-1 bg-secondary border-border" type="file" accept=".pdf,.jpg,.png" /></div>
                </div>
              </div>
              <div><label className="text-xs text-muted-foreground">Verification Notes</label>
                <textarea className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground min-h-[60px]" placeholder="Add notes about verification status" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleCreateApplication}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader><DialogTitle className="text-foreground">Application Review — Legitimacy Check</DialogTitle></DialogHeader>
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
            <DialogHeader><DialogTitle className="text-foreground">Upload Document</DialogTitle></DialogHeader>
            {selectedApp && (
              <div className="space-y-3 mt-2">
                <p className="text-xs text-muted-foreground">Select a missing or pending document to upload for {selectedApp.customerName}:</p>
                {selectedApp.documents.map((doc, i) => (
                  doc.status !== "Verified" && (
                    <Button key={i} variant="outline" className="w-full justify-start text-xs border-border text-foreground gap-2" onClick={() => handleUploadDoc(selectedApp.id, i)}>
                      <Upload className="w-3 h-3" /> Upload {doc.name} (currently: {doc.status})
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
