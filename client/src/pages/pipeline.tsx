import { useState } from "react";
import { useStore } from "@/lib/store";
import { 
  DndContext, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent
} from "@dnd-kit/core";
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { stages } from "@/lib/mock-data";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { GripVertical, DollarSign, Phone, Mail, Calendar, Clock, FileText } from "lucide-react";
import { Lead, Activity } from "@/lib/mock-data";

// Kanban Column Component
function KanbanColumn({ id, title, leads, color, activities }: { id: string, title: string, leads: Lead[], color: string, activities: Activity[] }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[280px] bg-muted/30 rounded-lg border border-border/50">
      <div className={`p-3 border-b flex items-center justify-between sticky top-0 bg-muted/30 backdrop-blur-sm rounded-t-lg z-10`}>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
          <span className="font-semibold text-sm text-foreground">{title}</span>
        </div>
        <Badge variant="secondary" className="text-xs bg-background text-muted-foreground">{leads.length}</Badge>
      </div>
      
      <div ref={setNodeRef} className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
        <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
          {leads.map((lead) => (
            <SortableLeadCard 
              key={lead.id} 
              lead={lead} 
              lastActivity={activities.filter(a => a.leadId === lead.id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]}
            />
          ))}
        </SortableContext>
        {leads.length === 0 && (
          <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md">
            Empty Stage
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Card Component
function SortableLeadCard({ lead, lastActivity }: { lead: Lead, lastActivity?: Activity }) {
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <LeadCard lead={lead} lastActivity={lastActivity} />
    </div>
  );
}

// Actual Card UI
function LeadCard({ lead, lastActivity }: { lead: Lead, lastActivity?: Activity }) {
  return (
    <Card className="cursor-grab active:cursor-grabbing hover-elevate transition-all border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardContent className="p-3 space-y-2">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-tight">{lead.name}</h4>
            <p className="text-xs text-muted-foreground line-clamp-1">{lead.company}</p>
          </div>
          {/* <GripVertical className="h-4 w-4 text-muted-foreground/30" /> */}
        </div>
        
        {lastActivity && (
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted/50 p-1.5 rounded">
            {lastActivity.type === 'call' && <Phone className="h-3 w-3" />}
            {lastActivity.type === 'email' && <Mail className="h-3 w-3" />}
            {lastActivity.type === 'meeting' && <Calendar className="h-3 w-3" />}
            {lastActivity.type === 'stage_change' && <Clock className="h-3 w-3" />}
            {lastActivity.type === 'note' && <FileText className="h-3 w-3" />}
            <span className="truncate max-w-[150px]">
              {lastActivity.type === 'note' ? 'Note added' : formatDistanceToNow(new Date(lastActivity.createdAt), { addSuffix: true })}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center text-xs font-medium text-foreground/80">
            <DollarSign className="h-3 w-3 mr-0.5 text-muted-foreground" />
            {(lead.value / 1000).toFixed(0)}k
          </div>
          {!lastActivity && (
            <span className="text-[10px] text-muted-foreground">
              Created {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Pipeline() {
  const { leads, activities, updateLeadStage, currentUser } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  
  // Admin sees all leads, Exec sees only theirs
  const isAdmin = currentUser.role === 'superadmin';
  const myLeads = isAdmin ? leads : leads.filter(l => l.assignedTo === currentUser.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveLead(event.active.data.current?.lead as Lead);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveLead(null);
      return;
    }

    const leadId = active.id as string;
    let targetStageId = over.id as string;
    const overLead = leads.find(l => l.id === over.id);
    if (overLead) {
      targetStageId = overLead.stage;
    }

    // Verify if targetStageId is valid stage
    const validStage = stages.find(s => s.id === targetStageId);
    
    if (validStage && activeLead && activeLead.stage !== targetStageId) {
      updateLeadStage(leadId, targetStageId as any);
    }
    
    setActiveId(null);
    setActiveLead(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Implement real-time list updates for smoother UX
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground mt-1">
            Drag and drop opportunities to move them through stages.
          </p>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start">
          {stages.map((stage) => (
            <KanbanColumn
              key={stage.id}
              id={stage.id}
              title={stage.label}
              color={stage.color}
              leads={myLeads.filter(l => l.stage === stage.id)}
              activities={activities}
            />
          ))}
        </div>

        <DragOverlay>
          {activeLead ? <LeadCard lead={activeLead} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
