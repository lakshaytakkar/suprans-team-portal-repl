import { useStore } from "@/lib/store";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, Phone, Mail, CheckCircle2, ArrowRight } from "lucide-react";
import { format, isToday, isTomorrow, isPast, addDays } from "date-fns";
import { Link } from "wouter";

export default function FollowUps() {
  const { currentUser, currentTeamId, simulatedRole, getEffectiveRole } = useStore();
  const effectiveRole = getEffectiveRole();

  const { data: allLeads = [] } = useQuery<any[]>({
    queryKey: ['/api/leads', currentTeamId, effectiveRole],
    queryFn: async () => {
      const res = await fetch(`/api/leads?teamId=${currentTeamId}&effectiveRole=${effectiveRole}`, { credentials: 'include' });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    enabled: !!currentUser,
  });

  const leads = allLeads;
  const isAdmin = currentUser?.role === 'superadmin';
  
  // Admin sees all scheduled follow-ups, Exec sees only theirs
  const myLeads = leads
    .filter(l => (isAdmin || l.assignedTo === currentUser?.id) && l.nextFollowUp)
    .sort((a, b) => new Date(a.nextFollowUp!).getTime() - new Date(b.nextFollowUp!).getTime());

  const overdue = myLeads.filter(l => isPast(new Date(l.nextFollowUp!)) && !isToday(new Date(l.nextFollowUp!)));
  const today = myLeads.filter(l => isToday(new Date(l.nextFollowUp!)));
  const upcoming = myLeads.filter(l => !isPast(new Date(l.nextFollowUp!)) && !isToday(new Date(l.nextFollowUp!)));

  const FollowUpCard = ({ lead, isOverdue = false }: { lead: typeof leads[0], isOverdue?: boolean }) => (
    <Card className={`hover-elevate transition-all ${isOverdue ? 'border-red-200 bg-red-50/20 dark:border-red-900/50 dark:bg-red-950/10' : ''}`}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 
            ${isOverdue 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' 
              : 'bg-primary/10 text-primary'}`}>
            <Phone className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <Link href={`/leads/${lead.id}`}>
              <a className="font-semibold hover:underline decoration-primary/50 underline-offset-4 block">
                {lead.name}
              </a>
            </Link>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{lead.company}</span>
              <span>•</span>
              <span className="capitalize">{lead.stage}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className={`flex items-center gap-1.5 text-sm font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : ''}`}>
              <Clock className="h-3.5 w-3.5" />
              {format(new Date(lead.nextFollowUp!), 'h:mm a')}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(lead.nextFollowUp!), 'MMM d')}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-9 w-9 p-0 rounded-full">
              <CalendarIcon className="h-4 w-4" />
            </Button>
            <Button size="sm" className={`h-9 w-9 p-0 rounded-full ${isOverdue ? 'bg-red-600 hover:bg-red-700' : ''}`}>
              <CheckCircle2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Follow-ups</h1>
        <p className="text-muted-foreground mt-1">
          Stay on top of your scheduled calls and meetings.
        </p>
      </div>

      <div className="space-y-8">
        {overdue.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-red-600 dark:text-red-400">
              Overdue <Badge variant="destructive" className="rounded-full px-2 h-5 text-xs">{overdue.length}</Badge>
            </h2>
            <div className="grid gap-3">
              {overdue.map(lead => <FollowUpCard key={lead.id} lead={lead} isOverdue />)}
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            Today <Badge variant="secondary" className="rounded-full px-2 h-5 text-xs">{today.length}</Badge>
          </h2>
          {today.length > 0 ? (
            <div className="grid gap-3">
              {today.map(lead => <FollowUpCard key={lead.id} lead={lead} />)}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground p-8 border border-dashed rounded-lg text-center">
              No follow-ups scheduled for today. Good job!
            </div>
          )}
        </div>

        {upcoming.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Upcoming</h2>
            <div className="grid gap-3 opacity-80">
              {upcoming.map(lead => <FollowUpCard key={lead.id} lead={lead} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
