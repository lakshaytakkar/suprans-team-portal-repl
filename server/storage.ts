import { eq, and, desc, asc, sql, or } from "drizzle-orm";
import { db } from "./db";
import { 
  users, leads, activities, tasks, services, templates, employees, travelPackages, travelBookings,
  events, eventAttendees, eventHotels, eventFlights, eventCreatives, eventPackingItems, eventCommunications, eventPresentations,
  eventTeamContacts, venueComparisons, eventVendors, eventVendorItems,
  channels, channelMessages, teamMembers,
  directMessageConversations, directMessages,
  hrEmployees, employeeDocuments, assets, assetAssignments, assetMaintenance,
  attendance, leaveRequests, jobOpenings, jobPortals,
  candidates, candidateCalls, hrTemplates, interviews,
  faireStores, faireSuppliers, faireProducts, faireProductVariants, faireOrders, faireOrderItems, faireShipments,
  llcBanks, llcClients, llcClientDocuments, llcClientTimeline,
  type User, type InsertUser,
  type Lead, type InsertLead,
  type Activity, type InsertActivity,
  type Task, type InsertTask,
  type Service, type InsertService,
  type Template, type InsertTemplate,
  type Employee, type InsertEmployee,
  type TravelPackage, type InsertTravelPackage,
  type TravelBooking, type InsertTravelBooking,
  type Event, type InsertEvent,
  type EventAttendee, type InsertEventAttendee,
  type EventHotel, type InsertEventHotel,
  type EventFlight, type InsertEventFlight,
  type EventCreative, type InsertEventCreative,
  type EventPackingItem, type InsertEventPackingItem,
  type EventCommunication, type InsertEventCommunication,
  type EventPresentation, type InsertEventPresentation,
  type EventTeamContact, type InsertEventTeamContact,
  type VenueComparison, type InsertVenueComparison,
  type EventVendor, type InsertEventVendor,
  type EventVendorItem, type InsertEventVendorItem,
  type Channel, type InsertChannel,
  type ChannelMessage, type InsertChannelMessage,
  type TeamMember, type InsertTeamMember,
  type DirectMessageConversation, type InsertDirectMessageConversation,
  type DirectMessage, type InsertDirectMessage,
  type HrEmployee, type InsertHrEmployee,
  type EmployeeDocument, type InsertEmployeeDocument,
  type Asset, type InsertAsset,
  type AssetAssignment, type InsertAssetAssignment,
  type AssetMaintenance, type InsertAssetMaintenance,
  type Attendance, type InsertAttendance,
  type LeaveRequest, type InsertLeaveRequest,
  type JobOpening, type InsertJobOpening,
  type JobPortal, type InsertJobPortal,
  type Candidate, type InsertCandidate,
  type CandidateCall, type InsertCandidateCall,
  type HrTemplate, type InsertHrTemplate,
  type Interview, type InsertInterview,
  type FaireStore, type InsertFaireStore,
  type FaireSupplier, type InsertFaireSupplier,
  type FaireProduct, type InsertFaireProduct,
  type FaireProductVariant, type InsertFaireProductVariant,
  type FaireOrder, type InsertFaireOrder,
  type FaireOrderItem, type InsertFaireOrderItem,
  type FaireShipment, type InsertFaireShipment,
  type LLCBank, type InsertLLCBank,
  type LLCClient, type InsertLLCClient,
  type LLCClientDocument, type InsertLLCClientDocument,
  type LLCClientTimeline, type InsertLLCClientTimeline,
  websiteContent,
  type WebsiteContent, type InsertWebsiteContent
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  
  // Leads
  getLead(id: string): Promise<Lead | undefined>;
  getLeadByPhone(phone: string): Promise<Lead | undefined>;
  getLeads(userId?: string, role?: string): Promise<Lead[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined>;
  deleteLead(id: string): Promise<boolean>;
  getLeadsByStage(stage: string, userId?: string): Promise<Lead[]>;
  assignLead(leadId: string, userId: string | null): Promise<Lead | undefined>;
  
  // Activities
  getActivity(id: string): Promise<Activity | undefined>;
  getActivities(leadId?: string, userId?: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  deleteActivity(id: string): Promise<boolean>;
  
  // Tasks
  getTask(id: string): Promise<Task | undefined>;
  getTasks(userId?: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;
  
  // Services
  getService(id: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined>;
  deleteService(id: string): Promise<boolean>;
  
  // Templates
  getTemplate(id: string): Promise<Template | undefined>;
  getTemplates(type?: string): Promise<Template[]>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  
  // Employees
  getEmployee(id: string): Promise<Employee | undefined>;
  getEmployees(): Promise<Employee[]>;
  getActiveEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  
  // Travel Packages
  getTravelPackage(id: string): Promise<TravelPackage | undefined>;
  getTravelPackageBySlug(slug: string): Promise<TravelPackage | undefined>;
  getTravelPackages(): Promise<TravelPackage[]>;
  getActiveTravelPackages(): Promise<TravelPackage[]>;
  getFeaturedTravelPackages(): Promise<TravelPackage[]>;
  createTravelPackage(pkg: InsertTravelPackage): Promise<TravelPackage>;
  updateTravelPackage(id: string, updates: Partial<InsertTravelPackage>): Promise<TravelPackage | undefined>;
  deleteTravelPackage(id: string): Promise<boolean>;
  
  // Travel Bookings
  createTravelBooking(booking: InsertTravelBooking): Promise<TravelBooking>;
  getTravelBooking(id: string): Promise<TravelBooking | undefined>;
  getTravelBookingByOrderId(orderId: string): Promise<TravelBooking | undefined>;
  updateTravelBooking(id: string, updates: Partial<TravelBooking>): Promise<TravelBooking | undefined>;
  getTravelBookings(): Promise<TravelBooking[]>;
  
  // Events
  getEvent(id: string): Promise<Event | undefined>;
  getEvents(): Promise<Event[]>;
  getUpcomingEvents(): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Event Attendees
  getEventAttendee(id: string): Promise<EventAttendee | undefined>;
  getEventAttendees(eventId: string): Promise<EventAttendee[]>;
  createEventAttendee(attendee: InsertEventAttendee): Promise<EventAttendee>;
  updateEventAttendee(id: string, updates: Partial<InsertEventAttendee>): Promise<EventAttendee | undefined>;
  deleteEventAttendee(id: string): Promise<boolean>;
  checkInAttendee(id: string): Promise<EventAttendee | undefined>;
  
  // Event Hotels
  getEventHotels(eventId: string): Promise<EventHotel[]>;
  createEventHotel(hotel: InsertEventHotel): Promise<EventHotel>;
  updateEventHotel(id: string, updates: Partial<InsertEventHotel>): Promise<EventHotel | undefined>;
  deleteEventHotel(id: string): Promise<boolean>;
  
  // Event Flights
  getEventFlights(eventId: string): Promise<EventFlight[]>;
  createEventFlight(flight: InsertEventFlight): Promise<EventFlight>;
  updateEventFlight(id: string, updates: Partial<InsertEventFlight>): Promise<EventFlight | undefined>;
  deleteEventFlight(id: string): Promise<boolean>;
  
  // Event Creatives
  getEventCreatives(eventId: string): Promise<EventCreative[]>;
  createEventCreative(creative: InsertEventCreative): Promise<EventCreative>;
  updateEventCreative(id: string, updates: Partial<InsertEventCreative>): Promise<EventCreative | undefined>;
  deleteEventCreative(id: string): Promise<boolean>;
  
  // Event Packing Items
  getEventPackingItems(eventId: string): Promise<EventPackingItem[]>;
  createEventPackingItem(item: InsertEventPackingItem): Promise<EventPackingItem>;
  updateEventPackingItem(id: string, updates: Partial<InsertEventPackingItem>): Promise<EventPackingItem | undefined>;
  deleteEventPackingItem(id: string): Promise<boolean>;
  
  // Event Communications
  getEventCommunications(eventId: string): Promise<EventCommunication[]>;
  createEventCommunication(comm: InsertEventCommunication): Promise<EventCommunication>;
  updateEventCommunication(id: string, updates: Partial<InsertEventCommunication>): Promise<EventCommunication | undefined>;
  deleteEventCommunication(id: string): Promise<boolean>;
  
  // Event Presentations
  getEventPresentations(eventId: string): Promise<EventPresentation[]>;
  createEventPresentation(pres: InsertEventPresentation): Promise<EventPresentation>;
  updateEventPresentation(id: string, updates: Partial<InsertEventPresentation>): Promise<EventPresentation | undefined>;
  deleteEventPresentation(id: string): Promise<boolean>;
  
  // Event Team Contacts
  getEventTeamContacts(eventId: string): Promise<EventTeamContact[]>;
  createEventTeamContact(contact: InsertEventTeamContact): Promise<EventTeamContact>;
  updateEventTeamContact(id: string, updates: Partial<InsertEventTeamContact>): Promise<EventTeamContact | undefined>;
  deleteEventTeamContact(id: string): Promise<boolean>;
  
  // Venue Comparisons
  getVenueComparisons(city?: string): Promise<VenueComparison[]>;
  getVenueComparison(id: string): Promise<VenueComparison | undefined>;
  createVenueComparison(venue: InsertVenueComparison): Promise<VenueComparison>;
  updateVenueComparison(id: string, updates: Partial<InsertVenueComparison>): Promise<VenueComparison | undefined>;
  deleteVenueComparison(id: string): Promise<boolean>;
  
  // Event Vendors
  getEventVendors(eventId: string): Promise<EventVendor[]>;
  getEventVendor(id: string): Promise<EventVendor | undefined>;
  createEventVendor(vendor: InsertEventVendor): Promise<EventVendor>;
  updateEventVendor(id: string, updates: Partial<InsertEventVendor>): Promise<EventVendor | undefined>;
  deleteEventVendor(id: string): Promise<boolean>;
  
  // Event Vendor Items
  getEventVendorItems(vendorId: string): Promise<EventVendorItem[]>;
  createEventVendorItem(item: InsertEventVendorItem): Promise<EventVendorItem>;
  updateEventVendorItem(id: string, updates: Partial<InsertEventVendorItem>): Promise<EventVendorItem | undefined>;
  deleteEventVendorItem(id: string): Promise<boolean>;
  
  // Channels
  getChannel(id: string): Promise<Channel | undefined>;
  getChannelByTeamId(teamId: string): Promise<Channel | undefined>;
  getChannels(): Promise<Channel[]>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  
  // Channel Messages
  getChannelMessages(channelId: string): Promise<ChannelMessage[]>;
  createChannelMessage(message: InsertChannelMessage): Promise<ChannelMessage>;
  
  // Team Members
  getTeamMembers(teamId: string): Promise<TeamMember[]>;
  getTeamMember(id: string): Promise<TeamMember | undefined>;
  createTeamMember(member: InsertTeamMember): Promise<TeamMember>;
  deleteTeamMember(id: string): Promise<boolean>;
  getUserTeams(userId: string): Promise<TeamMember[]>;
  
  // Direct Message Conversations
  getDirectMessageConversations(userId: string): Promise<DirectMessageConversation[]>;
  getDirectMessageConversation(id: string): Promise<DirectMessageConversation | undefined>;
  getOrCreateDirectMessageConversation(user1Id: string, user2Id: string): Promise<DirectMessageConversation>;
  
  // Direct Messages
  getDirectMessages(conversationId: string): Promise<DirectMessage[]>;
  createDirectMessage(message: InsertDirectMessage): Promise<DirectMessage>;
  markDirectMessagesAsRead(conversationId: string, userId: string): Promise<void>;
  getUnreadMessageCount(userId: string): Promise<number>;
  
  // All Users (for chat)
  getAllUsers(): Promise<User[]>;
  
  // HR Employees
  getHrEmployee(id: string): Promise<HrEmployee | undefined>;
  getHrEmployees(filters?: { officeUnit?: string; role?: string; status?: string; isSalesTeam?: boolean }): Promise<HrEmployee[]>;
  createHrEmployee(employee: InsertHrEmployee): Promise<HrEmployee>;
  updateHrEmployee(id: string, updates: Partial<InsertHrEmployee>): Promise<HrEmployee | undefined>;
  deleteHrEmployee(id: string): Promise<boolean>;
  
  // Employee Documents
  getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]>;
  createEmployeeDocument(doc: InsertEmployeeDocument): Promise<EmployeeDocument>;
  deleteEmployeeDocument(id: string): Promise<boolean>;
  
  // Assets
  getAsset(id: string): Promise<Asset | undefined>;
  getAssets(filters?: { category?: string; status?: string; location?: string }): Promise<Asset[]>;
  createAsset(asset: InsertAsset): Promise<Asset>;
  updateAsset(id: string, updates: Partial<InsertAsset>): Promise<Asset | undefined>;
  deleteAsset(id: string): Promise<boolean>;
  
  // Asset Assignments
  getAssetAssignments(assetId: string): Promise<AssetAssignment[]>;
  getEmployeeAssets(employeeId: string): Promise<AssetAssignment[]>;
  createAssetAssignment(assignment: InsertAssetAssignment): Promise<AssetAssignment>;
  updateAssetAssignment(id: string, updates: Partial<InsertAssetAssignment>): Promise<AssetAssignment | undefined>;
  
  // Asset Maintenance
  getAssetMaintenance(assetId: string): Promise<AssetMaintenance[]>;
  createAssetMaintenance(maintenance: InsertAssetMaintenance): Promise<AssetMaintenance>;
  updateAssetMaintenance(id: string, updates: Partial<InsertAssetMaintenance>): Promise<AssetMaintenance | undefined>;
  deleteAssetMaintenance(id: string): Promise<boolean>;
  
  // Attendance
  getAttendance(id: string): Promise<Attendance | undefined>;
  getAttendanceByDate(date: Date): Promise<Attendance[]>;
  getAttendanceByEmployee(employeeId: string): Promise<Attendance[]>;
  getAttendanceByDateRange(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]>;
  createAttendance(record: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined>;
  deleteAttendance(id: string): Promise<boolean>;
  bulkCreateAttendance(records: InsertAttendance[]): Promise<Attendance[]>;
  
  // Leave Requests
  getLeaveRequest(id: string): Promise<LeaveRequest | undefined>;
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]>;
  getLeaveRequestsByStatus(status: string): Promise<LeaveRequest[]>;
  createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined>;
  deleteLeaveRequest(id: string): Promise<boolean>;
  
  // Job Openings
  getJobOpening(id: string): Promise<JobOpening | undefined>;
  getJobOpenings(): Promise<JobOpening[]>;
  getJobOpeningsByStatus(status: string): Promise<JobOpening[]>;
  createJobOpening(opening: InsertJobOpening): Promise<JobOpening>;
  updateJobOpening(id: string, updates: Partial<InsertJobOpening>): Promise<JobOpening | undefined>;
  deleteJobOpening(id: string): Promise<boolean>;

  // Job Portals
  getJobPortals(): Promise<JobPortal[]>;
  getJobPortal(id: string): Promise<JobPortal | undefined>;
  createJobPortal(portal: InsertJobPortal): Promise<JobPortal>;
  updateJobPortal(id: string, updates: Partial<InsertJobPortal>): Promise<JobPortal | undefined>;
  deleteJobPortal(id: string): Promise<boolean>;

  // Candidates
  getCandidates(filters?: { status?: string; source?: string; appliedFor?: string }): Promise<Candidate[]>;
  getCandidate(id: string): Promise<Candidate | undefined>;
  getCandidateByPhone(phone: string): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
  updateCandidate(id: string, updates: Partial<InsertCandidate>): Promise<Candidate | undefined>;
  deleteCandidate(id: string): Promise<boolean>;
  bulkCreateCandidates(candidateList: InsertCandidate[]): Promise<Candidate[]>;

  // Candidate Calls
  getCandidateCalls(candidateId: string): Promise<CandidateCall[]>;
  getCandidateCall(id: string): Promise<CandidateCall | undefined>;
  createCandidateCall(call: InsertCandidateCall): Promise<CandidateCall>;
  updateCandidateCall(id: string, updates: Partial<InsertCandidateCall>): Promise<CandidateCall | undefined>;
  deleteCandidateCall(id: string): Promise<boolean>;
  getRecentCalls(limit?: number): Promise<CandidateCall[]>;

  // HR Templates
  getHrTemplates(filters?: { category?: string; type?: string }): Promise<HrTemplate[]>;
  getHrTemplate(id: string): Promise<HrTemplate | undefined>;
  createHrTemplate(template: InsertHrTemplate): Promise<HrTemplate>;
  updateHrTemplate(id: string, updates: Partial<InsertHrTemplate>): Promise<HrTemplate | undefined>;
  deleteHrTemplate(id: string): Promise<boolean>;
  incrementHrTemplateUsage(id: string): Promise<void>;

  // Interviews
  getInterviews(filter?: 'upcoming' | 'past'): Promise<Interview[]>;
  getInterview(id: string): Promise<Interview | undefined>;
  createInterview(interview: InsertInterview): Promise<Interview>;
  updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined>;
  deleteInterview(id: string): Promise<boolean>;
  bulkCreateInterviews(interviewList: InsertInterview[]): Promise<Interview[]>;

  // Website Content
  getWebsiteContent(): Promise<WebsiteContent[]>;
  getWebsiteContentBySection(section: string): Promise<WebsiteContent[]>;
  upsertWebsiteContent(section: string, key: string, value: any, updatedBy?: string): Promise<WebsiteContent>;
}

export class Storage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, role));
  }

  // Leads
  async getLead(id: string): Promise<Lead | undefined> {
    const result = await db.select().from(leads).where(eq(leads.id, id));
    return result[0];
  }

  async getLeadByPhone(phone: string): Promise<Lead | undefined> {
    // Normalize phone for comparison (remove non-digits)
    const normalizedPhone = phone.replace(/\D/g, '');
    const result = await db.select().from(leads).where(eq(leads.phone, normalizedPhone));
    return result[0];
  }

  async getLeads(userId?: string, role?: string): Promise<Lead[]> {
    if (role === 'superadmin') {
      // Admin sees all leads
      return await db.select().from(leads).orderBy(desc(leads.createdAt));
    } else if (userId) {
      // Sales exec sees only their leads
      return await db.select().from(leads)
        .where(eq(leads.assignedTo, userId))
        .orderBy(desc(leads.createdAt));
    }
    return await db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const result = await db.insert(leads).values(lead).returning();
    return result[0];
  }

  async updateLead(id: string, updates: Partial<InsertLead>): Promise<Lead | undefined> {
    const result = await db.update(leads).set(updates).where(eq(leads.id, id)).returning();
    return result[0];
  }

  async deleteLead(id: string): Promise<boolean> {
    const result = await db.delete(leads).where(eq(leads.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getLeadsByStage(stage: string, userId?: string): Promise<Lead[]> {
    if (userId) {
      return await db.select().from(leads)
        .where(and(eq(leads.stage, stage), eq(leads.assignedTo, userId)))
        .orderBy(desc(leads.createdAt));
    }
    return await db.select().from(leads)
      .where(eq(leads.stage, stage))
      .orderBy(desc(leads.createdAt));
  }

  async assignLead(leadId: string, userId: string | null): Promise<Lead | undefined> {
    const result = await db.update(leads)
      .set({ assignedTo: userId })
      .where(eq(leads.id, leadId))
      .returning();
    return result[0];
  }

  // Activities
  async getActivity(id: string): Promise<Activity | undefined> {
    const result = await db.select().from(activities).where(eq(activities.id, id));
    return result[0];
  }

  async getActivities(leadId?: string, userId?: string): Promise<Activity[]> {
    if (leadId) {
      return await db.select().from(activities)
        .where(eq(activities.leadId, leadId))
        .orderBy(desc(activities.createdAt));
    } else if (userId) {
      return await db.select().from(activities)
        .where(eq(activities.userId, userId))
        .orderBy(desc(activities.createdAt));
    }
    return await db.select().from(activities).orderBy(desc(activities.createdAt));
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }

  async deleteActivity(id: string): Promise<boolean> {
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Tasks
  async getTask(id: string): Promise<Task | undefined> {
    const result = await db.select().from(tasks).where(eq(tasks.id, id));
    return result[0];
  }

  async getTasks(userId?: string): Promise<Task[]> {
    if (userId) {
      return await db.select().from(tasks)
        .where(eq(tasks.assignedTo, userId))
        .orderBy(desc(tasks.dueDate));
    }
    return await db.select().from(tasks).orderBy(desc(tasks.dueDate));
  }

  async createTask(task: InsertTask): Promise<Task> {
    const result = await db.insert(tasks).values(task).returning();
    return result[0];
  }

  async updateTask(id: string, updates: Partial<InsertTask>): Promise<Task | undefined> {
    const result = await db.update(tasks).set(updates).where(eq(tasks.id, id)).returning();
    return result[0];
  }

  async deleteTask(id: string): Promise<boolean> {
    const result = await db.delete(tasks).where(eq(tasks.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Services
  async getService(id: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true));
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async updateService(id: string, updates: Partial<InsertService>): Promise<Service | undefined> {
    const result = await db.update(services).set(updates).where(eq(services.id, id)).returning();
    return result[0];
  }

  async deleteService(id: string): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Templates
  async getTemplate(id: string): Promise<Template | undefined> {
    const result = await db.select().from(templates).where(eq(templates.id, id));
    return result[0];
  }

  async getTemplates(type?: string): Promise<Template[]> {
    if (type) {
      return await db.select().from(templates).where(eq(templates.type, type));
    }
    return await db.select().from(templates);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const result = await db.insert(templates).values(template).returning();
    return result[0];
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const result = await db.update(templates).set(updates).where(eq(templates.id, id)).returning();
    return result[0];
  }

  async deleteTemplate(id: string): Promise<boolean> {
    const result = await db.delete(templates).where(eq(templates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Employees
  async getEmployee(id: string): Promise<Employee | undefined> {
    const result = await db.select().from(employees).where(eq(employees.id, id));
    return result[0];
  }

  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(asc(employees.displayOrder));
  }

  async getActiveEmployees(): Promise<Employee[]> {
    return await db.select().from(employees)
      .where(eq(employees.isActive, true))
      .orderBy(asc(employees.displayOrder));
  }

  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const result = await db.insert(employees).values(employee).returning();
    return result[0];
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const result = await db.update(employees).set(updates).where(eq(employees.id, id)).returning();
    return result[0];
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Travel Packages
  async getTravelPackage(id: string): Promise<TravelPackage | undefined> {
    const result = await db.select().from(travelPackages).where(eq(travelPackages.id, id));
    return result[0];
  }

  async getTravelPackageBySlug(slug: string): Promise<TravelPackage | undefined> {
    const result = await db.select().from(travelPackages).where(eq(travelPackages.slug, slug));
    return result[0];
  }

  async getTravelPackages(): Promise<TravelPackage[]> {
    return await db.select().from(travelPackages).orderBy(asc(travelPackages.displayOrder));
  }

  async getActiveTravelPackages(): Promise<TravelPackage[]> {
    return await db.select().from(travelPackages)
      .where(eq(travelPackages.isActive, true))
      .orderBy(asc(travelPackages.displayOrder));
  }

  async getFeaturedTravelPackages(): Promise<TravelPackage[]> {
    return await db.select().from(travelPackages)
      .where(and(eq(travelPackages.isActive, true), eq(travelPackages.isFeatured, true)))
      .orderBy(asc(travelPackages.displayOrder));
  }

  async createTravelPackage(pkg: InsertTravelPackage): Promise<TravelPackage> {
    const result = await db.insert(travelPackages).values(pkg).returning();
    return result[0];
  }

  async updateTravelPackage(id: string, updates: Partial<InsertTravelPackage>): Promise<TravelPackage | undefined> {
    const result = await db.update(travelPackages).set(updates).where(eq(travelPackages.id, id)).returning();
    return result[0];
  }

  async deleteTravelPackage(id: string): Promise<boolean> {
    const result = await db.delete(travelPackages).where(eq(travelPackages.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Travel Bookings
  async createTravelBooking(booking: InsertTravelBooking): Promise<TravelBooking> {
    const result = await db.insert(travelBookings).values(booking).returning();
    return result[0];
  }

  async getTravelBooking(id: string): Promise<TravelBooking | undefined> {
    const result = await db.select().from(travelBookings).where(eq(travelBookings.id, id));
    return result[0];
  }

  async getTravelBookingByOrderId(orderId: string): Promise<TravelBooking | undefined> {
    const result = await db.select().from(travelBookings).where(eq(travelBookings.razorpayOrderId, orderId));
    return result[0];
  }

  async updateTravelBooking(id: string, updates: Partial<TravelBooking>): Promise<TravelBooking | undefined> {
    const result = await db.update(travelBookings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(travelBookings.id, id))
      .returning();
    return result[0];
  }

  async getTravelBookings(): Promise<TravelBooking[]> {
    return await db.select().from(travelBookings).orderBy(desc(travelBookings.createdAt));
  }

  // Events
  async getEvent(id: string): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id));
    return result[0];
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events).orderBy(asc(events.date));
  }

  async getUpcomingEvents(): Promise<Event[]> {
    // Return current and future events for public display (including sold_out, but not cancelled/draft)
    const now = new Date();
    return await db.select().from(events)
      .where(and(
        sql`${events.status} != 'cancelled'`,
        sql`${events.status} != 'draft'`,
        sql`${events.date} >= ${now}`
      ))
      .orderBy(asc(events.date));
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(event).returning();
    return result[0];
  }

  async updateEvent(id: string, updates: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events).set(updates).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Attendees
  async getEventAttendee(id: string): Promise<EventAttendee | undefined> {
    const result = await db.select().from(eventAttendees).where(eq(eventAttendees.id, id));
    return result[0];
  }

  async getEventAttendees(eventId: string): Promise<EventAttendee[]> {
    return await db.select().from(eventAttendees)
      .where(eq(eventAttendees.eventId, eventId))
      .orderBy(asc(eventAttendees.createdAt));
  }

  async createEventAttendee(attendee: InsertEventAttendee): Promise<EventAttendee> {
    const result = await db.insert(eventAttendees).values(attendee).returning();
    return result[0];
  }

  async updateEventAttendee(id: string, updates: Partial<InsertEventAttendee>): Promise<EventAttendee | undefined> {
    const result = await db.update(eventAttendees).set(updates).where(eq(eventAttendees.id, id)).returning();
    return result[0];
  }

  async deleteEventAttendee(id: string): Promise<boolean> {
    const result = await db.delete(eventAttendees).where(eq(eventAttendees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async checkInAttendee(id: string): Promise<EventAttendee | undefined> {
    const result = await db.update(eventAttendees)
      .set({ checkedIn: true, checkedInAt: new Date() })
      .where(eq(eventAttendees.id, id))
      .returning();
    return result[0];
  }

  // Event Hotels
  async getEventHotels(eventId: string): Promise<EventHotel[]> {
    return await db.select().from(eventHotels)
      .where(eq(eventHotels.eventId, eventId))
      .orderBy(asc(eventHotels.checkIn));
  }

  async createEventHotel(hotel: InsertEventHotel): Promise<EventHotel> {
    const result = await db.insert(eventHotels).values(hotel).returning();
    return result[0];
  }

  async updateEventHotel(id: string, updates: Partial<InsertEventHotel>): Promise<EventHotel | undefined> {
    const result = await db.update(eventHotels).set(updates).where(eq(eventHotels.id, id)).returning();
    return result[0];
  }

  async deleteEventHotel(id: string): Promise<boolean> {
    const result = await db.delete(eventHotels).where(eq(eventHotels.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Flights
  async getEventFlights(eventId: string): Promise<EventFlight[]> {
    return await db.select().from(eventFlights)
      .where(eq(eventFlights.eventId, eventId))
      .orderBy(asc(eventFlights.departureTime));
  }

  async createEventFlight(flight: InsertEventFlight): Promise<EventFlight> {
    const result = await db.insert(eventFlights).values(flight).returning();
    return result[0];
  }

  async updateEventFlight(id: string, updates: Partial<InsertEventFlight>): Promise<EventFlight | undefined> {
    const result = await db.update(eventFlights).set(updates).where(eq(eventFlights.id, id)).returning();
    return result[0];
  }

  async deleteEventFlight(id: string): Promise<boolean> {
    const result = await db.delete(eventFlights).where(eq(eventFlights.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Creatives
  async getEventCreatives(eventId: string): Promise<EventCreative[]> {
    return await db.select().from(eventCreatives)
      .where(eq(eventCreatives.eventId, eventId))
      .orderBy(desc(eventCreatives.createdAt));
  }

  async createEventCreative(creative: InsertEventCreative): Promise<EventCreative> {
    const result = await db.insert(eventCreatives).values(creative).returning();
    return result[0];
  }

  async updateEventCreative(id: string, updates: Partial<InsertEventCreative>): Promise<EventCreative | undefined> {
    const result = await db.update(eventCreatives).set(updates).where(eq(eventCreatives.id, id)).returning();
    return result[0];
  }

  async deleteEventCreative(id: string): Promise<boolean> {
    const result = await db.delete(eventCreatives).where(eq(eventCreatives.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Packing Items
  async getEventPackingItems(eventId: string): Promise<EventPackingItem[]> {
    return await db.select().from(eventPackingItems)
      .where(eq(eventPackingItems.eventId, eventId))
      .orderBy(asc(eventPackingItems.category));
  }

  async createEventPackingItem(item: InsertEventPackingItem): Promise<EventPackingItem> {
    const result = await db.insert(eventPackingItems).values(item).returning();
    return result[0];
  }

  async updateEventPackingItem(id: string, updates: Partial<InsertEventPackingItem>): Promise<EventPackingItem | undefined> {
    const result = await db.update(eventPackingItems).set(updates).where(eq(eventPackingItems.id, id)).returning();
    return result[0];
  }

  async deleteEventPackingItem(id: string): Promise<boolean> {
    const result = await db.delete(eventPackingItems).where(eq(eventPackingItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Communications
  async getEventCommunications(eventId: string): Promise<EventCommunication[]> {
    return await db.select().from(eventCommunications)
      .where(eq(eventCommunications.eventId, eventId))
      .orderBy(desc(eventCommunications.createdAt));
  }

  async createEventCommunication(comm: InsertEventCommunication): Promise<EventCommunication> {
    const result = await db.insert(eventCommunications).values(comm).returning();
    return result[0];
  }

  async updateEventCommunication(id: string, updates: Partial<InsertEventCommunication>): Promise<EventCommunication | undefined> {
    const result = await db.update(eventCommunications).set(updates).where(eq(eventCommunications.id, id)).returning();
    return result[0];
  }

  async deleteEventCommunication(id: string): Promise<boolean> {
    const result = await db.delete(eventCommunications).where(eq(eventCommunications.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Presentations
  async getEventPresentations(eventId: string): Promise<EventPresentation[]> {
    return await db.select().from(eventPresentations)
      .where(eq(eventPresentations.eventId, eventId))
      .orderBy(asc(eventPresentations.order));
  }

  async createEventPresentation(pres: InsertEventPresentation): Promise<EventPresentation> {
    const result = await db.insert(eventPresentations).values(pres).returning();
    return result[0];
  }

  async updateEventPresentation(id: string, updates: Partial<InsertEventPresentation>): Promise<EventPresentation | undefined> {
    const result = await db.update(eventPresentations).set(updates).where(eq(eventPresentations.id, id)).returning();
    return result[0];
  }

  async deleteEventPresentation(id: string): Promise<boolean> {
    const result = await db.delete(eventPresentations).where(eq(eventPresentations.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Team Contacts
  async getEventTeamContacts(eventId: string): Promise<EventTeamContact[]> {
    return db.select().from(eventTeamContacts)
      .where(eq(eventTeamContacts.eventId, eventId))
      .orderBy(asc(eventTeamContacts.role), asc(eventTeamContacts.name));
  }

  async createEventTeamContact(contact: InsertEventTeamContact): Promise<EventTeamContact> {
    const result = await db.insert(eventTeamContacts).values(contact).returning();
    return result[0];
  }

  async updateEventTeamContact(id: string, updates: Partial<InsertEventTeamContact>): Promise<EventTeamContact | undefined> {
    const result = await db.update(eventTeamContacts).set(updates).where(eq(eventTeamContacts.id, id)).returning();
    return result[0];
  }

  async deleteEventTeamContact(id: string): Promise<boolean> {
    const result = await db.delete(eventTeamContacts).where(eq(eventTeamContacts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Venue Comparisons
  async getVenueComparisons(city?: string): Promise<VenueComparison[]> {
    if (city) {
      return db.select().from(venueComparisons)
        .where(eq(venueComparisons.city, city))
        .orderBy(asc(venueComparisons.category), asc(venueComparisons.name));
    }
    return db.select().from(venueComparisons)
      .orderBy(asc(venueComparisons.city), asc(venueComparisons.category), asc(venueComparisons.name));
  }

  async getVenueComparison(id: string): Promise<VenueComparison | undefined> {
    const result = await db.select().from(venueComparisons).where(eq(venueComparisons.id, id));
    return result[0];
  }

  async createVenueComparison(venue: InsertVenueComparison): Promise<VenueComparison> {
    const result = await db.insert(venueComparisons).values(venue).returning();
    return result[0];
  }

  async updateVenueComparison(id: string, updates: Partial<InsertVenueComparison>): Promise<VenueComparison | undefined> {
    const result = await db.update(venueComparisons).set({ ...updates, updatedAt: new Date() }).where(eq(venueComparisons.id, id)).returning();
    return result[0];
  }

  async deleteVenueComparison(id: string): Promise<boolean> {
    const result = await db.delete(venueComparisons).where(eq(venueComparisons.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Vendors
  async getEventVendors(eventId: string): Promise<EventVendor[]> {
    return db.select().from(eventVendors)
      .where(eq(eventVendors.eventId, eventId))
      .orderBy(asc(eventVendors.category), asc(eventVendors.vendorName));
  }

  async getEventVendor(id: string): Promise<EventVendor | undefined> {
    const result = await db.select().from(eventVendors).where(eq(eventVendors.id, id));
    return result[0];
  }

  async createEventVendor(vendor: InsertEventVendor): Promise<EventVendor> {
    const result = await db.insert(eventVendors).values(vendor).returning();
    return result[0];
  }

  async updateEventVendor(id: string, updates: Partial<InsertEventVendor>): Promise<EventVendor | undefined> {
    const result = await db.update(eventVendors).set(updates).where(eq(eventVendors.id, id)).returning();
    return result[0];
  }

  async deleteEventVendor(id: string): Promise<boolean> {
    const result = await db.delete(eventVendors).where(eq(eventVendors.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Event Vendor Items
  async getEventVendorItems(vendorId: string): Promise<EventVendorItem[]> {
    return db.select().from(eventVendorItems)
      .where(eq(eventVendorItems.vendorId, vendorId))
      .orderBy(asc(eventVendorItems.itemName));
  }

  async createEventVendorItem(item: InsertEventVendorItem): Promise<EventVendorItem> {
    const result = await db.insert(eventVendorItems).values(item).returning();
    return result[0];
  }

  async updateEventVendorItem(id: string, updates: Partial<InsertEventVendorItem>): Promise<EventVendorItem | undefined> {
    const result = await db.update(eventVendorItems).set(updates).where(eq(eventVendorItems.id, id)).returning();
    return result[0];
  }

  async deleteEventVendorItem(id: string): Promise<boolean> {
    const result = await db.delete(eventVendorItems).where(eq(eventVendorItems.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Channels
  async getChannel(id: string): Promise<Channel | undefined> {
    const result = await db.select().from(channels).where(eq(channels.id, id));
    return result[0];
  }

  async getChannelByTeamId(teamId: string): Promise<Channel | undefined> {
    const result = await db.select().from(channels).where(eq(channels.teamId, teamId));
    return result[0];
  }

  async getChannels(): Promise<Channel[]> {
    return db.select().from(channels).orderBy(asc(channels.name));
  }

  async createChannel(channel: InsertChannel): Promise<Channel> {
    const result = await db.insert(channels).values(channel).returning();
    return result[0];
  }

  // Channel Messages
  async getChannelMessages(channelId: string): Promise<ChannelMessage[]> {
    return db.select().from(channelMessages)
      .where(eq(channelMessages.channelId, channelId))
      .orderBy(asc(channelMessages.createdAt));
  }

  async createChannelMessage(message: InsertChannelMessage): Promise<ChannelMessage> {
    const result = await db.insert(channelMessages).values(message).returning();
    return result[0];
  }

  // Team Members
  async getTeamMembers(teamId: string): Promise<TeamMember[]> {
    return db.select().from(teamMembers)
      .where(eq(teamMembers.teamId, teamId))
      .orderBy(desc(teamMembers.role), asc(teamMembers.createdAt));
  }

  async getTeamMember(id: string): Promise<TeamMember | undefined> {
    const result = await db.select().from(teamMembers).where(eq(teamMembers.id, id));
    return result[0];
  }

  async createTeamMember(member: InsertTeamMember): Promise<TeamMember> {
    const result = await db.insert(teamMembers).values(member).returning();
    return result[0];
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    const result = await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getUserTeams(userId: string): Promise<TeamMember[]> {
    return db.select().from(teamMembers)
      .where(eq(teamMembers.userId, userId));
  }

  // Direct Message Conversations
  async getDirectMessageConversations(userId: string): Promise<DirectMessageConversation[]> {
    return db.select().from(directMessageConversations)
      .where(or(
        eq(directMessageConversations.user1Id, userId),
        eq(directMessageConversations.user2Id, userId)
      ))
      .orderBy(desc(directMessageConversations.lastMessageAt));
  }

  async getDirectMessageConversation(id: string): Promise<DirectMessageConversation | undefined> {
    const result = await db.select().from(directMessageConversations)
      .where(eq(directMessageConversations.id, id));
    return result[0];
  }

  async getOrCreateDirectMessageConversation(user1Id: string, user2Id: string): Promise<DirectMessageConversation> {
    const existing = await db.select().from(directMessageConversations)
      .where(or(
        and(
          eq(directMessageConversations.user1Id, user1Id),
          eq(directMessageConversations.user2Id, user2Id)
        ),
        and(
          eq(directMessageConversations.user1Id, user2Id),
          eq(directMessageConversations.user2Id, user1Id)
        )
      ));
    
    if (existing.length > 0) {
      return existing[0];
    }

    const result = await db.insert(directMessageConversations)
      .values({ user1Id, user2Id })
      .returning();
    return result[0];
  }

  // Direct Messages
  async getDirectMessages(conversationId: string): Promise<DirectMessage[]> {
    return db.select().from(directMessages)
      .where(eq(directMessages.conversationId, conversationId))
      .orderBy(asc(directMessages.createdAt));
  }

  async createDirectMessage(message: InsertDirectMessage): Promise<DirectMessage> {
    const result = await db.insert(directMessages).values(message).returning();
    await db.update(directMessageConversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(directMessageConversations.id, message.conversationId));
    return result[0];
  }

  async markDirectMessagesAsRead(conversationId: string, userId: string): Promise<void> {
    await db.update(directMessages)
      .set({ isRead: true })
      .where(and(
        eq(directMessages.conversationId, conversationId),
        sql`${directMessages.senderId} != ${userId}`
      ));
  }

  async getUnreadMessageCount(userId: string): Promise<number> {
    const conversations = await this.getDirectMessageConversations(userId);
    let count = 0;
    for (const conv of conversations) {
      const unread = await db.select({ count: sql<number>`count(*)` })
        .from(directMessages)
        .where(and(
          eq(directMessages.conversationId, conv.id),
          eq(directMessages.isRead, false),
          sql`${directMessages.senderId} != ${userId}`
        ));
      count += Number(unread[0]?.count || 0);
    }
    return count;
  }

  // HR Employees
  async getHrEmployee(id: string): Promise<HrEmployee | undefined> {
    const result = await db.select().from(hrEmployees).where(eq(hrEmployees.id, id));
    return result[0];
  }

  async getHrEmployees(filters?: { officeUnit?: string; role?: string; status?: string; isSalesTeam?: boolean }): Promise<HrEmployee[]> {
    const conditions = [];
    if (filters?.officeUnit) conditions.push(eq(hrEmployees.officeUnit, filters.officeUnit));
    if (filters?.role) conditions.push(eq(hrEmployees.role, filters.role));
    if (filters?.status) conditions.push(eq(hrEmployees.status, filters.status));
    if (filters?.isSalesTeam !== undefined) conditions.push(eq(hrEmployees.isSalesTeam, filters.isSalesTeam));
    
    if (conditions.length > 0) {
      return db.select().from(hrEmployees).where(and(...conditions)).orderBy(asc(hrEmployees.name));
    }
    return db.select().from(hrEmployees).orderBy(asc(hrEmployees.name));
  }

  async createHrEmployee(employee: InsertHrEmployee): Promise<HrEmployee> {
    const result = await db.insert(hrEmployees).values(employee).returning();
    return result[0];
  }

  async updateHrEmployee(id: string, updates: Partial<InsertHrEmployee>): Promise<HrEmployee | undefined> {
    const result = await db.update(hrEmployees).set({ ...updates, updatedAt: new Date() }).where(eq(hrEmployees.id, id)).returning();
    return result[0];
  }

  async deleteHrEmployee(id: string): Promise<boolean> {
    const result = await db.delete(hrEmployees).where(eq(hrEmployees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Employee Documents
  async getEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
    return db.select().from(employeeDocuments)
      .where(eq(employeeDocuments.employeeId, employeeId))
      .orderBy(desc(employeeDocuments.uploadedAt));
  }

  async createEmployeeDocument(doc: InsertEmployeeDocument): Promise<EmployeeDocument> {
    const result = await db.insert(employeeDocuments).values(doc).returning();
    return result[0];
  }

  async deleteEmployeeDocument(id: string): Promise<boolean> {
    const result = await db.delete(employeeDocuments).where(eq(employeeDocuments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Assets
  async getAsset(id: string): Promise<Asset | undefined> {
    const result = await db.select().from(assets).where(eq(assets.id, id));
    return result[0];
  }

  async getAssets(filters?: { category?: string; status?: string; location?: string }): Promise<Asset[]> {
    const conditions = [];
    if (filters?.category) conditions.push(eq(assets.category, filters.category));
    if (filters?.status) conditions.push(eq(assets.status, filters.status));
    if (filters?.location) conditions.push(eq(assets.location, filters.location));
    
    if (conditions.length > 0) {
      return db.select().from(assets).where(and(...conditions)).orderBy(desc(assets.createdAt));
    }
    return db.select().from(assets).orderBy(desc(assets.createdAt));
  }

  async createAsset(asset: InsertAsset): Promise<Asset> {
    const result = await db.insert(assets).values(asset).returning();
    return result[0];
  }

  async updateAsset(id: string, updates: Partial<InsertAsset>): Promise<Asset | undefined> {
    const result = await db.update(assets).set({ ...updates, updatedAt: new Date() }).where(eq(assets.id, id)).returning();
    return result[0];
  }

  async deleteAsset(id: string): Promise<boolean> {
    const result = await db.delete(assets).where(eq(assets.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Asset Assignments
  async getAssetAssignments(assetId: string): Promise<AssetAssignment[]> {
    return db.select().from(assetAssignments)
      .where(eq(assetAssignments.assetId, assetId))
      .orderBy(desc(assetAssignments.assignedDate));
  }

  async getEmployeeAssets(employeeId: string): Promise<AssetAssignment[]> {
    return db.select().from(assetAssignments)
      .where(and(
        eq(assetAssignments.employeeId, employeeId),
        sql`${assetAssignments.returnedDate} IS NULL`
      ))
      .orderBy(desc(assetAssignments.assignedDate));
  }

  async createAssetAssignment(assignment: InsertAssetAssignment): Promise<AssetAssignment> {
    const result = await db.insert(assetAssignments).values(assignment).returning();
    return result[0];
  }

  async updateAssetAssignment(id: string, updates: Partial<InsertAssetAssignment>): Promise<AssetAssignment | undefined> {
    const result = await db.update(assetAssignments).set(updates).where(eq(assetAssignments.id, id)).returning();
    return result[0];
  }

  // Asset Maintenance
  async getAssetMaintenance(assetId: string): Promise<AssetMaintenance[]> {
    return db.select().from(assetMaintenance)
      .where(eq(assetMaintenance.assetId, assetId))
      .orderBy(desc(assetMaintenance.createdAt));
  }

  async createAssetMaintenance(maintenance: InsertAssetMaintenance): Promise<AssetMaintenance> {
    const result = await db.insert(assetMaintenance).values(maintenance).returning();
    return result[0];
  }

  async updateAssetMaintenance(id: string, updates: Partial<InsertAssetMaintenance>): Promise<AssetMaintenance | undefined> {
    const result = await db.update(assetMaintenance).set(updates).where(eq(assetMaintenance.id, id)).returning();
    return result[0];
  }

  async deleteAssetMaintenance(id: string): Promise<boolean> {
    const result = await db.delete(assetMaintenance).where(eq(assetMaintenance.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Attendance methods
  async getAttendance(id: string): Promise<Attendance | undefined> {
    const result = await db.select().from(attendance).where(eq(attendance.id, id));
    return result[0];
  }

  async getAttendanceByDate(date: Date): Promise<Attendance[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return await db.select().from(attendance)
      .where(and(
        sql`${attendance.date} >= ${startOfDay}`,
        sql`${attendance.date} <= ${endOfDay}`
      ))
      .orderBy(asc(attendance.employeeId));
  }

  async getAttendanceByEmployee(employeeId: string): Promise<Attendance[]> {
    return await db.select().from(attendance)
      .where(eq(attendance.employeeId, employeeId))
      .orderBy(desc(attendance.date));
  }

  async getAttendanceByDateRange(employeeId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return await db.select().from(attendance)
      .where(and(
        eq(attendance.employeeId, employeeId),
        sql`${attendance.date} >= ${startDate}`,
        sql`${attendance.date} <= ${endDate}`
      ))
      .orderBy(asc(attendance.date));
  }

  async createAttendance(record: InsertAttendance): Promise<Attendance> {
    const result = await db.insert(attendance).values(record).returning();
    return result[0];
  }

  async updateAttendance(id: string, updates: Partial<InsertAttendance>): Promise<Attendance | undefined> {
    const result = await db.update(attendance).set(updates).where(eq(attendance.id, id)).returning();
    return result[0];
  }

  async deleteAttendance(id: string): Promise<boolean> {
    const result = await db.delete(attendance).where(eq(attendance.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkCreateAttendance(records: InsertAttendance[]): Promise<Attendance[]> {
    if (records.length === 0) return [];
    const result = await db.insert(attendance).values(records).returning();
    return result;
  }

  // Leave Request methods
  async getLeaveRequest(id: string): Promise<LeaveRequest | undefined> {
    const result = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id));
    return result[0];
  }

  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests).orderBy(desc(leaveRequests.appliedAt));
  }

  async getLeaveRequestsByEmployee(employeeId: string): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests)
      .where(eq(leaveRequests.employeeId, employeeId))
      .orderBy(desc(leaveRequests.appliedAt));
  }

  async getLeaveRequestsByStatus(status: string): Promise<LeaveRequest[]> {
    return await db.select().from(leaveRequests)
      .where(eq(leaveRequests.status, status))
      .orderBy(desc(leaveRequests.appliedAt));
  }

  async createLeaveRequest(request: InsertLeaveRequest): Promise<LeaveRequest> {
    const result = await db.insert(leaveRequests).values(request).returning();
    return result[0];
  }

  async updateLeaveRequest(id: string, updates: Partial<InsertLeaveRequest>): Promise<LeaveRequest | undefined> {
    const result = await db.update(leaveRequests).set(updates).where(eq(leaveRequests.id, id)).returning();
    return result[0];
  }

  async deleteLeaveRequest(id: string): Promise<boolean> {
    const result = await db.delete(leaveRequests).where(eq(leaveRequests.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Job Openings
  async getJobOpening(id: string): Promise<JobOpening | undefined> {
    const result = await db.select().from(jobOpenings).where(eq(jobOpenings.id, id));
    return result[0];
  }

  async getJobOpenings(): Promise<JobOpening[]> {
    return await db.select().from(jobOpenings).orderBy(desc(jobOpenings.createdAt));
  }

  async getJobOpeningsByStatus(status: string): Promise<JobOpening[]> {
    return await db.select().from(jobOpenings)
      .where(eq(jobOpenings.status, status))
      .orderBy(desc(jobOpenings.createdAt));
  }

  async createJobOpening(opening: InsertJobOpening): Promise<JobOpening> {
    const result = await db.insert(jobOpenings).values(opening).returning();
    return result[0];
  }

  async updateJobOpening(id: string, updates: Partial<InsertJobOpening>): Promise<JobOpening | undefined> {
    const result = await db.update(jobOpenings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobOpenings.id, id))
      .returning();
    return result[0];
  }

  async deleteJobOpening(id: string): Promise<boolean> {
    const result = await db.delete(jobOpenings).where(eq(jobOpenings.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Job Portals
  async getJobPortals(): Promise<JobPortal[]> {
    return db.select().from(jobPortals).orderBy(asc(jobPortals.name));
  }

  async getJobPortal(id: string): Promise<JobPortal | undefined> {
    const result = await db.select().from(jobPortals).where(eq(jobPortals.id, id));
    return result[0];
  }

  async createJobPortal(portal: InsertJobPortal): Promise<JobPortal> {
    const result = await db.insert(jobPortals).values(portal).returning();
    return result[0];
  }

  async updateJobPortal(id: string, updates: Partial<InsertJobPortal>): Promise<JobPortal | undefined> {
    const result = await db.update(jobPortals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(jobPortals.id, id))
      .returning();
    return result[0];
  }

  async deleteJobPortal(id: string): Promise<boolean> {
    const result = await db.delete(jobPortals).where(eq(jobPortals.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Candidates
  async getCandidates(filters?: { status?: string; source?: string; appliedFor?: string }): Promise<Candidate[]> {
    let query = db.select().from(candidates);
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(candidates.status, filters.status));
    }
    if (filters?.source) {
      conditions.push(eq(candidates.source, filters.source));
    }
    if (filters?.appliedFor) {
      conditions.push(eq(candidates.appliedFor, filters.appliedFor));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(candidates)
        .where(and(...conditions))
        .orderBy(desc(candidates.createdAt));
    }
    
    return await db.select().from(candidates).orderBy(desc(candidates.createdAt));
  }

  async getCandidate(id: string): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.id, id));
    return result[0];
  }

  async getCandidateByPhone(phone: string): Promise<Candidate | undefined> {
    const result = await db.select().from(candidates).where(eq(candidates.phone, phone));
    return result[0];
  }

  async createCandidate(candidate: InsertCandidate): Promise<Candidate> {
    const result = await db.insert(candidates).values(candidate).returning();
    return result[0];
  }

  async updateCandidate(id: string, updates: Partial<InsertCandidate>): Promise<Candidate | undefined> {
    const result = await db.update(candidates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(candidates.id, id))
      .returning();
    return result[0];
  }

  async deleteCandidate(id: string): Promise<boolean> {
    const result = await db.delete(candidates).where(eq(candidates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkCreateCandidates(candidateList: InsertCandidate[]): Promise<Candidate[]> {
    if (candidateList.length === 0) return [];
    const result = await db.insert(candidates).values(candidateList).returning();
    return result;
  }

  // Candidate Calls
  async getCandidateCalls(candidateId: string): Promise<CandidateCall[]> {
    return await db.select().from(candidateCalls)
      .where(eq(candidateCalls.candidateId, candidateId))
      .orderBy(desc(candidateCalls.callDate));
  }

  async getCandidateCall(id: string): Promise<CandidateCall | undefined> {
    const result = await db.select().from(candidateCalls).where(eq(candidateCalls.id, id));
    return result[0];
  }

  async createCandidateCall(call: InsertCandidateCall): Promise<CandidateCall> {
    const result = await db.insert(candidateCalls).values(call).returning();
    return result[0];
  }

  async updateCandidateCall(id: string, updates: Partial<InsertCandidateCall>): Promise<CandidateCall | undefined> {
    const result = await db.update(candidateCalls)
      .set(updates)
      .where(eq(candidateCalls.id, id))
      .returning();
    return result[0];
  }

  async deleteCandidateCall(id: string): Promise<boolean> {
    const result = await db.delete(candidateCalls).where(eq(candidateCalls.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getRecentCalls(limit: number = 50): Promise<CandidateCall[]> {
    return await db.select().from(candidateCalls)
      .orderBy(desc(candidateCalls.callDate))
      .limit(limit);
  }

  // HR Templates
  async getHrTemplates(filters?: { category?: string; type?: string }): Promise<HrTemplate[]> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(hrTemplates.category, filters.category));
    }
    if (filters?.type) {
      conditions.push(eq(hrTemplates.type, filters.type));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(hrTemplates)
        .where(and(...conditions))
        .orderBy(asc(hrTemplates.name));
    }
    
    return await db.select().from(hrTemplates).orderBy(asc(hrTemplates.name));
  }

  async getHrTemplate(id: string): Promise<HrTemplate | undefined> {
    const result = await db.select().from(hrTemplates).where(eq(hrTemplates.id, id));
    return result[0];
  }

  async createHrTemplate(template: InsertHrTemplate): Promise<HrTemplate> {
    const result = await db.insert(hrTemplates).values(template).returning();
    return result[0];
  }

  async updateHrTemplate(id: string, updates: Partial<InsertHrTemplate>): Promise<HrTemplate | undefined> {
    const result = await db.update(hrTemplates)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(hrTemplates.id, id))
      .returning();
    return result[0];
  }

  async deleteHrTemplate(id: string): Promise<boolean> {
    const result = await db.delete(hrTemplates).where(eq(hrTemplates.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async incrementHrTemplateUsage(id: string): Promise<void> {
    await db.update(hrTemplates)
      .set({ usageCount: sql`${hrTemplates.usageCount} + 1` })
      .where(eq(hrTemplates.id, id));
  }

  // Interviews
  async getInterviews(filter?: 'upcoming' | 'past'): Promise<Interview[]> {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Start of today
    
    if (filter === 'upcoming') {
      return db.select().from(interviews)
        .where(sql`${interviews.interviewDate} >= ${now}`)
        .orderBy(asc(interviews.interviewDate));
    } else if (filter === 'past') {
      return db.select().from(interviews)
        .where(sql`${interviews.interviewDate} < ${now}`)
        .orderBy(desc(interviews.interviewDate));
    }
    return db.select().from(interviews).orderBy(desc(interviews.interviewDate));
  }

  async getInterview(id: string): Promise<Interview | undefined> {
    const result = await db.select().from(interviews).where(eq(interviews.id, id));
    return result[0];
  }

  async createInterview(interview: InsertInterview): Promise<Interview> {
    const result = await db.insert(interviews).values(interview).returning();
    return result[0];
  }

  async updateInterview(id: string, updates: Partial<InsertInterview>): Promise<Interview | undefined> {
    const result = await db.update(interviews)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(interviews.id, id))
      .returning();
    return result[0];
  }

  async deleteInterview(id: string): Promise<boolean> {
    const result = await db.delete(interviews).where(eq(interviews.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkCreateInterviews(interviewList: InsertInterview[]): Promise<Interview[]> {
    if (interviewList.length === 0) return [];
    const result = await db.insert(interviews).values(interviewList).returning();
    return result;
  }

  // ============================================================================
  // FAIRE WHOLESALE METHODS
  // ============================================================================

  // Faire Stores
  async getFaireStores(): Promise<FaireStore[]> {
    return db.select().from(faireStores).orderBy(desc(faireStores.createdAt));
  }

  async getFaireStore(id: string): Promise<FaireStore | undefined> {
    const result = await db.select().from(faireStores).where(eq(faireStores.id, id));
    return result[0];
  }

  async createFaireStore(store: InsertFaireStore): Promise<FaireStore> {
    const result = await db.insert(faireStores).values(store).returning();
    return result[0];
  }

  async updateFaireStore(id: string, updates: Partial<InsertFaireStore>): Promise<FaireStore | undefined> {
    const result = await db.update(faireStores)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(faireStores.id, id))
      .returning();
    return result[0];
  }

  async deleteFaireStore(id: string): Promise<boolean> {
    const result = await db.delete(faireStores).where(eq(faireStores.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Faire Suppliers
  async getFaireSuppliers(): Promise<FaireSupplier[]> {
    return db.select().from(faireSuppliers).orderBy(desc(faireSuppliers.createdAt));
  }

  async getFaireSupplier(id: string): Promise<FaireSupplier | undefined> {
    const result = await db.select().from(faireSuppliers).where(eq(faireSuppliers.id, id));
    return result[0];
  }

  async createFaireSupplier(supplier: InsertFaireSupplier): Promise<FaireSupplier> {
    const result = await db.insert(faireSuppliers).values(supplier).returning();
    return result[0];
  }

  async updateFaireSupplier(id: string, updates: Partial<InsertFaireSupplier>): Promise<FaireSupplier | undefined> {
    const result = await db.update(faireSuppliers)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(faireSuppliers.id, id))
      .returning();
    return result[0];
  }

  async deleteFaireSupplier(id: string): Promise<boolean> {
    const result = await db.delete(faireSuppliers).where(eq(faireSuppliers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Faire Products
  async getFaireProducts(): Promise<FaireProduct[]> {
    return db.select().from(faireProducts).orderBy(desc(faireProducts.createdAt));
  }

  async getFaireProduct(id: string): Promise<FaireProduct | undefined> {
    const result = await db.select().from(faireProducts).where(eq(faireProducts.id, id));
    return result[0];
  }

  async createFaireProduct(product: InsertFaireProduct): Promise<FaireProduct> {
    const result = await db.insert(faireProducts).values(product).returning();
    return result[0];
  }

  async updateFaireProduct(id: string, updates: Partial<InsertFaireProduct>): Promise<FaireProduct | undefined> {
    const result = await db.update(faireProducts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(faireProducts.id, id))
      .returning();
    return result[0];
  }

  async deleteFaireProduct(id: string): Promise<boolean> {
    const result = await db.delete(faireProducts).where(eq(faireProducts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Faire Orders
  async getFaireOrders(): Promise<FaireOrder[]> {
    return db.select().from(faireOrders).orderBy(desc(faireOrders.createdAt));
  }

  async getFaireOrder(id: string): Promise<FaireOrder | undefined> {
    const result = await db.select().from(faireOrders).where(eq(faireOrders.id, id));
    return result[0];
  }

  async updateFaireOrder(id: string, updates: Partial<InsertFaireOrder>): Promise<FaireOrder | undefined> {
    const result = await db.update(faireOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(faireOrders.id, id))
      .returning();
    return result[0];
  }

  // Faire Shipments
  async getFaireShipments(): Promise<FaireShipment[]> {
    return db.select().from(faireShipments).orderBy(desc(faireShipments.createdAt));
  }

  async createFaireShipment(shipment: InsertFaireShipment): Promise<FaireShipment> {
    const result = await db.insert(faireShipments).values(shipment).returning();
    return result[0];
  }

  // ============================================================================
  // LLC CLIENTS METHODS
  // ============================================================================

  // LLC Banks
  async getLLCBanks(): Promise<LLCBank[]> {
    return db.select().from(llcBanks).orderBy(asc(llcBanks.displayOrder));
  }

  // LLC Clients
  async getLLCClients(): Promise<LLCClient[]> {
    return db.select().from(llcClients).orderBy(desc(llcClients.createdAt));
  }

  async getLLCClient(id: string): Promise<LLCClient | undefined> {
    const result = await db.select().from(llcClients).where(eq(llcClients.id, id));
    return result[0];
  }

  async createLLCClient(client: InsertLLCClient): Promise<LLCClient> {
    const result = await db.insert(llcClients).values(client).returning();
    return result[0];
  }

  async updateLLCClient(id: string, updates: Partial<InsertLLCClient>): Promise<LLCClient | undefined> {
    const result = await db.update(llcClients)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(llcClients.id, id))
      .returning();
    return result[0];
  }

  async deleteLLCClient(id: string): Promise<boolean> {
    const result = await db.delete(llcClients).where(eq(llcClients.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // LLC Client Documents
  async getLLCClientDocuments(clientId: string): Promise<LLCClientDocument[]> {
    return db.select().from(llcClientDocuments)
      .where(eq(llcClientDocuments.clientId, clientId))
      .orderBy(desc(llcClientDocuments.createdAt));
  }

  async createLLCClientDocument(document: InsertLLCClientDocument): Promise<LLCClientDocument> {
    const result = await db.insert(llcClientDocuments).values(document).returning();
    return result[0];
  }

  // LLC Client Timeline
  async getLLCClientTimeline(clientId: string): Promise<LLCClientTimeline[]> {
    return db.select().from(llcClientTimeline)
      .where(eq(llcClientTimeline.clientId, clientId))
      .orderBy(desc(llcClientTimeline.createdAt));
  }

  async createLLCClientTimelineEntry(entry: InsertLLCClientTimeline): Promise<LLCClientTimeline> {
    const result = await db.insert(llcClientTimeline).values(entry).returning();
    return result[0];
  }
  // Website Content
  async getWebsiteContent(): Promise<WebsiteContent[]> {
    return db.select().from(websiteContent);
  }

  async getWebsiteContentBySection(section: string): Promise<WebsiteContent[]> {
    return db.select().from(websiteContent).where(eq(websiteContent.section, section));
  }

  async upsertWebsiteContent(section: string, key: string, value: any, updatedBy?: string): Promise<WebsiteContent> {
    const existing = await db.select().from(websiteContent)
      .where(and(eq(websiteContent.section, section), eq(websiteContent.key, key)));
    if (existing.length > 0) {
      const result = await db.update(websiteContent)
        .set({ value, updatedAt: new Date(), updatedBy: updatedBy || null })
        .where(and(eq(websiteContent.section, section), eq(websiteContent.key, key)))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(websiteContent)
        .values({ section, key, value, updatedBy: updatedBy || null })
        .returning();
      return result[0];
    }
  }
}

export const storage = new Storage();
