import { db } from "../server/db";
import { travelPackages } from "../shared/schema";

const travelPackagesData = [
  {
    title: "Phase 1 Canton Fair: 15 - 19 April 2026",
    slug: "phase-1-canton-fair-april-2026",
    destination: "Guangzhou",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 99990,
    originalPrice: null,
    image: "/assets/images/travel/canton-phase1.png",
    gallery: ["/assets/images/travel/canton-phase1.png"],
    category: "canton_fair",
    shortDescription: "Experience Canton Fair Phase 1 with zero travel stress. Electronics, Home Appliances, Lighting, Vehicles & Parts.",
    description: "This business delegation trip is designed for entrepreneurs, buyers, traders, wholesalers, e-commerce sellers, and corporate sourcing professionals. Phase 1 focuses on Electronics & Home Appliances, Lighting Equipment, Vehicles & Spare Parts, Machinery, Hardware & Tools, and Building Materials.",
    highlights: [
      "Official Canton Fair Phase 1 buyer badge with express entry",
      "Direct access to Electronics, Home Appliances & Lighting halls",
      "Business interpreter assistance for supplier negotiations",
      "Pearl River Night Cruise with Canton Tower views",
      "Indian meals throughout the trip",
      "Professional tour manager from Team Suprans"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Buyer Badge Express Print",
      "Dinner at Indian Restaurant",
      "Pearl River Night Cruise",
      "Fair Pickup & Drop (In Group)",
      "Suprans Travel Kit: Travel Bag",
      "Suprans HelpBook: Travel Booklet",
      "Luxury AC Coach (for Transfer)",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Hotel Check-in",
        description: "Arrive at Guangzhou airport, group transfer to hotel, check-in and welcome briefing by Team Suprans.",
        activities: ["Airport Arrival", "Group Transfer", "Hotel Check-in", "Welcome Briefing"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "Canton Fair Phase 1 - Day 1",
        description: "Full day at Canton Fair exploring Electronics, Home Appliances & Lighting halls. Supplier meetings and sourcing discussions.",
        activities: ["Canton Fair Visit", "Supplier Meetings", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Canton Fair Phase 1 - Day 2",
        description: "Continue exploring Canton Fair halls. Focus on Vehicles, Machinery & Hardware sections.",
        activities: ["Canton Fair Visit", "Supplier Negotiations", "Sample Collections"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Canton Fair + Pearl River Cruise",
        description: "Morning at Canton Fair, evening Pearl River Night Cruise with stunning Canton Tower views.",
        activities: ["Canton Fair Visit", "Pearl River Night Cruise", "Canton Tower Sightseeing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure",
        description: "Breakfast at hotel, check-out and group transfer to airport for return flight.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Luxury AC Coach + Metro",
    groupSize: 40,
    ageRange: "18-60",
    startDate: new Date("2026-04-15"),
    endDate: new Date("2026-04-19"),
    isFeatured: true,
    isActive: true,
    displayOrder: 1
  },
  {
    title: "Phase 2 Canton Fair: 23 - 27 April 2026",
    slug: "phase-2-canton-fair-april-2026",
    destination: "Guangzhou",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 89990,
    originalPrice: 120000,
    image: "/assets/images/travel/canton-phase2.png",
    gallery: ["/assets/images/travel/canton-phase2.png"],
    category: "canton_fair",
    shortDescription: "Canton Fair Phase 2 - Consumer Goods, Gifts, Home Decorations & Textiles at special discounted pricing.",
    description: "Phase 2 of Canton Fair focuses on Consumer Goods, Gifts, Home Decorations, Textiles & Garments. Perfect for buyers looking for home decor, fashion accessories, gifts, and textile products.",
    highlights: [
      "Official Canton Fair Phase 2 buyer badge",
      "Access to Consumer Goods & Gifts halls",
      "Home Decorations & Textiles sourcing",
      "Business interpreter for negotiations",
      "Pearl River Night Cruise",
      "Special discounted group pricing"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Buyer Badge Express Print",
      "Dinner at Indian Restaurant",
      "Pearl River Night Cruise",
      "Fair Pickup & Drop (In Group)",
      "Suprans Travel Kit",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Hotel Check-in",
        description: "Arrive at Guangzhou airport, group transfer to hotel, welcome briefing.",
        activities: ["Airport Arrival", "Group Transfer", "Hotel Check-in", "Orientation Briefing"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "Canton Fair Phase 2 - Consumer Goods",
        description: "Full day exploring Consumer Goods, Gifts & Home Decorations halls.",
        activities: ["Canton Fair Visit", "Supplier Meetings", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Canton Fair Phase 2 - Textiles",
        description: "Focus on Textiles, Garments & Fashion Accessories sections.",
        activities: ["Canton Fair Visit", "Supplier Negotiations", "Sample Collections"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Canton Fair + City Tour",
        description: "Morning at fair, evening Pearl River Cruise and local sightseeing.",
        activities: ["Canton Fair Visit", "Pearl River Night Cruise", "City Sightseeing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure",
        description: "Breakfast, check-out and airport transfer.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Luxury AC Coach + Metro",
    groupSize: 40,
    ageRange: "18-60",
    startDate: new Date("2026-04-23"),
    endDate: new Date("2026-04-27"),
    isFeatured: true,
    isActive: true,
    displayOrder: 2
  },
  {
    title: "Phase 3 Canton Fair: 01 - 05 May 2026",
    slug: "phase-3-canton-fair-may-2026",
    destination: "Guangzhou",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 89900,
    originalPrice: 110000,
    image: "/assets/images/travel/canton-phase3.png",
    gallery: ["/assets/images/travel/canton-phase3.png"],
    category: "canton_fair",
    shortDescription: "Canton Fair Phase 3 - Food, Medical, Health Products & Services at best value pricing.",
    description: "Phase 3 focuses on Food, Medical & Health Products, Resources & Services. Ideal for buyers in food processing, pharmaceuticals, healthcare, and service industries.",
    highlights: [
      "Official Canton Fair Phase 3 buyer badge",
      "Food & Medical Products sourcing",
      "Health Products & Services halls",
      "Business interpreter assistance",
      "Special group discount pricing",
      "Complete travel support"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Buyer Badge Express Print",
      "Dinner at Indian Restaurant",
      "Pearl River Night Cruise",
      "Suprans Travel Kit",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Hotel Check-in",
        description: "Arrive at Guangzhou airport, group transfer and welcome briefing.",
        activities: ["Airport Arrival", "Group Transfer", "Hotel Check-in"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "Canton Fair Phase 3 - Day 1",
        description: "Explore Food, Medical & Health Products halls.",
        activities: ["Canton Fair Visit", "Supplier Meetings"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Canton Fair Phase 3 - Day 2",
        description: "Continue exploring Resources & Services sections.",
        activities: ["Canton Fair Visit", "Supplier Negotiations"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Canton Fair + Sightseeing",
        description: "Morning at fair, evening city tour and Pearl River Cruise.",
        activities: ["Canton Fair Visit", "Pearl River Night Cruise"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure",
        description: "Breakfast, check-out and airport transfer.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Luxury AC Coach + Metro",
    groupSize: 40,
    ageRange: "18-60",
    startDate: new Date("2026-05-01"),
    endDate: new Date("2026-05-05"),
    isFeatured: true,
    isActive: true,
    displayOrder: 3
  },
  {
    title: "Foshan Furniture & Lighting Market Tour",
    slug: "foshan-furniture-lighting-market-tour",
    destination: "Foshan",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 99990,
    originalPrice: null,
    image: "/assets/images/travel/foshan-tour.png",
    gallery: ["/assets/images/travel/foshan-tour.png"],
    category: "business",
    shortDescription: "Explore China's largest furniture and lighting wholesale markets in Foshan with expert sourcing guidance.",
    description: "This business delegation trip is designed for entrepreneurs, buyers, traders, wholesalers, e-commerce sellers, and corporate sourcing professionals. The program focuses on exploring China's largest furniture and lighting wholesale markets in Foshan, meeting suppliers, identifying products, and negotiating pricing directly with verified factory vendors.",
    highlights: [
      "Visit Lecong Furniture Market - Asia's largest furniture hub",
      "Explore Guzhen Lighting Capital of China",
      "Direct meetings with verified furniture manufacturers",
      "Lighting factory visits with product sourcing",
      "Business interpreter for negotiations",
      "Guidance on export process and logistics"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Dinner at Indian Restaurant",
      "Market Visit Vehicle",
      "Suprans Travel Kit",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival & Hotel Check-in",
        description: "Arrive at airport, group transfer to Foshan hotel, welcome briefing by Team Suprans.",
        activities: ["Airport Arrival", "Group Transfer", "Hotel Check-in", "Market Overview Briefing"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "Lecong Furniture Market",
        description: "Full day at Lecong Furniture Market - Asia's largest furniture wholesale hub with 5km of showrooms.",
        activities: ["Lecong Market Visit", "Supplier Meetings", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Furniture Factories & Showrooms",
        description: "Visit furniture factories and premium showrooms for custom manufacturing discussions.",
        activities: ["Factory Visits", "Supplier Negotiations", "Sample Reviews"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Guzhen Lighting Market",
        description: "Explore Guzhen - China's Lighting Capital with thousands of lighting manufacturers.",
        activities: ["Guzhen Market Visit", "Lighting Factory Tour", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure",
        description: "Breakfast at hotel, check-out and group transfer to airport.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Private Car + Market Visit Vehicle",
    groupSize: 40,
    ageRange: "18-60",
    startDate: null,
    endDate: null,
    isFeatured: true,
    isActive: true,
    displayOrder: 4
  },
  {
    title: "Yiwu & Shanghai Sourcing Tour",
    slug: "yiwu-shanghai-sourcing-tour",
    destination: "Yiwu, Shanghai",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 99990,
    originalPrice: null,
    image: "/assets/images/travel/yiwu-shanghai-tour.png",
    gallery: ["/assets/images/travel/yiwu-shanghai-tour.png"],
    category: "business",
    shortDescription: "Visit world's largest small commodities market in Yiwu and explore Shanghai's business opportunities.",
    description: "Explore the Yiwu International Trade Market - the world's largest wholesale market for small commodities, combined with Shanghai's business districts and manufacturing hubs.",
    highlights: [
      "Yiwu International Trade Market - 5 districts, 75,000+ shops",
      "Small commodities sourcing at wholesale prices",
      "Shanghai business district exploration",
      "Direct supplier meetings and negotiations",
      "Export guidance and logistics support",
      "Business interpreter assistance"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Dinner at Indian Restaurant",
      "Suprans Travel Kit",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Yiwu",
        description: "Arrive at airport, transfer to Yiwu hotel, welcome briefing.",
        activities: ["Airport Arrival", "Transfer to Yiwu", "Hotel Check-in"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "Yiwu Market - Districts 1 & 2",
        description: "Explore Yiwu Market Districts 1 & 2 - Toys, Fashion Accessories, Jewelry.",
        activities: ["Yiwu Market Visit", "Supplier Meetings", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Yiwu Market - Districts 3, 4 & 5",
        description: "Continue exploring Electronics, Stationery, Sports, and Handicrafts sections.",
        activities: ["Yiwu Market Visit", "Supplier Negotiations", "Sample Collections"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Shanghai Business Tour",
        description: "Transfer to Shanghai, explore business districts and The Bund.",
        activities: ["Transfer to Shanghai", "Business District Tour", "The Bund Visit"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure from Shanghai",
        description: "Breakfast, check-out and transfer to Shanghai airport.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Luxury AC Coach + High-Speed Train",
    groupSize: 40,
    ageRange: "18-60",
    startDate: null,
    endDate: null,
    isFeatured: true,
    isActive: true,
    displayOrder: 5
  },
  {
    title: "Wuxi - EV & Battery Factory Manufacturing Tour",
    slug: "wuxi-ev-battery-factory-tour",
    destination: "Wuxi, Shanghai",
    duration: "5 Days/4 Nights",
    days: 5,
    nights: 4,
    price: 99990,
    originalPrice: null,
    image: "/assets/images/travel/wuxi-ev-tour.png",
    gallery: ["/assets/images/travel/wuxi-ev-tour.png"],
    category: "business",
    shortDescription: "Explore China's EV & Battery manufacturing powerhouse in Wuxi with factory visits and supplier meetings.",
    description: "Discover Wuxi - China's emerging hub for Electric Vehicle and Battery manufacturing. Visit leading EV factories, battery production facilities, and meet suppliers in the clean energy sector.",
    highlights: [
      "EV manufacturing factory visits",
      "Battery production facility tours",
      "Direct meetings with EV component suppliers",
      "Clean energy technology exploration",
      "Business interpreter for negotiations",
      "Shanghai business district tour"
    ],
    inclusions: [
      "Group Visa 144Hrs",
      "Travel Insurance",
      "Group Pickup & Drop",
      "Buffet Breakfast",
      "Sharing Rooms (4 Star Hotel)",
      "2500ML Water Bottle",
      "Indian Tour Manager",
      "Dinner at Indian Restaurant",
      "Suprans Travel Kit",
      "Group Coordination Staff"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Wuxi",
        description: "Arrive at Shanghai airport, transfer to Wuxi hotel, welcome briefing.",
        activities: ["Airport Arrival", "Transfer to Wuxi", "Hotel Check-in"],
        meals: ["Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 2,
        title: "EV Manufacturing Facilities",
        description: "Visit leading EV manufacturing facilities and assembly plants.",
        activities: ["EV Factory Visit", "Manufacturing Tour", "Supplier Meetings"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 3,
        title: "Battery Production & Components",
        description: "Explore battery production facilities and EV component manufacturers.",
        activities: ["Battery Factory Visit", "Component Sourcing", "Supplier Negotiations"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 4,
        title: "Shanghai Tech Tour",
        description: "Transfer to Shanghai, explore tech districts and business opportunities.",
        activities: ["Transfer to Shanghai", "Tech District Tour", "Business Meetings"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "4 Star Business Hotel"
      },
      {
        day: 5,
        title: "Departure",
        description: "Breakfast, check-out and transfer to Shanghai airport.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "4 Star Hotel",
    meals: "Breakfast + Dinner included",
    transportation: "Luxury AC Coach + High-Speed Train",
    groupSize: 40,
    ageRange: "18-60",
    startDate: null,
    endDate: null,
    isFeatured: false,
    isActive: true,
    displayOrder: 6
  },
  {
    title: "Suprans Exclusive Hong Kong & Canton Trip",
    slug: "hong-kong-canton-exclusive-trip",
    destination: "Hong Kong, Canton Delegation",
    duration: "8 Days/7 Nights",
    days: 8,
    nights: 7,
    price: 169990,
    originalPrice: null,
    image: "/assets/images/travel/hong-kong-canton.png",
    gallery: ["/assets/images/travel/hong-kong-canton.png"],
    category: "canton_fair",
    shortDescription: "Premium 8-day experience combining Hong Kong exploration with Canton Fair business delegation and Mr. Suprans personal mentorship.",
    description: "The ultimate business delegation package combining the vibrant city of Hong Kong with Canton Fair sourcing. This exclusive trip includes Mr. Suprans' personal mentorship, business networking sessions, and premium accommodations throughout.",
    highlights: [
      "Mr. Suprans personal mentorship (Code: SUPEX01)",
      "Hong Kong business district exploration",
      "Canton Fair buyer badge with priority access",
      "Premium 5-star hotel accommodations",
      "Business networking sessions",
      "Victoria Peak and Hong Kong sightseeing",
      "Mentorship conference with industry experts"
    ],
    inclusions: [
      "Hong Kong PAR Visa",
      "Group Visa 144Hrs for China",
      "Travel Insurance",
      "All Pickup & Drop",
      "Daily Buffet Breakfast",
      "5 Star Hotel Accommodations",
      "Indian Meals (Lunch & Dinner)",
      "Hong Kong City Tour",
      "Victoria Peak Visit",
      "Canton Fair Buyer Badge",
      "Mr. Suprans Mentorship Session",
      "Business Networking Events",
      "Suprans Premium Travel Kit",
      "24/7 Tour Manager Support"
    ],
    exclusions: ["Sticker Visa", "Flight Tickets", "Personal Shopping", "Single Room Supplement"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Hong Kong",
        description: "Arrive at Hong Kong airport, premium hotel check-in, welcome dinner with Team Suprans.",
        activities: ["Airport Arrival", "Hotel Check-in", "Welcome Dinner", "Trip Briefing"],
        meals: ["Welcome Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 2,
        title: "Hong Kong City Exploration",
        description: "Full day Hong Kong city tour - Victoria Peak, The Peak Tram, Star Ferry, and business districts.",
        activities: ["Victoria Peak", "Peak Tram", "Star Ferry", "Business District Tour"],
        meals: ["Buffet Breakfast", "Lunch", "Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 3,
        title: "Hong Kong Business & Shopping",
        description: "Explore Hong Kong's business opportunities, electronics markets, and shopping districts.",
        activities: ["Business Meetings", "Electronics Market", "Shopping Tour"],
        meals: ["Buffet Breakfast", "Lunch", "Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 4,
        title: "Transfer to Guangzhou",
        description: "High-speed train to Guangzhou, hotel check-in, Canton Fair orientation.",
        activities: ["High-Speed Train", "Guangzhou Transfer", "Canton Fair Briefing"],
        meals: ["Buffet Breakfast", "Lunch", "Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 5,
        title: "Canton Fair - Day 1",
        description: "Full day at Canton Fair with priority access and guided sourcing.",
        activities: ["Canton Fair Visit", "Supplier Meetings", "Product Sourcing"],
        meals: ["Buffet Breakfast", "Indian Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 6,
        title: "Canton Fair - Day 2 + Mentorship",
        description: "Morning at fair, afternoon Mr. Suprans mentorship session and business networking.",
        activities: ["Canton Fair Visit", "Mentorship Session", "Business Networking"],
        meals: ["Buffet Breakfast", "Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 7,
        title: "Canton Fair + Pearl River Cruise",
        description: "Final fair day, Pearl River Night Cruise, farewell dinner.",
        activities: ["Canton Fair Visit", "Pearl River Cruise", "Farewell Dinner"],
        meals: ["Buffet Breakfast", "Farewell Dinner"],
        accommodation: "5 Star Hotel"
      },
      {
        day: 8,
        title: "Departure",
        description: "Breakfast, check-out and airport transfer.",
        activities: ["Hotel Check-out", "Airport Transfer"],
        meals: ["Buffet Breakfast"],
        accommodation: "N/A"
      }
    ],
    accommodation: "5 Star Hotel",
    meals: "All Meals Included",
    transportation: "Premium AC Vehicle + High-Speed Train",
    groupSize: 20,
    ageRange: "18-60",
    startDate: null,
    endDate: null,
    isFeatured: true,
    isActive: true,
    displayOrder: 0
  }
];

async function seedTravelPackages() {
  console.log("Seeding travel packages...");
  
  for (const pkg of travelPackagesData) {
    try {
      await db.insert(travelPackages).values(pkg);
      console.log(`Created package: ${pkg.title}`);
    } catch (error: any) {
      if (error.code === '23505') {
        console.log(`Package already exists: ${pkg.title}`);
      } else {
        console.error(`Error creating package ${pkg.title}:`, error.message);
      }
    }
  }
  
  console.log("Travel packages seeding complete!");
  process.exit(0);
}

seedTravelPackages();
