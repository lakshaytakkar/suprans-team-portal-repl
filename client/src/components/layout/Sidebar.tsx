import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import { teams, getTeamById, getDefaultTeam } from "@/lib/teams-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SidebarProps {
  className?: string;
}

const businessTeams = teams.filter(t => 
  t.id.startsWith('travel-') || 
  t.id.startsWith('china-import-') || 
  t.id.startsWith('dropshipping-') || 
  t.id.startsWith('llc-') ||
  t.id.startsWith('faire-') ||
  t.id === 'events'
);

const functionalTeams = teams.filter(t => 
  t.id === 'hr-recruitment' || 
  t.id === 'finance' || 
  t.id === 'marketing' || 
  t.id === 'admin-it' ||
  t.id === 'sales' ||
  t.id === 'media'
);

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const { currentUser, currentTeamId, setCurrentTeamId } = useStore();
  const role = currentUser?.role || 'sales_executive';

  const currentTeam = getTeamById(currentTeamId) || getDefaultTeam();
  
  // Check if user is admin for the current team (superadmin or team admin)
  const isTeamAdmin = role === 'superadmin' || 
    (currentTeam.members?.find(m => m.email === currentUser?.email)?.role === 'admin');
  
  // Use adminGroups if available and user is admin, otherwise use regular groups
  const navGroups = (isTeamAdmin && currentTeam.adminGroups) ? currentTeam.adminGroups : currentTeam.groups;

  return (
    <div className={cn("flex h-screen w-[280px] flex-col border-r bg-sidebar p-6 shrink-0 fixed left-0 top-0 overflow-y-auto z-50 no-scrollbar", className)}>
      {/* Team Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className="flex items-center gap-3 mb-8 w-full hover:bg-muted/50 rounded-lg py-2.5 px-2 transition-colors cursor-pointer group"
            data-testid="button-team-switcher"
          >
            <div 
              className="flex h-9 w-9 items-center justify-center rounded-lg shadow-sm"
              style={{ backgroundColor: currentTeam.color }}
            >
              <currentTeam.icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col flex-1 text-left min-w-0">
              <span className="text-sm font-bold tracking-tight text-foreground leading-none truncate">{currentTeam.name}</span>
              <span className="text-xs text-muted-foreground mt-0.5 truncate">
                {currentTeam.subtitle}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[260px]" sideOffset={4}>
          <ScrollArea className="h-[400px]">
            <DropdownMenuLabel className="text-xs text-muted-foreground">Business Teams</DropdownMenuLabel>
            {businessTeams.map((team) => (
              <DropdownMenuItem 
                key={team.id}
                onClick={() => setCurrentTeamId(team.id)}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
                data-testid={`menuitem-team-${team.id}`}
              >
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: team.color + '20' }}
                >
                  <team.icon className="h-4 w-4" style={{ color: team.color }} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{team.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{team.subtitle}</span>
                </div>
                {currentTeamId === team.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
            
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs text-muted-foreground">Functional Teams</DropdownMenuLabel>
            {functionalTeams.map((team) => (
              <DropdownMenuItem 
                key={team.id}
                onClick={() => setCurrentTeamId(team.id)}
                className="flex items-center gap-3 py-2.5 cursor-pointer"
                data-testid={`menuitem-team-${team.id}`}
              >
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: team.color + '20' }}
                >
                  <team.icon className="h-4 w-4" style={{ color: team.color }} />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{team.name}</span>
                  <span className="text-xs text-muted-foreground truncate">{team.subtitle}</span>
                </div>
                {currentTeamId === team.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Main Menu */}
      <div className="space-y-6 flex-1">
        {navGroups.map((group, i) => (
          <div key={i} className="space-y-1">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
              {group.label}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = location === item.href || (item.href !== "/" && item.href !== "/team/dashboard" && location.startsWith(item.href));
                const isDashboardActive = item.href === "/team/dashboard" && (location === "/team/dashboard" || location === "/team");
                const active = isActive || isDashboardActive;
                return (
                  <Link key={item.label} href={item.href}>
                    <div
                      className={cn(
                        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative cursor-pointer",
                        active
                          ? "text-foreground font-semibold bg-muted/50"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      )}
                      data-testid={`navitem-${item.label.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                    >
                      {active && (
                        <div 
                          className="absolute left-0 h-5 w-1 rounded-r-full" 
                          style={{ backgroundColor: currentTeam.color }}
                        />
                      )}
                      <item.icon 
                        className={cn("h-4 w-4 transition-colors", active ? "" : "text-muted-foreground group-hover:text-foreground")} 
                        style={active ? { color: currentTeam.color } : {}}
                      />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Settings - Only show for admin */}
        {role === 'superadmin' && currentTeam.id !== 'admin-it' && (
          <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
              System
            </h3>
            <Link href="/team/admin/settings">
              <div 
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 cursor-pointer transition-all"
                data-testid="navitem-settings"
              >
                <Settings className="h-4 w-4 group-hover:text-foreground transition-colors" />
                Settings
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
