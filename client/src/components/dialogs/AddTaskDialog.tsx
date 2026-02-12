import { useState } from "react";
import { useStore } from "@/lib/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Plus, CheckSquare } from "lucide-react";

interface AddTaskDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function AddTaskDialog({ children, trigger, open, onOpenChange, onSubmit }: AddTaskDialogProps) {
  const { currentUser, currentTeamId } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const isAdmin = currentUser?.role === 'superadmin';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: currentUser?.id || ""
  });

  const addTaskMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/tasks", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const taskData = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || new Date().toISOString(),
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'todo',
      assignedTo: formData.assignedTo,
      tags: [],
      teamId: currentTeamId
    };
    if (onSubmit) {
      onSubmit(taskData);
    } else {
      addTaskMutation.mutate(taskData);
    }
    setFormData({ 
      title: "", 
      description: "", 
      dueDate: "", 
      priority: "medium", 
      assignedTo: currentUser?.id || ""
    });
    setShow(false);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Task
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-[16px] overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b border flex flex-row items-center justify-between space-y-0 h-[88px]">
          <DialogTitle className="text-[18px] font-semibold text-foreground tracking-[0.36px]">Add New Task</DialogTitle>
          <div className="w-[40px] h-[40px] bg-card border border rounded-full flex items-center justify-center shadow-sm">
             <CheckSquare className="h-6 w-6 text-foreground" />
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[14px] font-medium text-muted-foreground tracking-[0.28px]">Task Title</Label>
              <Input 
                id="title" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-[52px] rounded-lg border text-[16px] text-foreground"
                placeholder="e.g. Update client proposal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[14px] font-medium text-muted-foreground tracking-[0.28px]">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[100px] rounded-lg border text-[16px] text-foreground resize-none p-3"
                placeholder="Add details about this task..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-[14px] font-medium text-muted-foreground tracking-[0.28px]">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="h-[52px] rounded-lg border text-[16px] text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-[14px] font-medium text-muted-foreground tracking-[0.28px]">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(val) => setFormData({...formData, priority: val})}
                >
                  <SelectTrigger className="h-[52px] rounded-lg border text-[16px] text-foreground">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="assignedTo" className="text-[14px] font-medium text-muted-foreground tracking-[0.28px]">Assign To</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={(val) => setFormData({...formData, assignedTo: val})}
                >
                  <SelectTrigger className="h-[52px] rounded-lg border text-[16px] text-foreground">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border flex items-center justify-end gap-3 h-[88px] bg-card">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShow(false)}
              className="h-[48px] w-[120px] rounded-[10px] border text-foreground font-semibold text-[16px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="h-[48px] w-[120px] rounded-lg font-semibold text-[16px]"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
