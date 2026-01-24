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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, differenceInDays, addDays } from "date-fns";
import { 
  Plus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { HrEmployee, LeaveRequest } from "@shared/schema";

const leaveTypeLabels: Record<string, string> = {
  casual: "Casual Leave",
  sick: "Sick Leave",
  earned: "Earned Leave",
  maternity: "Maternity Leave",
  paternity: "Paternity Leave",
  unpaid: "Unpaid Leave",
  other: "Other",
};

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-800", icon: CheckCircle },
  denied: { label: "Denied", color: "bg-red-100 text-red-800", icon: XCircle },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-600", icon: AlertCircle },
};

const formSchema = z.object({
  employeeId: z.string().min(1, "Please select an employee"),
  leaveType: z.string().min(1, "Please select leave type"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  reason: z.string().min(10, "Please provide a detailed reason (min 10 characters)"),
});

type FormData = z.infer<typeof formSchema>;

export default function MyLeaveRequests() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: employees = [] } = useQuery<HrEmployee[]>({
    queryKey: ['/api/hr/employees'],
  });

  const { data: leaveRequests = [], isLoading } = useQuery<LeaveRequest[]>({
    queryKey: ['/api/hr/my-leave-requests'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employeeId: "",
      leaveType: "casual",
      startDate: "",
      endDate: "",
      reason: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const totalDays = differenceInDays(endDate, startDate) + 1;
      
      return apiRequest('POST', '/api/hr/leave-requests', {
        employeeId: data.employeeId,
        leaveType: data.leaveType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalDays,
        reason: data.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/my-leave-requests'] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Leave request submitted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to submit request", description: error.message, variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('PATCH', `/api/hr/leave-requests/${id}`, { status: 'cancelled' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/my-leave-requests'] });
      toast({ title: "Leave request cancelled" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to cancel request", description: error.message, variant: "destructive" });
    },
  });

  const employeeMap = new Map<string, HrEmployee>();
  employees.forEach(emp => employeeMap.set(emp.id, emp));

  const pendingCount = leaveRequests.filter(r => r.status === "pending").length;
  const approvedCount = leaveRequests.filter(r => r.status === "approved").length;

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const startDate = form.watch("startDate");
  const endDate = form.watch("endDate");
  const calculatedDays = startDate && endDate ? 
    Math.max(1, differenceInDays(new Date(endDate), new Date(startDate)) + 1) : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">Submit and track leave applications</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} data-testid="button-new-request">
          <Plus className="h-4 w-4 mr-2" />
          New Leave Request
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">leaves approved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">all time</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Request History</CardTitle>
          <CardDescription>View all submitted leave requests</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => {
                  const employee = employeeMap.get(request.employeeId);
                  const StatusIcon = statusConfig[request.status]?.icon || Clock;
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <p className="font-medium">{employee?.name || 'Unknown'}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {leaveTypeLabels[request.leaveType] || request.leaveType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{request.totalDays} days</span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[request.status]?.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[request.status]?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(request.appliedAt), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {request.status === "pending" && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => cancelMutation.mutate(request.id)}
                            disabled={cancelMutation.isPending}
                            data-testid={`button-cancel-${request.id}`}
                          >
                            Cancel
                          </Button>
                        )}
                        {request.approverNotes && (
                          <p className="text-sm text-muted-foreground italic" title={request.approverNotes}>
                            Note: {request.approverNotes.substring(0, 30)}...
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {leaveRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No leave requests yet. Click "New Leave Request" to submit one.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>New Leave Request</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-employee">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.filter(e => e.status === 'active').map(emp => (
                          <SelectItem key={emp.id} value={emp.id}>
                            {emp.name} - {emp.officeUnit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="leaveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Leave Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-leave-type">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(leaveTypeLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-start-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} data-testid="input-end-date" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {calculatedDays > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Total Duration</p>
                  <p className="text-lg font-bold">{calculatedDays} {calculatedDays === 1 ? 'day' : 'days'}</p>
                </div>
              )}

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide a detailed reason for your leave request..."
                        className="min-h-[100px]"
                        {...field}
                        data-testid="textarea-reason"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit-request">
                  {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Submit Request
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
