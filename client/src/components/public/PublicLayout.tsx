import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Menu, X, ChevronDown, ChevronRight, Phone, Mail, Zap, Facebook, Linkedin, Instagram, Youtube, ArrowUp, MessageCircle, Factory, Globe, Building2, Users, Plane } from "lucide-react";
import { SiInstagram } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import MobileActionButtons from "./MobileActionButtons";
import type { Service, TravelPackage } from "@shared/schema";
import { format } from "date-fns";

// Travel package images
import hongKongCantonImg from "@/assets/images/travel/hong-kong-canton.png";
import cantonPhase1Img from "@/assets/images/travel/canton-phase1.png";
import cantonPhase2Img from "@/assets/images/travel/canton-phase2.png";
import cantonPhase3Img from "@/assets/images/travel/canton-phase3.png";
import foshanTourImg from "@/assets/images/travel/foshan-tour.png";
import yiwuShanghaiImg from "@/assets/images/travel/yiwu-shanghai-tour.png";
import wuxiEvImg from "@/assets/images/travel/wuxi-ev-tour.png";

const travelImageMap: Record<string, string> = {
  "hong-kong-canton-exclusive-trip": hongKongCantonImg,
  "phase-1-canton-fair-april-2026": cantonPhase1Img,
  "phase-2-canton-fair-april-2026": cantonPhase2Img,
  "phase-3-canton-fair-may-2026": cantonPhase3Img,
  "foshan-furniture-lighting-market-tour": foshanTourImg,
  "yiwu-shanghai-sourcing-tour": yiwuShanghaiImg,
  "wuxi-ev-battery-factory-tour": wuxiEvImg,
};

interface PublicLayoutProps {
  children: React.ReactNode;
}

