import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Phone, MessageCircle, Mail, Clock, Users, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PublicLayout from "@/components/public/PublicLayout";
import type { Service } from "@shared/schema";

const serviceDetails: Record<string, {
  highlights: string[];
  features: { title: string; description: string }[];
  process: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
}> = {
  "China Business Travel": {
    highlights: [
      "4★ Hotel (Twin Sharing) included",
      "Personal Mandarin translator & guide",
      "Canton Fair entry badge assistance",
      "Indian Tour Manager & China Support Team",
    ],
    features: [
      { title: "Complete Package", description: "7N/8D all-inclusive business travel package" },
      { title: "Daily Meals", description: "Breakfast + Indian dinner included daily" },
      { title: "Fair Transfers", description: "Airport & fair transfers via AC coach" },
      { title: "Pearl River Cruise", description: "Night cruise included in the package" },
    ],
    process: [
      { step: 1, title: "Book Package", description: "Choose your Canton Fair phase (April/October)" },
      { step: 2, title: "Submit Documents", description: "We assist with China visa application" },
      { step: 3, title: "Travel to China", description: "Guided tour with Indian team support" },
      { step: 4, title: "Supplier Connect", description: "Post-fair supplier coordination & follow-up" },
    ],
    faqs: [
      { question: "When is the Canton Fair?", answer: "Held twice yearly: Phase 1 (15-19 April), Phase 2 (23-27 April), Phase 3 (1-5 May). October dates follow similar pattern." },
      { question: "What's not included?", answer: "China sticker visa, international flights, lunch & personal expenses, and single room upgrade." },
      { question: "Do I need to pay upfront?", answer: "Full payment is required before visa submission. No refund except in case of visa rejection (service charges apply)." },
    ],
  },
  "Dropshipping": {
    highlights: [
      "Guaranteed first-order support",
      "Private China suppliers & fast shipping",
      "$800+ ad & tool access included",
      "1:1 mentorship + group sessions",
    ],
    features: [
      { title: "Private Suppliers", description: "Direct China supplier intros with MOQ negotiation (no Zendrop/CJ)" },
      { title: "Store Build", description: "Full Shopify store setup with CRO, tracking & analytics" },
      { title: "Ad Campaigns", description: "Meta/TikTok ad creative + campaign setup included" },
      { title: "Fulfillment", description: "US fulfillment & warehousing integration for 7-day delivery" },
    ],
    process: [
      { step: 1, title: "Onboarding", description: "Goal setting, store audit, tools & mentor assignment" },
      { step: 2, title: "Product Research", description: "Data-driven product selection & supplier sourcing" },
      { step: 3, title: "Store & Ads", description: "Store build, CRO optimization & ad launch" },
      { step: 4, title: "Scale & Exit", description: "Scaling playbooks, SOPs & brand growth planning" },
    ],
    faqs: [
      { question: "What is the program length?", answer: "90-day mentorship with weekly live sessions, fortnightly group calls, and 1:1 mentor check-ins." },
      { question: "Do you provide private suppliers?", answer: "Yes — we introduce private China suppliers (no Zendrop/CJ), negotiate MOQ, coordinate samples and perform QC checks." },
      { question: "What guarantee do you offer?", answer: "We offer focused support and guaranteed first-order assistance — we work alongside until your first USA order happens." },
    ],
  },
  "Brand Development": {
    highlights: [
      "Direct factory connect (no brokers)",
      "Custom packaging & branding included",
      "Certifications (FDA/CE/FCC/RoHS)",
      "Lifetime factory support",
    ],
    features: [
      { title: "Factory Hunt", description: "Real factory sourcing (not trading companies) with direct contact" },
      { title: "Branding Package", description: "Logo, packaging design, print-ready files and samples" },
      { title: "Store Setup", description: "Amazon/Shopify listing with SEO-ready content" },
      { title: "Fulfillment", description: "DDP handling, 3PL integration, returns & SOPs" },
    ],
    process: [
      { step: 1, title: "Discovery", description: "Client call, market benchmarking, product shortlist" },
      { step: 2, title: "Factory Hunt", description: "Factory shortlisting, MOQ negotiation, sample testing" },
      { step: 3, title: "Branding", description: "Logo, packaging design, certifications" },
      { step: 4, title: "Launch", description: "Store listing, fulfillment setup, marketing readiness" },
    ],
    faqs: [
      { question: "What is Brand Development?", answer: "Building a private-label product from research, factory sourcing, packaging & compliance to launch on Amazon/Shopify." },
      { question: "Do you share real factory contacts?", answer: "Yes — we connect you directly with verified factories (no brokers). You receive real supplier contact once approved." },
      { question: "How long does the process take?", answer: "6–12 weeks for simple SKU setup (sourcing + samples), longer for complex custom molds or multi-SKU projects." },
    ],
  },
  "Consulting": {
    highlights: [
      "Direct call with Mr. Suprans",
      "Custom sourcing strategies",
      "Market entry planning",
      "Business growth roadmap",
    ],
    features: [
      { title: "Expert Session", description: "One-on-one consultation with Mr. Suprans himself" },
      { title: "Product Strategy", description: "Discuss your product, sourcing plan or business strategy" },
      { title: "Market Insights", description: "Get industry-specific guidance and recommendations" },
      { title: "Action Plan", description: "Walk away with a clear roadmap for your business" },
    ],
    process: [
      { step: 1, title: "Book Appointment", description: "Schedule a direct consultation call" },
      { step: 2, title: "Prepare Questions", description: "List your key business challenges" },
      { step: 3, title: "Strategy Session", description: "Discuss solutions with Mr. Suprans" },
      { step: 4, title: "Implementation", description: "Execute the recommended action plan" },
    ],
    faqs: [
      { question: "Who will I speak with?", answer: "You'll have a direct consultation with Mr. Suprans or a senior team member based on your requirements." },
      { question: "How long is the session?", answer: "Standard consultations are 30-60 minutes. Extended sessions available for complex requirements." },
    ],
  },
};

