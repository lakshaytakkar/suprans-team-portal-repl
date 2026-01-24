import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, MoreHorizontal, Mail, Phone, Trash2, Edit, IndianRupee } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User } from "@shared/schema";

type UserWithSalary = Omit<User, 'password'> & { salary?: number };

export default function TeamManagement() {
  const { currentUser, leads, addUser, deleteUser, updateUser } = useStore();
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  const { data: users = [] } = useQuery<UserWithSalary[]>({
    queryKey: ["/api/users"],
  });
  
  const isMainAdmin = currentUser?.email === 'admin@suprans.in';
  
  // Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "sales_executive" as const
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      addUser(newUser);
      setIsAddUserOpen(false);
      setNewUser({ name: "", email: "", phone: "", role: "sales_executive" });
    }
  };

  const getUserStats = (userId: string) => {
    const userLeads = leads.filter(l => l.assignedTo === userId);
    const wonLeads = userLeads.filter(l => l.stage === 'won');
    const totalValue = wonLeads.reduce((sum, l) => sum + (l.wonAmount || l.value), 0);
    const conversionRate = userLeads.length > 0 ? (wonLeads.length / userLeads.length) * 100 : 0;
    
    return {
      activeLeads: userLeads.filter(l => !['won', 'lost'].includes(l.stage)).length,
      wonCount: wonLeads.length,
      revenue: totalValue,
      conversion: conversionRate
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage your sales team members and permissions.
          </p>
        </div>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Team Member</DialogTitle>
              <DialogDescription>
                Create a new user account for your sales team.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input 
                  id="name" 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">Phone</Label>
                <Input 
                  id="phone" 
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">Role</Label>
                <Select 
                  value={newUser.role} 
                  onValueChange={(val: any) => setNewUser({...newUser, role: val})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales_executive">Sales Executive</SelectItem>
                    <SelectItem value="superadmin">Superadmin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddUser}>Create Account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => {
          const stats = getUserStats(user.id);
          return (
            <div key={user.id} className="group relative flex flex-col gap-4 rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-all hover-elevate">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold leading-none tracking-tight">{user.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => deleteUser(user.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Deactivate User
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                {isMainAdmin && user.salary !== undefined && (
                  <div className="space-y-1 col-span-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-2 border border-amber-200 dark:border-amber-800">
                    <p className="text-xs text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> Monthly Salary
                    </p>
                    <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                      {user.salary.toLocaleString('en-IN')}
                    </p>
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Leads</p>
                  <p className="text-lg font-bold">{stats.activeLeads}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Revenue (Mo)</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {(stats.revenue / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Conversion</p>
                  <p className="text-lg font-bold">{stats.conversion.toFixed(1)}%</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Deals Won</p>
                  <p className="text-lg font-bold">{stats.wonCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 mt-auto border-t">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`mailto:${user.email}`}>
                    <Mail className="mr-2 h-3.5 w-3.5" /> Email
                  </a>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <a href={`tel:${user.phone}`}>
                    <Phone className="mr-2 h-3.5 w-3.5" /> Call
                  </a>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
