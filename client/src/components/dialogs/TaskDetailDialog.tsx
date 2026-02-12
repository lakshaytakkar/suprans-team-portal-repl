import { useState } from "react";
import { 
  Dialog, 
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { taskStages } from "@/lib/mock-data";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useStore } from "@/lib/store";
import { format } from "date-fns";
import { 
  Calendar, 
  User, 
  CheckSquare, 
  MoreHorizontal,
  Paperclip,
  X,
  Share2,
  Eye,
  Plus,
  ArrowRight,
  Link,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

interface TaskDetailDialogProps {
  task: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange?: (taskId: string, status: string) => void;
}

export function TaskDetailDialog({ task, open, onOpenChange, onStatusChange }: TaskDetailDialogProps) {
  const { currentUser } = useStore();
  const [activeTab, setActiveTab] = useState<'subtask' | 'attachment' | 'comments'>('subtask');
  const [comment, setComment] = useState("");

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const defaultUser = { name: "User", avatar: "" };
  const commentsUser = users.length > 1 ? users[1] : defaultUser;

  const [comments, setComments] = useState([
    { id: 1, user: commentsUser, text: "Can you please update the numbers for Q3?", time: "2 hours ago" },
    { id: 2, user: currentUser || defaultUser, text: "Sure, working on it right now.", time: "1 hour ago" }
  ]);

  if (!task) return null;

  const assignedUser = users.find((u: any) => u.id === task.assignedTo);
  const currentStage = taskStages.find(s => s.id === task.status);

  const priorityColors = {
    low: "text-[#2563eb] bg-[#eff6ff] dark:text-[#60a5fa] dark:bg-[#2563eb]/10",
    medium: "text-[#ea580c] bg-[#fff7ed] dark:text-[#fb923c] dark:bg-[#ea580c]/10",
    high: "text-[#dc2626] bg-[#fef2f2] dark:text-[#f87171] dark:bg-[#dc2626]/10"
  };

  const handleStatusChange = (val: string) => {
    if (onStatusChange) {
      onStatusChange(task.id, val);
    } else {
      updateTaskMutation.mutate({ id: task.id, data: { status: val } });
    }
  };

  const handleAddComment = () => {
    if (!comment.trim()) return;
    setComments([
      ...comments, 
      { 
        id: Date.now(), 
        user: currentUser || defaultUser, 
        text: comment, 
        time: "Just now" 
      }
    ]);
    setComment("");
    setActiveTab('comments');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] p-0 gap-0 overflow-hidden rounded-[20px] bg-card border h-[90vh] flex flex-col shadow-2xl">
        {/* Header - Fixed Height */}
        <div className="px-6 py-4 border-b border flex items-center justify-between bg-card shrink-0 h-[64px]">
          <div className="flex items-center gap-4">
            <div className="bg-muted p-2 rounded-lg">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="h-6 w-[1px] bg-border" />
            <span className="text-sm font-medium text-muted-foreground">Task Detail</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-card border border rounded-lg shadow-sm">
              <span className="text-xs font-medium text-muted-foreground">6</span>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
              <Share2 className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Main Content - Flex Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column (Main) */}
          <div className="flex-1 overflow-y-auto border-r border">
            <div className="p-8 pb-32">
              {/* Title & Desc */}
              <div className="mb-8">
                <h2 className="text-[24px] font-semibold text-foreground mb-2 leading-tight">{task.title}</h2>
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description || "No description provided for this task."}
                </p>
              </div>

              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-8 border-b border pb-8">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-[100px]">Status</span>
                  <Select 
                    defaultValue={task.status} 
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="h-8 border-none bg-[#FEEFE4] text-[#FA7319] font-medium text-xs px-3 rounded-md w-fit focus:ring-0 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {taskStages.map(stage => (
                        <SelectItem key={stage.id} value={stage.id}>
                          {stage.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-[100px]">Assigned to</span>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${task.assignedTo}`} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">{assignedUser?.name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-[100px]">Start date</span>
                  <span className="text-sm font-medium text-foreground">{format(new Date(task.createdAt || new Date()), "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-[100px]">Due date</span>
                  <span className="text-sm font-medium text-foreground">{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-muted-foreground w-[100px]">Priority</span>
                  <Badge variant="secondary" className={cn("rounded-md px-2 py-0.5 font-medium border-0 capitalize", priorityColors[task.priority as keyof typeof priorityColors])}>
                    {task.priority}
                  </Badge>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 border-b border mb-6">
                <button 
                  onClick={() => setActiveTab('subtask')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'subtask' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
                  )}
                >
                  Subtask
                </button>
                <button 
                  onClick={() => setActiveTab('attachment')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'attachment' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
                  )}
                >
                  Attachment
                </button>
                <button 
                  onClick={() => setActiveTab('comments')}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                    activeTab === 'comments' ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"
                  )}
                >
                  Comments
                </button>
              </div>

              {/* Tab Content */}
              <div className="space-y-6">
                {activeTab === 'subtask' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-muted rounded-full flex items-center justify-center">
                          <CheckSquare className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium text-foreground">Subtask</span>
                        <span className="text-sm text-muted-foreground ml-2">1/3</span>
                      </div>
                      <Button variant="outline" size="sm" className="h-8 gap-2 text-foreground">
                        <Plus className="h-3 w-3" />
                        Add Subtask
                      </Button>
                    </div>

                    <div className="space-y-3">
                       <div className="flex items-center gap-3 p-2 bg-muted rounded-lg group border border-transparent hover:border transition-all">
                         <Checkbox className="rounded-md border" checked />
                         <span className="text-sm text-muted-foreground line-through flex-1">Review requirements</span>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Avatar className="h-5 w-5"><AvatarImage src={users[1]?.avatar}/></Avatar>
                           <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3"/></Button>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 p-2 group hover:bg-muted rounded-lg transition-all">
                         <Checkbox className="rounded-md border" />
                         <span className="text-sm text-foreground flex-1">Draft initial proposal</span>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3"/></Button>
                         </div>
                       </div>
                       <div className="flex items-center gap-3 p-2 group hover:bg-muted rounded-lg transition-all">
                         <Checkbox className="rounded-md border" />
                         <span className="text-sm text-foreground flex-1">Share with team</span>
                         <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3 w-3"/></Button>
                         </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === 'comments' && (
                   <div className="space-y-6">
                      <div className="space-y-4">
                        {comments.map((c) => (
                          <div key={c.id} className="flex gap-4">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={(c.user as any)?.avatar} />
                              <AvatarFallback>{(c.user as any)?.name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground">{(c.user as any)?.name || "User"}</span>
                                <span className="text-xs text-muted-foreground">{c.time}</span>
                              </div>
                              <p className="text-sm text-foreground leading-relaxed">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex gap-4 pt-4 border-t border">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser?.avatar || ""} />
                        </Avatar>
                        <div className="flex-1 gap-2 flex flex-col">
                          <Textarea 
                            placeholder="Write a comment..." 
                            className="min-h-[80px] resize-none bg-muted border-none focus:ring-1 focus:ring-ring"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                          <div className="flex justify-between items-center">
                            <Button variant="ghost" size="sm" className="text-muted-foreground h-8">
                              <Paperclip className="h-4 w-4 mr-2" />
                              Attach
                            </Button>
                            <Button size="sm" onClick={handleAddComment} className="bg-primary h-8">
                              Send
                            </Button>
                          </div>
                        </div>
                      </div>
                   </div>
                )}
                
                {activeTab === 'attachment' && (
                  <div className="flex flex-col items-center justify-center py-12 text-center bg-muted rounded-lg border border-dashed border">
                    <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center shadow-sm mb-3">
                      <Paperclip className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="text-sm font-medium text-foreground">No attachments yet</h3>
                    <p className="text-xs text-muted-foreground mt-1 mb-4">Upload files to share with your team</p>
                    <Button variant="outline" size="sm">Upload File</Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-[360px] bg-card shrink-0 flex flex-col">
            <div className="p-6 border-b border">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <Clock className="h-4 w-4 text-muted-foreground" />
                       <span className="text-xs font-medium text-foreground">Time Remaining</span>
                     </div>
                     <span className="text-xs text-muted-foreground">4d</span>
                   </div>
                   <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span className="text-xs text-muted-foreground">Reminder</span>
                      <div className="w-8 h-4 bg-border rounded-full relative cursor-pointer">
                        <div className="absolute left-0.5 top-0.5 h-3 w-3 bg-card rounded-full shadow-sm" />
                      </div>
                   </div>
                </div>
                
                <div className="border rounded-lg p-3">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-foreground">Progress</span>
                    <span className="text-muted-foreground">40%</span>
                  </div>
                  <Progress value={40} className="h-1.5" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Activities</h3>
                 <Clock className="h-4 w-4 text-muted-foreground" />
               </div>

               <div className="relative pl-4 space-y-6 before:absolute before:left-[21px] before:top-2 before:bottom-0 before:w-[1px] before:bg-border">
                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-card bg-border ring-1 ring-border" />
                    <div className="flex gap-3 mb-2">
                      <Avatar className="h-6 w-6"><AvatarImage src={users[1]?.avatar}/></Avatar>
                      <div>
                        <p className="text-xs text-foreground"><span className="font-medium">Dea Ananda</span> checklist subtask</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Jan 8, 2024 at 10:30 AM</p>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-2 ml-9">
                      <div className="flex items-center gap-2">
                         <div className="h-4 w-4 bg-[#FA7319] rounded flex items-center justify-center">
                           <CheckSquare className="h-3 w-3 text-white" />
                         </div>
                         <span className="text-xs text-muted-foreground line-through">Accordion</span>
                      </div>
                    </div>
                 </div>

                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-card bg-border ring-1 ring-border" />
                    <div className="flex gap-3 mb-2">
                      <div className="h-6 w-6 rounded-full bg-[#EEEFF2] flex items-center justify-center">
                        <Link className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-foreground"><span className="font-medium">Rahmadini</span> moved task card</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Jan 8, 2024 at 09:00 AM</p>
                      </div>
                    </div>
                    <div className="ml-9 flex items-center gap-2">
                       <Badge variant="secondary" className="bg-[#EFEAFF] text-[#875CFE] border-0 text-[10px]">Upcoming Tasks</Badge>
                       <ArrowRight className="h-3 w-3 text-muted-foreground" />
                       <Badge variant="secondary" className="bg-[#FEEFE4] text-[#FA7319] border-0 text-[10px]">Task</Badge>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-card bg-border ring-1 ring-border" />
                    <div className="flex gap-3">
                      <Avatar className="h-6 w-6"><AvatarImage src={users[0]?.avatar}/></Avatar>
                      <div>
                        <p className="text-xs text-foreground"><span className="font-medium">Rahmadini</span> created task</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Jan 7, 2024 at 02:00 PM</p>
                      </div>
                    </div>
                 </div>
               </div>
            </div>

            <div className="p-6 border-t border mt-auto">
              <span className="text-xs text-muted-foreground block mb-2">Created by</span>
              <div className="flex items-center gap-2">
                <Avatar className="h-5 w-5"><AvatarImage src={users[0]?.avatar}/></Avatar>
                <span className="text-sm font-medium text-foreground">Rahmadini</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
