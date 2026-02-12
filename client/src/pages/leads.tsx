import { useState } from "react";
import { useStore } from "@/lib/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { stages } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Phone, 
  Mail,
  Calendar,
  Clock,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  Target,
  CheckCircle2,
  Download,
  Upload,
  Trash2,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { AddLeadDialog } from "@/components/dialogs/AddLeadDialog";
import { LogActivityDialog } from "@/components/dialogs/LogActivityDialog";
import { EditLeadDialog } from "@/components/dialogs/EditLeadDialog";
import { GenerateQuoteDialog } from "@/components/dialogs/GenerateQuoteDialog";
import { SendEmailDialog } from "@/components/dialogs/SendEmailDialog";
import { SendWhatsAppDialog } from "@/components/dialogs/SendWhatsAppDialog";

export default function Leads() {
  const { currentUser, currentTeamId, simulatedRole } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  const isAdmin = currentUser?.role === 'superadmin';
  const effectiveRole = useStore.getState().getEffectiveRole();

  const { data: leads = [], isLoading: leadsLoading } = useQuery<any[]>({
    queryKey: ['/api/leads', currentTeamId, effectiveRole],
    queryFn: async () => {
      const res = await fetch(`/api/leads?teamId=${currentTeamId}&effectiveRole=${effectiveRole}`, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const { data: activities = [] } = useQuery<any[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const res = await fetch('/api/activities', { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ['/api/users'],
    queryFn: async () => {
      const res = await fetch('/api/users', { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const res = await apiRequest('PATCH', `/api/leads/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => (q.queryKey[0] as string)?.startsWith('/api/leads') });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => (q.queryKey[0] as string)?.startsWith('/api/leads') });
    },
  });

  if (leadsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.stage === statusFilter;
      return matchesSearch && matchesStatus;
    });

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(l => l.id));
    }
  };

  const toggleSelectLead = (id: string) => {
    if (selectedLeads.includes(id)) {
      setSelectedLeads(selectedLeads.filter(l => l !== id));
    } else {
      setSelectedLeads([...selectedLeads, id]);
    }
  };

  const getLastActivity = (leadId: string) => {
    const leadActivities = activities
      .filter(a => a.leadId === leadId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (leadActivities.length === 0) return null;
    return leadActivities[0];
  };

  const getStageBadgeStyles = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    switch (stage?.color) {
      case 'blue': return "bg-card text-blue-500 border-blue-500";
      case 'yellow': return "bg-card text-orange-500 border-orange-500";
      case 'purple': return "bg-card text-purple-500 border-purple-500";
      case 'green': return "bg-card text-emerald-500 border-emerald-500";
      case 'gray': return "bg-card text-gray-500 border-gray-300";
      default: return "bg-card text-gray-500 border-gray-300";
    }
  };

  const getStageDotColor = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    switch (stage?.color) {
      case 'blue': return "bg-blue-500";
      case 'yellow': return "bg-orange-500";
      case 'purple': return "bg-purple-500";
      case 'green': return "bg-emerald-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-semibold text-foreground leading-[1.35] tracking-tight" data-testid="text-leads-heading">
          {effectiveRole === 'manager' ? "All Leads (Manager View)" : "My Leads"}
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-semibold">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button variant="outline" className="font-semibold">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <AddLeadDialog trigger={
            <Button className="font-semibold">
              Add New Lead
            </Button>
          } />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-5 w-full overflow-x-auto pb-1">
        <div className="flex-1 min-w-[240px] bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">Total Leads</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Users className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-foreground">
              {leads.length}
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-[#effefa] dark:bg-[#40c4aa]/10 px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40c4aa] dark:text-[#40c4aa]">+12%</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">from last month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">Active Deals</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-foreground">
              {leads.filter(l => ['negotiation', 'proposal'].includes(l.stage)).length}
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-[#effefa] dark:bg-[#40c4aa]/10 px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40c4aa] dark:text-[#40c4aa]">+5%</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">from last month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-card border rounded-lg p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">Conversion Rate</span>
            <div className="w-9 h-9 rounded-lg border flex items-center justify-center">
              <Target className="w-4 h-4 text-primary" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-foreground">24%</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#fff0f3] dark:bg-[#df1c41]/10 px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#df1c41] dark:text-[#df1c41]">-2%</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground tracking-[0.28px]">from last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        <button
          onClick={() => setStatusFilter("all")}
          className={`
            whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border
            ${statusFilter === "all" 
              ? "bg-foreground text-background border-foreground" 
              : "bg-card text-muted-foreground border hover-elevate"
            }
          `}
        >
          All Leads
          <span className={`ml-2 text-xs ${statusFilter === "all" ? "text-gray-400" : "text-gray-400"}`}>
            {leads.length}
          </span>
        </button>
        {stages.map((stage) => {
          const count = leads.filter(l => l.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setStatusFilter(stage.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${statusFilter === stage.id
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border hover-elevate"
                }
              `}
            >
              {stage.label}
              <span className={`ml-2 text-xs ${statusFilter === stage.id ? "text-gray-300" : "text-gray-400"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table Container */}
      <div className="bg-card border rounded-lg shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className={`flex items-center justify-between px-5 py-2 border-b h-[64px] ${selectedLeads.length > 0 ? 'bg-[#fff0f3] dark:bg-[#df1c41]/10' : ''}`}>
          {selectedLeads.length > 0 ? (
            <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-4">
                 <span className="font-semibold text-foreground">{selectedLeads.length} selected</span>
                 <div className="h-4 w-[1px] bg-border" />
                 <Button variant="ghost" size="sm" className="text-primary">
                   <Trash2 className="mr-2 h-4 w-4" /> Delete
                 </Button>
                 <Button variant="ghost" size="sm" className="text-muted-foreground">
                   Mark as Lost
                 </Button>
                 <Button variant="ghost" size="sm" className="text-muted-foreground">
                   Change Stage
                 </Button>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setSelectedLeads([])}>Cancel</Button>
            </div>
          ) : (
            <>
              <h2 className="text-base font-semibold text-foreground tracking-[0.02em]">Leads Data Table</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-[38px] w-[256px] bg-card text-sm placeholder:text-muted-foreground focus-visible:ring-ring"
                  />
                </div>
                <Button variant="outline" className="h-[38px] px-3 flex gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="font-medium text-[14px]">Filter</span>
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="border-b hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                  <Checkbox 
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded" 
                  />
                </TableHead>
                <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Lead Name</TableHead>
                <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Company</TableHead>
                {isAdmin && <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Assignee</TableHead>}
                <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Value</TableHead>
                <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Stage</TableHead>
                <TableHead className="h-[40px] text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Last Activity</TableHead>
                <TableHead className="h-[40px] w-[140px] text-right pr-4 text-muted-foreground font-medium text-[14px] tracking-[0.28px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No leads found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => {
                  const lastActivity = getLastActivity(lead.id);
                  const isSelected = selectedLeads.includes(lead.id);
                  return (
                    <TableRow key={lead.id} className={`border-b hover-elevate transition-colors group h-[64px] ${isSelected ? 'bg-[#fff0f3] dark:bg-[#df1c41]/10' : ''}`}>
                      <TableCell className="pl-4">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectLead(lead.id)}
                          className="border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded" 
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/leads/${lead.id}`}>
                          <a className="font-medium text-foreground text-[14px] hover:text-primary transition-colors">
                            {lead.name}
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-foreground text-[14px]">{lead.company}</span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-foreground text-[14px] flex items-center gap-2 hover-elevate p-1.5 rounded-lg transition-colors outline-none group/assign">
                                {lead.assignedTo ? (
                                  <>
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs overflow-hidden">
                                      <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${lead.assignedTo}`} alt="Assignee" />
                                    </div>
                                    <span>{users.find(u => u.id === lead.assignedTo)?.name || lead.assignedTo}</span>
                                  </>
                                ) : (
                                  <span className="text-muted-foreground text-xs italic">Unassigned</span>
                                )}
                                <ChevronDown className="w-3 h-3 text-muted-foreground opacity-0 group-hover/assign:opacity-100 transition-opacity" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[200px]">
                              {users.filter(u => u.role === 'sales_executive').map(user => (
                                <DropdownMenuItem 
                                  key={user.id}
                                  onClick={() => updateLeadMutation.mutate({ id: lead.id, updates: { assignedTo: user.id } })}
                                  className="flex items-center gap-2"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span>{user.name}</span>
                                  {lead.assignedTo === user.id && <CheckCircle2 className="ml-auto h-4 w-4 text-green-500" />}
                                </DropdownMenuItem>
                              ))}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => updateLeadMutation.mutate({ id: lead.id, updates: { assignedTo: null } })}
                                className="text-red-500 focus:text-red-500"
                              >
                                Unassign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className="text-foreground text-[14px] font-medium">₹{(lead.value).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xl border ${getStageBadgeStyles(lead.stage)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${getStageDotColor(lead.stage)}`} />
                          <span className="text-[12px] font-medium tracking-[0.12px]">
                            {stages.find(s => s.id === lead.stage)?.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lastActivity ? (
                          <div className="flex items-center gap-2 text-muted-foreground text-[14px]">
                            {lastActivity.type === 'call' && <Phone className="h-3.5 w-3.5" />}
                            {lastActivity.type === 'email' && <Mail className="h-3.5 w-3.5" />}
                            {lastActivity.type === 'meeting' && <Calendar className="h-3.5 w-3.5" />}
                            <span className="text-[14px]">
                              {formatDistanceToNow(new Date(lastActivity.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-[14px]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LogActivityDialog 
                            leadId={lead.id} 
                            defaultType="call"
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Phone className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <SendEmailDialog 
                            leadId={lead.id} 
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                              </Button>
                            }
                          />
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem asChild>
                                <Link href={`/leads/${lead.id}`}>
                                  <div className="flex items-center w-full cursor-pointer">
                                    <ArrowRight className="mr-2 h-4 w-4" /> View Details
                                  </div>
                                </Link>
                              </DropdownMenuItem>
                              <EditLeadDialog leadId={lead.id} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit Details</DropdownMenuItem>} />
                              <GenerateQuoteDialog leadId={lead.id} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><DollarSign className="mr-2 h-4 w-4" /> Generate Quote</DropdownMenuItem>} />
                              <SendWhatsAppDialog leadId={lead.id} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><MessageSquare className="mr-2 h-4 w-4" /> Send WhatsApp</DropdownMenuItem>} />
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-[#df1c41] dark:text-[#df1c41]"
                                onClick={() => deleteLeadMutation.mutate(lead.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t bg-card h-[64px]">
          <span className="text-foreground text-[14px] font-medium tracking-[0.28px]">
            Showing 1 to {Math.min(filteredLeads.length, 8)} of, {filteredLeads.length} results
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center h-[32px] border rounded-lg overflow-hidden">
              <div className="px-2 border-r h-full flex items-center bg-card">
                <span className="text-[12px] font-medium text-foreground">Per page</span>
              </div>
              <div className="flex items-center gap-1 px-2 h-full bg-card cursor-pointer hover-elevate">
                <span className="text-[12px] font-medium text-foreground">8</span>
                <ChevronDown className="h-4 w-4 text-foreground" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <Button variant="outline" size="icon" className="h-8 w-8 p-0 rounded-lg">
                <ChevronLeft className="h-4 w-4 text-foreground" />
              </Button>
              <div className="flex items-center border rounded-lg overflow-hidden">
                <button className="h-8 w-8 flex items-center justify-center bg-card border-r text-[12px] font-medium text-foreground hover-elevate">1</button>
                <button className="h-8 w-8 flex items-center justify-center bg-card border-r text-[12px] font-medium text-foreground hover-elevate">2</button>
                <button className="h-8 w-8 flex items-center justify-center bg-primary border-r text-[12px] font-medium text-white">3</button>
                <button className="h-8 w-8 flex items-center justify-center bg-card border-r text-[12px] font-medium text-foreground hover-elevate">...</button>
                <button className="h-8 w-8 flex items-center justify-center bg-card text-[12px] font-medium text-foreground hover-elevate">5</button>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 p-0 rounded-lg">
                <ChevronRight className="h-4 w-4 text-foreground" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
