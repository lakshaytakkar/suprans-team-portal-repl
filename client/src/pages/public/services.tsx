import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Package, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "@/components/public/PublicLayout";
import type { Service } from "@shared/schema";

const categoryInfo: Record<string, { description: string; color: string; bgColor: string }> = {
  "China Business Travel": {
    description: "Canton Fair business tours with 4★ hotel, translator, fair access, and Indian support team. Perfect for importers and wholesalers.",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
  "Dropshipping": {
    description: "90-day USA dropshipping mentorship with private China suppliers, store setup, ads guidance, and guaranteed first-order support.",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
  "Brand Development": {
    description: "Private label/OEM development with real factory sourcing, custom packaging, certifications, and lifetime factory connect.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  "Consulting": {
    description: "Direct consultation with Mr. Suprans to discuss your product, sourcing plan, or business strategy.",
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
};

export default function PublicServices() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const categories = Object.keys(servicesByCategory);
  const displayedServices = activeCategory
    ? servicesByCategory[activeCategory] || []
    : services;

  const openInquiry = (service?: Service) => {
    setSelectedService(service || null);
    setIsInquiryOpen(true);
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#F34147]/10 via-white to-yellow-50 py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Our <span className="text-[#F34147]">Services</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-6 md:mb-8">
            Comprehensive solutions to help you build and scale your global business. 
            From China travel to USA dropshipping to brand development, we've got you covered.
          </p>
          <Button
            onClick={() => openInquiry()}
            className="btn-shine-red text-white px-8 py-3"
          >
            Request a Quote <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      {categories.length > 1 && (
        <section className="py-8 bg-white border-b sticky top-[72px] z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant={activeCategory === null ? "default" : "outline"}
                onClick={() => setActiveCategory(null)}
                className={activeCategory === null ? "bg-[#F34147] hover:bg-[#D93036]" : ""}
              >
                All Services
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  onClick={() => setActiveCategory(category)}
                  className={activeCategory === category ? "bg-[#F34147] hover:bg-[#D93036]" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-10 md:py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F34147] mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Services coming soon</p>
            </div>
          ) : activeCategory ? (
            // Single category view
            <div>
              <div className="mb-8">
                <h2 className={`text-2xl font-bold ${categoryInfo[activeCategory]?.color || "text-gray-800"} mb-2`}>
                  {activeCategory}
                </h2>
                <p className="text-gray-600">
                  {categoryInfo[activeCategory]?.description || "Explore our services in this category."}
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    categoryInfo={categoryInfo[activeCategory]}
                  />
                ))}
              </div>
            </div>
          ) : (
            // All categories view
            <div className="space-y-16">
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category}>
                  <div className="mb-8">
                    <h2 className={`text-2xl font-bold ${categoryInfo[category]?.color || "text-gray-800"} mb-2`}>
                      {category}
                    </h2>
                    <p className="text-gray-600">
                      {categoryInfo[category]?.description || "Explore our services in this category."}
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        categoryInfo={categoryInfo[category]}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-3 md:mb-4">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-gray-400 mb-6 md:mb-8 text-sm md:text-base">
            Get a callback from our team and we'll guide you to the right solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => openInquiry()}
              className="btn-shine text-black px-8 py-3 font-bold"
              data-testid="button-services-callback"
            >
              Get a Callback
            </Button>
            <a href="tel:+919350818272">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 shadow-lg" data-testid="button-services-call">
                <Phone className="w-4 h-4 mr-2" />
                Call Us Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="p-4 md:p-6">
              <Phone className="w-8 h-8 md:w-10 md:h-10 mx-auto text-[#F34147] mb-3 md:mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+91 9350-818-272 (Mr. Sahil)</p>
              <p className="text-gray-600">+91 9266-370-813 (Mr. Yash)</p>
            </div>
            <div className="p-6">
              <Mail className="w-10 h-10 mx-auto text-[#F34147] mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">ds@suprans.in</p>
              <p className="text-gray-600">info@suprans.in</p>
            </div>
            <div className="p-6">
              <MessageCircle className="w-10 h-10 mx-auto text-[#F34147] mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">WhatsApp</h3>
              <a href="https://wa.me/919350818272" className="text-[#F34147] hover:underline">
                Chat with us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {selectedService ? `Inquire about ${selectedService.name}` : "Request a Quote"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Service</label>
              <select 
                className="w-full h-10 px-3 border border-gray-200 rounded-md"
                defaultValue={selectedService?.id || ""}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Tell us about your requirements..." rows={3} />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F34147] hover:bg-[#D93036] text-white"
            >
              Submit Inquiry
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </PublicLayout>
  );
}

function ServiceCard({ 
  service, 
  categoryInfo
}: { 
  service: Service; 
  categoryInfo?: { bgColor: string }; 
}) {
  return (
    <Link
      href={`/services/${service.id}`}
      className={`block p-6 rounded-2xl border-2 ${categoryInfo?.bgColor || "bg-gray-50 border-gray-200"} hover:shadow-lg transition-all h-full`}
    >
      <h3 className="text-lg font-bold text-gray-900 mb-3">{service.name}</h3>
      <p className="text-gray-600 mb-4 text-sm line-clamp-3">{service.description}</p>
      <div className="flex items-center text-[#F34147] font-medium text-sm">
        Learn More <ArrowRight className="w-4 h-4 ml-1" />
      </div>
    </Link>
  );
}
