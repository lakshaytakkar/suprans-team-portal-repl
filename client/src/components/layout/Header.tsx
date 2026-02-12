import { useState } from "react";
import { Link } from "wouter";
import { 
  Bell, 
  Search,
  Command,
  Clock,
  CheckCircle2,
  Package,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchDialog } from "@/components/modals/SearchDialog";
import { SignOutDialog } from "@/components/modals/SignOutDialog";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getTeamById } from "@/lib/teams-config";

export function Header() {
  const { currentUser, simulatedRole, setSimulatedRole, currentTeamId } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const isSuperadmin = currentUser?.role === 'superadmin';
  const currentTeam = getTeamById(currentTeamId);
  const effectiveRole = isSuperadmin ? (simulatedRole || 'manager') : 'executive';

  const notifications = [
    {
      id: 1,
      title: "Shipment Delayed",
      message: "SHP-1004 is delayed due to customs check",
      time: "2025-08-13 09:12",
      icon: Clock,
      type: "warning",
      read: false
    },
    {
      id: 2,
      title: "Shipment Delivered",
      message: "SHP-1002 has been successfully delivered",
      time: "2025-08-10 09:50",
      icon: CheckCircle2,
      type: "success",
      read: true
    },
    {
      id: 3,
      title: "Customs Clearance Complete",
      message: "SHP-1001 cleared Singapore customs",
      time: "2025-08-13 10:10",
      icon: User,
      type: "info",
      read: true
    },
    {
      id: 4,
      title: "New Shipment Created",
      message: "SHP-1006 has been added to the system",
      time: "2025-08-12 15:25",
      icon: Package,
      type: "default",
      read: true
    }
  ];

  const handleLogout = () => {
    setLogoutOpen(false);
  };

  return (
    <>
      <header className="flex h-[80px] items-center justify-between px-8 bg-white border-b border-[#DFE1E7]">
        <button 
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-[#DFE1E7] rounded-lg shadow-sm w-[288px] h-[40px] hover:bg-gray-50 transition-colors text-left"
          data-testid="button-search"
        >
          <Search className="h-5 w-5 text-[#818898]" />
          <span className="flex-1 text-sm text-[#818898] font-normal">Search</span>
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center h-5 w-5 bg-[#ECEFF3] rounded-[4px]">
              <Command className="h-3 w-3 text-[#818898]" />
            </div>
            <div className="flex items-center justify-center h-5 w-5 bg-[#ECEFF3] rounded-[4px]">
              <span className="text-[13px] font-semibold text-[#818898] leading-none">K</span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          {isSuperadmin && (
            <div className="flex items-center gap-1.5 mr-2 bg-gray-100 p-1 rounded-lg" data-testid="role-switcher">
              <Button 
                variant={effectiveRole === 'manager' ? 'default' : 'ghost'} 
                size="sm" 
                className={`h-7 text-xs gap-1.5 ${effectiveRole === 'manager' ? 'bg-[#F34147] text-white' : 'text-[#666D80]'}`}
                onClick={() => setSimulatedRole('manager')}
                data-testid="button-role-manager"
              >
                <Shield className="h-3 w-3" />
                Manager
              </Button>
              <Button 
                variant={effectiveRole === 'executive' ? 'default' : 'ghost'} 
                size="sm" 
                className={`h-7 text-xs gap-1.5 ${effectiveRole === 'executive' ? 'bg-[#F34147] text-white' : 'text-[#666D80]'}`}
                onClick={() => setSimulatedRole('executive')}
                data-testid="button-role-executive"
              >
                <Eye className="h-3 w-3" />
                Executive
              </Button>
            </div>
          )}

          <Popover>
            <PopoverTrigger asChild>
              <button 
                className="relative flex items-center justify-center w-[40px] h-[40px] rounded-full border border-[#DFE1E7] bg-white hover:bg-gray-50 transition-colors outline-none"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5 text-[#666D80]" />
                {notifications.some(n => !n.read) && (
                   <div className="absolute top-[8px] right-[8px] h-2 w-2 bg-[#F34147] border-[1.5px] border-white rounded-full"></div>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] p-0 rounded-[16px] shadow-[0px_16px_32px_-1px_rgba(128,136,151,0.2)] border-[#DFE1E7]" align="end">
              <div className="flex items-center justify-between p-6 border-b border-[#DFE1E7]">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-semibold text-[#0D0D12]">Notifications</h3>
                  <div className="bg-[#F34147] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {notifications.filter(n => !n.read).length}
                  </div>
                </div>
                <button className="text-[#666D80] hover:text-[#0D0D12]">
                  <Settings className="h-4 w-4" />
                </button>
              </div>
              <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex gap-3 items-start">
                    <div className="flex items-center justify-center w-8 h-8 rounded-[8px] bg-[#ECEFF3] shrink-0">
                      <notification.icon className="h-4 w-4 text-[#818898]" />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                       <div className="flex items-center justify-between">
                         <h4 className="text-[14px] font-semibold text-[#0D0D12]">{notification.title}</h4>
                         {!notification.read && (
                           <div className="h-2 w-2 rounded-full bg-[#F34147]" />
                         )}
                       </div>
                       <p className="text-[12px] text-[#666D80] leading-[1.5]">{notification.message}</p>
                       <span className="text-[12px] text-[#666D80]">{notification.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 border-t border-[#DFE1E7] flex items-center justify-between gap-2">
                 <button className="text-[16px] font-semibold text-[#F34147]">Mark as all read</button>
                 <Button className="bg-[#F34147] text-white rounded-[10px] px-4 h-[48px] font-semibold text-[16px]">
                   View All Notifications
                 </Button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="w-[20px] h-[20px] flex items-center justify-center rotate-90">
             <div className="w-[20px] h-[1px] bg-[#DFE1E7]" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 outline-none" data-testid="button-user-menu">
                <Avatar className="h-8 w-8 border border-white shadow-sm">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                </Avatar>
                <div className="flex flex-col items-start leading-tight">
                  <span className="text-xs font-semibold text-[#0D0D12]" data-testid="text-user-name">{currentUser?.name}</span>
                  <span className="text-xs font-normal text-[#666D80]" data-testid="text-user-role">
                    {isSuperadmin ? 'Super Admin' : effectiveRole === 'manager' ? 'Manager' : 'Executive'}
                    {isSuperadmin && simulatedRole && (
                      <span className="ml-1 text-[#F34147]">
                        (viewing as {simulatedRole})
                      </span>
                    )}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-[#666D80]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link href="/team/profile">
                <DropdownMenuItem data-testid="menuitem-profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
              </Link>
              <Link href="/team/admin/settings">
                <DropdownMenuItem data-testid="menuitem-settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setLogoutOpen(true)} data-testid="menuitem-logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <SignOutDialog open={logoutOpen} onOpenChange={setLogoutOpen} onConfirm={handleLogout} />
    </>
  );
}
