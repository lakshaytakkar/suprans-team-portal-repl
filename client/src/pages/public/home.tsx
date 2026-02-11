import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Star, Users, Globe, Award, CheckCircle, ArrowRight, ChevronRight, ChevronLeft, Package, Plane, Quote, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PublicLayout from "@/components/public/PublicLayout";
import type { Service, Event } from "@shared/schema";
import { format } from "date-fns";

import founderImage from "@/assets/images/founder-portrait.png";
import heroImage from "@/assets/images/mr-suprans-hero-optimized.jpg";
import cantonFairImage from "@/assets/images/canton-fair.png";
import chinaFactoryImage from "@/assets/images/china-factory.png";
import businessMeetingImage from "@/assets/images/business-meeting.png";
import marketTourImage from "@/assets/images/market-tour.png";
import seminarEventImage from "@/assets/images/seminar-event.png";
import networkingEventImage from "@/assets/images/networking-event.png";

import serviceChinaTravel from "@/assets/images/service-china-travel.png";
import serviceDropshipping from "@/assets/images/service-dropshipping.png";
import serviceBrandDevelopment from "@/assets/images/service-brand-development.png";
import serviceConsultation from "@/assets/images/service-consultation.png";

import delhiSeminarImage from "@/assets/images/events/delhi-seminar.png";
import mumbaiCantonImage from "@/assets/images/events/mumbai-canton-preview.png";
import bangaloreWorkshopImage from "@/assets/images/events/bangalore-workshop.png";
import hyderabadSummitImage from "@/assets/images/events/hyderabad-summit.png";
import puneMeetupImage from "@/assets/images/events/pune-meetup.png";

const eventImageMap: Record<string, string> = {
  'Delhi': delhiSeminarImage,
  'Mumbai': mumbaiCantonImage,
  'Bangalore': bangaloreWorkshopImage,
  'Hyderabad': hyderabadSummitImage,
  'Pune': puneMeetupImage,
  'Chennai': delhiSeminarImage, // Use Delhi seminar image as fallback
};

function getEventImage(city: string): string {
  return eventImageMap[city] || delhiSeminarImage;
}

const thumbnailMap: Record<string, string> = {
  'china-business-travel': serviceChinaTravel,
  'usa-dropshipping-mentorship': serviceDropshipping,
  'brand-development': serviceBrandDevelopment,
  'book-appointment': serviceConsultation,
  // Map by service ID as well (since slugs may be null)
  'srv-dropshipping': serviceDropshipping,
  'srv-brand-development': serviceBrandDevelopment,
  'srv-consultation': serviceConsultation,
};

const stats = [
  { value: "1000+", label: "Entrepreneurs Guided", icon: Users },
  { value: "15+", label: "Years Experience", icon: Award },
  { value: "50+", label: "Countries Served", icon: Globe },
  { value: "98%", label: "Client Satisfaction", icon: Star },
];

const processSteps = [
  { step: 1, title: "Free Consultation", description: "Share your business goals and requirements" },
  { step: 2, title: "Custom Strategy", description: "Receive a tailored plan for your needs" },
  { step: 3, title: "Implementation", description: "We handle the execution with full support" },
  { step: 4, title: "Growth & Scale", description: "Ongoing guidance as your business grows" },
];

const videoTestimonials = [
  { id: "GwQWsHjYhPc", title: "Success Story" },
  { id: "lXsiTL9bDIc", title: "Client Review" },
  { id: "x66MSHKuszg", title: "Business Growth" },
  { id: "fdhk4hJ58tw", title: "Canton Fair Experience" },
];

const galleryImages = [
  { src: cantonFairImage, title: "Canton Fair 2024", location: "Guangzhou, China" },
  { src: marketTourImage, title: "Market Tour", location: "Yiwu, China" },
  { src: businessMeetingImage, title: "Supplier Meeting", location: "Shenzhen, China" },
  { src: seminarEventImage, title: "IBS Seminar Delhi", location: "New Delhi, India" },
  { src: networkingEventImage, title: "VIP Networking", location: "Mumbai, India" },
  { src: chinaFactoryImage, title: "Factory Visit", location: "Dongguan, China" },
];

