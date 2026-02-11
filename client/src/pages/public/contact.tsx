import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Loader2, Users, Globe, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PublicLayout from "@/components/public/PublicLayout";
import type { Service } from "@shared/schema";

const salesContacts = [
  { name: "Dropshipping & LLC", email: "ds@suprans.in", phone: "+91 9350830133", role: "Mentorship & Formation" },
  { name: "China Travel & Canton Fair", email: "travel@suprans.in", phone: "+91 9350818272", role: "Travel Packages" },
  { name: "Brand Development", email: "info@suprans.in", phone: "+91 7988702534", role: "Private Label & Branding" },
  { name: "Customer Support", email: "cs@suprans.in", phone: "+91 8851492209", role: "General Inquiries" },
];

export default function PublicContact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const { data: siteContent } = useQuery({
    queryKey: ["/api/public/website-content"],
    queryFn: async () => {
      const res = await fetch("/api/public/website-content");
      if (!res.ok) throw new Error("Failed to fetch website content");
      return res.json();
    },
  });

  const phones: string[] = siteContent?.contact_info?.phones || ["+91 9350830133", "+91 9350818272", "+91 7988702534"];
  const emails: string[] = siteContent?.contact_info?.emails || ["ds@suprans.in", "info@suprans.in", "travel@suprans.in"];
  const whatsapp = siteContent?.contact_info?.whatsapp || { number: "919350818272", display: "Chat with us on WhatsApp" };
  const office = siteContent?.contact_info?.office || "New Delhi, India";
  const hours = siteContent?.contact_info?.hours || { weekday: "Monday - Saturday: 10:00 AM - 7:00 PM IST", weekend: "Sunday: Closed" };

  const createLead = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: data.message,
          service: data.service,
          source: "contact_form",
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Thank you!", description: "We'll get back to you within 24 hours." });
      setFormData({ name: "", email: "", phone: "", service: "", message: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(formData);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F34147]/10 via-white to-yellow-50 py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Contact <span className="text-[#F34147]">Us</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Sales Team Contacts */}
      <section className="py-8 md:py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Reach Our <span className="text-[#F34147]">Team</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">Contact the right department directly for faster assistance</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {salesContacts.map((contact, index) => (
              <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl md:rounded-2xl p-4 md:p-5 text-center group" data-testid={`card-sales-contact-${index}`}>
                <div
                  className="w-11 h-11 md:w-14 md:h-14 bg-[#F34147]/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                >
                  {index === 0 && <Globe className="w-5 h-5 md:w-7 md:h-7 text-[#F34147]" />}
                  {index === 1 && <MapPin className="w-5 h-5 md:w-7 md:h-7 text-[#F34147]" />}
                  {index === 2 && <Users className="w-5 h-5 md:w-7 md:h-7 text-[#F34147]" />}
                  {index === 3 && <Headphones className="w-5 h-5 md:w-7 md:h-7 text-[#F34147]" />}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{contact.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{contact.role}</p>
                <div className="space-y-1.5">
                  <a href={`tel:${contact.phone.replace(/\D/g, "")}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#F34147] transition-colors" data-testid={`link-phone-${index}`}>
                    <Phone className="w-3.5 h-3.5" /> {contact.phone}
                  </a>
                  <a href={`mailto:${contact.email}`} className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-[#F34147] transition-colors" data-testid={`link-email-${index}`}>
                    <Mail className="w-3.5 h-3.5" /> {contact.email}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-10 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#F34147]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    {phones.map((phone, index) => (
                      <p key={index} className="text-gray-600">{phone}</p>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#F34147]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    {emails.map((email, index) => (
                      <p key={index} className="text-gray-600">{email}</p>
                    ))}
                    <p className="text-gray-600">cs@suprans.in</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-[#F34147]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
                    <a 
                      href={`https://wa.me/${whatsapp.number}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#F34147] hover:underline"
                    >
                      {whatsapp.display}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#F34147]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Office</h3>
                    <p className="text-gray-600">{office}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#F34147]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Business Hours</h3>
                    <p className="text-gray-600">{hours.weekday}</p>
                    <p className="text-gray-600">{hours.weekend}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={`tel:${phones[0]?.replace(/\D/g, "")}`}>
                  <Button className="bg-[#F34147] hover:bg-[#D93036] text-white">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
                <a href={`https://wa.me/${whatsapp.number}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-5 md:p-8 rounded-xl md:rounded-2xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-5" data-testid="form-contact">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Name *</label>
                    <Input
                      required
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone *</label>
                    <Input
                      required
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      data-testid="input-contact-phone"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email *</label>
                  <Input
                    required
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    data-testid="input-contact-email"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Service Interested In</label>
                  <select
                    className="w-full h-10 px-3 border border-gray-200 rounded-md bg-white"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    data-testid="select-contact-service"
                  >
                    <option value="">Select a service (optional)</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Message *</label>
                  <Textarea
                    required
                    placeholder="Tell us about your requirements..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    data-testid="input-contact-message"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#F34147] hover:bg-[#D93036] text-white py-3"
                  disabled={createLead.isPending}
                  data-testid="button-submit-contact"
                >
                  {createLead.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 mr-2" />
                  )}
                  {createLead.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="h-64 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">{office}</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
