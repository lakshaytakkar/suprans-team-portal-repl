import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight,
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Download,
  Filter,
  MoreHorizontal,
  Search,
  Users,
  DollarSign,
  Target,
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { stages } from "@/lib/mock-data";
import { format } from "date-fns";
import { useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import EventsDashboard from "@/pages/events/events-dashboard";

// Mock Revenue Data
const revenueData = [
  { month: 'Jan', revenue: 45000, target: 40000 },
  { month: 'Feb', revenue: 52000, target: 42000 },
  { month: 'Mar', revenue: 48000, target: 45000 },
  { month: 'Apr', revenue: 61000, target: 48000 },
  { month: 'May', revenue: 55000, target: 50000 },
  { month: 'Jun', revenue: 67000, target: 55000 },
  { month: 'Jul', revenue: 72000, target: 58000 },
  { month: 'Aug', revenue: 65000, target: 60000 },
  { month: 'Sep', revenue: 85000, target: 65000 },
  { month: 'Oct', revenue: 90000, target: 70000 },
  { month: 'Nov', revenue: 88000, target: 75000 },
  { month: 'Dec', revenue: 95000, target: 80000 },
];

export default function Dashboard() {
  const { currentUser, currentTeamId, simulatedRole } = useStore();
  const [activeStage, setActiveStage] = useState('all');

  if (currentTeamId === 'events') {
    return <EventsDashboard />;
  }

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

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<any[]>({
    queryKey: ['/api/tasks', currentTeamId, effectiveRole],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?teamId=${currentTeamId}&effectiveRole=${effectiveRole}`, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const totalLeads = leads.length;
  const activeLeads = leads.filter((l: any) => !['won', 'lost'].includes(l.stage)).length;
  const wonLeads = leads.filter((l: any) => l.stage === 'won').length;
  const totalPipelineValue = leads
    .filter((l: any) => !['won', 'lost'].includes(l.stage))
    .reduce((acc: number, curr: any) => acc + (curr.value || 0), 0);

  const pipelineData = stages.map(stage => ({
    name: stage.label,
    count: leads.filter((l: any) => l.stage === stage.id).length,
    color: stage.color
  })).filter(s => s.count > 0);

  if (leadsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[#666D80] text-sm">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#0D0D12]">
            {isAdmin ? "Company Dashboard" : "My Dashboard"}
          </h1>
          <p className="text-[14px] text-[#666D80] mt-1">
            {isAdmin 
              ? "Overview of company-wide sales performance and pipeline." 
              : "Track your personal sales performance and active deals."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-white border-[#DFE1E7] text-[#0D0D12]">
            <Calendar className="mr-2 h-4 w-4 text-[#666D80]" />
            Last 30 Days
          </Button>
          <Button className="bg-[#F34147] hover:bg-[#D93036] text-white">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white border border-[#DFE1E7] rounded-[12px] p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <div className="flex items-center justify-between w-full">
            <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
              Total Leads
            </p>
            <div className="w-[36px] h-[36px] bg-white border border-[#DFE1E7] rounded-[8px] flex items-center justify-center">
               <Users className="h-[18px] w-[18px] text-[#F34147]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-start">
            <p className="text-[#0D0D12] text-[24px] font-semibold leading-[1.3]">
              {totalLeads}
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
                <p className="text-[#40C4AA] text-[12px] font-medium tracking-[0.24px]">
                  +12.5%
                </p>
              </div>
              <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
                from last month
              </p>
            </div>
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white border border-[#DFE1E7] rounded-[12px] p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <div className="flex items-center justify-between w-full">
            <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
              Active Deals
            </p>
            <div className="w-[36px] h-[36px] bg-white border border-[#DFE1E7] rounded-[8px] flex items-center justify-center">
               <Briefcase className="h-[18px] w-[18px] text-[#F34147]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-start">
            <p className="text-[#0D0D12] text-[24px] font-semibold leading-[1.3]">
              {activeLeads}
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
                <p className="text-[#40C4AA] text-[12px] font-medium tracking-[0.24px]">
                  +4.2%
                </p>
              </div>
              <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
                from last month
              </p>
            </div>
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white border border-[#DFE1E7] rounded-[12px] p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <div className="flex items-center justify-between w-full">
            <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
              Win Rate
            </p>
            <div className="w-[36px] h-[36px] bg-white border border-[#DFE1E7] rounded-[8px] flex items-center justify-center">
               <Target className="h-[18px] w-[18px] text-[#F34147]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-start">
            <p className="text-[#0D0D12] text-[24px] font-semibold leading-[1.3]">
              {((wonLeads / totalLeads) * 100).toFixed(1)}%
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
                <p className="text-[#40C4AA] text-[12px] font-medium tracking-[0.24px]">
                  +8.1%
                </p>
              </div>
              <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
                from last month
              </p>
            </div>
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="bg-white border border-[#DFE1E7] rounded-[12px] p-4 flex flex-col gap-2 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <div className="flex items-center justify-between w-full">
            <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
              Pipeline Value
            </p>
            <div className="w-[36px] h-[36px] bg-white border border-[#DFE1E7] rounded-[8px] flex items-center justify-center">
               <DollarSign className="h-[18px] w-[18px] text-[#F34147]" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 items-start">
            <p className="text-[#0D0D12] text-[24px] font-semibold leading-[1.3]">
              ₹{(totalPipelineValue / 100000).toFixed(1)}L
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#EFFEFA] px-[6px] py-[2px] rounded-[50px] flex items-center justify-center">
                <p className="text-[#40C4AA] text-[12px] font-medium tracking-[0.24px]">
                  +2.4%
                </p>
              </div>
              <p className="text-[#666D80] text-[14px] font-medium tracking-[0.28px]">
                from last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#DFE1E7] p-6 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D12]">Revenue Trend</h3>
              <p className="text-sm text-[#666D80]">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded-lg">
              <Button variant="ghost" size="sm" className="h-8 bg-white shadow-sm text-[#0D0D12]">Monthly</Button>
              <Button variant="ghost" size="sm" className="h-8 text-[#666D80]">Quarterly</Button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F34147" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F34147" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666D80', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#666D80', fontSize: 12 }}
                  tickFormatter={(value) => `₹${value/1000}k`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  formatter={(value: any) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#F34147" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#0D0D12" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fill="none" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="bg-white rounded-xl border border-[#DFE1E7] p-6 shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
          <h3 className="text-lg font-bold text-[#0D0D12] mb-6">Pipeline by Stage</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  width={80}
                  tick={{ fill: '#666D80', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={24}>
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#F34147" fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 pt-6 border-t border-[#DFE1E7]">
            <Button variant="outline" className="w-full justify-between group text-[#0D0D12] border-[#DFE1E7] hover:bg-[#F1F5F9]">
              View Full Pipeline
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      {/* Recent Leads Table */}
      <div className="bg-white rounded-xl border border-[#DFE1E7] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden">
        <div className="p-6 border-b border-[#DFE1E7] flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#0D0D12]">Recent Leads</h3>
              <p className="text-sm text-[#666D80]">New leads added to the system</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#818898]" />
                <input 
                  placeholder="Search leads..." 
                  className="h-9 pl-9 pr-4 rounded-lg border border-[#DFE1E7] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-[200px] text-[#0D0D12] placeholder-[#818898]"
                />
              </div>
              <Button variant="outline" size="sm" className="h-9 gap-2 text-[#0D0D12] border-[#DFE1E7]">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button 
              onClick={() => setActiveStage('all')}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border",
                activeStage === 'all' 
                  ? "bg-[#F34147] text-white border-[#F34147]" 
                  : "bg-white text-[#666D80] border-[#DFE1E7] hover:bg-[#F8F9FB] hover:text-[#0D0D12]"
              )}
            >
              All Leads
            </button>
            {stages.map(stage => (
              <button 
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap border flex items-center gap-2",
                  activeStage === stage.id 
                    ? "bg-[#F34147]/10 text-[#F34147] border-[#F34147]" 
                    : "bg-white text-[#666D80] border-[#DFE1E7] hover:bg-[#F8F9FB] hover:text-[#0D0D12]"
                )}
              >
                <div className={cn("h-2 w-2 rounded-full", `bg-${stage.color}-500`)} />
                {stage.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F8F9FB] border-b border-[#DFE1E7] text-[#666D80] uppercase text-xs font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 w-[40px]">
                  <Checkbox className="rounded-[4px] border-[#DFE1E7]" />
                </th>
                <th className="px-6 py-4">Lead Name</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Service</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4">Stage</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DFE1E7]">
              {leads
                .filter(lead => activeStage === 'all' || lead.stage === activeStage)
                .slice(0, 5)
                .map((lead) => {
                const stage = stages.find(s => s.id === lead.stage);
                return (
                  <tr key={lead.id} className="hover:bg-[#F8F9FB] transition-colors group">
                    <td className="px-6 py-4">
                      <Checkbox className="rounded-[4px] border-[#DFE1E7]" />
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/leads/${lead.id}`}>
                        <div className="flex items-center gap-3 cursor-pointer">
                          <div className="h-8 w-8 rounded-full bg-[#F34147]/10 text-[#F34147] flex items-center justify-center font-medium text-xs">
                            {lead.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-[#0D0D12] hover:text-[#F34147] transition-colors">{lead.name}</span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#0D0D12] font-medium">{lead.company}</span>
                    </td>
                    <td className="px-6 py-4 text-[#666D80]">
                      {lead.service}
                    </td>
                    <td className="px-6 py-4 font-medium text-[#0D0D12]">
                      ₹{lead.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "rounded-md px-2.5 py-1 font-medium border-0 capitalize",
                          `bg-${stage?.color}-100 text-${stage?.color}-700`
                        )}
                      >
                        {lead.stage}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12] opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
