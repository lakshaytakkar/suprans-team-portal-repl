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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { stages } from "@/lib/mock-data";
import { format } from "date-fns";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Download,
  Trash2,
  Edit,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  Briefcase,
  Target
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { AddLeadDialog } from "@/components/dialogs/AddLeadDialog";
import { EditLeadDialog } from "@/components/dialogs/EditLeadDialog";

export default function AdminLeads() {
  const { currentUser } = useStore();

  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ['/api/leads'],
    queryFn: async () => {
      const res = await fetch('/api/leads', { credentials: 'include' });
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
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest('PATCH', `/api/leads/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/leads/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leads'] });
    },
  });

  const updateLead = (id: string, data: any) => updateLeadMutation.mutate({ id, data });
  const deleteLead = (id: string) => deleteLeadMutation.mutate(id);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.stage === statusFilter;
      const matchesAssignee = assigneeFilter === "all" || lead.assignedTo === assigneeFilter;
      return matchesSearch && matchesStatus && matchesAssignee;
    });

  const getStageBadgeStyles = (stageId: string) => {
    const stage = stages.find(s => s.id === stageId);
    switch (stage?.color) {
      case 'blue': return "bg-white text-blue-500 border-blue-500";
      case 'yellow': return "bg-white text-orange-500 border-orange-500";
      case 'purple': return "bg-white text-purple-500 border-purple-500";
      case 'green': return "bg-white text-emerald-500 border-emerald-500";
      case 'gray': return "bg-white text-gray-500 border-gray-300";
      default: return "bg-white text-gray-500 border-gray-300";
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

  const getUserName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    return users.find(u => u.id === userId)?.name || "Unknown";
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[20px] font-semibold text-[#0D0D12] leading-[1.35]">All Leads</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-[#DFE1E7] text-[#0D0D12] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-[40px] px-4 font-semibold">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <AddLeadDialog trigger={
            <Button className="bg-[#F34147] hover:bg-[#D93036] text-white shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-[40px] px-4 font-semibold border-none">
              Add New Lead
            </Button>
          } />
        </div>
      </div>

      {/* Stats Cards for Admin */}
      <div className="flex gap-5 w-full overflow-x-auto pb-1">
        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Total Pipeline</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">{leads.length}</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40C4AA]">+8%</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">vs last week</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Avg Deal Size</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">₹45.2k</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#FFF0F3] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#DF1C41]">-1.2%</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">vs last week</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Active Agents</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">{users.length}</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40C4AA]">+2</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">new this month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-[#DFE1E7] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#DFE1E7] h-[64px]">
          <h2 className="text-[16px] font-semibold text-[#0D0D12] tracking-[0.32px]">All Leads Data</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666D80]" />
              <Input 
                placeholder="Search" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-[38px] w-[200px] bg-white border-[#DFE1E7] text-sm placeholder:text-[#666D80] focus-visible:ring-1 focus-visible:ring-[#F34147]"
              />
            </div>
            
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[160px] h-[38px] bg-white border-[#DFE1E7] text-[#666D80]">
                <SelectValue placeholder="Assignee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-[38px] bg-white border-[#DFE1E7] text-[#666D80]">
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map(stage => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" className="h-[38px] px-3 border-[#DFE1E7] text-[#666D80] hover:text-[#0D0D12] flex gap-2">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#F6F8FA]">
              <TableRow className="border-b border-[#DFE1E7] hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                  <Checkbox className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" />
                </TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Lead Name</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Assigned To</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Value</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Stage</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Created</TableHead>
                <TableHead className="h-[40px] w-[60px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No leads found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="border-b border-[#DFE1E7] hover:bg-[#F8F9FB] transition-colors group h-[64px]">
                    <TableCell className="pl-4">
                      <Checkbox className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" />
                    </TableCell>
                    <TableCell>
                      <Link href={`/leads/${lead.id}`}>
                        <a className="font-medium text-[#0D0D12] text-[14px] hover:text-[#F34147] transition-colors">
                          {lead.name}
                        </a>
                      </Link>
                      <div className="text-xs text-[#666D80]">{lead.company}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={users.find(u => u.id === lead.assignedTo)?.avatar} />
                          <AvatarFallback>
                            {getUserName(lead.assignedTo).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-[#0D0D12]">{getUserName(lead.assignedTo)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-[#0D0D12] text-[14px]">₹{(lead.value).toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[16px] border ${getStageBadgeStyles(lead.stage)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${getStageDotColor(lead.stage)}`} />
                        <span className="text-[12px] font-medium tracking-[0.12px]">
                          {stages.find(s => s.id === lead.stage)?.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#666D80] text-[14px]">
                      {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12] opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <EditLeadDialog leadId={lead.id} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><Edit className="mr-2 h-4 w-4" /> Edit Details</DropdownMenuItem>} />
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Reassign To</DropdownMenuLabel>
                          {users.filter(u => u.id !== lead.assignedTo).map(u => (
                            <DropdownMenuItem key={u.id} onClick={() => updateLead(lead.id, { assignedTo: u.id })}>
                              {u.name}
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-[#DF1C41] hover:text-[#DF1C41] hover:bg-[#FFF0F3]"
                            onClick={() => deleteLead(lead.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#DFE1E7] bg-white h-[64px]">
          <span className="text-[#0D0D12] text-[14px] font-medium tracking-[0.28px]">
            Showing 1 to {Math.min(filteredLeads.length, 8)} of, {filteredLeads.length} results
          </span>
          <div className="flex items-center gap-2">
            <div className="flex items-center h-[32px] border border-[#DFE1E7] rounded-[8px] overflow-hidden">
              <div className="px-2 border-r border-[#DFE1E7] h-full flex items-center bg-white">
                <span className="text-[12px] font-medium text-[#0D0D12]">Per page</span>
              </div>
              <div className="flex items-center gap-1 px-2 h-full bg-white cursor-pointer hover:bg-gray-50">
                <span className="text-[12px] font-medium text-[#0D0D12]">8</span>
                <ChevronDown className="h-4 w-4 text-[#0D0D12]" />
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              <Button variant="outline" size="icon" className="h-8 w-8 p-0 border-[#DFE1E7] rounded-[8px]">
                <ChevronLeft className="h-4 w-4 text-[#0D0D12]" />
              </Button>
              <div className="flex items-center border border-[#DFE1E7] rounded-[8px] overflow-hidden">
                <button className="h-8 w-8 flex items-center justify-center bg-white border-r border-[#DFE1E7] text-[12px] font-medium text-[#0D0D12] hover:bg-gray-50">1</button>
                <button className="h-8 w-8 flex items-center justify-center bg-white border-r border-[#DFE1E7] text-[12px] font-medium text-[#0D0D12] hover:bg-gray-50">2</button>
                <button className="h-8 w-8 flex items-center justify-center bg-[#F34147] border-r border-[#DFE1E7] text-[12px] font-medium text-white">3</button>
                <button className="h-8 w-8 flex items-center justify-center bg-white border-r border-[#DFE1E7] text-[12px] font-medium text-[#0D0D12] hover:bg-gray-50">...</button>
                <button className="h-8 w-8 flex items-center justify-center bg-white text-[12px] font-medium text-[#0D0D12] hover:bg-gray-50">5</button>
              </div>
              <Button variant="outline" size="icon" className="h-8 w-8 p-0 border-[#DFE1E7] rounded-[8px]">
                <ChevronRight className="h-4 w-4 text-[#0D0D12]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
