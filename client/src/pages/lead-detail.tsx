import { useParams, useLocation } from "wouter";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  MessageSquare,
  FileText,
  Clock,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  MapPin,
  Globe,
  User,
  Users,
  Building2,
  DollarSign,
  Tag,
  Star,
  Flame,
  ThermometerSnowflake,
  X,
  Plus
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { stages } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { LogActivityDialog } from "@/components/dialogs/LogActivityDialog";
import { EditLeadDialog } from "@/components/dialogs/EditLeadDialog";
import { GenerateQuoteDialog } from "@/components/dialogs/GenerateQuoteDialog";
import { SendEmailDialog } from "@/components/dialogs/SendEmailDialog";
import { SendWhatsAppDialog } from "@/components/dialogs/SendWhatsAppDialog";

export default function LeadDetail() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { leads, activities, currentUser, addActivity, updateLeadStage } = useStore();
  const [note, setNote] = useState("");
  const [newTag, setNewTag] = useState("");
  
  const lead = leads.find(l => l.id === params.id);
  
  // Local state for UI interactivity (mocking updates)
  const [rating, setRating] = useState(lead?.rating || 0);
  const [leadTags, setLeadTags] = useState<string[]>(lead?.tags || []);
  const [temperature, setTemperature] = useState<'hot'|'warm'|'cold'|undefined>(lead?.temperature);
  const [bulletNotes, setBulletNotes] = useState<string[]>(["Interested in the enterprise plan", "Budget review pending"]);
  const [objections, setObjections] = useState([
    { id: 1, title: "Price is too high", desc: "Customer mentioned they have a quote from a competitor that is 20% lower.", type: "Pricing", date: "Jan 15", author: "Rahul" },
    { id: 2, title: "Need to consult partner", desc: "Decision maker is not the sole authority.", type: "Authority", date: "Jan 12", author: "Rahul" }
  ]);

  const leadActivities = activities
    .filter(a => a.leadId === lead?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  if (!lead) {
    return <div className="p-8">Lead not found</div>;
  }

  // Navigation Logic
  const currentIndex = leads.findIndex(l => l.id === lead.id);
  const prevLeadId = currentIndex > 0 ? leads[currentIndex - 1].id : null;
  const nextLeadId = currentIndex < leads.length - 1 ? leads[currentIndex + 1].id : null;

  const navigateToLead = (id: string | null) => {
    if (id) setLocation(`/leads/${id}`);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      if (!leadTags.includes(newTag.trim())) {
        setLeadTags([...leadTags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setLeadTags(leadTags.filter(t => t !== tagToRemove));
  };

  const handleAddNote = () => {
    if (!note.trim()) return;
    addActivity({
      leadId: lead.id,
      userId: currentUser.id,
      type: 'note',
      notes: note
    });
    setNote("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-full max-w-[1600px] mx-auto overflow-hidden">
      {/* Fixed Header Section */}
      <div className="shrink-0 pt-1 px-1 pb-2 flex flex-col gap-2">
        {/* Header Navigation */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center text-sm text-[#666D80] gap-2">
            <Link href="/leads">
              <a className="hover:text-[#0D0D12] transition-colors flex items-center gap-1">
                <Users className="h-4 w-4" />
                Leads
              </a>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#0D0D12] font-medium truncate">{lead.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-[#DFE1E7]" 
              disabled={!prevLeadId}
              onClick={() => navigateToLead(prevLeadId)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border-[#DFE1E7]"
              disabled={!nextLeadId}
              onClick={() => navigateToLead(nextLeadId)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Profile Header Card */}
        <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden shrink-0">
          <div className="p-6 pb-4">
          <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
            <div className="flex flex-col gap-4 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-4">
                <Avatar className="h-12 w-12 border border-[#DFE1E7] shadow-sm">
                  <AvatarImage src={lead.avatar} className="object-cover" />
                  <AvatarFallback className="text-sm bg-[#F8F9FB]">{lead.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <h1 className="text-[20px] font-bold text-[#0D0D12] leading-tight">{lead.name}</h1>
                    <div className="h-4 w-[1px] bg-[#DFE1E7]" />
                    
                    {/* Rating Stars with Integrated Temperature */}
                    <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-0.5 border border-gray-100">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          let fillClass = "text-[#DFE1E7]";
                          if (star <= rating) {
                            if (rating >= 4) fillClass = "fill-red-500 text-red-500";
                            else if (rating === 3) fillClass = "fill-orange-500 text-orange-500";
                            else fillClass = "fill-blue-500 text-blue-500";
                          }
                          return (
                            <button 
                              key={star}
                              onClick={() => {
                                setRating(star);
                                if (star >= 4) setTemperature('hot');
                                else if (star === 3) setTemperature('warm');
                                else setTemperature('cold');
                              }}
                              className="focus:outline-none hover:scale-110 transition-transform p-0.5"
                            >
                              <Star className={cn("h-3 w-3 transition-colors", fillClass)} />
                            </button>
                          );
                        })}
                      </div>
                      <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        rating >= 4 ? "text-red-600" :
                        rating === 3 ? "text-orange-600" :
                        rating > 0 ? "text-blue-600" : "text-gray-400"
                      )}>
                        {rating >= 4 ? "Hot" : rating === 3 ? "Warm" : rating > 0 ? "Cold" : "Unrated"}
                      </span>
                    </div>

                    <div className="h-4 w-[1px] bg-[#DFE1E7]" />

                    {/* Compact Stage Selector */}
                    <div className="flex items-center gap-1">
                      {stages.map((stage) => {
                        const isActive = stage.id === lead.stage;
                        return (
                          <button
                            key={stage.id}
                            onClick={() => updateLeadStage(lead.id, stage.id)}
                            className={cn(
                              "h-2 w-8 rounded-full transition-all hover:scale-105",
                              isActive ? `bg-${stage.color}-500 ring-2 ring-${stage.color}-200` : "bg-gray-200 hover:bg-gray-300"
                            )}
                            title={stage.label}
                          />
                        );
                      })}
                      <span className="ml-2 text-xs font-medium text-[#0D0D12] uppercase tracking-wide">
                        {stages.find(s => s.id === lead.stage)?.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#666D80]">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {lead.company}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#DFE1E7]" />
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {lead.address || "No location"}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#DFE1E7]" />
                    <div className="flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      {lead.source}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-3 shrink-0">
              <LogActivityDialog 
                leadId={lead.id} 
                defaultType="call"
                trigger={
                  <Button variant="outline" className="h-[40px] border-[#DFE1E7] text-[#0D0D12] font-medium shadow-sm hover:bg-gray-50">
                    <Phone className="mr-2 h-4 w-4" />
                    Call
                  </Button>
                }
              />
              <SendEmailDialog 
                leadId={lead.id} 
                trigger={
                  <Button variant="outline" className="h-[40px] border-[#DFE1E7] text-[#0D0D12] font-medium shadow-sm hover:bg-gray-50">
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                }
              />
              <SendWhatsAppDialog 
                leadId={lead.id} 
                trigger={
                  <Button variant="outline" className="h-[40px] border-[#DFE1E7] text-[#0D0D12] font-medium shadow-sm hover:bg-gray-50">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                }
              />
              <div className="h-8 w-[1px] bg-[#DFE1E7] mx-1" />
              {lead.stage !== 'lost' && (
                <Button 
                  onClick={() => updateLeadStage(lead.id, 'lost')} 
                  className="h-[40px] bg-white hover:bg-red-50 text-red-600 border border-red-200 shadow-sm font-medium"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Mark Lost
                </Button>
              )}
              {lead.stage !== 'won' && (
                <Button 
                  onClick={() => updateLeadStage(lead.id, 'won')} 
                  className="h-[40px] bg-[#10B981] hover:bg-[#059669] text-white border border-[#10B981] shadow-sm font-medium"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Won
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-[40px] w-[40px] border-[#DFE1E7] text-[#666D80]">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <GenerateQuoteDialog leadId={lead.id} trigger={<DropdownMenuItem onSelect={(e) => e.preventDefault()}><FileText className="mr-2 h-4 w-4" /> Generate Quote</DropdownMenuItem>} />
                  <DropdownMenuItem className="text-red-600"><XCircle className="mr-2 h-4 w-4" /> Mark as Lost</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Separated Stages Section - Removed as per request */}
      </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden pr-1 pb-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column: Info Cards - Scrollable */}
          <div className="space-y-6 lg:col-span-1 overflow-y-auto h-full pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Key Details */}
            <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#DFE1E7] flex items-center justify-between">
                  <h3 className="text-[16px] font-semibold text-[#0D0D12]">Lead Details</h3>
                  <EditLeadDialog leadId={lead.id} trigger={<Button variant="ghost" size="sm" className="h-8 text-[#F34147] hover:text-[#D93036] hover:bg-[#FFF0F3]">Edit</Button>} />
                </div>
                <div className="p-5">
                   <div className="mb-6">
                      <p className="text-xs font-medium text-[#666D80] flex items-center gap-1.5 mb-1">
                        <Phone className="h-3 w-3" /> Phone
                      </p>
                      <a href={`tel:${lead.phone}`} className="text-xl font-bold text-[#0D0D12] hover:underline block">
                        {lead.phone}
                      </a>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#666D80] flex items-center gap-1.5">
                           <DollarSign className="h-3 w-3" /> Deal Value
                        </p>
                        <p className="text-sm font-bold text-[#10B981]">₹{lead.value.toLocaleString()}</p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-[#666D80] flex items-center gap-1.5">
                           <Tag className="h-3 w-3" /> Service
                        </p>
                        <p className="text-sm font-medium text-[#0D0D12] truncate" title={lead.service}>{lead.service}</p>
                      </div>

                      <div className="space-y-1 col-span-2">
                        <p className="text-xs font-medium text-[#666D80] flex items-center gap-1.5">
                           <Mail className="h-3 w-3" /> Email
                        </p>
                        <a href={`mailto:${lead.email}`} className="text-sm font-medium text-[#F34147] hover:underline truncate block">
                           {lead.email}
                        </a>
                      </div>
                      
                      <div className="space-y-1 col-span-2">
                         <p className="text-xs font-medium text-[#666D80] flex items-center gap-1.5">
                           <Clock className="h-3 w-3" /> Created
                         </p>
                         <p className="text-sm text-[#0D0D12]">
                           {format(new Date(lead.createdAt), 'MMM d, yyyy')}
                         </p>
                      </div>
                   </div>
                </div>
              </div>

              {/* Last Connected Card */}
              {lead.lastConnected ? (
                 <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#DFE1E7]">
                    <h3 className="text-[16px] font-semibold text-[#0D0D12] flex items-center gap-2">
                      <Phone className="h-4 w-4 text-[#F34147]" /> Last Connected
                    </h3>
                  </div>
                  <div className="p-5">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                      <div className="space-y-1">
                        <p className="text-xs text-[#666D80] uppercase tracking-wide font-medium">Date</p>
                        <p className="text-sm font-medium text-[#0D0D12]">
                          {format(new Date(lead.lastConnected.date), 'MMM d, h:mm a')}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-xs text-[#666D80] uppercase tracking-wide font-medium">Outcome</p>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 capitalize font-medium">
                          {lead.lastConnected.outcome}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#666D80] uppercase tracking-wide font-medium">Duration</p>
                        <p className="text-sm font-medium text-[#0D0D12] flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#666D80]" />
                          {lead.lastConnected.duration}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs text-[#666D80] uppercase tracking-wide font-medium">Agent</p>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${lead.lastConnected.agent}`} />
                            <AvatarFallback className="text-[10px]">{lead.lastConnected.agent.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-[#0D0D12] truncate">{lead.lastConnected.agent}</span>
                        </div>
                      </div>
                    </div>

                    {lead.lastConnected.nextFollowUp && (
                      <div className="mt-4 pt-4 border-t border-[#F1F5F9]">
                        <div className="flex items-center gap-2 text-sm text-[#F34147] font-medium bg-[#FFF0F3] p-3 rounded-lg border border-[#FFE4E8]">
                          <Calendar className="h-4 w-4" />
                          Next: {format(new Date(lead.lastConnected.nextFollowUp), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    )}
                  </div>
                 </div>
              ) : (
                 <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] p-6 text-center">
                    <p className="text-sm text-[#666D80]">No connection history available.</p>
                 </div>
              )}
            </div>

          <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
            <Tabs defaultValue="activity" className="w-full flex flex-col h-full">
              <div className="flex items-center justify-between mb-4 shrink-0">
                <TabsList className="bg-white border border-[#DFE1E7] p-1 h-[44px] rounded-[10px]">
                    <TabsTrigger value="activity" className="rounded-[8px] data-[state=active]:bg-[#F34147] data-[state=active]:text-white text-[#666D80]">Timeline</TabsTrigger>
                    <TabsTrigger value="notes" className="rounded-[8px] data-[state=active]:bg-[#F34147] data-[state=active]:text-white text-[#666D80]">Notes</TabsTrigger>
                    <TabsTrigger value="files" className="rounded-[8px] data-[state=active]:bg-[#F34147] data-[state=active]:text-white text-[#666D80]">Attachments</TabsTrigger>
                  </TabsList>
                </div>
                
              <div className="flex-1 overflow-hidden pb-1">
                <TabsContent value="activity" className="h-full mt-0 outline-none">
                    <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden h-full flex flex-col">
                      <div className="px-5 py-4 border-b border-[#DFE1E7] shrink-0">
                        <h3 className="text-[16px] font-semibold text-[#0D0D12]">Activity History</h3>
                      </div>
                      <div className="flex-1 min-h-0">
                        <ScrollArea className="h-full">
                          <div className="p-6 space-y-8">
                            {leadActivities.length === 0 ? (
                              <div className="text-center py-10 text-[#666D80]">No activities recorded yet.</div>
                            ) : (
                              leadActivities.map((activity, i) => (
                                <div key={activity.id} className="relative flex gap-4">
                                  {/* Line connector */}
                                  {i !== leadActivities.length - 1 && (
                                    <div className="absolute left-[15px] top-10 h-full w-[2px] bg-[#F1F5F9]" />
                                  )}
                                  
                                  <div className="relative z-10 shrink-0">
                                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm
                                      ${activity.type === 'call' ? 'bg-blue-100 text-blue-600' : ''}
                                      ${activity.type === 'email' ? 'bg-orange-100 text-orange-600' : ''}
                                      ${activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' : ''}
                                      ${activity.type === 'stage_change' ? 'bg-gray-100 text-gray-600' : ''}
                                      ${activity.type === 'note' ? 'bg-yellow-100 text-yellow-600' : ''}
                                    `}>
                                      {activity.type === 'call' && <Phone className="h-4 w-4" />}
                                      {activity.type === 'email' && <Mail className="h-4 w-4" />}
                                      {activity.type === 'meeting' && <Calendar className="h-4 w-4" />}
                                      {activity.type === 'stage_change' && <TrendingUp className="h-4 w-4" />}
                                      {activity.type === 'note' && <FileText className="h-4 w-4" />}
                                    </div>
                                  </div>
                                  
                                  <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-sm font-semibold text-[#0D0D12] capitalize">
                                        {activity.type.replace('_', ' ')}
                                      </p>
                                      <span className="text-xs text-[#666D80]">
                                        {format(new Date(activity.createdAt), 'MMM d, h:mm a')}
                                      </span>
                                    </div>
                                    <div className="bg-[#F8F9FB] rounded-[12px] p-3 border border-[#F1F5F9]">
                                      <p className="text-sm text-[#0D0D12] leading-relaxed">
                                        {activity.notes}
                                      </p>
                                      {activity.duration && (
                                        <Badge variant="outline" className="text-[10px] h-5 mt-2 bg-white border-[#DFE1E7]">
                                          {activity.duration} mins
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="h-full mt-0 outline-none">
                     <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-full flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                          {/* Notes Section */}
                          <section>
                            <h3 className="text-[16px] font-semibold text-[#0D0D12] mb-4 flex items-center gap-2">
                              <FileText className="h-4 w-4 text-[#F34147]" /> Key Notes
                            </h3>
                            <div className="space-y-2">
                              {bulletNotes.map((note, idx) => (
                                <div key={idx} className="flex items-start gap-2 group">
                                  <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-[#F34147] shrink-0" />
                                  <Input 
                                    value={note}
                                    onChange={(e) => {
                                      const newNotes = [...bulletNotes];
                                      newNotes[idx] = e.target.value;
                                      setBulletNotes(newNotes);
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Backspace' && note === '') {
                                        e.preventDefault();
                                        const newNotes = bulletNotes.filter((_, i) => i !== idx);
                                        setBulletNotes(newNotes);
                                      }
                                    }}
                                    className="border-none shadow-none focus-visible:ring-0 p-0 h-auto min-h-[24px] text-sm bg-transparent resize-none overflow-hidden hover:bg-gray-50 rounded px-2 -ml-2 w-full transition-colors"
                                  />
                                </div>
                              ))}
                              <div className="flex items-center gap-2 text-[#666D80] hover:text-[#0D0D12] cursor-pointer transition-colors pl-0.5" onClick={() => setBulletNotes([...bulletNotes, ""])}>
                                <Plus className="h-4 w-4" />
                                <span className="text-sm">Add note...</span>
                              </div>
                            </div>
                          </section>

                          <Separator />

                          {/* Tags Section */}
                          <section>
                            <h3 className="text-[16px] font-semibold text-[#0D0D12] mb-4 flex items-center gap-2">
                              <Tag className="h-4 w-4 text-[#F34147]" /> Tags
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {leadTags.map(tag => (
                                <Badge key={tag} variant="secondary" className="bg-[#F8F9FB] text-[#0D0D12] border border-[#DFE1E7] px-2 py-1 flex items-center gap-1 font-normal group">
                                  {tag}
                                  <button onClick={() => removeTag(tag)} className="text-[#666D80] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                              {leadTags.length === 0 && <span className="text-sm text-[#666D80] italic">No tags added yet.</span>}
                            </div>
                            <div className="relative max-w-sm">
                              <Input 
                                placeholder="Add a tag..." 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                className="h-9 text-sm pr-8 bg-[#F8F9FB] border-[#DFE1E7] focus-visible:ring-[#F34147]"
                              />
                              <Plus className="h-4 w-4 absolute right-3 top-2.5 text-[#666D80]" />
                            </div>
                          </section>

                          <Separator />

                          {/* Objections Section */}
                          <section>
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="text-[16px] font-semibold text-[#0D0D12] flex items-center gap-2">
                                <XCircle className="h-4 w-4 text-[#F34147]" /> Objections
                              </h3>
                              <Button variant="ghost" size="sm" className="h-7 text-xs text-[#666D80]">Add New</Button>
                            </div>
                            <div className="space-y-3">
                               {objections.map((obj) => (
                                 <div key={obj.id} className="bg-[#F8F9FB] rounded-lg p-3 border border-[#F1F5F9]">
                                    <div className="flex items-start gap-3">
                                       <div className={`mt-1.5 h-2 w-2 rounded-full ${obj.type === 'Pricing' ? 'bg-red-500' : 'bg-orange-500'} shrink-0`} />
                                       <div className="flex-1 min-w-0">
                                          <h4 className="text-sm font-semibold text-[#0D0D12] mb-0.5">{obj.title}</h4>
                                          <p className="text-xs text-[#666D80] leading-relaxed mb-2">
                                             {obj.desc}
                                          </p>
                                          <div className="flex items-center gap-2">
                                             <Badge variant="outline" className={`text-[10px] h-5 ${obj.type === 'Pricing' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>{obj.type}</Badge>
                                             <span className="text-[10px] text-[#9AA0AC]">• Logged by {obj.author}</span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                               ))}
                            </div>
                          </section>
                        </div>
                     </div>
                  </TabsContent>

                  <TabsContent value="files" className="h-full mt-0 outline-none">
                      <div className="bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] h-full flex flex-col items-center justify-center text-[#666D80]">
                        <FileText className="h-12 w-12 text-[#DFE1E7] mb-3" />
                        <p className="font-medium">No attachments uploaded yet</p>
                        <Button variant="link" className="text-[#F34147]">Upload Attachment</Button>
                      </div>
                  </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}