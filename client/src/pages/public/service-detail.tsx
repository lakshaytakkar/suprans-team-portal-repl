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

import bannerDropshipping from "@/assets/images/banners/banner-dropshipping.png";
import bannerLlcFormation from "@/assets/images/banners/banner-llc-formation.png";
import bannerBrandDevelopment from "@/assets/images/banners/banner-brand-development.png";
import bannerImportService from "@/assets/images/banners/banner-import-service.png";
import bannerConsultation from "@/assets/images/banners/banner-consultation.png";

const serviceBanners: Record<string, string> = {
  "srv-dropshipping": bannerDropshipping,
  "srv-llc-formation": bannerLlcFormation,
  "srv-brand-development": bannerBrandDevelopment,
  "srv-import-service": bannerImportService,
  "srv-consultation": bannerConsultation,
  "srv-virtual-meet": bannerConsultation,
  "srv-canton-fair": bannerImportService,
  "srv-china-travel": bannerImportService,
  "srv-franchise-store": bannerBrandDevelopment,
};

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
      { question: "Can I book multiple sessions?", answer: "Yes, many clients book follow-up sessions. We offer discounted packages for recurring consultations." },
      { question: "What topics can I discuss?", answer: "Anything related to global trade, sourcing, branding, market entry, dropshipping, or business scaling strategies." },
    ],
  },
  "Formation": {
    highlights: [
      "Complete USA LLC formation end-to-end",
      "EIN registration & operating agreement",
      "Registered agent included for 1 year",
      "US bank account setup assistance",
    ],
    features: [
      { title: "LLC Formation", description: "State filing in Wyoming/Delaware with all paperwork handled" },
      { title: "EIN Registration", description: "IRS Employer Identification Number obtained for your LLC" },
      { title: "Registered Agent", description: "1-year registered agent service included with formation" },
      { title: "Bank Account", description: "Guidance and support to open a US business bank account" },
    ],
    process: [
      { step: 1, title: "Consultation", description: "Discuss your LLC requirements and best state for filing" },
      { step: 2, title: "Document Prep", description: "We prepare Articles of Organization & Operating Agreement" },
      { step: 3, title: "Filing", description: "LLC filed with the state + EIN obtained from IRS" },
      { step: 4, title: "Bank Setup", description: "Assistance with US bank account opening & compliance" },
    ],
    faqs: [
      { question: "Which state is best for my LLC?", answer: "Wyoming and Delaware are most popular for Indian entrepreneurs due to no state tax and privacy protections. We help you choose the best fit." },
      { question: "How long does formation take?", answer: "Standard processing takes 5-7 business days. Expedited options available for 2-3 business days." },
      { question: "Do I need to visit the USA?", answer: "No, the entire process is done remotely. We handle all paperwork and filings on your behalf." },
      { question: "What is an EIN?", answer: "An Employer Identification Number (EIN) is like a PAN number for your US business. Required for bank accounts, taxes, and vendor payments." },
      { question: "Can I open a US bank account from India?", answer: "Yes, we assist with Mercury, Relay, or other neobanks that allow remote account opening for foreign-owned LLCs." },
      { question: "What ongoing compliance is needed?", answer: "Annual report filing (varies by state), registered agent renewal, and basic bookkeeping. We can help with all of these." },
    ],
  },
  "Trade": {
    highlights: [
      "End-to-end sourcing from China",
      "Quality inspection before shipping",
      "Customs clearance handled",
      "Door-to-door delivery to India",
    ],
    features: [
      { title: "Product Sourcing", description: "Find verified factories and negotiate best prices for your products" },
      { title: "Quality Check", description: "Pre-shipment inspection at factory to ensure product quality" },
      { title: "Shipping & Logistics", description: "Sea/air freight booking with complete documentation" },
      { title: "Customs Clearance", description: "Indian customs handling, duty calculation & clearance support" },
    ],
    process: [
      { step: 1, title: "Requirements", description: "Share product details, quantity & quality expectations" },
      { step: 2, title: "Sourcing", description: "We find 3-5 verified factories with price comparisons" },
      { step: 3, title: "Sample & QC", description: "Sample approval + pre-shipment quality inspection" },
      { step: 4, title: "Ship & Deliver", description: "Complete logistics from factory to your doorstep" },
    ],
    faqs: [
      { question: "What is the minimum order quantity?", answer: "MOQ varies by product. We negotiate with factories to get the lowest possible MOQ for first-time importers." },
      { question: "How long does shipping take?", answer: "Sea freight: 25-35 days. Air freight: 7-10 days. We recommend sea freight for cost-effective bulk orders." },
      { question: "Do you handle customs duty?", answer: "Yes, we calculate estimated duty, handle documentation, and coordinate with customs brokers for smooth clearance." },
      { question: "Can I visit the factory?", answer: "Absolutely! We can arrange factory visits during our Canton Fair trips or schedule dedicated factory tours." },
    ],
  },
  "Business": {
    highlights: [
      "Turnkey franchise store setup",
      "Complete inventory & supply chain",
      "Staff training & operations manual",
      "Ongoing marketing & growth support",
    ],
    features: [
      { title: "Store Setup", description: "Complete retail store setup including design, fixtures & branding" },
      { title: "Product Inventory", description: "Curated product catalog with competitive wholesale pricing" },
      { title: "Training", description: "Comprehensive staff training on sales, inventory & operations" },
      { title: "Marketing", description: "Local marketing strategy, social media & grand opening support" },
    ],
    process: [
      { step: 1, title: "Application", description: "Submit franchise application and location details" },
      { step: 2, title: "Approval", description: "Location assessment, agreement signing & investment planning" },
      { step: 3, title: "Setup", description: "Store design, fit-out, inventory stocking & staff training" },
      { step: 4, title: "Launch", description: "Grand opening event, marketing campaign & ongoing support" },
    ],
    faqs: [
      { question: "What is the total investment?", answer: "The franchise fee is ₹15,00,000 which includes store setup, initial inventory, training, and 6 months of marketing support." },
      { question: "What products will my store carry?", answer: "A curated selection of trending consumer products sourced directly from international manufacturers at wholesale prices." },
      { question: "What support do I get after launch?", answer: "Ongoing supply chain management, quarterly training updates, marketing campaigns, and a dedicated franchise manager." },
      { question: "Can I choose my store location?", answer: "Yes, we help you evaluate locations based on foot traffic, demographics, and market potential to maximize your ROI." },
    ],
  },
  "Travel": {
    highlights: [
      "Complete Canton Fair guided tour",
      "4-Star hotel accommodation included",
      "Personal Mandarin translator",
      "Factory visits & supplier meetings",
    ],
    features: [
      { title: "Complete Package", description: "7N/8D all-inclusive business travel with hotel & meals" },
      { title: "Fair Access", description: "Canton Fair badge assistance & guided booth tours" },
      { title: "Translator", description: "Personal Mandarin interpreter for all business meetings" },
      { title: "Factory Visits", description: "Curated factory tours in Guangzhou, Foshan & Yiwu" },
    ],
    process: [
      { step: 1, title: "Reserve Slot", description: "Pay ₹30,000 advance to reserve your seat (limited slots)" },
      { step: 2, title: "Visa & Docs", description: "We assist with China visa application & travel docs" },
      { step: 3, title: "Travel", description: "Guided tour with Indian team, translator & local support" },
      { step: 4, title: "Follow-up", description: "Post-trip supplier coordination & order placement support" },
    ],
    faqs: [
      { question: "When is the next Canton Fair?", answer: "Canton Fair happens twice yearly: April (Phase 1: 15-19, Phase 2: 23-27, Phase 3: 1-5 May) and October. Contact us for the next available trip." },
      { question: "What's included in the package?", answer: "4-star hotel (twin sharing), daily breakfast + Indian dinner, AC coach transfers, Canton Fair badge, translator, Pearl River cruise, and Indian tour manager." },
      { question: "What's NOT included?", answer: "International flights, China sticker visa fees, lunch, personal expenses, and single room upgrade (available at extra cost)." },
      { question: "How many seats are available?", answer: "We limit each batch to 15-20 entrepreneurs for personalized attention. Slots fill up fast — reserve early with ₹30,000 advance." },
      { question: "Is this suitable for first-time visitors?", answer: "Absolutely! Most of our travellers are first-timers. Our experienced team guides you through everything from visa to supplier selection." },
    ],
  },
  "Mentorship": {
    highlights: [
      "Structured 3-month mentorship program",
      "Weekly calls with industry expert",
      "Exclusive community access",
      "Real project-based learning",
    ],
    features: [
      { title: "Weekly Calls", description: "One-on-one 45-min calls with your mentor every week" },
      { title: "Community", description: "Exclusive Telegram/WhatsApp group with fellow entrepreneurs" },
      { title: "Resources", description: "Access to supplier lists, templates, contracts & SOP documents" },
      { title: "Certification", description: "Certificate of completion and LinkedIn recommendation" },
    ],
    process: [
      { step: 1, title: "Enroll", description: "Choose your program and complete enrollment" },
      { step: 2, title: "Onboarding", description: "Meet your mentor and set learning goals" },
      { step: 3, title: "Learn & Build", description: "Weekly sessions with assignments and real-world projects" },
      { step: 4, title: "Graduate", description: "Complete the program with certification and ongoing support" },
    ],
    faqs: [
      { question: "What's included in the mentorship?", answer: "12 weekly 1-on-1 sessions, WhatsApp support, resource library, supplier contacts, and a graduation certificate." },
      { question: "What if I miss a session?", answer: "You can reschedule up to 24 hours in advance. We also offer session recordings when available." },
      { question: "Is there a payment plan?", answer: "Yes, we offer 3-month EMI options. Contact us for details on installment plans." },
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
    "Mentorship": { bg: "from-purple-900 to-violet-800", overlay: "bg-purple-950/40" },
  };

  const colorScheme = categoryColors[service.category] || { bg: "from-gray-900 to-gray-800", overlay: "bg-gray-950/40" };

  return (
    <PublicLayout>
      {/* Hero with banner image */}
      <section className={`relative bg-gradient-to-br ${colorScheme.bg} text-white py-16 lg:py-24 overflow-hidden`}>
        {serviceBanners[service.id] && (
          <img
            src={serviceBanners[service.id]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
        )}
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
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-start gap-3 animate-bounce-subtle"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
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
              <div key={index} className="text-center p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div
                  className="w-14 h-14 mx-auto mb-4 bg-[#F34147]/10 rounded-xl flex items-center justify-center animate-bounce-subtle"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
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
            {[
              { icon: Users, value: "1000+", label: "Happy Clients" },
              { icon: Award, value: "15+", label: "Years Experience" },
              { icon: Shield, value: "100%", label: "Secure Process" },
              { icon: Clock, value: "24/7", label: "Support Available" },
            ].map((badge, index) => (
              <div key={index}>
                <badge.icon
                  className="w-8 h-8 mx-auto mb-3 text-[#F34147] animate-bounce-subtle"
                  style={{ animationDelay: `${index * 200}ms` }}
                />
                <div className="text-2xl font-bold mb-1">{badge.value}</div>
                <div className="text-gray-400 text-sm">{badge.label}</div>
              </div>
            ))}
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
