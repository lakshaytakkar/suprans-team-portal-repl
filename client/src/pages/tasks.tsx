import { useState } from "react";
import { useStore } from "@/lib/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { taskStages } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  Calendar, 
  CheckCircle2, 
  MoreHorizontal,
  Flag,
  Plus,
  LayoutGrid,
  List,
  Search,
  Filter,
  ArrowUpDown,
  Paperclip,
  CheckSquare
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddTaskDialog } from "@/components/dialogs/AddTaskDialog";
import { TaskDetailDialog } from "@/components/dialogs/TaskDetailDialog";

function KanbanColumn({ id, title, tasks, color, onTaskClick }: { id: string, title: string, tasks: any[], color: string, onTaskClick?: (task: any) => void }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div className="flex flex-col h-full min-w-[280px] w-full max-w-[320px] bg-muted rounded-xl border">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
          <span className="font-semibold text-[14px] text-foreground">{title}</span>
        </div>
        <Badge variant="secondary" className="bg-card text-muted-foreground">{tasks.length}</Badge>
      </div>
      
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-xs text-muted-foreground border border-dashed rounded-md">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

function SortableTaskCard({ task, onClick }: { task: any, onClick?: (task: any) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick && onClick(task)}>
      <TaskCard task={task} />
    </div>
  );
}

function TaskCard({ task }: { task: any }) {
  const priorityColor = {
    low: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
    medium: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
    high: "text-red-500 bg-red-50 dark:bg-red-500/10"
  };

  return (
    <Card className="cursor-grab active:cursor-grabbing hover-elevate transition-all bg-card group">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Badge className={`text-[10px] px-2 py-0.5 border-0 font-medium ${priorityColor[task.priority as keyof typeof priorityColor]} capitalize`}>
            {task.priority}
          </Badge>
          <button className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="text-[14px] font-semibold text-foreground leading-tight">{task.title}</h4>
          <p className="text-[12px] text-muted-foreground line-clamp-2">{task.description}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {task.tags?.map((tag: string) => (
            <span key={tag} className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
          <Avatar className="h-6 w-6 border border-card shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${task.assignedTo}`} />
            <AvatarFallback className="text-[10px]">U</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}

function TasksListView({ tasks, onTaskClick }: { tasks: any[], onTaskClick: (task: any) => void }) {
  const priorityColor = {
    low: "text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
    medium: "text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
    high: "text-red-500 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20"
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] dark:shadow-none">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow className="hover:bg-transparent border-b">
            <TableHead className="w-[50px] pl-6">
              <Checkbox className="border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded" />
            </TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider h-[48px]">Task Name</TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Due Date</TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Assignee</TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider w-[200px]">Progress</TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider">Priority</TableHead>
            <TableHead className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="hover-elevate border-b cursor-pointer group transition-colors"
              onClick={() => onTaskClick(task)}
            >
              <TableCell className="pl-6 py-4">
                <Checkbox 
                  className="border data-[state=checked]:bg-primary data-[state=checked]:border-primary rounded" 
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-medium text-foreground">{task.title}</span>
                  <span className="text-[12px] text-muted-foreground line-clamp-1">{task.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-[14px] text-foreground">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-card">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${task.assignedTo}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="h-8 w-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground font-medium">
                    +2
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0} className="h-1.5" />
                  <span className="text-[12px] font-medium text-foreground">
                    {task.status === 'done' ? '100%' : task.status === 'in_progress' ? '50%' : '0%'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`border ${priorityColor[task.priority as keyof typeof priorityColor]} font-medium`}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function Tasks() {
  const { currentUser, currentTeamId, simulatedRole } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<any | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState("");

  const effectiveRole = useStore.getState().getEffectiveRole();

  const { data: tasks = [], isLoading: tasksLoading } = useQuery<any[]>({
    queryKey: ['/api/tasks', currentTeamId, effectiveRole],
    queryFn: async () => {
      const res = await fetch(`/api/tasks?teamId=${currentTeamId}&effectiveRole=${effectiveRole}`, { credentials: 'include' });
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

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const res = await apiRequest('PATCH', `/api/tasks/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ predicate: (q) => (q.queryKey[0] as string)?.startsWith('/api/tasks') });
    },
  });

  const myTasks = tasks.filter((t: any) => 
    (t.title?.toLowerCase().includes(searchQuery.toLowerCase()) || t.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveTask(event.active.data.current?.task as any);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    let targetStageId = over.id as string;
    
    const overTask = tasks.find(t => t.id === over.id);
    if (overTask) {
      targetStageId = overTask.status;
    }

    const validStage = taskStages.find(s => s.id === targetStageId);
    
    if (validStage && activeTask && activeTask.status !== targetStageId) {
      updateTaskMutation.mutate({ id: taskId, updates: { status: targetStageId } });
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  const handleTaskClick = (task: any) => {
    if (!activeId) {
      setSelectedTask(task);
      setDetailOpen(true);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 w-full max-w-[1600px] mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground leading-[1.35] tracking-tight">{currentUser?.role === 'superadmin' ? 'Team Tasks' : 'My Tasks'}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentUser?.role === 'superadmin' ? 'Manage and track tasks across the team.' : 'Manage your daily tasks and priorities.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-muted p-1 rounded-lg border flex items-center">
              <button 
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[14px] font-medium transition-all ${viewMode === 'board' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-[14px] font-medium transition-all ${viewMode === 'list' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-[40px] w-[280px] bg-card rounded-lg"
              />
            </div>
            <Button variant="outline" className="h-[40px] rounded-lg">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort By
            </Button>
            <Button variant="outline" className="h-[40px] rounded-lg">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button 
            className="h-[40px] rounded-lg px-6"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {tasksLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading tasks...</div>
        </div>
      ) : viewMode === 'board' ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
            {taskStages.map((stage) => (
              <KanbanColumn
                key={stage.id}
                id={stage.id}
                title={stage.label}
                color={stage.color}
                tasks={myTasks.filter(t => t.status === stage.id)}
                onTaskClick={handleTaskClick}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <TaskCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="flex-1 overflow-auto">
          <TasksListView tasks={myTasks} onTaskClick={handleTaskClick} />
        </div>
      )}
      
      <TaskDetailDialog 
        task={selectedTask} 
        open={detailOpen} 
        onOpenChange={setDetailOpen} 
      />
      
      <AddTaskDialog
        open={addOpen}
        onOpenChange={setAddOpen}
      />
    </div>
  );
}