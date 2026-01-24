import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MessageSquare, Crown, Users } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTeamById } from "@/lib/teams-config";
import type { User, TeamMember } from "@shared/schema";

interface TeamMemberWithUser extends TeamMember {
  user: User;
}

export default function TeamMembersPage() {
  const currentTeamId = useStore((state) => state.currentTeamId);
  const currentTeam = getTeamById(currentTeamId);

  const { data: members = [], isLoading } = useQuery<TeamMemberWithUser[]>({
    queryKey: ["/api/team-members", currentTeamId],
    queryFn: async () => {
      const res = await fetch(`/api/team-members?teamId=${currentTeamId}`);
      if (!res.ok) throw new Error("Failed to fetch team members");
      return res.json();
    },
    enabled: !!currentTeamId,
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-teal-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6" style={{ color: currentTeam?.color }} />
            {currentTeam?.name} - Team Members
          </h1>
          <p className="text-muted-foreground mt-1">
            {members.length} member{members.length !== 1 ? "s" : ""} in this team
          </p>
        </div>
      </div>

      {members.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Team Members Yet</h3>
            <p className="text-muted-foreground">
              No members have been assigned to this team yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="hover-elevate" data-testid={`card-member-${member.id}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className={`${getAvatarColor(member.user.name)} text-white font-semibold`}>
                      {getInitials(member.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{member.user.name}</h3>
                      {member.role === "lead" && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{member.user.email}</p>
                    <Badge variant="secondary" className="mt-1 text-xs">
                      {member.role === "lead" ? "Team Lead" : "Member"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {member.user.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.open(`tel:${member.user.phone}`)}
                      data-testid={`button-call-${member.id}`}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => window.open(`mailto:${member.user.email}`)}
                    data-testid={`button-email-${member.id}`}
                  >
                    <Mail className="h-3 w-3 mr-1" />
                    Email
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    data-testid={`button-message-${member.id}`}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
