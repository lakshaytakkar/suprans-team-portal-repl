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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { services } from "@/lib/mock-data";
import { Plus, Box } from "lucide-react";

interface AddLeadDialogProps {
  children?: React.ReactNode;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddLeadDialog({ children, trigger, open, onOpenChange }: AddLeadDialogProps) {
  const { addLead, currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  // Use controlled or uncontrolled state
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    value: "",
    service: "",
    source: "Website"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLead({
      name: formData.name,
      company: formData.company,
      email: formData.email,
      phone: formData.phone,
      value: Number(formData.value) || 0,
      service: formData.service || "Other",
      stage: "new",
      assignedTo: currentUser.role === 'sales_executive' ? currentUser.id : null,
      source: formData.source
    });
    setFormData({ name: "", company: "", email: "", phone: "", value: "", service: "", source: "Website" });
    setShow(false);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger || children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0 rounded-[16px] overflow-hidden gap-0">
        <DialogHeader className="p-6 border-b border-[#DFE1E7] flex flex-row items-center justify-between space-y-0 h-[88px]">
          <DialogTitle className="text-[18px] font-semibold text-[#0D0D12] tracking-[0.36px]">Add New Lead</DialogTitle>
          <div className="w-[40px] h-[40px] bg-white border border-[#DFE1E7] rounded-full flex items-center justify-center shadow-sm">
             <Box className="h-6 w-6 text-[#0D0D12]" />
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Contact Name</Label>
                <Input 
                  id="name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Company</Label>
                <Input 
                  id="company" 
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Phone</Label>
                <Input 
                  id="phone" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Deal Value (₹)</Label>
                <Input 
                  id="value" 
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({...formData, value: e.target.value})}
                  className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service" className="text-[14px] font-medium text-[#666D80] tracking-[0.28px]">Interested Service</Label>
                <Select 
                  value={formData.service} 
                  onValueChange={(val) => setFormData({...formData, service: val})}
                >
                  <SelectTrigger className="h-[52px] rounded-[12px] border-[#DFE1E7] text-[16px] text-[#0D0D12]">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(s => (
                      <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