const faqs = [
  {
    question: "How do I start importing from China?",
    answer: "We provide complete guidance from product sourcing to delivery. Start with a free consultation to discuss your requirements.",
  },
  {
    question: "Is the Canton Fair worth attending?",
    answer: "Absolutely! It's the world's largest trade fair with 25,000+ exhibitors. Our guided tours ensure you make the most of your visit.",
  },
  {
    question: "What is USA dropshipping mentorship?",
    answer: "Our 60-day program teaches you to run a USA-based dropshipping business with US suppliers, fast shipping, and proven scaling systems.",
  },
  {
    question: "What support do you provide after service?",
    answer: "We provide ongoing support including follow-up consultations, market updates, and business growth strategies.",
  },
];

export default function PublicHome() {
  const servicesRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: siteContent } = useQuery<Record<string, Record<string, any>>>({
    queryKey: ["/api/public/website-content"],
  });

  const dynamicStats = siteContent?.home_stats?.items || stats;
  const dynamicProcess = siteContent?.home_process?.items || processSteps;
  const dynamicFaqs = siteContent?.home_faqs?.items || faqs;
  const dynamicVideos = siteContent?.home_videos?.items || videoTestimonials;

  const heroTags = siteContent?.home_hero?.tags || ["USA Dropshipping Expert", "E2E Imports from China", "India's #1 Business Channel"];
  const heroTrustBadge = siteContent?.home_hero?.trust_badge || "Trusted by 1000+ Indian Entrepreneurs";
  const heroHeadline = siteContent?.home_hero?.headline || "Explore Business in China";
  const heroHeadlineSubtitle = siteContent?.home_hero?.headline_subtitle || "w/ Mr. Suprans";
  const heroDescription = siteContent?.home_hero?.description || "Join India's most trusted business mentor for guided Canton Fair tours, factory visits, and supplier connections.";
  const heroDescriptionStrong = "15+ years of experience helping entrepreneurs build profitable import businesses.";
  const heroDescriptionMobile = siteContent?.home_hero?.description_mobile || "Canton Fair tours, factory visits & supplier connections with 15+ years expertise.";
  const heroCtaPrimary = siteContent?.home_hero?.cta_primary || { text: "Explore China Packages", link: "/travel" };
  const heroCtaSecondary = siteContent?.home_hero?.cta_secondary || { text: "Get a Callback", link: "/contact" };

  useEffect(() => {
    setIsVisible(true);
    const finalValues: Record<string, number> = {};
    dynamicStats.forEach((s: any) => {
      const num = parseInt(String(s.value).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(num)) finalValues[s.value] = num;
    });
    const duration = 2000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const newStats: Record<string, number> = {};
      Object.entries(finalValues).forEach(([key, value]) => {
        newStats[key] = Math.floor(value * eased);
      });
      setAnimatedStats(newStats);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [dynamicStats]);

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/public/services"],
    queryFn: async () => {
      const res = await fetch("/api/public/services");
      if (!res.ok) throw new Error("Failed to fetch services");
      return res.json();
    },
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/public/events"],
    queryFn: async () => {
      const res = await fetch("/api/public/events");
      if (!res.ok) throw new Error("Failed to fetch events");
      return res.json();
    },
  });

  const sortedServices = [...services].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 340;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 300);
    }
  };

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => carousel.removeEventListener('scroll', checkScroll);
    }
  }, [services]);

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-white min-h-[70vh] md:min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(243,65,71,0.08),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(243,65,71,0.05),transparent_50%)]" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-24">
          {/* Mobile Layout - Image First */}
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
            {/* Hero Image - Shows first on mobile */}
            <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0 lg:translate-x-0" : "opacity-0 translate-y-8 lg:translate-x-8"}`}>
              <img
                src={heroImage}
                alt="Mr. Suprans - Your China Business Guide"
                className="w-full max-w-xs md:max-w-lg mx-auto rounded-3xl shadow-2xl object-cover"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </div>

            {/* Text Content - Below image on mobile */}
            <div className={`order-2 lg:order-1 text-center lg:text-left transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4 md:mb-6">
                {heroTags.map((tag: string, idx: number) => (
                  <span key={idx} className="bg-[#F34147] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Trust Badge - Hidden on mobile */}
              <div className="hidden md:inline-flex items-center gap-2 bg-[#F34147]/10 border border-[#F34147]/20 rounded-full px-4 py-2 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#F34147] fill-current" />
                  ))}
                </div>
                <span className="text-[#F34147] font-semibold text-sm">
                  {heroTrustBadge}
                </span>
              </div>

              {/* Headline - Simplified on mobile */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
                <span className="md:hidden">{heroHeadline.replace('Explore ', '')} <span className="text-[#F34147]"></span></span>
                <span className="hidden md:inline">
                  {heroHeadline.split('China')[0]}<span className="text-[#F34147]">China</span>{heroHeadline.split('China').slice(1).join('China')}
                </span>
                <span className="block text-xl md:text-4xl mt-1 md:mt-2 text-gray-600">{heroHeadlineSubtitle}</span>
              </h1>

              {/* Description - Shortened on mobile */}
              <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6 md:mb-8">
                <span className="md:hidden">{heroDescriptionMobile}</span>
                <span className="hidden md:inline">
                  {heroDescription}{" "}
                  <strong className="text-gray-900">
                    {heroDescriptionStrong}
                  </strong>
                </span>
              </p>

              {/* CTA Buttons - Hidden on mobile (pinned at bottom) */}
              <div className="hidden md:flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href={heroCtaPrimary.link}>
                  <Button className="bg-[#F34147] hover:bg-[#D93036] text-white px-8 py-6 text-lg font-bold shadow-lg" data-testid="button-explore-packages">
                    {heroCtaPrimary.text}
                    <Plane className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href={heroCtaSecondary.link}>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg font-bold"
                    data-testid="button-get-callback"
                  >
                    {heroCtaSecondary.text}
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators - Hidden on mobile */}
              <div className="hidden md:flex mt-10 flex-wrap items-center gap-6 text-gray-600 text-sm justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Verified Suppliers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Complete Visa Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>On-ground Assistance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {dynamicStats.map((stat: any, index: number) => {
              const iconMap: Record<string, any> = { Users, Award, Globe, Star };
              const IconComponent = stat.icon ? (typeof stat.icon === 'string' ? iconMap[stat.icon] || Star : stat.icon) : Star;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-[#F34147]/10 rounded-2xl flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-[#F34147]" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                    {animatedStats[stat.value] || 0}{stat.value.includes('+') ? '+' : stat.value.includes('%') ? '%' : ''}
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Carousel Section */}
      <section ref={servicesRef} className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F34147]">Services</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions to help you build and scale your global business
            </p>
          </div>

          {servicesLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F34147] mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Services coming soon</p>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Navigation */}
              <button
                onClick={() => scrollCarousel('left')}
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 transition-all ${canScrollLeft ? 'opacity-100 hover:bg-gray-50' : 'opacity-0 pointer-events-none'}`}
                data-testid="button-carousel-left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200 transition-all ${canScrollRight ? 'opacity-100 hover:bg-gray-50' : 'opacity-0 pointer-events-none'}`}
                data-testid="button-carousel-right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {sortedServices.map((service) => {
                  // Check by slug first, then by ID
                  const thumbnail = (service.slug && thumbnailMap[service.slug]) || thumbnailMap[service.id] || null;
                  return (
                    <Link
                      key={service.id}
                      href={service.ctaLink || `/services/${service.slug || service.id}`}
                      className="flex-shrink-0 w-[300px] group"
                      data-testid={`card-service-${service.slug || service.id}`}
                    >
                      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl hover:border-[#F34147]/30 transition-all duration-300 h-full flex flex-col">
                        {/* Thumbnail */}
                        <div className="relative h-[220px] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
                          {thumbnail ? (
                            <img
                              src={thumbnail}
                              alt={service.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-16 h-16 text-gray-300" />
                            </div>
                          )}
                          <div className="absolute top-4 left-4">
                            <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                              {service.category}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#F34147] transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {service.shortDescription || service.description}
                          </p>
                          <div className="flex items-center text-[#F34147] font-semibold text-sm group-hover:gap-2 transition-all">
                            {service.ctaText || 'Learn More'} 
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Founder's Note Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Quote className="absolute -top-6 -left-4 w-20 h-20 text-[#F34147]/10" />
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                  A Note from <span className="text-[#F34147]">Mr. Suprans</span>
                </h2>
                <blockquote className="text-gray-600 text-lg leading-relaxed mb-6 italic">
                  "When I started my journey in China trade 15 years ago, I made every mistake in the book. 
                  Fake suppliers, wrong products, shipping nightmares - you name it. Today, I've helped over 
                  1000+ Indian entrepreneurs avoid these pitfalls and build successful import businesses.
                  <br /><br />
                  My mission is simple: to be the guide I wish I had when I started. Join me on a Canton Fair 
                  tour, and I'll personally show you how to find genuine suppliers, negotiate like a pro, and 
                  build lasting business relationships."
                </blockquote>
                <div className="flex items-center gap-4">
                  <img
                    src={founderImage}
                    alt="Mr. Suprans"
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#F34147]"
                  />
                  <div>
                    <div className="font-bold text-gray-900">Mr. Suprans</div>
                    <div className="text-sm text-gray-500">Founder & Chief Mentor, Suprans</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <img
                src={cantonFairImage}
                alt="Canton Fair"
                className="rounded-2xl shadow-lg w-full h-40 object-cover"
              />
              <img
                src={businessMeetingImage}
                alt="Business Meeting"
                className="rounded-2xl shadow-lg w-full h-40 object-cover mt-8"
              />
              <img
                src={marketTourImage}
                alt="Market Tour"
                className="rounded-2xl shadow-lg w-full h-40 object-cover"
              />
              <img
                src={chinaFactoryImage}
                alt="Factory Visit"
                className="rounded-2xl shadow-lg w-full h-40 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F34147]">Journey</span> So Far
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Glimpses from our past China trips and business events
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <div key={index} className="group relative overflow-hidden rounded-2xl aspect-[4/3] shadow-sm border border-gray-200">
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-white font-semibold">{image.title}</div>
                  <div className="text-white/80 text-sm flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {image.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      {events.length > 0 && (
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Upcoming <span className="text-[#F34147]">Events</span>
                </h2>
                <p className="text-gray-600 max-w-2xl">
                  Join our business seminars and workshops across India
                </p>
              </div>
              <Link href="/events">
                <Button variant="outline" className="mt-4 md:mt-0 border-[#F34147] text-[#F34147] hover:bg-[#F34147]/10" data-testid="button-view-all-events">
                  View All Events <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm h-full cursor-pointer" data-testid={`card-home-event-${event.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getEventImage(event.city)}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-[#F34147] text-white border-0">
                          {event.type === 'ibs' ? 'IBS Workshop' : 'Seminar'}
                        </Badge>
                        {event.status === 'sold_out' && (
                          <Badge className="bg-gray-800 text-white border-0">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(event.date), "MMMM d, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-5 bg-white">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[#F34147] transition-colors line-clamp-2">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.capacity} seats</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {event.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-[#F34147]">Works</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simple, transparent process to get you started
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {dynamicProcess.map((step: any, index: number) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 mx-auto mb-4 bg-[#F34147] text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                  {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < dynamicProcess.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-6 -right-4 w-8 h-8 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-[#F34147]">Clients</span> Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Real stories from entrepreneurs who transformed their businesses with us
            </p>
          </div>

          {/* Video Testimonials */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dynamicVideos.map((video: any, index: number) => (
              <div
                key={video.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
                data-testid={`card-video-testimonial-${index}`}
              >
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-[#F34147]">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {dynamicFaqs.map((faq: any, index: number) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                  data-testid={`button-faq-${index}`}
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-5 pb-5 text-gray-600 bg-gray-50">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#F34147]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Business Journey?
          </h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Join 1000+ entrepreneurs who have transformed their businesses with our guidance.
            Get a callback from our team today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button className="bg-white text-[#F34147] hover:bg-gray-100 px-8 py-6 text-lg font-bold" data-testid="button-cta-callback">
                Get a Callback
              </Button>
            </Link>
            <Link href="/travel">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg font-bold" data-testid="button-cta-packages">
                View China Packages
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
