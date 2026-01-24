import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, differenceInDays } from "date-fns";
import { 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Filter
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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

export default function HRLeaveRequests() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    request: LeaveRequest | null;
    action: "approve" | "deny" | null;
  }>({ open: false, request: null, action: null });
  const [approverNotes, setApproverNotes] = useState("");

  const { data: leaveRequests = [], isLoading: loadingRequests } = useQuery<LeaveRequest[]>({
    queryKey: ['/api/hr/leave-requests'],
  });

  const { data: employees = [] } = useQuery<HrEmployee[]>({
    queryKey: ['/api/hr/employees'],
  });

  const employeeMap = new Map<string, HrEmployee>();
  employees.forEach(emp => employeeMap.set(emp.id, emp));

  const updateMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes: string }) => {
      return apiRequest('PATCH', `/api/hr/leave-requests/${id}`, { 
        status, 
        approverNotes: notes 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/leave-requests'] });
      setActionDialog({ open: false, request: null, action: null });
      setApproverNotes("");
      toast({ title: `Leave request ${actionDialog.action === 'approve' ? 'approved' : 'denied'} successfully` });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update request", description: error.message, variant: "destructive" });
    },
  });

  const filteredRequests = leaveRequests.filter(req => 
    statusFilter === "all" || req.status === statusFilter
  );

  const pendingCount = leaveRequests.filter(r => r.status === "pending").length;
  const approvedCount = leaveRequests.filter(r => r.status === "approved").length;
  const deniedCount = leaveRequests.filter(r => r.status === "denied").length;

  const handleAction = (request: LeaveRequest, action: "approve" | "deny") => {
    setActionDialog({ open: true, request, action });
    setApproverNotes("");
  };

  const confirmAction = () => {
    if (!actionDialog.request || !actionDialog.action) return;
    updateMutation.mutate({
      id: actionDialog.request.id,
      status: actionDialog.action === "approve" ? "approved" : "denied",
      notes: approverNotes,
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">Review and manage employee leave applications</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover-elevate" onClick={() => setStatusFilter("pending")}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">requests awaiting review</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover-elevate" onClick={() => setStatusFilter("approved")}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">requests approved</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover-elevate" onClick={() => setStatusFilter("denied")}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
            <CardTitle className="text-sm font-medium">Denied</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{deniedCount}</div>
            <p className="text-xs text-muted-foreground">requests denied</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-status-filter">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="denied">Denied</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loadingRequests ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Employee</TableHead>
                  <TableHead>Leave Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => {
                  const employee = employeeMap.get(request.employeeId);
                  const StatusIcon = statusConfig[request.status]?.icon || Clock;
                  
                  return (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>
                              {employee?.name?.split(' ').map(n => n[0]).join('').substring(0, 2) || '??'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{employee?.name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{employee?.officeUnit}</p>
                          </div>
                        </div>
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
                          <p>{format(new Date(request.startDate), 'MMM d, yyyy')}</p>
                          <p className="text-muted-foreground">to {format(new Date(request.endDate), 'MMM d, yyyy')}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="max-w-[200px] truncate" title={request.reason}>
                          {request.reason}
                        </p>
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
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-green-600 hover:text-green-700"
                              onClick={() => handleAction(request, "approve")}
                              data-testid={`button-approve-${request.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleAction(request, "deny")}
                              data-testid={`button-deny-${request.id}`}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Deny
                            </Button>
                          </div>
                        )}
                        {request.status !== "pending" && request.approverNotes && (
                          <p className="text-sm text-muted-foreground italic max-w-[150px] truncate" title={request.approverNotes}>
                            "{request.approverNotes}"
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredRequests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No leave requests found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={actionDialog.open} onOpenChange={(open) => !open && setActionDialog({ open: false, request: null, action: null })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.action === "approve" ? "Approve Leave Request" : "Deny Leave Request"}
            </DialogTitle>
          </DialogHeader>
          {actionDialog.request && (
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p><strong>Employee:</strong> {employeeMap.get(actionDialog.request.employeeId)?.name}</p>
                <p><strong>Leave Type:</strong> {leaveTypeLabels[actionDialog.request.leaveType]}</p>
                <p><strong>Duration:</strong> {actionDialog.request.totalDays} days</p>
                <p><strong>Dates:</strong> {format(new Date(actionDialog.request.startDate), 'MMM d')} - {format(new Date(actionDialog.request.endDate), 'MMM d, yyyy')}</p>
                <p><strong>Reason:</strong> {actionDialog.request.reason}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder={actionDialog.action === "approve" ? "Add any notes for the employee..." : "Provide reason for denial..."}
                  value={approverNotes}
                  onChange={(e) => setApproverNotes(e.target.value)}
                  data-testid="textarea-approver-notes"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog({ open: false, request: null, action: null })}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              disabled={updateMutation.isPending}
              className={actionDialog.action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
              data-testid="button-confirm-action"
            >
              {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {actionDialog.action === "approve" ? "Approve Request" : "Deny Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
