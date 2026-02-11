import type { IStorage } from "./storage";

export async function seedWebsiteContent(storage: IStorage) {
  console.log("Seeding website content...");

  const contentData: { section: string; key: string; value: any }[] = [
    { section: "site_banner", key: "text", value: "Canton Fair 139th Phase 1 starting April 15th, 2025. Register Now!" },

    { section: "home_hero", key: "tags", value: ["USA Dropshipping Expert", "E2E Imports from China", "India's #1 Business Channel"] },
    { section: "home_hero", key: "trust_badge", value: "Trusted by 1000+ Indian Entrepreneurs" },
    { section: "home_hero", key: "headline", value: "Explore Business in China" },
    { section: "home_hero", key: "headline_subtitle", value: "w/ Mr. Suprans" },
    { section: "home_hero", key: "description", value: "Join India's most trusted business mentor for guided Canton Fair tours, factory visits, and supplier connections. 15+ years of experience helping entrepreneurs build profitable import businesses." },
    { section: "home_hero", key: "description_mobile", value: "Canton Fair tours, factory visits & supplier connections with 15+ years expertise." },
    { section: "home_hero", key: "cta_primary", value: { text: "Explore China Packages", link: "/travel" } },
    { section: "home_hero", key: "cta_secondary", value: { text: "Get a Callback", link: "/contact" } },

    { section: "home_stats", key: "items", value: [{ value: "1000+", label: "Entrepreneurs Guided" }, { value: "15+", label: "Years Experience" }, { value: "50+", label: "Countries Served" }, { value: "98%", label: "Client Satisfaction" }] },

    { section: "home_process", key: "items", value: [{ step: 1, title: "Free Consultation", description: "Share your business goals and requirements" }, { step: 2, title: "Custom Strategy", description: "Receive a tailored plan for your needs" }, { step: 3, title: "Implementation", description: "We handle the execution with full support" }, { step: 4, title: "Growth & Scale", description: "Ongoing guidance as your business grows" }] },

    { section: "home_videos", key: "items", value: [{ id: "GwQWsHjYhPc", title: "Success Story" }, { id: "lXsiTL9bDIc", title: "Client Review" }, { id: "x66MSHKuszg", title: "Business Growth" }, { id: "fdhk4hJ58tw", title: "Canton Fair Experience" }] },

    { section: "home_faqs", key: "items", value: [{ question: "How do I start importing from China?", answer: "We provide complete guidance from product sourcing to delivery. Start with a free consultation to discuss your requirements." }, { question: "Is the Canton Fair worth attending?", answer: "Absolutely! It's the world's largest trade fair with 25,000+ exhibitors. Our guided tours ensure you make the most of your visit." }, { question: "What is USA dropshipping mentorship?", answer: "Our 60-day program teaches you to run a USA-based dropshipping business with US suppliers, fast shipping, and proven scaling systems." }, { question: "What support do you provide after service?", answer: "We provide ongoing support including follow-up consultations, market updates, and business growth strategies." }] },

    { section: "about_hero", key: "title", value: "About Suprans" },
    { section: "about_hero", key: "description", value: "India's #1 global business development platform, helping entrepreneurs build profitable, legally structured, and scalable international businesses." },

    { section: "about_mission", key: "paragraph1", value: "Founded by Mr. Suprans, we believe every entrepreneur deserves access to global markets. Our mission is to democratize international trade by providing expert guidance, done-for-you services, and complete support to help businesses expand globally." },
    { section: "about_mission", key: "paragraph2", value: "Whether you're looking to attend the Canton Fair, start USA dropshipping with private suppliers, build your own private label brand, or need strategic business consulting - we've got you covered." },

    { section: "about_stats", key: "items", value: [{ value: "1000+", label: "Entrepreneurs Guided" }, { value: "15+", label: "Years Experience" }, { value: "50+", label: "Countries Served" }, { value: "98%", label: "Client Satisfaction" }] },

    { section: "about_values", key: "items", value: [{ icon: "Target", title: "Results-Driven", description: "We focus on tangible outcomes that grow your business" }, { icon: "Users", title: "Client-First", description: "Your success is our success - we're with you every step" }, { icon: "CheckCircle", title: "Integrity", description: "Transparent pricing, honest advice, no hidden agendas" }, { icon: "Globe", title: "Global Expertise", description: "15+ years of hands-on experience in international trade" }] },

    { section: "about_achievements", key: "items", value: [{ icon: "Rocket", label: "740+ Private Label Brands Built" }, { icon: "TrendingUp", label: "$50M+ Revenue Generated for Clients" }, { icon: "Mic", label: "25+ Events | 15+ Cities | 8,000+ Attendees" }, { icon: "Building2", label: "Warehouses in USA, China & India" }, { icon: "Star", label: "Featured in Economic Times, YourStory & Forbes India" }, { icon: "Handshake", label: "Strategic Partner: Boult Audio, Mokobara, Urbanic" }, { icon: "GraduationCap", label: "Angel Investor in 12+ D2C Startups" }, { icon: "Award", label: "India's #1 USA Dropshipping Mentor" }] },

    { section: "about_offices", key: "items", value: [{ city: "Gurgaon", country: "India", countryCode: "IN", address: "Tower B, 4th Floor, Udyog Vihar Phase 4, Sector 18, Gurugram, Haryana 122015" }, { city: "Mumbai", country: "India", countryCode: "IN", address: "Unit 1205, Platina Building, G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051" }, { city: "Bangalore", country: "India", countryCode: "IN", address: "3rd Floor, Sigma Tech Park, Whitefield Main Road, Koramangala, Bangalore, Karnataka 560034" }, { city: "Yiwu", country: "China", countryCode: "CN", address: "District 2, Block F, Yiwu International Trade City, Futian Street, Yiwu, Zhejiang 322000" }, { city: "Guangzhou", country: "China", countryCode: "CN", address: "Level 18, Canton Tower Business Center, Haizhu District, Guangzhou, Guangdong 510623" }, { city: "Edison", country: "USA", countryCode: "US", address: "2000 Lincoln Highway, Suite 350, Edison, New Jersey 08817, United States" }] },

    { section: "contact_info", key: "phones", value: ["+91 9350830133", "+91 9350818272", "+91 7988702534"] },
    { section: "contact_info", key: "emails", value: ["ds@suprans.in", "info@suprans.in", "travel@suprans.in"] },
    { section: "contact_info", key: "whatsapp", value: { number: "919350818272", display: "Chat with us on WhatsApp" } },
    { section: "contact_info", key: "office", value: "New Delhi, India" },
    { section: "contact_info", key: "hours", value: { weekday: "Monday - Saturday: 10:00 AM - 7:00 PM IST", weekend: "Sunday: Closed" } },

    { section: "footer_social", key: "items", value: [{ platform: "facebook", url: "https://www.facebook.com/supranschina/" }, { platform: "linkedin", url: "https://www.linkedin.com/in/sanjay-suprans" }, { platform: "instagram", url: "https://www.instagram.com/suprans.china/" }, { platform: "youtube", url: "https://www.youtube.com/@Suprans" }] },

    { section: "footer_useful_links", key: "items", value: [{ label: "Free Dropshipping Learning", url: "https://suprans1.odoo.com/slides/slide/part-01-usa-dropshipping-overview-49?fullscreen=1" }] },

    { section: "footer_contact", key: "phones", value: ["+91 9350830133", "+91 9350818272"] },
    { section: "footer_contact", key: "email", value: "info@suprans.in" },
  ];

  for (const item of contentData) {
    await storage.upsertWebsiteContent(item.section, item.key, item.value);
  }

  console.log(`Seeded ${contentData.length} website content entries.`);
}
