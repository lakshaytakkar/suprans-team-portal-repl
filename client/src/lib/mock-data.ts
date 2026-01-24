export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  tags?: string[];
  createdAt?: string;
}

export const mockTasks: Task[] = [
  { id: "t1", title: "Prepare Q3 Sales Report", description: "Compile data from all regions and create presentation", status: "in_progress", priority: "high", dueDate: "2024-02-10", assignedTo: "u1", tags: ["Reporting", "Q3"] },
  { id: "t2", title: "Follow up with TechStart", description: "Send updated proposal and schedule demo", status: "todo", priority: "high", dueDate: "2024-02-05", assignedTo: "u1", tags: ["Sales", "Follow-up"] },
  { id: "t3", title: "Update CRM records", description: "Clean up duplicate leads from import", status: "done", priority: "low", dueDate: "2024-01-30", assignedTo: "u1", tags: ["Admin"] },
  { id: "t4", title: "Team Meeting Preparation", description: "Create agenda for weekly sync", status: "todo", priority: "medium", dueDate: "2024-02-07", assignedTo: "u1", tags: ["Internal"] },
  { id: "t5", title: "Contract Review - KM Industries", description: "Review legal terms with legal team", status: "review", priority: "high", dueDate: "2024-02-08", assignedTo: "u2", tags: ["Legal", "Contract"] },
  { id: "t6", title: "Draft Email Sequence", description: "Create 5-step email sequence for cold outreach", status: "in_progress", priority: "medium", dueDate: "2024-02-12", assignedTo: "u1", tags: ["Marketing"] }
];

export const taskStages = [
  { id: "todo", label: "To Do", color: "blue" },
  { id: "in_progress", label: "In Progress", color: "orange" },
  { id: "review", label: "In Review", color: "purple" },
  { id: "done", label: "Done", color: "green" }
] as const;

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'sales_executive' | 'superadmin';
  phone: string;
  avatar?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  value: number;
  stage: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  assignedTo: string | null;
  source: string;
  nextFollowUp?: string;
  createdAt: string;
  wonAmount?: number;
  wonDate?: string;
  lostReason?: string;
  address?: string;
  avatar?: string;
  rating?: number; // 1-5
  tags?: string[];
  temperature?: 'hot' | 'warm' | 'cold';
  lastConnected?: {
    date: string;
    outcome: string;
    duration: string;
    agent: string;
    nextFollowUp?: string;
  };
}

export interface Activity {
  id: string;
  leadId: string;
  userId: string;
  type: 'call' | 'email' | 'meeting' | 'stage_change' | 'note';
  notes: string;
  duration?: number;
  outcome?: string;
  fromStage?: string;
  toStage?: string;
  createdAt: string;
}

