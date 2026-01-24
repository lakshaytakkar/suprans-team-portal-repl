import { useState } from "react";
import { useStore } from "@/lib/store";
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
import { mockUsers } from "@/lib/mock-data";
import { Plus, CheckSquare } from "lucide-react";

interface AddTaskDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddTaskDialog({ children, trigger, open, onOpenChange }: AddTaskDialogProps) {
  const { addTask, currentUser, users } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const isAdmin = currentUser.role === 'superadmin';

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignedTo: currentUser.id
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTask({
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate || new Date().toISOString(),
      priority: formData.priority as 'low' | 'medium' | 'high',
      status: 'todo',
      assignedTo: formData.assignedTo,
      tags: []
    });
    setFormData({ 
      title: "", 
      description: "", 
      dueDate: "", 
      priority: "medium", 
      assignedTo: currentUser.id 
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
        <DialogHeader className="p-6 border-b border-[#DFE1E7] flex flex-row items-center justify-between space-y-0 h-[88px]">
          <DialogTitle className="text-[18px] font-semibold text-[#0D0D12] tracking-[0.36px]">Add New Task</DialogTitle>
          <div className="w-[40px] h-[40px] bg-white border border-[#DFE1E7] rounded-full flex items-center justify-center shadow-sm">
             <CheckSquare className="h-6 w-6 text-[#0D0D12]" />
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Task Title</Label>
              <Input 
                id="title" 
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                placeholder="e.g. Update client proposal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="min-h-[100px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12] resize-none p-3"
                placeholder="Add details about this task..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Due Date</Label>
                <Input 
                  id="dueDate" 
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Priority</Label>
                <Select 
                  value={formData.priority} 
                  onValueChange={(val) => setFormData({...formData, priority: val})}
                >
                  <SelectTrigger className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]">
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
                <Label htmlFor="assignedTo" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Assign To</Label>
                <Select 
                  value={formData.assignedTo} 
                  onValueChange={(val) => setFormData({...formData, assignedTo: val})}
                >
                  <SelectTrigger className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]">
                    <SelectValue placeholder="Select team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <div className="p-6 border-t border-[#DFE1E7] flex items-center justify-end gap-3 h-[88px] bg-white">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShow(false)}
              className="h-[48px] w-[120px] rounded-[10px] border-[#DFE1E7] text-[#0D0D12] font-semibold text-[16px]"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="h-[48px] w-[120px] rounded-[10px] bg-[#F34147] hover:bg-[#D93036] text-white font-semibold text-[16px] border border-[#F34147] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)]"
            >
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}