const categoryIcons: Record<string, any> = {
  "China Sourcing": Factory,
  "Canton Fair": Globe,
  "US Business": Building2,
  "Consulting": Users,
  "Travel": Plane,
};

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isTravelMenuOpen, setIsTravelMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [location] = useLocation();
  const { toast } = useToast();

  const { data: siteContent } = useQuery<Record<string, Record<string, any>>>({
    queryKey: ["/api/public/website-content"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const { data: travelPackages = [] } = useQuery<TravelPackage[]>({
    queryKey: ["/api/public/travel-packages"],
    queryFn: async () => {
      const res = await fetch("/api/public/travel-packages");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  const servicesByCategory = services.reduce((acc, service) => {
    const category = service.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  const submitLead = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/public/leads", {
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
      toast({ title: "Thank you!", description: "We'll get back to you within 24 hours." });
      setIsConsultationOpen(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/travel", label: "Travel" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location === path;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Banner */}
      <div className="bg-[#F34147] text-white text-xs sm:text-sm py-2 text-center px-4">
        {siteContent?.site_banner?.text || "Canton Fair 139th Phase 1 starting April 15th, 2025. Register Now!"}
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#F34147] h-9 w-9 rounded-lg flex items-center justify-center shadow-sm">
                <Zap className="h-5 w-5 text-white fill-current" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Suprans<span className="text-[#F34147]">.</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-6">
              <li>
                <Link
                  href="/"
                  className={`font-medium transition-colors ${
                    isActive("/") ? "text-[#F34147] font-semibold" : "text-gray-700 hover:text-[#F34147]"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li
                className="relative"
                onMouseEnter={() => setIsMegaMenuOpen(true)}
                onMouseLeave={() => setIsMegaMenuOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    location.startsWith("/services") ? "text-[#F34147] font-semibold" : "text-gray-700 hover:text-[#F34147]"
                  }`}
                >
                  Services <ChevronDown className={`w-4 h-4 transition-transform ${isMegaMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[600px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="grid grid-cols-2 gap-6">
                        {Object.entries(servicesByCategory).map(([category, categoryServices]) => {
                          const Icon = categoryIcons[category] || Globe;
                          return (
                            <div key={category}>
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                  <Icon className="w-4 h-4 text-[#F34147]" />
                                </div>
                                <span className="font-semibold text-gray-900">{category}</span>
                              </div>
                              <ul className="space-y-1 ml-10">
                                {categoryServices.slice(0, 4).map((service) => (
                                  <li key={service.id}>
                                    <Link
                                      href={`/services/${service.id}`}
                                      className="text-sm text-gray-600 hover:text-[#F34147] flex items-center gap-1 py-1"
                                    >
                                      <ChevronRight className="w-3 h-3" />
                                      {service.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Link
                          href="/services"
                          className="text-sm font-medium text-[#F34147] hover:underline flex items-center gap-1"
                        >
                          View All Services <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li
                className="relative"
                onMouseEnter={() => setIsTravelMenuOpen(true)}
                onMouseLeave={() => setIsTravelMenuOpen(false)}
              >
                <button
                  className={`flex items-center gap-1 font-medium transition-colors ${
                    location.startsWith("/travel") ? "text-[#F34147] font-semibold" : "text-gray-700 hover:text-[#F34147]"
                  }`}
                >
                  Travel <ChevronDown className={`w-4 h-4 transition-transform ${isTravelMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {isTravelMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[700px] animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900 text-lg">Travel Packages</h3>
                        <a
                          href="/travel"
                          className="text-sm font-medium text-[#F34147] hover:underline flex items-center gap-1"
                          onClick={(e) => {
                            e.preventDefault();
                            setIsTravelMenuOpen(false);
                            window.location.href = "/travel";
                          }}
                          data-testid="link-travel-view-all"
                        >
                          View All <ChevronRight className="w-4 h-4" />
                        </a>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {travelPackages.slice(0, 6).map((pkg) => (
                          <Link
                            key={pkg.id}
                            href={`/travel/${pkg.slug}`}
                            className="flex gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setIsTravelMenuOpen(false)}
                          >
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <img
                                src={travelImageMap[pkg.slug] || cantonPhase1Img}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 text-sm line-clamp-1 group-hover:text-[#F34147] transition-colors">
                                {pkg.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {pkg.destination}
                              </p>
                              {pkg.startDate && (
                                <p className="text-xs text-[#F34147] font-medium mt-1">
                                  {format(new Date(pkg.startDate), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  href="/about"
                  className={`font-medium transition-colors ${
                    isActive("/about") ? "text-[#F34147] font-semibold" : "text-gray-700 hover:text-[#F34147]"
                  }`}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`font-medium transition-colors ${
                    isActive("/contact") ? "text-[#F34147] font-semibold" : "text-gray-700 hover:text-[#F34147]"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>

            <div className="hidden md:block">
              <Button
                onClick={() => setIsConsultationOpen(true)}
                className="bg-[#F34147] hover:bg-[#D93036] text-white px-6 py-2 rounded-full font-semibold shadow-md"
                data-testid="button-header-callback"
              >
                Get a Callback
              </Button>
            </div>

            {/* Mobile Menu Button + Instagram */}
            <div className="flex items-center gap-3 md:hidden">
              <a
                href="https://www.instagram.com/suprans.china"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#dc2743] text-white"
                data-testid="link-mobile-instagram"
              >
                <SiInstagram className="w-5 h-5" />
              </a>
              <button
                className="text-2xl text-[#F34147]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Linktree Style */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="py-4 px-4">
              {/* Quick Links */}
              <div className="space-y-2 mb-6">
                <Link
                  href="/"
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border ${isActive("/") ? "border-[#F34147] bg-red-50 text-[#F34147]" : "border-gray-200 text-gray-700"} font-medium transition-all`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-home"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border ${isActive("/about") ? "border-[#F34147] bg-red-50 text-[#F34147]" : "border-gray-200 text-gray-700"} font-medium transition-all`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-about"
                >
                  <span>About Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className={`flex items-center justify-between py-3 px-4 rounded-xl border ${isActive("/contact") ? "border-[#F34147] bg-red-50 text-[#F34147]" : "border-gray-200 text-gray-700"} font-medium transition-all`}
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="link-mobile-contact"
                >
                  <span>Contact</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Services Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-3">Our Services</h3>
                <div className="space-y-2">
                  {services.slice(0, 6).map((service) => {
                    const IconComponent = categoryIcons[service.category || ""] || Globe;
                    const serviceSlug = service.slug || service.id;
                    return (
                      <Link
                        key={service.id}
                        href={`/services/${serviceSlug}`}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover-elevate active-elevate-2 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                        data-testid={`link-mobile-service-${serviceSlug}`}
                      >
                        <div className="w-8 h-8 bg-[#F34147]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="w-4 h-4 text-[#F34147]" />
                        </div>
                        <span className="flex-1 text-sm line-clamp-1">{service.name}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    );
                  })}
                  <Link
                    href="/services"
                    className="flex items-center justify-center py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover-elevate active-elevate-2 transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="link-mobile-all-services"
                  >
                    View All Services
                  </Link>
                </div>
              </div>

              {/* Travel Section */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 mb-3">Travel Packages</h3>
                <div className="space-y-2">
                  {travelPackages.slice(0, 4).map((pkg) => {
                    const pkgSlug = pkg.slug || pkg.id;
                    return (
                      <Link
                        key={pkg.id}
                        href={`/travel/${pkgSlug}`}
                        className="flex items-center gap-3 py-3 px-4 rounded-xl border border-gray-200 text-gray-700 font-medium hover-elevate active-elevate-2 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                        data-testid={`link-mobile-travel-${pkgSlug}`}
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                          <img
                            src={travelImageMap[pkg.slug || ""] || cantonPhase1Img}
                            alt={pkg.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-sm line-clamp-1">{pkg.title}</span>
                          <span className="text-xs text-gray-500">{pkg.destination}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </Link>
                    );
                  })}
                  <Link
                    href="/travel"
                    className="flex items-center justify-center py-3 px-4 rounded-xl bg-gray-100 text-gray-600 font-medium hover-elevate active-elevate-2 transition-all text-sm"
                    onClick={() => setIsMenuOpen(false)}
                    data-testid="link-mobile-all-travel"
                  >
                    View All Travel Packages
                  </Link>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsConsultationOpen(true);
                }}
                className="w-full bg-[#F34147] hover:bg-[#D93036] text-white py-6 text-base font-bold rounded-xl"
                data-testid="button-mobile-callback"
              >
                Get a Free Callback
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-16 md:pb-0">{children}</main>

      {/* Mobile Action Buttons */}
      <MobileActionButtons />

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-block">
                <h2 className="text-3xl font-bold text-gray-900">
                  Suprans<span className="text-[#F34147]">.</span>
                </h2>
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed max-w-md">
                Guiding 1000+ entrepreneurs across India and abroad to launch
                profitable, legally structured, and scalable global businesses —
                with hands-on guidance and systems that work.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <Mail className="text-[#F34147] mt-1 flex-shrink-0 h-4 w-4" />
                  <div className="text-sm text-gray-600">
                    <div>{siteContent?.footer_contact?.email || "info@suprans.in"}</div>
                    <div>cs@suprans.in</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="text-[#F34147] mt-1 flex-shrink-0 h-4 w-4" />
                  <div className="text-sm text-gray-600">
                    {(siteContent?.footer_contact?.phones || ["+91 9350830133", "+91 9350818272"]).map((phone: string, index: number) => (
                      <div key={index}>{phone}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                  Follow Us
                </h4>
                <div className="flex gap-3">
                  {(siteContent?.footer_social?.items || [
                    { platform: "facebook", url: "https://www.facebook.com/supranschina/" },
                    { platform: "linkedin", url: "https://www.linkedin.com/in/sanjay-suprans" },
                    { platform: "instagram", url: "https://www.instagram.com/suprans.china/" },
                    { platform: "youtube", url: "https://www.youtube.com/@Suprans" },
                  ]).map((link: any, index: number) => {
                    const socialPlatformIcons: Record<string, any> = { facebook: Facebook, linkedin: Linkedin, instagram: Instagram, youtube: Youtube };
                    const IconComp = socialPlatformIcons[link.platform] || Globe;
                    return (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#F34147] hover:bg-[#F34147] hover:text-white transition-all"
                        data-testid={`link-footer-social-${link.platform}`}
                      >
                        <IconComp className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Quick Links
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-[#F34147]">
                    All Services
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-[#F34147]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-[#F34147]">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-gray-600 hover:text-[#F34147]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-gray-600 hover:text-[#F34147]">
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>

            {/* Useful Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Useful Links
              </h4>
              <ul className="space-y-2 text-sm">
                {(siteContent?.footer_useful_links?.items || [
                  { label: "Free Dropshipping Learning", url: "https://suprans1.odoo.com/slides/slide/part-01-usa-dropshipping-overview-49?fullscreen=1" },
                ]).map((link: any, index: number) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#F34147]"
                      data-testid={`link-footer-useful-${index}`}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">
                Our Services
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-[#F34147]">
                    China Sourcing
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-[#F34147]">
                    Canton Fair Tours
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-[#F34147]">
                    US LLC Formation
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-[#F34147]">
                    Business Consulting
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-100 text-gray-600 py-4 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">© 2026 Suprans. All rights reserved.</p>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-gray-600 text-sm"
            >
              <ArrowUp className="h-4 w-4" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button - hidden on mobile since we have action buttons */}
      <a
        href="https://wa.me/919350818272?text=Hi%20Suprans%2C%20I%27m%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className={`hidden md:flex fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
        data-testid="whatsapp-button"
      >
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute right-full mr-3 px-3 py-1 bg-white text-gray-700 text-sm rounded-lg shadow-lg border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Chat with us
        </span>
      </a>

      {/* Callback Modal */}
      <Dialog open={isConsultationOpen} onOpenChange={setIsConsultationOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Get a Callback</DialogTitle>
            <DialogDescription>Share your details and our team will call you back within 24 hours.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-4 pt-4"
            onSubmit={(e) => {
              e.preventDefault();
              submitLead.mutate(formData);
            }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input
                  required
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  data-testid="input-callback-name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone *</label>
                <Input
                  required
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  data-testid="input-callback-phone"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email *</label>
              <Input
                required
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                data-testid="input-callback-email"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">What are you interested in?</label>
              <Textarea
                placeholder="E.g., China Business Travel, Dropshipping Mentorship, Brand Development..."
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                data-testid="input-callback-message"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#F34147] hover:bg-[#D93036] text-white"
              disabled={submitLead.isPending}
              data-testid="button-callback-submit"
            >
              {submitLead.isPending ? "Submitting..." : "Request Callback"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
