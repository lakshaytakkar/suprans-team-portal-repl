import { useState } from "react";
import { useStore } from "@/lib/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay
} from "@dnd-kit/core";
import { 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowRight, GripVertical, UserPlus, CheckCircle2 } from "lucide-react";
// Draggable Lead Card for Assignment
function DraggableLead({ lead }: { lead: any }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: lead.id, data: { lead } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="p-3 mb-2 bg-card border rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium text-sm">{lead.name}</h4>
          <p className="text-xs text-muted-foreground">{lead.company}</p>
        </div>
        <GripVertical className="h-4 w-4 text-muted-foreground/30" />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Badge variant="outline" className="text-[10px]">{lead.service}</Badge>
        <span className="text-xs font-mono">₹{(lead.value/1000).toFixed(0)}k</span>
      </div>
    </div>
  );
}

// Droppable User Zone
function UserAssignmentZone({ user, leads, onDrop }: { user: any, leads: any[], onDrop?: () => void }) {
  const { setNodeRef, isOver } = useSortable({ id: user.id, data: { type: 'user', user } });
  
  return (
    <div 
      ref={setNodeRef}
      className={`p-4 rounded-xl border-2 transition-all ${
        isOver 
          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
          : 'border-transparent bg-muted/50 hover:bg-muted/80'
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <Avatar className="h-10 w-10 border border-background">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold text-sm">{user.name}</h3>
          <p className="text-xs text-muted-foreground">{leads.length} leads assigned</p>
        </div>
      </div>
      
      <div className="space-y-2 min-h-[100px]">
        {leads.slice(0, 3).map(lead => (
          <div key={lead.id} className="text-xs p-2 bg-background rounded border opacity-70">
            {lead.name} - {lead.company}
          </div>
        ))}
        {leads.length > 3 && (
          <div className="text-xs text-center text-muted-foreground py-1">
            + {leads.length - 3} more
          </div>
        )}
        {leads.length === 0 && (
          <div className="h-full flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded bg-background/50 p-4">
            Drop leads here
          </div>
        )}
      </div>
    </div>
  );
}

export default function Assignments() {
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

  const updateLead = (id: string, data: any) => updateLeadMutation.mutate({ id, data });

  const [autoAssign, setAutoAssign] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<any | null>(null);

  const unassignedLeads = leads.filter(l => !l.assignedTo);
  const salesUsers = users.filter(u => u.role === 'sales_executive');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: any) => {
    const lead = event.active.data.current?.lead;
    if (lead) {
      setActiveId(event.active.id);
      setActiveLead(lead);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      // Check if dropped on a user
      const targetUser = users.find(u => u.id === over.id);
      if (targetUser) {
        updateLead(active.id, { assignedTo: targetUser.id });
      }
    }
    
    setActiveId(null);
    setActiveLead(null);
  };

  const handleAutoAssign = () => {
    // Simple round robin
    let userIndex = 0;
    unassignedLeads.forEach(lead => {
      updateLead(lead.id, { assignedTo: salesUsers[userIndex].id });
      userIndex = (userIndex + 1) % salesUsers.length;
    });
  };

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Assignment</h1>
          <p className="text-muted-foreground mt-1">
            Distribute new leads to your sales team.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-card p-2 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-2 px-2">
            <Switch id="auto-assign" checked={autoAssign} onCheckedChange={setAutoAssign} />
            <Label htmlFor="auto-assign">Round-Robin Auto Assign</Label>
          </div>
          {unassignedLeads.length > 0 && (
            <Button size="sm" onClick={handleAutoAssign}>
              Auto-Assign All ({unassignedLeads.length})
            </Button>
          )}
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
          {/* Unassigned Queue */}
          <Card className="lg:col-span-1 flex flex-col h-full bg-muted/10 border-dashed border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                Unassigned Queue
                <Badge variant="secondary">{unassignedLeads.length}</Badge>
              </CardTitle>
              <CardDescription>Drag these leads to team members</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto min-h-0">
              <div className="space-y-2">
                {unassignedLeads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50 text-green-500" />
                    All leads assigned!
                  </div>
                ) : (
                  <SortableContext items={unassignedLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                    {unassignedLeads.map(lead => (
                      <DraggableLead key={lead.id} lead={lead} />
                    ))}
                  </SortableContext>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members Grid */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 content-start overflow-y-auto">
            {salesUsers.map(user => (
              <UserAssignmentZone 
                key={user.id} 
                user={user} 
                leads={leads.filter(l => l.assignedTo === user.id)} 
              />
            ))}
            
            {/* Add Team Member Placeholder */}
            <div className="p-4 rounded-xl border-2 border-dashed border-muted hover:border-primary/50 hover:bg-muted/30 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer h-[200px]">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <UserPlus className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Add Team Member</p>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeLead ? (
             <div className="p-3 bg-card border rounded-lg shadow-xl w-[280px] opacity-90 rotate-3 cursor-grabbing">
               <h4 className="font-medium text-sm">{activeLead.name}</h4>
               <p className="text-xs text-muted-foreground">{activeLead.company}</p>
             </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
