import { useState } from "react";
import { useStore } from "@/lib/store";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Phone, Mail, Calendar, Clock, BookOpen } from "lucide-react";
import { Input } from "@/components/ui/input";

interface LogActivityDialogProps {
  leadId: string;
  trigger?: React.ReactNode;
  defaultType?: 'call' | 'email' | 'meeting';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function LogActivityDialog({ leadId, trigger, defaultType = 'call', open, onOpenChange, onSubmit }: LogActivityDialogProps) {
  const { currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const { data: templates } = useQuery<any>({
    queryKey: ["/api/templates"],
  });

  const addActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/activities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/activities"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    }
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiRequest("PATCH", `/api/leads/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    }
  });

  const [type, setType] = useState(defaultType);
  const [notes, setNotes] = useState("");
  const [duration, setDuration] = useState("");
  const [outcome, setOutcome] = useState("connected");
  
  const [scheduleFollowUp, setScheduleFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");
  const [followUpTime, setFollowUpTime] = useState("");
  
  const [selectedTemplate, setSelectedTemplate] = useState("none");

  const mockTemplates = templates || { scripts: [], emails: [], messages: [], objections: [] };

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    if (val === "none") return;
    
    const allTemplates = [
      ...(mockTemplates.scripts || []), 
      ...(mockTemplates.emails || []), 
      ...(mockTemplates.messages || []), 
      ...(mockTemplates.objections || [])
    ];
    
    const template = allTemplates.find((t: any) => t.id === val);
    if (template) {
      if ('content' in template) {
        setNotes((prev) => prev ? prev + "\n\n" + template.content : template.content);
      } else if ('response' in template) {
        setNotes((prev) => prev ? prev + "\n\n" + template.response : template.response);
      }
    }
  };

  const handleSubmit = () => {
    const activityData = {
      leadId,
      userId: currentUser?.id,
      type,
      notes,
      duration: Number(duration),
      outcome
    };

    if (onSubmit) {
      onSubmit(activityData);
    } else {
      addActivityMutation.mutate(activityData);
    }

    if (scheduleFollowUp && followUpDate) {
      const scheduledTime = followUpTime ? new Date(`${followUpDate}T${followUpTime}`) : new Date(followUpDate);
      
      updateLeadMutation.mutate({
        id: leadId,
        data: { nextFollowUp: scheduledTime.toISOString() }
      });
    }

    setNotes("");
    setDuration("");
    setScheduleFollowUp(false);
    setFollowUpDate("");
    setFollowUpTime("");
    setShow(false);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Activity Type</Label>
            <div className="flex gap-2">
              <Button 
                variant={type === 'call' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setType('call')}
              >
                <Phone className="mr-2 h-4 w-4" /> Call
              </Button>
              <Button 
                variant={type === 'email' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setType('email')}
              >
                <Mail className="mr-2 h-4 w-4" /> Email
              </Button>
              <Button 
                variant={type === 'meeting' ? 'default' : 'outline'} 
                size="sm" 
                className="flex-1"
                onClick={() => setType('meeting')}
              >
                <Calendar className="mr-2 h-4 w-4" /> Meeting
              </Button>
            </div>
          </div>
          
          {type !== 'email' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected</SelectItem>
                    <SelectItem value="busy">Busy/No Answer</SelectItem>
                    <SelectItem value="left_message">Left Message</SelectItem>
                    <SelectItem value="wrong_number">Wrong Number</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center justify-between">
              Notes 
              <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                <SelectTrigger className="w-[200px] h-7 text-xs">
                  <BookOpen className="mr-2 h-3 w-3" />
                  <SelectValue placeholder="Use Template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Template</SelectItem>
                  {type === 'call' && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Scripts</div>
                      {(mockTemplates.scripts || []).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                    </>
                  )}
                  {type === 'email' && (
                    <>
                      <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Emails</div>
                      {(mockTemplates.emails || []).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                    </>
                  )}
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Objection Handlers</div>
                  {(mockTemplates.objections || []).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </Label>
            <Textarea 
              placeholder="What happened?" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          <div className="border-t pt-4 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <Button 
                variant={scheduleFollowUp ? "secondary" : "outline"} 
                size="sm"
                onClick={() => setScheduleFollowUp(!scheduleFollowUp)}
                className="w-full justify-start"
              >
                <Clock className="mr-2 h-4 w-4" />
                {scheduleFollowUp ? "Schedule Follow-up" : "No Follow-up Needed"}
              </Button>
            </div>

            {scheduleFollowUp && (
              <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input 
                    type="time" 
                    value={followUpTime}
                    onChange={(e) => setFollowUpTime(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>Save Log</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
