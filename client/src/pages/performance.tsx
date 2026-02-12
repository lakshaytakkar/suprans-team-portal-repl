import { useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { TrendingUp, Trophy, Timer, Target } from "lucide-react";

export default function Performance() {
  const { currentUser, currentTeamId, getEffectiveRole } = useStore();
  const effectiveRole = getEffectiveRole();

  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ['/api/leads', currentTeamId, effectiveRole],
    queryFn: async () => {
      const res = await fetch(`/api/leads?teamId=${currentTeamId}&effectiveRole=${effectiveRole}`, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const isAdmin = currentUser?.role === 'superadmin';
  
  // Admin sees company-wide stats, Exec sees personal stats
  // For now, we'll just toggle the data source. In a real app, Admin might want to filter by team member.
  const myLeads = isAdmin ? leads : leads.filter(l => l.assignedTo === currentUser?.id);
  const wonLeads = myLeads.filter(l => l.stage === 'won');
  
  // Stats
  const totalValue = wonLeads.reduce((sum, l) => sum + (l.wonAmount || l.value), 0);
  const conversionRate = myLeads.length > 0 ? (wonLeads.length / myLeads.length) * 100 : 0;
  const avgDealSize = wonLeads.length > 0 ? totalValue / wonLeads.length : 0;

  // Mock data for charts - randomized slightly based on role to look different
  const monthlyPerformance = [
    { name: 'Jan', value: isAdmin ? 420000 : 120000, target: isAdmin ? 400000 : 100000 },
    { name: 'Feb', value: isAdmin ? 480000 : 150000, target: isAdmin ? 420000 : 110000 },
    { name: 'Mar', value: isAdmin ? 550000 : 180000, target: isAdmin ? 450000 : 120000 },
    { name: 'Apr', value: isAdmin ? 450000 : 90000, target: isAdmin ? 480000 : 130000 },
    { name: 'May', value: isAdmin ? 680000 : 210000, target: isAdmin ? 500000 : 140000 },
    { name: 'Jun', value: isAdmin ? 620000 : 170000, target: isAdmin ? 520000 : 150000 },
  ];

  const funnelData = [
    { stage: 'New', count: myLeads.filter(l => l.stage === 'new').length },
    { stage: 'Contacted', count: myLeads.filter(l => l.stage === 'contacted').length },
    { stage: 'Qualified', count: myLeads.filter(l => l.stage === 'qualified').length },
    { stage: 'Proposal', count: myLeads.filter(l => l.stage === 'proposal').length },
    { stage: 'Won', count: wonLeads.length },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{isAdmin ? 'Team Performance' : 'My Performance'}</h1>
        <p className="text-muted-foreground mt-1">
          {isAdmin ? 'Overview of company sales metrics and team velocity.' : 'Track your metrics and sales velocity.'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Deal Size</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(avgDealSize / 1000).toFixed(1)}k</div>
            <p className="text-xs text-muted-foreground">+₹5k from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalValue / 100000).toFixed(2)}L</div>
            <p className="text-xs text-muted-foreground">YTD Performance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Closing Time</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 Days</div>
            <p className="text-xs text-muted-foreground">-2 days from avg</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue vs Target</CardTitle>
            <CardDescription>Monthly performance trend</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sales Funnel</CardTitle>
            <CardDescription>Lead distribution by stage</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="stage" type="category" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
