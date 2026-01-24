import { useState } from "react";
import { useStore } from "@/lib/store";
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
import { Mail, BookOpen, Loader2, Check } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";

interface SendEmailDialogProps {
  leadId: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SendEmailDialog({ leadId, trigger, open, onOpenChange }: SendEmailDialogProps) {
  const { leads, addActivity, currentUser } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'compose' | 'sending' | 'success'>('compose');
  
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  const lead = leads.find(l => l.id === leadId);
  
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("none");

  if (!lead) return null;

  const handleTemplateChange = (val: string) => {
    setSelectedTemplate(val);
    if (val === "none") return;
    
    const template = mockTemplates.emails.find(t => t.id === val);
    if (template) {
      setSubject(template.subject.replace('[Company]', lead.company));
      setContent(template.content
        .replace('[Name]', lead.name)
        .replace('[Company]', lead.company)
        .replace('[Your Name]', currentUser.name)
      );
    }
  };

  const handleSend = () => {
    setStep('sending');
    // Simulate API call
    setTimeout(() => {
      setStep('success');
      
      // Log the activity
      addActivity({
        leadId,
        userId: currentUser.id,
        type: 'email',
        notes: `Sent Email: ${subject}`,
        outcome: 'sent'
      });
    }, 1500);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      setStep('compose');
      setSubject("");
      setContent("");
      setSelectedTemplate("none");
    }, 300);
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email</DialogTitle>
          <DialogDescription>
            Send an email to {lead.name} ({lead.email})
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
                    {mockTemplates.emails.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Subject</Label>
              <Input 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Email subject..."
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your email content..."
                className="min-h-[200px]"
              />
            </div>
          </div>
        )}

        {step === 'sending' && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Sending email...</p>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Email Sent!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your email has been sent successfully.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 'compose' ? (
            <Button onClick={handleSend} disabled={!subject || !content}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </Button>
          ) : step === 'success' ? (
            <Button onClick={handleClose}>Done</Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
