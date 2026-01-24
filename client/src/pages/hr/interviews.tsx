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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Plus, 
  Calendar,
  Phone,
  User,
  Loader2,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
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
import type { Interview, User as UserType } from "@shared/schema";
import { insertInterviewSchema } from "@shared/schema";

const resultConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  selected: { label: "Selected", color: "bg-green-100 text-green-800", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: XCircle },
  on_hold: { label: "On Hold", color: "bg-amber-100 text-amber-800", icon: Clock },
  pending: { label: "Pending", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Completed", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  no_show: { label: "No Show", color: "bg-gray-100 text-gray-800" },
};

const formSchema = insertInterviewSchema.extend({
  candidateName: z.string().min(1, "Name is required"),
  candidatePhone: z.string().min(1, "Phone is required"),
  interviewDate: z.string().min(1, "Interview date is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Interviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
  const { toast } = useToast();

  const { data: interviews, isLoading } = useQuery<Interview[]>({
    queryKey: ["/api/hr/interviews", activeTab],
    queryFn: async () => {
      const res = await fetch(`/api/hr/interviews?filter=${activeTab}`);
      if (!res.ok) throw new Error("Failed to fetch interviews");
      return res.json();
    },
  });

  const { data: users } = useQuery<UserType[]>({
    queryKey: ["/api/users"],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      candidatePhone: "",
      interviewDate: "",
      interviewerId: "",
      status: "scheduled",
      result: "",
      remarks: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        interviewDate: new Date(data.interviewDate),
      };
      return apiRequest("POST", "/api/hr/interviews", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/interviews"] });
      setIsDialogOpen(false);
      form.reset();
      toast({ title: "Interview scheduled successfully" });
    },
    onError: () => {
      toast({ title: "Failed to schedule interview", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData> }) => {
      const payload = {
        ...data,
        interviewDate: data.interviewDate ? new Date(data.interviewDate) : undefined,
      };
      return apiRequest("PATCH", `/api/hr/interviews/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/interviews"] });
      setIsDialogOpen(false);
      setEditingInterview(null);
      form.reset();
      toast({ title: "Interview updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update interview", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/hr/interviews/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hr/interviews"] });
      toast({ title: "Interview deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete interview", variant: "destructive" });
    },
  });

  const filteredInterviews = interviews?.filter((interview) => {
    const matchesSearch = 
      interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interview.candidatePhone.includes(searchQuery) ||
      interview.remarks?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleEdit = (interview: Interview) => {
    setEditingInterview(interview);
    form.reset({
      candidateName: interview.candidateName,
      candidatePhone: interview.candidatePhone,
      interviewDate: interview.interviewDate ? format(new Date(interview.interviewDate), "yyyy-MM-dd'T'HH:mm") : "",
      interviewerId: interview.interviewerId || "",
      status: interview.status,
      result: interview.result || "",
      remarks: interview.remarks || "",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: FormData) => {
    if (editingInterview) {
      updateMutation.mutate({ id: editingInterview.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const getInterviewerName = (id: string | null) => {
    if (!id || !users) return "Not assigned";
    const user = users.find((u) => u.id === id);
    return user?.name || "Unknown";
  };

  const upcomingCount = interviews?.filter(() => activeTab === "upcoming").length || 0;
  const pastCount = interviews?.filter(() => activeTab === "past").length || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Interviews</h1>
          <p className="text-muted-foreground">Manage candidate interview schedules</p>
        </div>
        <Button
          onClick={() => {
            setEditingInterview(null);
            form.reset({
              candidateName: "",
              candidatePhone: "",
              interviewDate: "",
              interviewerId: "",
              status: "scheduled",
              result: "",
              remarks: "",
            });
            setIsDialogOpen(true);
          }}
          data-testid="button-schedule-interview"
        >
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-count">{interviews?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600" data-testid="text-upcoming-count">
              {activeTab === "upcoming" ? filteredInterviews?.length || 0 : "-"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Past Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600" data-testid="text-past-count">
              {activeTab === "past" ? filteredInterviews?.length || 0 : "-"}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "upcoming" | "past")}>
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="upcoming" data-testid="tab-upcoming">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="past" data-testid="tab-past">
              <Clock className="h-4 w-4 mr-2" />
              Past
            </TabsTrigger>
          </TabsList>

          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search interviews..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <TabsContent value="upcoming" className="mt-4">
          <InterviewTable
            interviews={filteredInterviews || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            getInterviewerName={getInterviewerName}
            isPast={false}
          />
        </TabsContent>

        <TabsContent value="past" className="mt-4">
          <InterviewTable
            interviews={filteredInterviews || []}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={(id) => deleteMutation.mutate(id)}
            getInterviewerName={getInterviewerName}
            isPast={true}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingInterview ? "Edit Interview" : "Schedule Interview"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="candidateName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Name</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-candidate-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="candidatePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-candidate-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interview Date & Time</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} data-testid="input-interview-date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interviewerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interviewer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-interviewer">
                          <SelectValue placeholder="Select interviewer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "scheduled"}>
                      <FormControl>
                        <SelectTrigger data-testid="select-status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.label}
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
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Result</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger data-testid="select-result">
                          <SelectValue placeholder="Select result" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="selected">Selected</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea {...field} value={field.value || ""} data-testid="input-remarks" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-submit"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingInterview ? "Update" : "Schedule"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InterviewTable({
  interviews,
  isLoading,
  onEdit,
  onDelete,
  getInterviewerName,
  isPast,
}: {
  interviews: Interview[];
  isLoading: boolean;
  onEdit: (interview: Interview) => void;
  onDelete: (id: string) => void;
  getInterviewerName: (id: string | null) => string;
  isPast: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No {isPast ? "past" : "upcoming"} interviews</h3>
          <p className="text-muted-foreground">
            {isPast ? "Past interviews will appear here" : "Schedule an interview to get started"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Candidate</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Interview Date</TableHead>
            <TableHead>Interviewer</TableHead>
            <TableHead>Status</TableHead>
            {isPast && <TableHead>Result</TableHead>}
            <TableHead>Remarks</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {interviews.map((interview) => {
            const status = statusConfig[interview.status] || statusConfig.scheduled;
            const result = interview.result ? resultConfig[interview.result] : null;
            
            return (
              <TableRow key={interview.id} data-testid={`row-interview-${interview.id}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{interview.candidateName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {interview.candidatePhone}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {interview.interviewDate 
                      ? format(new Date(interview.interviewDate), "dd MMM yyyy") 
                      : "-"
                    }
                  </div>
                </TableCell>
                <TableCell>{getInterviewerName(interview.interviewerId)}</TableCell>
                <TableCell>
                  <Badge className={status.color}>{status.label}</Badge>
                </TableCell>
                {isPast && (
                  <TableCell>
                    {result ? (
                      <Badge className={result.color}>{result.label}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                )}
                <TableCell className="max-w-[200px] truncate">
                  {interview.remarks || "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onEdit(interview)}
                      data-testid={`button-edit-${interview.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => onDelete(interview.id)}
                      data-testid={`button-delete-${interview.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
