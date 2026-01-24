import { Link } from "wouter";
import { Award, Users, Globe, Target, CheckCircle, ArrowRight, MapPin, Building2, Rocket, TrendingUp, Star, Mic, Handshake, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import PublicLayout from "@/components/public/PublicLayout";
import mrSupransHero from "@/assets/images/mr-suprans-hero.png";

import gurgaonOffice from "@/assets/images/offices/gurgaon-office.png";
import mumbaiOffice from "@/assets/images/offices/mumbai-office.png";
import bangaloreOffice from "@/assets/images/offices/bangalore-office.png";
import yiwuOffice from "@/assets/images/offices/yiwu-office.png";
import guangzhouOffice from "@/assets/images/offices/guangzhou-office.png";
import newjerseyOffice from "@/assets/images/offices/newjersey-office.png";

const offices = [
  {
    city: "Gurgaon",
    country: "India",
    countryCode: "IN",
    address: "Tower B, 4th Floor, Udyog Vihar Phase 4, Sector 18, Gurugram, Haryana 122015",
    image: gurgaonOffice,
  },
  {
    city: "Mumbai",
    country: "India",
    countryCode: "IN",
    address: "Unit 1205, Platina Building, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051",
    image: mumbaiOffice,
  },
  {
    city: "Bangalore",
    country: "India",
    countryCode: "IN",
    address: "3rd Floor, Sigma Tech Park, Whitefield Main Road, Koramangala, Bangalore, Karnataka 560034",
    image: bangaloreOffice,
  },
  {
    city: "Yiwu",
    country: "China",
    countryCode: "CN",
    address: "District 2, Block F, Yiwu International Trade City, Futian Street, Yiwu, Zhejiang 322000",
    image: yiwuOffice,
  },
  {
    city: "Guangzhou",
    country: "China",
    countryCode: "CN",
    address: "Level 18, Canton Tower Business Center, Haizhu District, Guangzhou, Guangdong 510623",
    image: guangzhouOffice,
  },
  {
    city: "Edison",
    country: "USA",
    countryCode: "US",
    address: "2000 Lincoln Highway, Suite 350, Edison, New Jersey 08817, United States",
    image: newjerseyOffice,
  },
];

const values = [
  {
    icon: Target,
    title: "Results-Driven",
    description: "We focus on tangible outcomes that grow your business",
  },
  {
    icon: Users,
    title: "Client-First",
    description: "Your success is our success - we're with you every step",
  },
  {
    icon: CheckCircle,
    title: "Integrity",
    description: "Transparent pricing, honest advice, no hidden agendas",
  },
  {
    icon: Globe,
    title: "Global Expertise",
    description: "15+ years of hands-on experience in international trade",
  },
];

const founderAchievements = [
  { icon: Rocket, label: "740+ Private Label Brands Built" },
  { icon: TrendingUp, label: "$50M+ Revenue Generated for Clients" },
  { icon: Mic, label: "25+ Events | 15+ Cities | 8,000+ Attendees" },
  { icon: Building2, label: "Warehouses in USA, China & India" },
  { icon: Star, label: "Featured in Economic Times, YourStory & Forbes India" },
  { icon: Handshake, label: "Strategic Partner: Boult Audio, Mokobara, Urbanic" },
  { icon: GraduationCap, label: "Angel Investor in 12+ D2C Startups" },
  { icon: Award, label: "India's #1 USA Dropshipping Mentor" },
];

export default function PublicAbout() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-gray-50 to-white py-20 lg:py-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            About <span className="text-[#F34147]">Suprans</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            India's #1 global business development platform, helping entrepreneurs 
            build profitable, legally structured, and scalable international businesses.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our <span className="text-[#F34147]">Mission</span>
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded by Mr. Suprans, we believe every entrepreneur deserves access to global markets. 
                Our mission is to democratize international trade by providing expert guidance, 
                done-for-you services, and complete support to help businesses expand globally.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Whether you're looking to attend the Canton Fair, start USA dropshipping with private suppliers,
                build your own private label brand, or need strategic business consulting - we've got you covered.
              </p>
              <Link href="/services">
                <Button data-testid="button-explore-services" className="btn-shine-red text-white">
                  Explore Our Services <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-yellow-50 rounded-2xl p-8 border border-red-100">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-[#F34147] mb-2">1000+</div>
                  <div className="text-gray-600 text-sm">Entrepreneurs Guided</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-[#F34147] mb-2">15+</div>
                  <div className="text-gray-600 text-sm">Years Experience</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-[#F34147] mb-2">50+</div>
                  <div className="text-gray-600 text-sm">Countries Served</div>
                </div>
                <div className="text-center p-4">
                  <div className="text-4xl font-bold text-[#F34147] mb-2">98%</div>
                  <div className="text-gray-600 text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet the <span className="text-[#F34147]">Founder</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The visionary behind India's most trusted global business consulting platform
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mr. Suprans</h3>
              <p className="text-[#F34147] font-semibold mb-4">Founder & CEO | Global Trade Strategist</p>
              <p className="text-gray-600 leading-relaxed mb-6">
                With over 15 years of hands-on experience in international trade, Mr. Suprans has revolutionized 
                how Indian entrepreneurs access global markets. From building 740+ private label brands to 
                establishing strategic partnerships with leading D2C companies, his expertise spans the entire 
                spectrum of global business development.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                As India's foremost USA dropshipping expert with established warehouses in USA, China, and India, 
                he has trained thousands of entrepreneurs through his renowned 90-day mentorship programs and 
                business events across 15+ cities.
              </p>
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                <span className="px-4 py-2 bg-[#F34147]/10 text-[#F34147] rounded-full text-sm font-medium">
                  USA Dropshipping Expert
                </span>
                <span className="px-4 py-2 bg-[#F34147]/10 text-[#F34147] rounded-full text-sm font-medium">
                  Angel Investor
                </span>
                <span className="px-4 py-2 bg-[#F34147]/10 text-[#F34147] rounded-full text-sm font-medium">
                  Education Advocate
                </span>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-br from-[#F34147]/20 to-orange-500/20 rounded-2xl transform rotate-3"></div>
                <img 
                  src={mrSupransHero} 
                  alt="Mr. Suprans - Founder & CEO" 
                  className="relative rounded-2xl shadow-xl w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Achievement Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {founderAchievements.map((achievement, index) => (
              <div key={index} data-testid={`card-achievement-${index}`} className="bg-white border border-gray-200 rounded-xl p-4 hover-elevate transition-colors">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-[#F34147]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <achievement.icon className="w-5 h-5 text-[#F34147]" />
                  </div>
                  <span data-testid={`text-achievement-${index}`} className="text-gray-700 text-sm font-medium">{achievement.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-500 mb-4">Connect with Mr. Suprans</p>
            <a 
              href="mailto:info@suprans.in" 
              data-testid="link-founder-email"
              className="inline-flex items-center gap-2 text-[#F34147] font-medium"
            >
              info@suprans.in <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F34147]">Values</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 text-center">
                <div className="w-14 h-14 mx-auto mb-4 bg-red-100 rounded-xl flex items-center justify-center">
                  <value.icon className="w-7 h-7 text-[#F34147]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Presence */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our <span className="text-[#F34147]">Global Presence</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Strategically located offices across India, China, and USA to serve you better
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <div key={index} data-testid={`card-office-${office.city.toLowerCase()}`} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={office.image} 
                    alt={`${office.city} Office`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-[#F34147] text-white text-xs font-bold rounded">{office.countryCode}</span>
                    <h3 className="text-lg font-bold text-gray-900">{office.city}</h3>
                    <span className="text-gray-500 text-sm">| {office.country}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#F34147]" />
                    <span>{office.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-6 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F34147] rounded-full"></div>
                <span className="text-gray-600 text-sm">3 Offices in India</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F34147] rounded-full"></div>
                <span className="text-gray-600 text-sm">2 Offices in China</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#F34147] rounded-full"></div>
                <span className="text-gray-600 text-sm">1 Office in USA</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F34147]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Work With Us?
          </h2>
          <p className="text-white/80 mb-8">
            Join 1000+ entrepreneurs who have transformed their businesses with Suprans
          </p>
          <Link href="/contact">
            <Button data-testid="button-contact-cta" size="lg" className="btn-shine text-black px-8 py-6 text-lg font-bold">
              Get in Touch <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
