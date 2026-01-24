import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Search, 
  MoreHorizontal, 
  Phone, 
  Video, 
  Paperclip, 
  Send, 
  Smile, 
  Image as ImageIcon,
  MoreVertical,
  Hash,
  Users,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getTeamById } from "@/lib/teams-config";
import type { User, Channel, ChannelMessage, DirectMessageConversation, DirectMessage } from "@shared/schema";

interface MessageWithUser extends ChannelMessage {
  user?: User;
}

interface DirectMessageWithSender extends DirectMessage {
  sender?: User;
}

interface EnrichedConversation extends DirectMessageConversation {
  otherUser?: User;
  lastMessage?: DirectMessage;
  unreadCount?: number;
}

export default function ChatPage() {
  const { currentTeamId } = useStore();
  const selectedTeam = getTeamById(currentTeamId);
  const [activeTab, setActiveTab] = useState<'teams' | 'individuals'>('teams');
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<EnrichedConversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user
  const { data: currentUser } = useQuery<User>({
    queryKey: ['/api/auth/me']
  });

  // Fetch team channel (always fetch when team is available)
  const { data: teamChannel, isLoading: channelLoading } = useQuery<Channel>({
    queryKey: ['/api/channels/team', selectedTeam?.id],
    enabled: !!selectedTeam?.id
  });

  // Fetch all users for individuals tab
  const { data: allUsers = [] } = useQuery<User[]>({
    queryKey: ['/api/chat/users'],
    enabled: activeTab === 'individuals'
  });

  // Fetch direct message conversations
  const { data: conversations = [] } = useQuery<EnrichedConversation[]>({
    queryKey: ['/api/direct-messages/conversations'],
    enabled: activeTab === 'individuals'
  });

  // Set selected channel when team channel loads
  useEffect(() => {
    if (teamChannel) {
      setSelectedChannel(teamChannel);
    }
  }, [teamChannel]);

  // Fetch channel messages (use teamChannel directly)
  const { data: channelMessages = [] } = useQuery<MessageWithUser[]>({
    queryKey: ['/api/channels', teamChannel?.id, 'messages'],
    enabled: !!teamChannel?.id,
    refetchInterval: 5000
  });

  // Fetch direct messages for selected conversation
  const { data: directMessages = [] } = useQuery<DirectMessageWithSender[]>({
    queryKey: ['/api/direct-messages/conversations', selectedConversation?.id, 'messages'],
    enabled: !!selectedConversation?.id && activeTab === 'individuals',
    refetchInterval: 5000
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages, directMessages]);

  // Send channel message mutation
  const sendChannelMessage = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', `/api/channels/${teamChannel?.id}/messages`, { content });
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/channels', teamChannel?.id, 'messages'] });
    }
  });

  // Send direct message mutation
  const sendDirectMessage = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest('POST', `/api/direct-messages/conversations/${selectedConversation?.id}/messages`, { content });
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ['/api/direct-messages/conversations', selectedConversation?.id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/direct-messages/conversations'] });
    }
  });

  // Start or get conversation mutation
  const startConversation = useMutation({
    mutationFn: async (otherUserId: string) => {
      const response = await apiRequest('POST', '/api/direct-messages/conversations', { otherUserId });
      return response.json();
    },
    onSuccess: (data: EnrichedConversation) => {
      setSelectedConversation(data);
      queryClient.invalidateQueries({ queryKey: ['/api/direct-messages/conversations'] });
    }
  });

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    if (activeTab === 'teams' && selectedChannel) {
      sendChannelMessage.mutate(messageInput);
    } else if (activeTab === 'individuals' && selectedConversation) {
      sendDirectMessage.mutate(messageInput);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserClick = (user: User) => {
    const existingConv = conversations.find(c => c.otherUser?.id === user.id);
    if (existingConv) {
      setSelectedConversation(existingConv);
    } else {
      startConversation.mutate(user.id);
    }
  };

  // Filter users based on search
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Merge users with conversation data and sort by latest message activity
  const userListWithConversations = filteredUsers.map(user => {
    const conv = conversations.find(c => c.otherUser?.id === user.id);
    return {
      ...user,
      lastMessage: conv?.lastMessage?.content || "",
      lastMessageAt: conv?.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).getTime() : 0,
      time: conv?.lastMessage?.createdAt ? new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      unread: conv?.unreadCount || 0,
      conversationId: conv?.id
    };
  }).sort((a, b) => b.lastMessageAt - a.lastMessageAt);

  // Get active chat info
  const activeChatName = activeTab === 'teams' 
    ? (selectedChannel?.name || selectedTeam?.name || "Team Channel")
    : (selectedConversation?.otherUser?.name || "Select a chat");

  const activeChatRole = activeTab === 'individuals' && selectedConversation?.otherUser
    ? (selectedConversation.otherUser.role || "Team Member")
    : "";

  const messages = activeTab === 'teams' ? channelMessages : directMessages;

  const formatTime = (date: Date | string) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-6 w-full max-w-[1600px] mx-auto">
      {/* Left Sidebar: Contact List */}
      <div className="w-[380px] flex flex-col bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden shrink-0">
        
        {/* Header */}
        <div className="p-5 border-b border-[#DFE1E7] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-semibold text-[#0D0D12]">Internal Chat</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-[#666D80]" data-testid="button-chat-menu">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#808897]" />
            <Input 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-[#DFE1E7] h-[40px] text-sm focus-visible:ring-1 focus-visible:ring-[#F34147]"
              data-testid="input-chat-search"
            />
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-[#F8F9FB] rounded-lg border border-[#DFE1E7]">
            <button
              onClick={() => {
                setActiveTab('teams');
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'teams' 
                  ? "bg-white text-[#0D0D12] shadow-sm" 
                  : "text-[#666D80] hover:text-[#0D0D12]"
              )}
              data-testid="button-tab-teams"
            >
              <Users className="h-4 w-4" />
              Teams
            </button>
            <button
              onClick={() => {
                setActiveTab('individuals');
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === 'individuals' 
                  ? "bg-white text-[#0D0D12] shadow-sm" 
                  : "text-[#666D80] hover:text-[#0D0D12]"
              )}
              data-testid="button-tab-individuals"
            >
              <Avatar className="h-4 w-4">
                <AvatarFallback className="text-[8px]">U</AvatarFallback>
              </Avatar>
              Individuals
            </button>
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {activeTab === 'teams' ? (
            // Team channel - single item
            teamChannel && (
              <div 
                onClick={() => setSelectedChannel(teamChannel)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#F6F8FA] hover:bg-[#F8F9FB]",
                  selectedChannel?.id === teamChannel.id ? "bg-[#F8F9FB]" : "bg-white"
                )}
                data-testid={`channel-${teamChannel.id}`}
              >
                <div className="relative shrink-0">
                  <div className="h-[48px] w-[48px] border border-[#DFE1E7] rounded-lg bg-[#F34147]/10 flex items-center justify-center text-[#F34147]">
                    <Hash className="h-6 w-6" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[14px] font-semibold text-[#0D0D12] truncate flex items-center gap-1.5">
                      <Hash className="h-3.5 w-3.5 text-[#666D80]" />
                      {teamChannel.name}
                    </h3>
                  </div>
                  <p className="text-[13px] text-[#666D80] truncate flex-1 leading-relaxed">
                    {selectedTeam?.subtitle || "Team Channel"}
                  </p>
                </div>
              </div>
            )
          ) : (
            // Individuals list
            userListWithConversations.map((user) => (
              <div 
                key={user.id}
                onClick={() => handleUserClick(user)}
                className={cn(
                  "flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-[#F6F8FA] last:border-none hover:bg-[#F8F9FB]",
                  selectedConversation?.otherUser?.id === user.id ? "bg-[#F8F9FB]" : "bg-white"
                )}
                data-testid={`user-${user.id}`}
              >
                <div className="relative shrink-0">
                  <Avatar className="h-[48px] w-[48px] border border-[#DFE1E7]">
                    <AvatarImage src={user.avatar || ""} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[14px] font-semibold text-[#0D0D12] truncate">
                      {user.name}
                    </h3>
                    {user.time && (
                      <span className="text-[12px] text-[#666D80]">{user.time}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13px] text-[#666D80] truncate flex-1 leading-relaxed">
                      {user.lastMessage || user.role || "Click to start chatting"}
                    </p>
                    {user.unread > 0 && (
                      <span className="h-[18px] min-w-[18px] flex items-center justify-center rounded-full bg-[#F34147] text-[10px] font-bold text-white px-1">
                        {user.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {activeTab === 'teams' && channelLoading && (
            <div className="p-4 text-center text-[#666D80]">Loading channel...</div>
          )}
          
          {activeTab === 'individuals' && userListWithConversations.length === 0 && (
            <div className="p-4 text-center text-[#666D80]">No users found</div>
          )}
        </div>
      </div>

      {/* Right Area: Chat Window */}
      <div className="flex-1 flex flex-col bg-white border border-[#DFE1E7] rounded-[16px] shadow-[0px_1px_2px_0px_rgba(13,13,18,0.06)] overflow-hidden">
        
        {/* Chat Header */}
        <div className="h-[72px] px-6 border-b border-[#DFE1E7] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            {activeTab === 'teams' ? (
               <div className="h-[44px] w-[44px] border border-[#DFE1E7] rounded-lg bg-[#F34147]/10 flex items-center justify-center text-[#F34147]">
                 <Hash className="h-5 w-5" />
               </div>
            ) : (
              <Avatar className="h-[44px] w-[44px] border border-[#DFE1E7]">
                <AvatarImage src={selectedConversation?.otherUser?.avatar || ""} />
                <AvatarFallback>{activeChatName.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <h3 className="text-[16px] font-semibold text-[#0D0D12] leading-tight flex items-center gap-2" data-testid="text-active-chat-name">
                 {activeTab === 'teams' && <Hash className="h-4 w-4 text-[#666D80]" />}
                 {activeChatName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {activeTab === 'teams' ? (
                   <span className="text-[12px] text-[#666D80]">{selectedTeam?.subtitle || "Team Channel"}</span>
                ) : activeChatRole && (
                  <span className="text-[12px] text-[#666D80]">{activeChatRole}</span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 border-[#DFE1E7] text-[#666D80]" data-testid="button-call">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-9 w-9 border-[#DFE1E7] text-[#666D80]" data-testid="button-video">
              <Video className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-[#DFE1E7] mx-2" />
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#666D80]" data-testid="button-chat-options">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F8F9FB] space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-[#666D80]">
              <Hash className="h-12 w-12 mb-4 text-[#DFE1E7]" />
              <p className="text-lg font-medium">No messages yet</p>
              <p className="text-sm">Start a conversation by sending a message below</p>
            </div>
          )}
          
          {messages.map((msg) => {
            const isMe = activeTab === 'teams' 
              ? (msg as MessageWithUser).userId === currentUser?.id
              : (msg as DirectMessageWithSender).senderId === currentUser?.id;
            
            const senderName = activeTab === 'teams'
              ? ((msg as MessageWithUser).user?.name || "Unknown")
              : ((msg as DirectMessageWithSender).sender?.name || "Unknown");
            
            const senderAvatar = activeTab === 'teams'
              ? ((msg as MessageWithUser).user?.avatar || "")
              : ((msg as DirectMessageWithSender).sender?.avatar || "");

            const msgContent = msg.content;
            const msgTime = formatTime(msg.createdAt);
            const attachment = msg.attachmentUrl ? {
              url: msg.attachmentUrl,
              type: msg.attachmentType || 'file',
              name: msg.attachmentName || 'Attachment'
            } : null;

            return (
              <div 
                key={msg.id} 
                className={cn(
                  "flex items-end gap-3 max-w-[80%]",
                  isMe ? "ml-auto flex-row-reverse" : ""
                )}
                data-testid={`message-${msg.id}`}
              >
                {/* Avatar */}
                <Avatar className="h-[32px] w-[32px] border border-[#DFE1E7] shrink-0">
                  <AvatarImage src={isMe ? currentUser?.avatar || "" : senderAvatar} />
                  <AvatarFallback>{(isMe ? currentUser?.name : senderName)?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                {/* Message Content */}
                <div className="flex flex-col gap-1">
                  {/* Name & Time */}
                  <div className={cn("flex items-center gap-2", isMe ? "flex-row-reverse" : "")}>
                    <span className="text-[12px] font-medium text-[#666D80]">
                      {isMe ? "You" : senderName}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[#D1D5DB]" />
                    <span className="text-[12px] text-[#9CA3AF]">{msgTime}</span>
                  </div>

                  {/* Bubble */}
                  <div 
                    className={cn(
                      "p-3 rounded-[12px] text-[14px] leading-relaxed relative shadow-sm",
                      isMe 
                        ? "bg-[#F34147] text-white rounded-tr-none" 
                        : "bg-[#F3F4F6] border border-[#DFE1E7] text-[#0D0D12] rounded-tl-none"
                    )}
                  >
                     {msgContent}
                     
                     {/* Attachment preview */}
                     {attachment && (
                       <div className={cn(
                         "mt-2 pt-2 border-t",
                         isMe ? "border-white/30" : "border-[#DFE1E7]"
                       )}>
                         {attachment.type === 'image' ? (
                           <img 
                             src={attachment.url} 
                             alt={attachment.name}
                             className="max-w-[200px] rounded-lg"
                           />
                         ) : (
                           <a 
                             href={attachment.url}
                             target="_blank"
                             rel="noopener noreferrer"
                             className={cn(
                               "flex items-center gap-2 hover:underline",
                               isMe ? "text-white" : "text-[#F34147]"
                             )}
                           >
                             <FileText className="h-4 w-4" />
                             {attachment.name}
                           </a>
                         )}
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-white border-t border-[#DFE1E7]">
          <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-[12px] p-2 border border-[#DFE1E7] focus-within:ring-1 focus-within:ring-[#F34147] focus-within:border-[#F34147] transition-all">
            <Button variant="ghost" size="icon" className="h-9 w-9 text-[#666D80] shrink-0" data-testid="button-emoji">
              <Smile className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-[#666D80] shrink-0"
              onClick={() => fileInputRef.current?.click()}
              data-testid="button-attach-file"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-[#666D80] shrink-0"
              data-testid="button-attach-image"
            >
              <ImageIcon className="h-5 w-5" />
            </Button>
            
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                // File upload handler - would integrate with file upload API
                console.log('File selected:', e.target.files?.[0]);
              }}
            />
            
            <div className="h-6 w-px bg-[#DFE1E7] mx-1" />
            
            <input 
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${activeTab === 'teams' ? `#${activeChatName}` : activeChatName}...`}
              className="flex-1 bg-transparent border-none outline-none text-sm text-[#0D0D12] placeholder:text-[#9CA3AF] min-w-0"
              disabled={
                (activeTab === 'teams' && !teamChannel) || 
                (activeTab === 'individuals' && !selectedConversation)
              }
              data-testid="input-message"
            />
            
            <Button 
              onClick={handleSendMessage}
              disabled={
                !messageInput.trim() ||
                sendChannelMessage.isPending ||
                sendDirectMessage.isPending ||
                (activeTab === 'teams' && !teamChannel) ||
                (activeTab === 'individuals' && !selectedConversation)
              }
              className="bg-[#F34147] hover:bg-[#D93036] text-white h-9 px-4 rounded-[8px] font-medium shadow-sm transition-all disabled:opacity-50"
              data-testid="button-send-message"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
