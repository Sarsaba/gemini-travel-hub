import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import { Star, Clock, MapPin, UserPlus, Search, Eye, Mail, Phone, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface Agent {
  id: number;
  name: string;
  role: string;
  rating: number;
  experience: string;
  toursCompleted: number;
  status: "Active" | "Pending" | "On Leave";
  specialization: string;
  hireDate: string;
  hrSource: string;
  email: string;
  phone: string;
}

interface StaffRequest {
  id: number;
  applicantName: string;
  roleApplied: string;
  coverLetter: string;
  portfolioUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedDate: string;
}

const initialAgents: Agent[] = [
  { id: 1, name: "Russel Santillan", role: "Travel Agent", rating: 4.8, experience: "3 years", toursCompleted: 40, status: "Active", specialization: "Beach Destinations", hireDate: "2023-06-15", hrSource: "HR4 System — Direct Hire", email: "russel.santillan@travelntours.ph", phone: "+63 917 123 4567" },
  { id: 2, name: "Michelle Garcia", role: "Travel Agent", rating: 4.9, experience: "5 years", toursCompleted: 85, status: "Active", specialization: "International Tours", hireDate: "2021-03-10", hrSource: "HR4 System — Referral", email: "michelle.garcia@travelntours.ph", phone: "+63 918 234 5678" },
  { id: 3, name: "Roberto Villanueva", role: "Tour Guide", rating: 4.7, experience: "7 years", toursCompleted: 120, status: "Active", specialization: "Historical Tours", hireDate: "2019-01-20", hrSource: "HR4 System — Direct Hire", email: "roberto.v@travelntours.ph", phone: "+63 919 345 6789" },
  { id: 4, name: "Patricia Lim", role: "Staff", rating: 4.5, experience: "2 years", toursCompleted: 0, status: "Active", specialization: "Operations Support", hireDate: "2024-04-01", hrSource: "HR4 System — Internal Transfer", email: "patricia.lim@travelntours.ph", phone: "+63 920 456 7890" },
];

const AgentStaffManagement = () => {
  const [search, setSearch] = useState("");
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [requests, setRequests] = useState<StaffRequest[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [requestOpen, setRequestOpen] = useState(false);
  const [addAgentOpen, setAddAgentOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All Roles");

  // Request form
  const [reqName, setReqName] = useState("");
  const [reqRole, setReqRole] = useState("");
  const [reqCoverLetter, setReqCoverLetter] = useState("");
  const [reqPortfolio, setReqPortfolio] = useState("");

  // Add Agent form
  const [agName, setAgName] = useState("");
  const [agRole, setAgRole] = useState("");
  const [agEmail, setAgEmail] = useState("");
  const [agPhone, setAgPhone] = useState("");
  const [agSpec, setAgSpec] = useState("");
  const [agRating, setAgRating] = useState("");
  const [agExperience, setAgExperience] = useState("");

  const filtered = agents.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All Roles" || a.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSubmitRequest = () => {
    if (!reqName.trim() || !reqRole.trim()) {
      toast({ title: "Missing Fields", description: "Applicant name and role are required.", variant: "destructive" });
      return;
    }
    const newReq: StaffRequest = {
      id: requests.length + 1,
      applicantName: reqName,
      roleApplied: reqRole,
      coverLetter: reqCoverLetter,
      portfolioUrl: reqPortfolio,
      status: "Pending",
      submittedDate: new Date().toISOString().split("T")[0],
    };
    setRequests((prev) => [...prev, newReq]);
    setReqName(""); setReqRole(""); setReqCoverLetter(""); setReqPortfolio("");
    setRequestOpen(false);
    toast({ title: "Request Submitted", description: `Request for ${reqName} sent to HR4 System for approval.` });
  };

  const handleAddAgent = () => {
    if (!agName.trim() || !agRole.trim() || !agEmail.trim()) {
      toast({ title: "Missing Fields", description: "Name, role, and email are required.", variant: "destructive" });
      return;
    }
    const newAgent: Agent = {
      id: agents.length + 1,
      name: agName,
      role: agRole,
      rating: parseFloat(agRating) || 0,
      experience: agExperience || "New",
      toursCompleted: 0,
      status: "Active",
      specialization: agSpec || "General",
      hireDate: new Date().toISOString().split("T")[0],
      hrSource: "HR4 System — Direct Entry",
      email: agEmail,
      phone: agPhone,
    };
    setAgents((prev) => [...prev, newAgent]);
    setAgName(""); setAgRole(""); setAgEmail(""); setAgPhone(""); setAgSpec(""); setAgRating(""); setAgExperience("");
    setAddAgentOpen(false);
    toast({ title: "Agent Created", description: `${agName} has been added to the system.` });
  };

  const handleApproveRequest = (reqId: number) => {
    setRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, status: "Approved" as const } : r));
    toast({ title: "Request Approved", description: "Staff request has been approved by HR4." });
  };

  const handleRejectRequest = (reqId: number) => {
    setRequests((prev) => prev.map((r) => r.id === reqId ? { ...r, status: "Rejected" as const } : r));
    toast({ title: "Request Rejected", description: "Staff request has been rejected." });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Travel Agent & Staff Management</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage agents, staff, and recruitment requests</p>
            <p className="text-[10px] text-primary mt-0.5">📌 Integrated with HR4 System • Agent data sourced from HR records • Requests require HR4 approval</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border text-foreground gap-2" onClick={() => setRequestOpen(true)}>
              <FileText className="w-4 h-4" />
              Submit Request
            </Button>
            <Button className="gradient-primary text-primary-foreground border-0 gap-2" onClick={() => setAddAgentOpen(true)}>
              <Plus className="w-4 h-4" />
              Add Agent
            </Button>
          </div>
        </div>

        <AIRecommendPanel type="agent" />

        <Tabs defaultValue="agents" className="space-y-4">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="agents" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Agents & Staff ({agents.length})
            </TabsTrigger>
            <TabsTrigger value="requests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Requests ({requests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents" className="space-y-4">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input className="pl-9 bg-secondary border-border" placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select
                className="px-3 py-2 rounded-md bg-secondary border border-border text-sm text-foreground"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option>All Roles</option>
                <option>Travel Agent</option>
                <option>Tour Guide</option>
                <option>Staff</option>
              </select>
            </div>

            <div className="space-y-3">
              {filtered.map((agent) => (
                <div key={agent.id} className="glass-card p-5 animate-fade-in hover:border-primary/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                        <p className="text-xs text-muted-foreground">{agent.role}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        agent.status === "Active" ? "bg-success/20 text-success" : agent.status === "Pending" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                      }`}>
                        {agent.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        <span className="text-sm font-bold text-foreground">{agent.rating}</span>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-foreground">{agent.experience}</span>
                        <p className="text-[10px] text-muted-foreground">Experience</p>
                      </div>
                      <div className="text-center">
                        <span className="text-sm font-bold text-foreground">{agent.toursCompleted}</span>
                        <p className="text-[10px] text-muted-foreground">Tours</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => { setSelectedAgent(agent); setViewOpen(true); }}>
                        <Eye className="w-3 h-3" /> View
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {agent.email}</div>
                    <div className="flex items-center gap-1"><Phone className="w-3 h-3" /> {agent.phone}</div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Source: {agent.hrSource}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            {requests.length === 0 ? (
              <div className="glass-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No requests yet. Click "Submit Request" to request new staff from HR4.</p>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="glass-card p-5 animate-fade-in">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{req.applicantName}</h3>
                      <p className="text-xs text-muted-foreground">{req.roleApplied} • Submitted {req.submittedDate}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      req.status === "Approved" ? "bg-success/20 text-success" : req.status === "Rejected" ? "bg-destructive/20 text-destructive" : "bg-accent/20 text-accent"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                  {req.coverLetter && <p className="text-xs text-muted-foreground mb-2">"{req.coverLetter}"</p>}
                  {req.portfolioUrl && <p className="text-xs text-primary mb-2">Portfolio: {req.portfolioUrl}</p>}
                  {req.status === "Pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="gradient-primary text-primary-foreground border-0 text-xs" onClick={() => handleApproveRequest(req.id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="border-border text-foreground text-xs" onClick={() => handleRejectRequest(req.id)}>Reject</Button>
                    </div>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-2">Process: Core 2 → HR4 System for approval → Administrative for compliance</p>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>

        {/* Submit Request Dialog */}
        <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Submit Agent/Staff Request</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">This request will be submitted to <span className="text-primary font-medium">HR4 System</span> for review and approval.</p>
            <div className="space-y-3 mt-2">
              <div>
                <label className="text-xs text-muted-foreground">Applicant Name *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="Full name" value={reqName} onChange={(e) => setReqName(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Role Applied For *</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="Travel Agent / Tour Guide / Staff" value={reqRole} onChange={(e) => setReqRole(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Cover Letter</label>
                <textarea className="mt-1 w-full rounded-md bg-secondary border border-border p-2 text-sm text-foreground min-h-[80px]" placeholder="Tell us about yourself..." value={reqCoverLetter} onChange={(e) => setReqCoverLetter(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Profile Photo</label>
                  <Input className="mt-1 bg-secondary border-border" type="file" accept="image/*" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Resume</label>
                  <Input className="mt-1 bg-secondary border-border" type="file" accept=".pdf,.doc,.docx" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Portfolio URL</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="https://..." value={reqPortfolio} onChange={(e) => setReqPortfolio(e.target.value)} />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleSubmitRequest}>
                Submit Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Agent Dialog */}
        <Dialog open={addAgentOpen} onOpenChange={setAddAgentOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Agent/Staff</DialogTitle>
            </DialogHeader>
            <p className="text-xs text-muted-foreground">Direct entry — data will sync with <span className="text-primary font-medium">HR4 System</span>.</p>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Full Name *</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="Full name" value={agName} onChange={(e) => setAgName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Role *</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="Travel Agent / Tour Guide / Staff" value={agRole} onChange={(e) => setAgRole(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Email *</label>
                  <Input className="mt-1 bg-secondary border-border" type="email" placeholder="email@company.ph" value={agEmail} onChange={(e) => setAgEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="+63 9XX XXX XXXX" value={agPhone} onChange={(e) => setAgPhone(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Specialization</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="e.g. Beach Destinations" value={agSpec} onChange={(e) => setAgSpec(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Rating (1-5)</label>
                  <Input className="mt-1 bg-secondary border-border" type="number" min="0" max="5" step="0.1" placeholder="0" value={agRating} onChange={(e) => setAgRating(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Years of Experience</label>
                <Input className="mt-1 bg-secondary border-border" placeholder="e.g. 3 years" value={agExperience} onChange={(e) => setAgExperience(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Hire Date</label>
                <Input className="mt-1 bg-secondary border-border" type="date" />
              </div>
              <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleAddAgent}>
                Create Agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Agent Dialog */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="bg-card border-border max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground">Agent Profile</DialogTitle>
            </DialogHeader>
            {selectedAgent && (
              <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
                    {selectedAgent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{selectedAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAgent.role}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedAgent.status === "Active" ? "bg-success/20 text-success" : selectedAgent.status === "Pending" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                    }`}>
                      {selectedAgent.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Star Rating</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-lg font-bold text-foreground">{selectedAgent.rating}</span>
                      <span className="text-xs text-muted-foreground">/ 5.0</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: Customer Surveys</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Experience</p>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedAgent.experience}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: HR4 Records</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Tours Completed</p>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedAgent.toursCompleted}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: Core 1 — Tour Records</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Specialization</p>
                    <p className="text-sm font-bold text-primary mt-1">{selectedAgent.specialization}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: HR4 Assignment</p>
                  </div>
                </div>

                <div className="p-3 rounded-md bg-secondary/50">
                  <p className="text-[10px] text-muted-foreground">Contact Information</p>
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1 text-xs text-foreground"><Mail className="w-3 h-3" /> {selectedAgent.email}</div>
                    <div className="flex items-center gap-1 text-xs text-foreground"><Phone className="w-3 h-3" /> {selectedAgent.phone}</div>
                  </div>
                </div>
                <div className="p-3 rounded-md bg-secondary/50">
                  <p className="text-[10px] text-muted-foreground">Hire Date</p>
                  <p className="text-sm text-foreground">{selectedAgent.hireDate}</p>
                </div>
                <div className="p-3 rounded-md bg-secondary/50">
                  <p className="text-[10px] text-muted-foreground">HR Source</p>
                  <p className="text-sm text-foreground">{selectedAgent.hrSource}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
};

export default AgentStaffManagement;
