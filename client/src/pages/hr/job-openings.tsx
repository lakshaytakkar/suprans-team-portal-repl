import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { 
  Search, 
  Plus, 
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Edit,
  Trash2,
  AlertTriangle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { JobOpening } from "@shared/schema";
import { insertJobOpeningSchema } from "@shared/schema";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Open", color: "bg-primary/10 text-primary", icon: CheckCircle },
  on_hold: { label: "On Hold", color: "bg-muted text-muted-foreground", icon: Clock },
  filled: { label: "Filled", color: "bg-secondary text-secondary-foreground", icon: Users },
  cancelled: { label: "Cancelled", color: "bg-muted text-muted-foreground", icon: XCircle },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  low: { label: "Low", color: "bg-muted text-muted-foreground" },
  medium: { label: "Medium", color: "bg-secondary text-secondary-foreground" },
  high: { label: "High", color: "bg-accent text-accent-foreground" },
  urgent: { label: "Urgent", color: "bg-primary text-primary-foreground" },
};

const departmentOptions = [
  "Sales",
  "Operations",
  "Marketing",
  "HR",
  "Finance",
  "Technology",
  "Ecommerce",
  "Content",
];

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  department: z.string().optional().nullable(),
  minExperience: z.coerce.number().min(0).default(1),
  maxExperience: z.coerce.number().optional().nullable(),
  industries: z.string().optional(),
  skills: z.string().optional(),
  description: z.string().optional().nullable(),
  requirements: z.string().optional().nullable(),
  positions: z.coerce.number().min(1).default(1),
  priority: z.string().default("medium"),
  status: z.string().default("open"),
  salary: z.string().optional().nullable(),
  location: z.string().default("Gurugram"),
  employmentType: z.string().default("full_time"),
});

type FormData = z.infer<typeof formSchema>;

export default function JobOpenings() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOpening, setEditingOpening] = useState<JobOpening | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const { data: openings = [], isLoading } = useQuery<JobOpening[]>({
    queryKey: ['/api/hr/job-openings'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      department: "",
      minExperience: 1,
      maxExperience: undefined,
      industries: "",
      skills: "",
      description: "",
      requirements: "",
      positions: 1,
      priority: "medium",
      status: "open",
      salary: "",
      location: "Gurugram",
      employmentType: "full_time",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        industries: data.industries ? data.industries.split(',').map(s => s.trim()).filter(Boolean) : [],
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return apiRequest('POST', '/api/hr/job-openings', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-openings'] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Job opening created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to create job opening", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        industries: data.industries ? data.industries.split(',').map(s => s.trim()).filter(Boolean) : [],
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return apiRequest('PATCH', `/api/hr/job-openings/${editingOpening?.id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-openings'] });
      setDialogOpen(false);
      setEditingOpening(null);
      form.reset();
      toast({ title: "Job opening updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update job opening", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/hr/job-openings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-openings'] });
      setDeleteConfirmId(null);
      toast({ title: "Job opening deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const filteredOpenings = openings.filter(opening => {
    const matchesSearch = 
      opening.title.toLowerCase().includes(search.toLowerCase()) ||
      (opening.department?.toLowerCase().includes(search.toLowerCase())) ||
      (opening.skills?.some(s => s.toLowerCase().includes(search.toLowerCase())));
    
    const matchesStatus = statusFilter === "all" || opening.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || opening.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const openCount = openings.filter(o => o.status === "open").length;
  const filledCount = openings.filter(o => o.status === "filled").length;
  const onHoldCount = openings.filter(o => o.status === "on_hold").length;
  const totalPositions = openings.filter(o => o.status === "open").reduce((sum, o) => sum + (o.positions || 1), 0);

  const handleEdit = (opening: JobOpening) => {
    setEditingOpening(opening);
    form.reset({
      title: opening.title,
      department: opening.department || "",
      minExperience: opening.minExperience,
      maxExperience: opening.maxExperience || undefined,
      industries: opening.industries?.join(', ') || "",
      skills: opening.skills?.join(', ') || "",
      description: opening.description || "",
      requirements: opening.requirements || "",
      positions: opening.positions,
      priority: opening.priority,
      status: opening.status,
      salary: opening.salary || "",
      location: opening.location || "Gurugram",
      employmentType: opening.employmentType || "full_time",
    });
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingOpening(null);
    form.reset({
      title: "",
      department: "",
      minExperience: 1,
      maxExperience: undefined,
      industries: "",
      skills: "",
      description: "",
      requirements: "",
      positions: 1,
      priority: "medium",
      status: "open",
      salary: "",
      location: "Gurugram",
      employmentType: "full_time",
    });
    setDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (editingOpening) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Job Openings</h1>
          <p className="text-muted-foreground">Manage hiring requirements and open positions</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-job-opening">
          <Plus className="mr-2 h-4 w-4" />
          Add Opening
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{openCount}</div>
            <p className="text-xs text-muted-foreground">{totalPositions} total vacancies</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{onHoldCount}</div>
            <p className="text-xs text-muted-foreground">Paused hiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Filled</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{filledCount}</div>
            <p className="text-xs text-muted-foreground">Positions filled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openings.length}</div>
            <p className="text-xs text-muted-foreground">All job openings</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search roles, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
                data-testid="input-search"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="on_hold">On Hold</SelectItem>
                  <SelectItem value="filled">Filled</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[150px]" data-testid="select-department-filter">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departmentOptions.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Positions</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOpenings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                    No job openings found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOpenings.map((opening) => {
                  const status = statusConfig[opening.status] || statusConfig.open;
                  const priority = priorityConfig[opening.priority] || priorityConfig.medium;
                  
                  return (
                    <TableRow key={opening.id} data-testid={`row-job-opening-${opening.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{opening.title}</p>
                          {opening.location && (
                            <p className="text-xs text-muted-foreground">{opening.location}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {opening.department && (
                          <Badge variant="outline">{opening.department}</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {opening.minExperience}
                        {opening.maxExperience ? `-${opening.maxExperience}` : '+'} years
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {opening.skills?.slice(0, 3).map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {opening.skills && opening.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{opening.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{opening.positions}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={priority.color}>{priority.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={status.color}>{status.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(opening)}
                            data-testid={`button-edit-${opening.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => setDeleteConfirmId(opening.id)}
                            data-testid={`button-delete-${opening.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingOpening ? 'Edit Job Opening' : 'Add Job Opening'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Sr. Sales Manager" {...field} data-testid="input-title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-department">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departmentOptions.map(dept => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gurugram">Gurugram</SelectItem>
                          <SelectItem value="Rewari">Rewari</SelectItem>
                          <SelectItem value="Remote">Remote</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="minExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Experience (years)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} data-testid="input-min-experience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="maxExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Experience (years)</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} placeholder="Optional" {...field} data-testid="input-max-experience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="positions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Positions</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} data-testid="input-positions" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-priority">
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="on_hold">On Hold</SelectItem>
                          <SelectItem value="filled">Filled</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="employmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Employment Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger data-testid="select-employment-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="full_time">Full Time</SelectItem>
                          <SelectItem value="part_time">Part Time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary Range</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 5-8 LPA" {...field} data-testid="input-salary" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industries"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Preferred Industries</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Edtech, IT, Service (comma separated)" {...field} data-testid="input-industries" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shopify, Excel, CRM (comma separated)" {...field} data-testid="input-skills" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Job description..." rows={3} {...field} data-testid="textarea-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingOpening ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Job Opening
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this job opening? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && deleteMutation.mutate(deleteConfirmId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