const defaultDetails = {
  highlights: [
    "Expert guidance from industry professionals",
    "End-to-end support throughout the process",
    "Transparent pricing with no hidden fees",
    "Dedicated account manager",
  ],
  features: [
    { title: "Professional Service", description: "Work with experienced professionals" },
    { title: "Full Support", description: "Complete assistance from start to finish" },
    { title: "Quality Assured", description: "Guaranteed quality and satisfaction" },
    { title: "Fast Turnaround", description: "Quick and efficient service delivery" },
  ],
  process: [
    { step: 1, title: "Consultation", description: "Discuss your requirements" },
    { step: 2, title: "Planning", description: "We create a custom plan" },
    { step: 3, title: "Execution", description: "We handle the implementation" },
    { step: 4, title: "Delivery", description: "Receive your completed service" },
  ],
  faqs: [
    { question: "How do I get started?", answer: "Book a free consultation call to discuss your needs." },
    { question: "What support do you provide?", answer: "We offer complete support throughout the entire process." },
  ],
};

export default function PublicServiceDetail() {
  const [, params] = useRoute("/services/:id");
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params?.id]);

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const service = services.find(s => s.id === params?.id);
  const details = service?.category ? (serviceDetails[service.category] || defaultDetails) : defaultDetails;

  if (!service && services.length > 0) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <Link href="/services">
              <Button className="bg-[#F34147] hover:bg-[#D93036] text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Button>
            </Link>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!service) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F34147]"></div>
        </div>
      </PublicLayout>
    );
  }

  const categoryColors: Record<string, { bg: string; overlay: string }> = {
    "China Business Travel": { bg: "from-red-900 to-red-800", overlay: "bg-red-950/40" },
    "Dropshipping": { bg: "from-amber-900 to-orange-800", overlay: "bg-amber-950/40" },
    "Brand Development": { bg: "from-blue-900 to-indigo-800", overlay: "bg-blue-950/40" },
    "Consulting": { bg: "from-emerald-900 to-green-800", overlay: "bg-emerald-950/40" },
  };

  const colorScheme = categoryColors[service.category] || { bg: "from-gray-900 to-gray-800", overlay: "bg-gray-950/40" };

  return (
    <PublicLayout>
      {/* Hero with grainy texture */}
      <section className={`relative bg-gradient-to-br ${colorScheme.bg} text-white py-16 lg:py-24 overflow-hidden`}>
        {/* Grainy texture overlay */}
        <div className={`absolute inset-0 ${colorScheme.overlay}`} style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.15
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link href="/services" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm mb-4">
                {service.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">{service.name}</h1>
              <p className="text-lg text-white/90 mb-8">{service.description}</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setIsInquiryOpen(true)}
                  className="btn-shine text-black px-8 py-3 font-bold shadow-lg"
                >
                  Get a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <a href="tel:+919350818272">
                  <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 shadow-lg">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {details.highlights.map((highlight, index) => (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Highlights */}
      <section className="lg:hidden py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4">
            {details.highlights.map((highlight, index) => (
              <div key={index} className="bg-white rounded-xl p-4 flex items-start gap-3 border border-gray-200">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{highlight}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Included</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need for a successful outcome
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {details.features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="w-14 h-14 mx-auto mb-4 bg-[#F34147]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-7 h-7 text-[#F34147]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process to get you started
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {details.process.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F34147] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="w-8 h-8 mx-auto mb-3 text-[#F34147]" />
              <div className="text-2xl font-bold mb-1">1000+</div>
              <div className="text-gray-400 text-sm">Happy Clients</div>
            </div>
            <div>
              <Award className="w-8 h-8 mx-auto mb-3 text-[#F34147]" />
              <div className="text-2xl font-bold mb-1">15+</div>
              <div className="text-gray-400 text-sm">Years Experience</div>
            </div>
            <div>
              <Shield className="w-8 h-8 mx-auto mb-3 text-[#F34147]" />
              <div className="text-2xl font-bold mb-1">100%</div>
              <div className="text-gray-400 text-sm">Secure Process</div>
            </div>
            <div>
              <Clock className="w-8 h-8 mx-auto mb-3 text-[#F34147]" />
              <div className="text-2xl font-bold mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {details.faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >
                <button
                  className="w-full px-6 py-4 text-left flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ArrowRight className={`w-5 h-5 text-gray-500 transition-transform ${expandedFaq === index ? "rotate-90" : ""}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 py-4 bg-white">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F34147]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-8">
            Contact us today for a free consultation and quote
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setIsInquiryOpen(true)}
              className="btn-shine text-black px-8 py-3 font-bold shadow-lg"
            >
              Get a Free Quote
            </Button>
            <a href="https://wa.me/919350818272" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-8 py-3 shadow-lg">
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      <Dialog open={isInquiryOpen} onOpenChange={setIsInquiryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Inquire about {service.name}</DialogTitle>
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
