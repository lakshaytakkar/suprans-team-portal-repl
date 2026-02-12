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
} from "@dnd-kit/core";
import { 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { taskStages, Task, mockUsers } from "@/lib/mock-data";
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

// Kanban Column Component
function KanbanColumn({ id, title, tasks, color, onTaskClick }: { id: string, title: string, tasks: Task[], color: string, onTaskClick?: (task: Task) => void }) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div className="flex flex-col h-full min-w-[280px] w-full max-w-[320px] bg-[#F8F9FB] rounded-[16px] border border-[#DFE1E7]">
      <div className="p-4 flex items-center justify-between border-b border-[#DFE1E7]">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full bg-${color}-500`} />
          <span className="font-semibold text-[14px] text-[#0D0D12]">{title}</span>
        </div>
        <Badge variant="secondary" className="bg-white text-[#666D80] border-[#DFE1E7]">{tasks.length}</Badge>
      </div>
      
      <div ref={setNodeRef} className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-220px)] scrollbar-thin">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="h-24 flex items-center justify-center text-xs text-[#666D80] border border-dashed border-[#DFE1E7] rounded-md">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}

// Draggable Card Component
function SortableTaskCard({ task, onClick }: { task: Task, onClick?: (task: Task) => void }) {
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

// Actual Card UI
function TaskCard({ task }: { task: Task }) {
  const priorityColor = {
    low: "text-blue-500 bg-blue-50",
    medium: "text-orange-500 bg-orange-50",
    high: "text-red-500 bg-red-50"
  };

  return (
    <Card className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all border-[#DFE1E7] bg-white group">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <Badge className={`text-[10px] px-2 py-0.5 border-0 font-medium ${priorityColor[task.priority]} capitalize`}>
            {task.priority}
          </Badge>
          <button className="text-[#666D80] hover:text-[#0D0D12] opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-1">
          <h4 className="text-[14px] font-semibold text-[#0D0D12] leading-tight">{task.title}</h4>
          <p className="text-[12px] text-[#666D80] line-clamp-2">{task.description}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {task.tags?.map(tag => (
            <span key={tag} className="text-[10px] font-medium text-[#666D80] bg-[#F8F9FB] px-2 py-0.5 rounded-full border border-[#DFE1E7]">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#F8F9FB]">
          <div className="flex items-center gap-1.5 text-[12px] text-[#666D80]">
            <Calendar className="h-3.5 w-3.5" />
            <span>{format(new Date(task.dueDate), 'MMM d')}</span>
          </div>
          <Avatar className="h-6 w-6 border border-white shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${task.assignedTo}`} />
            <AvatarFallback className="text-[10px]">U</AvatarFallback>
          </Avatar>
        </div>
      </CardContent>
    </Card>
  );
}

function TasksListView({ tasks, onTaskClick }: { tasks: Task[], onTaskClick: (task: Task) => void }) {
  const priorityColor = {
    low: "text-blue-500 bg-blue-50 border-blue-100",
    medium: "text-orange-500 bg-orange-50 border-orange-100",
    high: "text-red-500 bg-red-50 border-red-100"
  };

  return (
    <div className="border border-[#DFE1E7] rounded-[12px] overflow-hidden bg-white shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]">
      <Table>
        <TableHeader className="bg-[#F8F9FB]">
          <TableRow className="hover:bg-transparent border-[#DFE1E7]">
            <TableHead className="w-[50px] pl-6">
              <Checkbox className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" />
            </TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider h-[48px]">Task Name</TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider">Due Date</TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider">Assignee</TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider w-[200px]">Progress</TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider">Priority</TableHead>
            <TableHead className="text-[12px] font-medium text-[#666D80] uppercase tracking-wider text-right pr-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow 
              key={task.id} 
              className="hover:bg-[#F8F9FB] border-[#DFE1E7] cursor-pointer group transition-colors"
              onClick={() => onTaskClick(task)}
            >
              <TableCell className="pl-6 py-4">
                <Checkbox 
                  className="border-[#DFE1E7] data-[state=checked]:bg-[#F34147] data-[state=checked]:border-[#F34147] rounded-[4px]" 
                  onClick={(e) => e.stopPropagation()}
                />
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1">
                  <span className="text-[14px] font-medium text-[#0D0D12]">{task.title}</span>
                  <span className="text-[12px] text-[#666D80] line-clamp-1">{task.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-[14px] text-[#0D0D12]">{format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
              </TableCell>
              <TableCell>
                <div className="flex -space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-white">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${task.assignedTo}`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="h-8 w-8 rounded-full bg-[#F3F4F6] border-2 border-white flex items-center justify-center text-[10px] text-[#666D80] font-medium">
                    +2
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Progress value={task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : 0} className="h-1.5" indicatorClassName="bg-[#F34147]" />
                  <span className="text-[12px] font-medium text-[#0D0D12]">
                    {task.status === 'done' ? '100%' : task.status === 'in_progress' ? '50%' : '0%'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={`border ${priorityColor[task.priority]} font-medium`}>
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell className="text-right pr-6">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80] hover:text-[#0D0D12] opacity-0 group-hover:opacity-100 transition-opacity">
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
  const { tasks, updateTaskStatus, currentUser, simulatedRole } = useStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState("");
  
  const isAdmin = currentUser?.role === 'superadmin';
  const effectiveManager = isAdmin && simulatedRole !== 'executive';

  const myTasks = tasks.filter(t => 
    (effectiveManager ? true : (t.assignedTo === currentUser?.id || t.assignedTo === 'u1')) &&
    (t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveTask(event.active.data.current?.task as Task);
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
      updateTaskStatus(taskId, targetStageId as any);
    }
    
    setActiveId(null);
    setActiveTask(null);
  };

  const handleTaskClick = (task: Task) => {
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
            <h1 className="text-[24px] font-bold text-[#0D0D12]">{currentUser.role === 'superadmin' ? 'Team Tasks' : 'My Tasks'}</h1>
            <p className="text-[14px] text-[#666D80] mt-1">
              {currentUser.role === 'superadmin' ? 'Manage and track tasks across the team.' : 'Manage your daily tasks and priorities.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#F9F9FB] p-1 rounded-[8px] border border-[#DFE1E7] flex items-center">
              <button 
                onClick={() => setViewMode('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[14px] font-medium transition-all ${viewMode === 'board' ? 'bg-white text-[#0D0D12] shadow-sm' : 'text-[#666D80] hover:text-[#0D0D12]'}`}
              >
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[14px] font-medium transition-all ${viewMode === 'list' ? 'bg-white text-[#0D0D12] shadow-sm' : 'text-[#666D80] hover:text-[#0D0D12]'}`}
              >
                <List className="h-4 w-4" />
                List
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-[#DFE1E7]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#666D80]" />
              <Input 
                placeholder="Search tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-[40px] w-[280px] border-[#DFE1E7] bg-white rounded-[10px]"
              />
            </div>
            <Button variant="outline" className="h-[40px] border-[#DFE1E7] text-[#666D80] rounded-[10px] hover:text-[#0D0D12] bg-white">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              Sort By
            </Button>
            <Button variant="outline" className="h-[40px] border-[#DFE1E7] text-[#666D80] rounded-[10px] hover:text-[#0D0D12] bg-white">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
          <Button 
            className="bg-[#F34147] hover:bg-[#D93036] text-white h-[40px] rounded-[10px] px-6"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'board' ? (
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