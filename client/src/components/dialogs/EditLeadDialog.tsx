import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
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
import { services, stages } from "@/lib/mock-data";
import { Lead } from "@/lib/mock-data";

interface EditLeadDialogProps {
  leadId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditLeadDialog({ leadId, trigger, open, onOpenChange }: EditLeadDialogProps) {
  const { leads, updateLead } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const lead = leads.find(l => l.id === leadId);

  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        value: lead.value,
        service: lead.service,
        stage: lead.stage
      });
    }
  }, [lead, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (leadId) {
      updateLead(leadId, formData);
      setShow(false);
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Lead Details</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Contact Name</Label>
              <Input 
                id="edit-name" 
                value={formData.name || ''}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input 
                id="edit-company" 
                value={formData.company || ''}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input 
                id="edit-phone" 
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-value">Deal Value</Label>
              <Input 
                id="edit-value" 
                type="number"
                value={formData.value || ''}
                onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-stage">Stage</Label>
              <Select 
                value={formData.stage} 
                onValueChange={(val: any) => setFormData({...formData, stage: val})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
