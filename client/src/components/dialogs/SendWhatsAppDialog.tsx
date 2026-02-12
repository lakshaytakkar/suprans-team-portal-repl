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
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { MessageSquare, BookOpen, Loader2, Check } from "lucide-react";

interface SendWhatsAppDialogProps {
  leadId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultMessage?: string;
}

export function SendWhatsAppDialog({ leadId, trigger, open, onOpenChange, defaultMessage }: SendWhatsAppDialogProps) {
  const { currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'compose' | 'sending' | 'success'>('compose');
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const { data: lead } = useQuery<any>({
    queryKey: ["/api/leads", leadId],
    enabled: !!leadId,
  });

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
    }
  });

  const mockTemplates = templates || { scripts: [], emails: [], messages: [], objections: [] };
  
  const [content, setContent] = useState(defaultMessage || "");
  const [selectedTemplate, setSelectedTemplate] = useState("none");

  if (!lead) return null;

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    if (val === "none") return;
    
    const template = (mockTemplates.messages || []).find((t: any) => t.id === val);
    if (template) {
      setContent(template.content
        .replace('[Name]', lead.name)
        .replace('[Company]', lead.company)
        .replace('[Your Name]', currentUser?.name || '')
      );
    }
  };

  const handleSend = () => {
    setStep('sending');
    setTimeout(() => {
      setStep('success');
      
      addActivityMutation.mutate({
        leadId,
        userId: currentUser?.id,
        type: 'note',
        notes: `Sent WhatsApp: ${content}`,
        outcome: 'sent'
      });
      
      window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(content)}`, '_blank');
      
    }, 1000);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setStep('compose');
      setContent("");
      setSelectedTemplate("none");
    }, 300);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Send WhatsApp Message</DialogTitle>
          <DialogDescription>
            Message {lead.name} on {lead.phone}
          </DialogDescription>
        </DialogHeader>

        {step === 'compose' && (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label className="flex items-center justify-between">
                Template
                <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                  <SelectTrigger className="w-[200px] h-7 text-xs">
                    <BookOpen className="mr-2 h-3 w-3" />
                    <SelectValue placeholder="Use Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Template</SelectItem>
                    {(mockTemplates.messages || []).map((t: any) => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[150px]"
              />
            </div>
          </div>
        )}

        {step === 'sending' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-green-600" />
            <p className="text-sm text-muted-foreground">Opening WhatsApp...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Opened WhatsApp!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                The conversation has been opened in a new tab.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'compose' ? (
            <Button onClick={handleSend} className="bg-[#25D366] hover:bg-[#128C7E] text-white" disabled={!content}>
              <MessageSquare className="mr-2 h-4 w-4" /> Send WhatsApp
            </Button>
          ) : step === 'success' ? (
            <Button onClick={handleClose}>Done</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
