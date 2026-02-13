import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import AIRecommendPanel from "@/components/AIRecommendPanel";
import { Star, Clock, MapPin, UserPlus, Search, Eye, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
}

const initialAgents: Agent[] = [
  { id: 1, name: "Russel Santillan", role: "Travel Agent", rating: 4.8, experience: "3 years", toursCompleted: 40, status: "Active", specialization: "Beach Destinations", hireDate: "2023-06-15", hrSource: "HR Department — Direct Hire" },
  { id: 2, name: "Maria Santos", role: "Travel Agent", rating: 4.5, experience: "5 years", toursCompleted: 78, status: "Active", specialization: "International Tours", hireDate: "2021-03-10", hrSource: "HR Department — Referral" },
  { id: 3, name: "Juan Dela Cruz", role: "Tour Guide", rating: 4.9, experience: "7 years", toursCompleted: 120, status: "Active", specialization: "Historical Tours", hireDate: "2019-01-20", hrSource: "HR Department — Direct Hire" },
  { id: 4, name: "Ana Reyes", role: "Travel Agent", rating: 4.2, experience: "1 year", toursCompleted: 12, status: "Pending", specialization: "Budget Travel", hireDate: "2025-11-05", hrSource: "HR Department — Job Fair Recruit" },
  { id: 5, name: "Carlos Garcia", role: "Staff", rating: 4.6, experience: "4 years", toursCompleted: 55, status: "On Leave", specialization: "Adventure Tours", hireDate: "2022-08-01", hrSource: "HR Department — Internal Transfer" },
];

const AgentStaffManagement = () => {
  const [search, setSearch] = useState("");
  const [requestOpen, setRequestOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  // Request form state
  const [reqName, setReqName] = useState("");
  const [reqRole, setReqRole] = useState("");
  const [reqSpec, setReqSpec] = useState("");
  const [reqReason, setReqReason] = useState("");

  const filtered = agents.filter(
    (a) => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmitRequest = () => {
    if (!reqName.trim() || !reqRole.trim()) {
      toast({ title: "Missing Fields", description: "Please fill in at least the name and role.", variant: "destructive" });
      return;
    }
    const newAgent: Agent = {
      id: agents.length + 1,
      name: reqName,
      role: reqRole,
      rating: 0,
      experience: "New",
      toursCompleted: 0,
      status: "Pending",
      specialization: reqSpec || "General",
      hireDate: new Date().toISOString().split("T")[0],
      hrSource: "HR Department — Pending Request",
    };
    setAgents((prev) => [...prev, newAgent]);
    setReqName("");
    setReqRole("");
    setReqSpec("");
    setReqReason("");
    setRequestOpen(false);
    toast({ title: "Request Submitted", description: `Request for ${reqName} has been sent to HR Department for approval.` });
  };

  const handleViewAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setViewOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Travel Agents & Staff</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your team, track performance, and request new staff</p>
            <p className="text-[10px] text-primary mt-0.5">📌 Data Source: HR Department • Agent requests require HR approval</p>
          </div>
          <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary text-primary-foreground border-0 gap-2">
                <UserPlus className="w-4 h-4" />
                Request Agent/Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">Request New Agent or Staff</DialogTitle>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">This request will be submitted to the <span className="text-primary font-medium">HR Department</span> for review and approval.</p>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="text-xs text-muted-foreground">Full Name *</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="Enter full name" value={reqName} onChange={(e) => setReqName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Role *</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="Travel Agent / Tour Guide / Staff" value={reqRole} onChange={(e) => setReqRole(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Specialization</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="e.g. Beach Destinations" value={reqSpec} onChange={(e) => setReqSpec(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Reason for Request</label>
                  <Input className="mt-1 bg-secondary border-border" placeholder="Why do you need this agent/staff?" value={reqReason} onChange={(e) => setReqReason(e.target.value)} />
                </div>
                <Button className="w-full gradient-primary text-primary-foreground border-0" onClick={handleSubmitRequest}>
                  Submit Request to HR
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <AIRecommendPanel type="agent" />

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-9 bg-secondary border-border"
              placeholder="Search agents and staff..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((agent) => (
            <div key={agent.id} className="glass-card p-5 animate-fade-in hover:border-primary/30 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">{agent.role}</p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    agent.status === "Active"
                      ? "bg-success/20 text-success"
                      : agent.status === "Pending"
                      ? "bg-accent/20 text-accent"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {agent.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-sm font-bold text-foreground">{agent.rating}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Rating</p>
                </div>
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <div className="flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3 text-info" />
                    <span className="text-sm font-bold text-foreground">{agent.experience}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Experience</p>
                </div>
                <div className="text-center p-2 rounded-md bg-secondary/50">
                  <div className="flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="text-sm font-bold text-foreground">{agent.toursCompleted}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Tours</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">{agent.specialization}</span>
                <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={() => handleViewAgent(agent)}>
                  <Eye className="w-3 h-3" />
                  View Profile
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground mt-2">Source: {agent.hrSource}</p>
            </div>
          ))}
        </div>

        {/* View Agent Profile Dialog */}
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
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        selectedAgent.status === "Active" ? "bg-success/20 text-success" : selectedAgent.status === "Pending" ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                      }`}
                    >
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
                    <p className="text-[10px] text-muted-foreground mt-1">Source: HR Records</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Tours Completed</p>
                    <p className="text-lg font-bold text-foreground mt-1">{selectedAgent.toursCompleted}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: Tour Resources</p>
                  </div>
                  <div className="p-3 rounded-md bg-secondary/50">
                    <p className="text-[10px] text-muted-foreground">Specialization</p>
                    <p className="text-sm font-bold text-primary mt-1">{selectedAgent.specialization}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Source: HR Assignment</p>
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
