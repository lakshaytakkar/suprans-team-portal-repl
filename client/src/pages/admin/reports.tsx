import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
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
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Download, Calendar, Filter } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";

export default function Reports() {
  const { leads, users } = useStore();
  const [timeRange, setTimeRange] = useState("this_month");

  // Mock Data Generators for Charts
  const dailyActivityData = [
    { day: 'Mon', calls: 45, emails: 120, meetings: 8 },
    { day: 'Tue', calls: 52, emails: 135, meetings: 12 },
    { day: 'Wed', calls: 48, emails: 110, meetings: 10 },
    { day: 'Thu', calls: 60, emails: 145, meetings: 15 },
    { day: 'Fri', calls: 55, emails: 125, meetings: 9 },
    { day: 'Sat', calls: 12, emails: 45, meetings: 2 },
    { day: 'Sun', calls: 5, emails: 20, meetings: 0 },
  ];

  const serviceRevenueData = [
    { name: 'LLC Formation', value: 450000 },
    { name: 'GST Reg', value: 120000 },
    { name: 'Trademark', value: 300000 },
    { name: 'Import License', value: 200000 },
    { name: 'Accounting', value: 180000 },
  ];

  const conversionFunnelData = [
    { name: 'Leads', value: 1000, fill: '#8884d8' },
    { name: 'Contacted', value: 800, fill: '#83a6ed' },
    { name: 'Qualified', value: 500, fill: '#8dd1e1' },
    { name: 'Proposal', value: 300, fill: '#82ca9d' },
    { name: 'Won', value: 100, fill: '#a4de6c' },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Deep dive into your sales metrics and performance.
          </p>
        </div>
        <div className="flex gap-2">
           <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px] bg-background">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this_week">This Week</SelectItem>
              <SelectItem value="this_month">This Month</SelectItem>
              <SelectItem value="last_quarter">Last Quarter</SelectItem>
              <SelectItem value="this_year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Daily Activity Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Daily Activity Volume</CardTitle>
            <CardDescription>Calls, Emails, and Meetings over the last week</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyActivityData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Legend />
                <Bar dataKey="calls" stackId="a" fill="#3b82f6" name="Calls" />
                <Bar dataKey="emails" stackId="a" fill="#60a5fa" name="Emails" />
                <Bar dataKey="meetings" stackId="a" fill="#1d4ed8" name="Meetings" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Revenue Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>Which services are generating the most value?</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceRevenueData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {serviceRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Drop-off rates between pipeline stages</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={conversionFunnelData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers Table (Mock) */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Regions</CardTitle>
            <CardDescription>Based on closed deal value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { region: 'Mumbai', revenue: 1250000, deals: 45, growth: '+12%' },
                { region: 'Bangalore', revenue: 980000, deals: 32, growth: '+8%' },
                { region: 'Delhi NCR', revenue: 850000, deals: 28, growth: '+15%' },
                { region: 'Chennai', revenue: 420000, deals: 15, growth: '-2%' },
                { region: 'Hyderabad', revenue: 380000, deals: 12, growth: '+5%' },
              ].map((item, i) => (
                <div key={item.region} className="flex items-center justify-between border-b last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold w-6 text-muted-foreground">#{i + 1}</span>
                    <div>
                      <p className="font-medium text-sm">{item.region}</p>
                      <p className="text-xs text-muted-foreground">{item.deals} Deals</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">₹{(item.revenue/1000).toFixed(0)}k</p>
                    <p className={`text-xs ${item.growth.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {item.growth}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