export const mockUsers: User[] = [
  { id: "u1", name: "Rahul Sharma", email: "rahul@suprans.in", role: "sales_executive", phone: "+91 98765 43210", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
  { id: "u2", name: "Priya Patel", email: "priya@suprans.in", role: "sales_executive", phone: "+91 98765 43211", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya" },
  { id: "u3", name: "Admin User", email: "admin@suprans.in", role: "superadmin", phone: "+91 98765 00000", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" }
];

export const mockLeads: Lead[] = [
  { 
    id: "l1", 
    name: "Amit Kumar", 
    company: "TechStart Pvt Ltd", 
    phone: "+91 99887 76655", 
    email: "amit@techstart.com", 
    service: "LLC Formation", 
    value: 150000, 
    stage: "qualified", 
    assignedTo: "u1", 
    source: "Website", 
    nextFollowUp: "2024-01-22T10:00:00", 
    createdAt: "2024-01-15", 
    address: "123 Startup Hub, Bangalore", 
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Amit",
    rating: 4,
    tags: ["High Value", "Urgent"],
    temperature: "hot",
    lastConnected: {
      date: "2024-01-16T10:30:00",
      outcome: "Interested",
      duration: "15 min",
      agent: "Rahul Sharma",
      nextFollowUp: "2024-01-22T10:00:00"
    }
  },
  { 
    id: "l2", 
    name: "Sneha Reddy", 
    company: "Fashion Hub", 
    phone: "+91 88776 65544", 
    email: "sneha@fashionhub.in", 
    service: "GST Registration", 
    value: 25000, 
    stage: "new", 
    assignedTo: "u1", 
    source: "Referral", 
    nextFollowUp: "2024-01-21T14:00:00", 
    createdAt: "2024-01-20", 
    address: "45 Fashion St, Mumbai", 
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Sneha",
    rating: 3,
    tags: ["Fashion", "Retail"],
    temperature: "warm"
  },
  { id: "l3", name: "Vikram Singh", company: "Singh Exports", phone: "+91 77665 54433", email: "vikram@singhexports.com", service: "Import Export License", value: 200000, stage: "proposal", assignedTo: "u2", source: "Google Ads", nextFollowUp: "2024-01-23T11:00:00", createdAt: "2024-01-10", address: "78 Export Zone, Chennai", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Vikram" },
  { id: "l4", name: "Meera Joshi", company: "Joshi & Associates", phone: "+91 66554 43322", email: "meera@joshilaw.com", service: "Trademark", value: 75000, stage: "won", assignedTo: "u1", source: "LinkedIn", wonAmount: 75000, wonDate: "2024-01-18", createdAt: "2024-01-05", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Meera" },
  { id: "l5", name: "Rajesh Gupta", company: "Gupta Trading Co", phone: "+91 55443 32211", email: "rajesh@guptatrading.com", service: "Company Registration", value: 50000, stage: "contacted", assignedTo: "u2", source: "Website", nextFollowUp: "2024-01-24T15:00:00", createdAt: "2024-01-19", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Rajesh" },
  { id: "l6", name: "Anita Desai", company: "Desai Textiles", phone: "+91 44332 21100", email: "anita@desaitextiles.com", service: "GST Registration", value: 30000, stage: "lost", assignedTo: "u1", lostReason: "Went with competitor", createdAt: "2024-01-08", source: "Cold Call", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Anita" },
  { id: "l7", name: "Karan Malhotra", company: "KM Industries", phone: "+91 33221 10099", email: "karan@kmindustries.com", service: "Accounting Services", value: 120000, stage: "negotiation", assignedTo: "u2", source: "Referral", nextFollowUp: "2024-01-22T16:00:00", createdAt: "2024-01-12", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Karan" },
  { id: "l8", name: "Pooja Verma", company: "Verma Foods", phone: "+91 22110 09988", email: "pooja@vermafoods.com", service: "FSSAI License", value: 45000, stage: "new", assignedTo: null, source: "Website", createdAt: "2024-01-21", avatar: "https://api.dicebear.com/7.x/micah/svg?seed=Pooja" }
];

export const mockActivities: Activity[] = [
  { id: "a1", leadId: "l1", userId: "u1", type: "call", notes: "Discussed LLC requirements, interested in Delaware formation", duration: 15, outcome: "interested", createdAt: "2024-01-16T10:30:00" },
  { id: "a2", leadId: "l1", userId: "u1", type: "email", notes: "Sent pricing proposal for LLC formation", createdAt: "2024-01-17T14:00:00" },
  { id: "a3", leadId: "l3", userId: "u2", type: "meeting", notes: "In-person meeting at their office, discussed IE code process", duration: 45, createdAt: "2024-01-15T11:00:00" },
  { id: "a4", leadId: "l4", userId: "u1", type: "stage_change", notes: "Marked as Won - Payment received", fromStage: "negotiation", toStage: "won", createdAt: "2024-01-18T16:00:00" }
];

export const services = [
  { id: "s1", name: "LLC Formation", category: "Company Formation" },
  { id: "s2", name: "Company Registration", category: "Company Formation" },
  { id: "s3", name: "Trademark", category: "IP Services" },
  { id: "s4", "name": "GST Registration", category: "Tax & Compliance" },
  { id: "s5", "name": "Import Export License", category: "Licenses" },
  { id: "s6", "name": "FSSAI License", category: "Licenses" },
  { id: "s7", "name": "Accounting Services", category: "Ongoing Services" }
];

export const stages = [
  { id: "new", label: "New", color: "blue", order: 1 },
  { id: "contacted", label: "Contacted", color: "yellow", order: 2 },
  { id: "qualified", label: "Qualified", color: "purple", order: 3 },
  { id: "proposal", label: "Proposal", color: "pink", order: 4 },
  { id: "negotiation", label: "Negotiation", color: "orange", order: 5 },
  { id: "won", label: "Won", color: "green", order: 6, isWon: true },
  { id: "lost", label: "Lost", color: "gray", order: 7, isLost: true }
] as const;

export const mockTemplates = {
  scripts: [
    { id: "s1", title: "Cold Call - Intro", content: "Hi [Name], this is [Your Name] from SalesPulse. We help companies like [Company] streamline their sales process. Do you have 2 minutes?" },
    { id: "s2", title: "Follow Up - Voicemail", content: "Hi [Name], just following up on my previous email regarding our [Service]. Please give me a call back at [Your Phone] when you get a chance." },
    { id: "s3", title: "Gatekeeper Script", content: "Hi, I'm trying to reach [Name] regarding a partnership opportunity. Could you please connect me?" }
  ],
  emails: [
    { id: "e1", title: "Initial Outreach", subject: "Partnership Opportunity with [Company]", content: "Hi [Name],\n\nI noticed that [Company] is doing great work in [Industry]. We specialize in [Service] and I believe we can help you scale.\n\nBest,\n[Your Name]" },
    { id: "e2", title: "Proposal Follow-up", subject: "Thoughts on the proposal?", content: "Hi [Name],\n\nI wanted to circle back on the proposal I sent earlier. Do you have any questions?\n\nRegards,\n[Your Name]" },
    { id: "e3", title: "Meeting Confirmation", subject: "Confirming our meeting for [Date]", content: "Hi [Name],\n\nLooking forward to our chat on [Date] at [Time].\n\nSee you then,\n[Your Name]" }
  ],
  messages: [
    { id: "m1", title: "WhatsApp Intro", content: "Hi [Name], this is [Your Name] from SalesPulse. Saw your inquiry about [Service]. Is now a good time to chat?" },
    { id: "m2", title: "Meeting Reminder", content: "Hi [Name], reminder for our call in 15 mins. Speak soon!" }
  ],
  objections: [
    { id: "o1", title: "Too Expensive", response: "I understand budget is a concern. However, our solution typically has an ROI of 3x within 6 months. Let's look at the value it brings..." },
    { id: "o2", title: "Happy with Competitor", response: "That's great! It means you see value in this service. What's one thing you wish they did better?" },
    { id: "o3", title: "Send me an email", response: "I'd be happy to. To make sure I send relevant info, could you tell me what your biggest challenge is right now?" }
  ]
};

export const mockKnowledgeBase = [
  {
    id: "kb1",
    title: "LLC Formation",
    category: "Services",
    content: "Our LLC Formation service includes name availability search, filing Articles of Organization, Operating Agreement drafting, and EIN acquisition.",
    faqs: [
      { q: "How long does it take?", a: " typically 5-10 business days depending on the state." },
      { q: "Do I need to be a US resident?", a: "No, non-residents can form an LLC." }
    ]
  },
  {
    id: "kb2",
    title: "GST Registration",
    category: "Services",
    content: "Full assistance with GST registration including document verification and application filing.",
    faqs: [
      { q: "What documents are needed?", a: "PAN, Aadhaar, Business address proof, and bank details." },
      { q: "Is it mandatory?", a: "Yes, if turnover exceeds 20/40 lakhs." }
    ]
  }
];

export const mockTrainingModules = [
  { id: "t1", title: "SalesPulse CRM Basics", duration: "15 min", type: "video", thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60" },
  { id: "t2", title: "Handling Objections Like a Pro", duration: "25 min", type: "video", thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500&auto=format&fit=crop&q=60" },
  { id: "t3", title: "Closing Techniques", duration: "20 min", type: "video", thumbnail: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&auto=format&fit=crop&q=60" }
];

export const mockRecordings = [
  { id: "r1", title: "Discovery Call with TechStart", date: "2024-01-15", duration: "45 min", agent: "Rahul Sharma", tags: ["Good Discovery", "Closed Won"] },
  { id: "r2", title: "Negotiation with KM Industries", date: "2024-01-12", duration: "30 min", agent: "Priya Patel", tags: ["Pricing Objection", "Negotiation"] }
];
