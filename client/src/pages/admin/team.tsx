import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { teams } from "@/lib/teams-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Users, Settings2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@shared/schema";

type UserWithSalary = Omit<User, "password"> & { salary?: number };

interface TeamMemberRecord {
  id: string;
  teamId: string;
  userId: string;
  role: string;
}

export default function TeamManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [manageUserId, setManageUserId] = useState<string | null>(null);

  const { data: users = [], isLoading: usersLoading } = useQuery<UserWithSalary[]>({
    queryKey: ["/api/users"],
  });

  const teamIds = useMemo(() => teams.map((t) => t.id), []);

  const { data: allTeamMembers = [], isLoading: membersLoading } = useQuery<TeamMemberRecord[]>({
    queryKey: ["/api/team-members", "all-teams"],
    queryFn: async () => {
      const results: TeamMemberRecord[] = [];
      const promises = teamIds.map(async (teamId) => {
        const res = await fetch(`/api/team-members?teamId=${teamId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          data.forEach((m: TeamMemberRecord) => results.push(m));
        }
      });
      await Promise.all(promises);
      return results;
    },
  });

  const userTeamMap = useMemo(() => {
    const map = new Map<string, TeamMemberRecord[]>();
    allTeamMembers.forEach((m) => {
      const existing = map.get(m.userId) || [];
      existing.push(m);
      map.set(m.userId, existing);
    });
    return map;
  }, [allTeamMembers]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !searchQuery ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  const managedUser = users.find((u) => u.id === manageUserId);

  const addMemberMutation = useMutation({
    mutationFn: async (data: { teamId: string; userId: string; role: string }) => {
      await apiRequest("POST", "/api/team-members", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-teams"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async (data: { id: string; role: string }) => {
      await apiRequest("PATCH", `/api/team-members/${data.id}`, { role: data.role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-teams"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/team-members"] });
      queryClient.invalidateQueries({ queryKey: ["/api/my-teams"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleToggleTeam = (teamId: string, userId: string, currentMembership: TeamMemberRecord | undefined) => {
    if (currentMembership) {
      removeMemberMutation.mutate(currentMembership.id);
    } else {
      addMemberMutation.mutate({ teamId, userId, role: "executive" });
    }
  };

  const handleRoleChange = (membershipId: string, newRole: string) => {
    updateRoleMutation.mutate({ id: membershipId, role: newRole });
  };

  const isLoading = usersLoading || membersLoading;

  const uniqueRoles = useMemo(() => {
    const roles = new Set(users.map((u) => u.role));
    return Array.from(roles);
  }, [users]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">
          Team Management
        </h1>
        <p className="text-muted-foreground mt-1" data-testid="text-page-subtitle">
          Manage users, assign teams, and set roles.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-users"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-role-filter">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {uniqueRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 mb-3" />
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => {
            const memberships = userTeamMap.get(user.id) || [];
            return (
              <Card key={user.id} data-testid={`card-user-${user.id}`}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.avatar || undefined} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate" data-testid={`text-username-${user.id}`}>
                        {user.name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate" data-testid={`text-email-${user.id}`}>
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <Badge variant="secondary" data-testid={`badge-role-${user.id}`}>
                      {user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      Team Memberships
                    </p>
                    {memberships.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {memberships.map((m) => {
                          const teamDef = teams.find((t) => t.id === m.teamId);
                          if (!teamDef) return null;
                          const roleLabel = m.role === "manager" ? "M" : "E";
                          return (
                            <Badge
                              key={m.id}
                              variant="outline"
                              className="text-xs no-default-hover-elevate no-default-active-elevate"
                              style={{
                                borderColor: teamDef.color,
                                color: teamDef.color,
                              }}
                              data-testid={`badge-team-${user.id}-${m.teamId}`}
                            >
                              {teamDef.name} ({roleLabel})
                            </Badge>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No teams assigned</p>
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setManageUserId(user.id)}
                    data-testid={`button-manage-teams-${user.id}`}
                  >
                    <Settings2 className="mr-2 h-4 w-4" />
                    Manage Teams
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredUsers.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      <Dialog open={!!manageUserId} onOpenChange={(open) => !open && setManageUserId(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          {managedUser && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={managedUser.avatar || undefined} />
                    <AvatarFallback>{managedUser.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle data-testid="text-dialog-username">{managedUser.name}</DialogTitle>
                    <DialogDescription data-testid="text-dialog-email">
                      {managedUser.email}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3 mt-4">
                {teams.map((team) => {
                  const membership = allTeamMembers.find(
                    (m) => m.teamId === team.id && m.userId === managedUser.id
                  );
                  const isMember = !!membership;
                  const TeamIcon = team.icon;
                  const isMutating =
                    addMemberMutation.isPending ||
                    removeMemberMutation.isPending ||
                    updateRoleMutation.isPending;

                  return (
                    <div
                      key={team.id}
                      className="flex items-center gap-3 rounded-md border p-3"
                      data-testid={`team-row-${team.id}`}
                    >
                      <TeamIcon className="h-4 w-4 shrink-0" style={{ color: team.color }} />
                      <span className="text-sm font-medium flex-1 min-w-0 truncate">
                        {team.name}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        {isMember && (
                          <Select
                            value={membership.role}
                            onValueChange={(val) => handleRoleChange(membership.id, val)}
                            disabled={isMutating}
                          >
                            <SelectTrigger
                              className="w-[110px]"
                              data-testid={`select-role-${team.id}`}
                            >
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="manager">Manager</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                        <Switch
                          checked={isMember}
                          onCheckedChange={() =>
                            handleToggleTeam(team.id, managedUser.id, membership)
                          }
                          disabled={isMutating}
                          data-testid={`switch-team-${team.id}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
