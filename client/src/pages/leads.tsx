import { useState } from "react";
import { useStore } from "@/lib/store";
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
  const { leads, activities, currentUser, updateLead, users, deleteLead, simulatedRole } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  
  const isAdmin = currentUser?.role === 'superadmin';
  const effectiveManager = isAdmin && simulatedRole !== 'executive';

  const baseLeads = leads.filter(lead => 
    effectiveManager ? true : lead.assignedTo === currentUser?.id
  );

  const filteredLeads = baseLeads
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
      case 'blue': return "bg-white text-blue-500 border-blue-500";
      case 'yellow': return "bg-white text-orange-500 border-orange-500"; // Using orange for yellow/pending like design
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

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Page Header */}
      <div className="flex items-center justify-between w-full">
        <h1 className="text-[20px] font-semibold text-[#0D0D12] leading-[1.35]" data-testid="text-leads-heading">
          {effectiveManager ? "All Leads (Manager View)" : "My Leads"}
        </h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-[#DFE1E7] text-[#0D0D12] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-[40px] px-4 font-semibold">
            <Upload className="mr-2 h-4 w-4" /> Import
          </Button>
          <Button variant="outline" className="bg-white border-[#DFE1E7] text-[#0D0D12] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-[40px] px-4 font-semibold">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <AddLeadDialog trigger={
            <Button className="bg-[#F34147] hover:bg-[#D93036] text-white shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-[40px] px-4 font-semibold border-none">
              Add New Lead
            </Button>
          } />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-5 w-full overflow-x-auto pb-1">
        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Total Leads</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">
              {baseLeads.length}
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40C4AA]">+12%</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">from last month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Active Deals</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">
              {baseLeads.filter(l => ['negotiation', 'proposal'].includes(l.stage)).length}
            </span>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#40C4AA]">+5%</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">from last month</span>
            </div>
          </div>
        </div>

        <div className="flex-1 min-w-[240px] bg-white border border-[#DFE1E7] rounded-[12px] p-4 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">Conversion Rate</span>
            <div className="w-9 h-9 rounded-[8px] border border-[#DFE1E7] flex items-center justify-center">
              <Target className="w-4 h-4 text-[#F34147]" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-2xl font-semibold text-[#0D0D12]">24%</span>
            <div className="flex items-center gap-2">
              <div className="bg-[#FFF0F3] px-1.5 py-0.5 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-[#DF1C41]">-2%</span>
              </div>
              <span className="text-sm font-medium text-[#666D80] tracking-[0.28px]">from last month</span>
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
              ? "bg-[#0D0D12] text-white border-[#0D0D12]" 
              : "bg-white text-[#666D80] border-[#DFE1E7] hover:bg-gray-50 hover:text-[#0D0D12]"
            }
          `}
        >
          All Leads
          <span className={`ml-2 text-xs ${statusFilter === "all" ? "text-gray-400" : "text-gray-400"}`}>
            {baseLeads.length}
          </span>
        </button>
        {stages.map((stage) => {
          const count = baseLeads.filter(l => l.stage === stage.id).length;
          return (
            <button
              key={stage.id}
              onClick={() => setStatusFilter(stage.id)}
              className={`
                whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors border
                ${statusFilter === stage.id
                  ? "bg-[#0D0D12] text-white border-[#0D0D12]"
                  : "bg-white text-[#666D80] border-[#DFE1E7] hover:bg-gray-50 hover:text-[#0D0D12]"
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
      <div className="bg-white border border-[#DFE1E7] rounded-[12px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden flex flex-col">
        {/* Table Header Controls */}
        <div className={`flex items-center justify-between px-5 py-2 border-b border-[#DFE1E7] h-[64px] ${selectedLeads.length > 0 ? 'bg-[#FFF0F3]' : ''}`}>
          {selectedLeads.length > 0 ? (
            <div className="flex items-center justify-between w-full">
               <div className="flex items-center gap-4">
                 <span className="font-semibold text-[#0D0D12]">{selectedLeads.length} selected</span>
                 <div className="h-4 w-[1px] bg-[#DFE1E7]" />
                 <Button variant="ghost" size="sm" className="text-[#F34147] hover:text-[#D93036] hover:bg-[#FFE4E8]">
                   <Trash2 className="mr-2 h-4 w-4" /> Delete
                 </Button>
                 <Button variant="ghost" size="sm" className="text-[#666D80] hover:text-[#0D0D12]">
                   Mark as Lost
                 </Button>
                 <Button variant="ghost" size="sm" className="text-[#666D80] hover:text-[#0D0D12]">
                   Change Stage
                 </Button>
               </div>
               <Button variant="ghost" size="sm" onClick={() => setSelectedLeads([])}>Cancel</Button>
            </div>
          ) : (
            <>
              <h2 className="text-[16px] font-semibold text-[#0D0D12] tracking-[0.32px]">Leads Data Table</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666D80]" />
                  <Input 
                    placeholder="Search" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 h-[38px] w-[256px] bg-white border-[#DFE1E7] text-sm placeholder:text-[#666D80] focus-visible:ring-1 focus-visible:ring-[#F34147]"
                  />
                </div>
                <Button variant="outline" className="h-[38px] px-3 border-[#DFE1E7] text-[#666D80] hover:text-[#0D0D12] flex gap-2">
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
            <TableHeader className="bg-[#F6F8FA]">
              <TableRow className="border-b border-[#DFE1E7] hover:bg-transparent">
                <TableHead className="w-[50px] pl-4">
                  <Checkbox 
                    checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                    onCheckedChange={toggleSelectAll}
                    className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" 
                  />
                </TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Lead Name</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Company</TableHead>
                {isAdmin && <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Assignee</TableHead>}
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Value</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Stage</TableHead>
                <TableHead className="h-[40px] text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Last Activity</TableHead>
                <TableHead className="h-[40px] w-[140px] text-right pr-4 text-[#666D80] font-medium text-[14px] tracking-[0.28px]">Actions</TableHead>
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
                    <TableRow key={lead.id} className={`border-b border-[#DFE1E7] hover:bg-[#F8F9FB] transition-colors group h-[64px] ${isSelected ? 'bg-[#FFF0F3]' : ''}`}>
                      <TableCell className="pl-4">
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => toggleSelectLead(lead.id)}
                          className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" 
                        />
                      </TableCell>
                      <TableCell>
                        <Link href={`/leads/${lead.id}`}>
                          <a className="font-medium text-[#0D0D12] text-[14px] hover:text-[#F34147] transition-colors">
                            {lead.name}
                          </a>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-[#0D0D12] text-[14px]">{lead.company}</span>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-[#0D0D12] text-[14px] flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-lg transition-colors outline-none group/assign">
                                {lead.assignedTo ? (
                                  <>
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs overflow-hidden">
                                      <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${lead.assignedTo}`} alt="Assignee" />
                                    </div>
                                    <span>{users.find(u => u.id === lead.assignedTo)?.name || lead.assignedTo}</span>
                                  </>
                                ) : (
                                  <span className="text-[#666D80] text-xs italic">Unassigned</span>
                                )}
                                <ChevronDown className="w-3 h-3 text-gray-400 opacity-0 group-hover/assign:opacity-100 transition-opacity" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[200px]">
                              {users.filter(u => u.role === 'sales_executive').map(user => (
                                <DropdownMenuItem 
                                  key={user.id}
                                  onClick={() => updateLead(lead.id, { assignedTo: user.id })}
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
                                onClick={() => updateLead(lead.id, { assignedTo: undefined })}
                                className="text-red-500 focus:text-red-500"
                              >
                                Unassign
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                      <TableCell>
                        <span className="text-[#0D0D12] text-[14px] font-medium">₹{(lead.value).toLocaleString()}</span>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[16px] border ${getStageBadgeStyles(lead.stage)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${getStageDotColor(lead.stage)}`} />
                          <span className="text-[12px] font-medium tracking-[0.12px]">
                            {stages.find(s => s.id === lead.stage)?.label}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {lastActivity ? (
                          <div className="flex items-center gap-2 text-[#666D80] text-[14px]">
                            {lastActivity.type === 'call' && <Phone className="h-3.5 w-3.5" />}
                            {lastActivity.type === 'email' && <Mail className="h-3.5 w-3.5" />}
                            {lastActivity.type === 'meeting' && <Calendar className="h-3.5 w-3.5" />}
                            <span className="text-[14px]">
                              {formatDistanceToNow(new Date(lastActivity.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#666D80] text-[14px]">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <LogActivityDialog 
                            leadId={lead.id} 
                            defaultType="call"
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12] hover:bg-gray-100">
                                <Phone className="h-4 w-4" />
                              </Button>
                            }
                          />
                          <SendEmailDialog 
                            leadId={lead.id} 
                            trigger={
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12] hover:bg-gray-100">
                                <Mail className="h-4 w-4" />
                              </Button>
                            }
                          />
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12]">
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
                                className="text-[#DF1C41] hover:text-[#DF1C41] hover:bg-[#FFF0F3]"
                                onClick={() => deleteLead(lead.id)}
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
