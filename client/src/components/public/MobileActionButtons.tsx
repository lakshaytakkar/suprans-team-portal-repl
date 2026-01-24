import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Phone, MessageCircle, User } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import type { Service } from "@shared/schema";

type SalesTeamMember = {
  id: string;
  name: string;
  phone: string;
};

export default function MobileActionButtons() {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);
  const [isSalesTeamOpen, setIsSalesTeamOpen] = useState(false);
  const [callbackForm, setCallbackForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    message: "",
  });
  const { toast } = useToast();

  const { data: salesTeam = [] } = useQuery<SalesTeamMember[]>({
    queryKey: ["/api/public/sales-team"],
    queryFn: async () => {
      const res = await fetch("/api/public/sales-team");
      if (!res.ok) throw new Error("Failed to fetch sales team");
      return res.json();
    },
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const submitCallback = useMutation({
    mutationFn: async (data: typeof callbackForm) => {
      const res = await fetch("/api/public/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Request Submitted!", description: "Our team will call you back shortly." });
      setIsCallbackOpen(false);
      setCallbackForm({ name: "", phone: "", email: "", service: "", message: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCallback.mutate(callbackForm);
  };

  const getDicebearAvatar = (seed: string) => {
    return `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}`;
  };

  const formatPhoneForCall = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return `tel:+91${digits}`;
  };

  const formatPhoneForWhatsApp = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    const fullNumber = digits.startsWith("91") ? digits : `91${digits}`;
    return `https://wa.me/${fullNumber}?text=Hi%2C%20I%27m%20interested%20in%20your%20services`;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
        <div className="flex">
          <button
            onClick={() => setIsCallbackOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-[#F34147] text-white font-semibold text-sm active:bg-[#D93036] transition-colors"
            data-testid="button-get-callback"
          >
            <MessageCircle className="w-5 h-5" />
            Get a Callback
          </button>
          <button
            onClick={() => setIsSalesTeamOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-100 text-gray-900 font-semibold text-sm active-elevate-2 transition-colors border-l border-gray-200"
            data-testid="button-call-now"
          >
            <Phone className="w-5 h-5" />
            Call Now
          </button>
        </div>
      </div>

      <Dialog open={isCallbackOpen} onOpenChange={setIsCallbackOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Request a Callback</DialogTitle>
            <DialogDescription>
              Fill out the form and our team will call you back within 30 minutes during business hours.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCallbackSubmit} className="space-y-4 pt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name *</label>
              <Input
                required
                placeholder="Your full name"
                value={callbackForm.name}
                onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                data-testid="input-callback-name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone *</label>
              <Input
                required
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={callbackForm.phone}
                onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                data-testid="input-callback-phone"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="your@email.com (optional)"
                value={callbackForm.email}
                onChange={(e) => setCallbackForm({ ...callbackForm, email: e.target.value })}
                data-testid="input-callback-email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service Interested In</label>
              <Select
                value={callbackForm.service}
                onValueChange={(value) => setCallbackForm({ ...callbackForm, service: value })}
              >
                <SelectTrigger data-testid="select-callback-service">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.name}>
                      {service.name}
                    </SelectItem>
                  ))}
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Tell us briefly about your requirements..."
                rows={3}
                value={callbackForm.message}
                onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                data-testid="input-callback-message"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F34147] hover:bg-[#D93036] text-white py-6 text-base font-semibold"
              disabled={submitCallback.isPending}
              data-testid="button-submit-callback"
            >
              {submitCallback.isPending ? "Submitting..." : "Request Callback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isSalesTeamOpen} onOpenChange={setIsSalesTeamOpen}>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Talk to Our Sales Team</DialogTitle>
            <DialogDescription>
              Choose a team member to connect with directly via WhatsApp or phone call.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-2">
            {salesTeam.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No team members available at the moment</p>
              </div>
            ) : (
              salesTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100"
                  data-testid={`sales-member-tile-${member.id}`}
                >
                  <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                    <AvatarImage src={getDicebearAvatar(member.name)} alt={member.name} />
                    <AvatarFallback className="bg-[#F34147] text-white font-semibold">
                      {member.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{member.name}</h4>
                    <p className="text-sm text-gray-500">Sales Executive</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={formatPhoneForWhatsApp(member.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
                      data-testid={`button-whatsapp-${member.id}`}
                    >
                      <SiWhatsapp className="w-5 h-5" />
                    </a>
                    <a
                      href={formatPhoneForCall(member.phone)}
                      className="w-10 h-10 flex items-center justify-center bg-[#F34147] hover:bg-[#D93036] text-white rounded-full transition-colors"
                      data-testid={`button-call-${member.id}`}
                    >
                      <Phone className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom, 0);
        }
      `}</style>
    </>
  );
}
