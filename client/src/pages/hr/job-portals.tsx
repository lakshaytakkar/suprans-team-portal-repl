import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { 
  Plus, 
  ExternalLink,
  Eye,
  EyeOff,
  Loader2,
  Edit,
  Trash2,
  AlertTriangle,
  Copy,
  Check,
  Globe
} from "lucide-react";
import { SiLinkedin, SiIndeed } from "react-icons/si";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { JobPortal } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(1, "Platform name is required"),
  url: z.string().url("Please enter a valid URL"),
  logo: z.string().optional().nullable(),
  userId: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

const platformLogos: Record<string, { icon: any; bgColor: string; textColor: string }> = {
  naukri: { icon: null, bgColor: "bg-blue-600", textColor: "text-white" },
  internshala: { icon: null, bgColor: "bg-sky-500", textColor: "text-white" },
  linkedin: { icon: SiLinkedin, bgColor: "bg-blue-700", textColor: "text-white" },
  indeed: { icon: SiIndeed, bgColor: "bg-purple-700", textColor: "text-white" },
};

function getPlatformStyle(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(platformLogos)) {
    if (lower.includes(key)) {
      return platformLogos[key];
    }
  }
  return { icon: Globe, bgColor: "bg-primary", textColor: "text-primary-foreground" };
}

export default function JobPortals() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPortal, setEditingPortal] = useState<JobPortal | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: portals = [], isLoading } = useQuery<JobPortal[]>({
    queryKey: ['/api/hr/job-portals'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      logo: "",
      userId: "",
      password: "",
      notes: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('POST', '/api/hr/job-portals', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-portals'] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Job portal added successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to add portal", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest('PATCH', `/api/hr/job-portals/${editingPortal?.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-portals'] });
      setDialogOpen(false);
      setEditingPortal(null);
      form.reset();
      toast({ title: "Job portal updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to update portal", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/hr/job-portals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-portals'] });
      setDeleteConfirmId(null);
      toast({ title: "Job portal deleted" });
    },
    onError: (error: any) => {
      toast({ title: "Failed to delete", description: error.message, variant: "destructive" });
    },
  });

  const accessMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('POST', `/api/hr/job-portals/${id}/accessed`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/job-portals'] });
    },
  });

  const handleEdit = (portal: JobPortal) => {
    setEditingPortal(portal);
    form.reset({
      name: portal.name,
      url: portal.url,
      logo: portal.logo || "",
      userId: portal.userId || "",
      password: portal.password || "",
      notes: portal.notes || "",
      isActive: portal.isActive ?? true,
    });
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingPortal(null);
    form.reset({
      name: "",
      url: "",
      logo: "",
      userId: "",
      password: "",
      notes: "",
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleOpenPortal = (portal: JobPortal) => {
    accessMutation.mutate(portal.id);
    window.open(portal.url, '_blank');
  };

  const handleCopyCredentials = (portal: JobPortal) => {
    const text = `User ID: ${portal.userId}\nPassword: ${portal.password}`;
    navigator.clipboard.writeText(text);
    setCopiedId(portal.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast({ title: "Credentials copied to clipboard" });
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onSubmit = (data: FormData) => {
    if (editingPortal) {
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
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Job Portals</h1>
          <p className="text-muted-foreground">Manage your recruitment platform credentials</p>
        </div>
        <Button onClick={handleAddNew} data-testid="button-add-portal">
          <Plus className="mr-2 h-4 w-4" />
          Add Portal
        </Button>
      </div>

      {portals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No job portals added</h3>
            <p className="text-muted-foreground text-center mb-4">
              Add your recruitment platform credentials for quick access
            </p>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Portal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portals.map((portal) => {
            const style = getPlatformStyle(portal.name);
            const IconComponent = style.icon;
            const isPasswordVisible = showPasswords[portal.id];
            
            return (
              <Card key={portal.id} className="overflow-hidden" data-testid={`card-portal-${portal.id}`}>
                <div className={`h-24 ${style.bgColor} flex items-center justify-center relative`}>
                  {portal.logo ? (
                    <img 
                      src={portal.logo} 
                      alt={portal.name} 
                      className="h-12 object-contain"
                    />
                  ) : IconComponent ? (
                    <IconComponent className={`h-12 w-12 ${style.textColor}`} />
                  ) : (
                    <span className={`text-2xl font-bold ${style.textColor}`}>
                      {portal.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                  {!portal.isActive && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      Inactive
                    </Badge>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{portal.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(portal)}
                        data-testid={`button-edit-${portal.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setDeleteConfirmId(portal.id)}
                        data-testid={`button-delete-${portal.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {portal.lastAccessed && (
                    <CardDescription>
                      Last accessed: {format(new Date(portal.lastAccessed), 'PPp')}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {portal.userId && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">User ID</span>
                        <span className="text-sm font-medium truncate max-w-[180px]">{portal.userId}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Password</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {isPasswordVisible ? portal.password : '••••••••'}
                          </span>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(portal.id)}
                            data-testid={`button-toggle-password-${portal.id}`}
                          >
                            {isPasswordVisible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      className="flex-1" 
                      onClick={() => handleOpenPortal(portal)}
                      data-testid={`button-open-${portal.id}`}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Portal
                    </Button>
                    {portal.userId && portal.password && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleCopyCredentials(portal)}
                        data-testid={`button-copy-${portal.id}`}
                      >
                        {copiedId === portal.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                  
                  {portal.notes && (
                    <p className="text-xs text-muted-foreground border-t pt-2 mt-2">
                      {portal.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingPortal ? 'Edit Job Portal' : 'Add Job Portal'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Naukri, LinkedIn" {...field} data-testid="input-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Login URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} data-testid="input-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo URL (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} value={field.value || ""} data-testid="input-logo" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID / Email</FormLabel>
                    <FormControl>
                      <Input placeholder="username@example.com" {...field} value={field.value || ""} data-testid="input-userid" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} value={field.value || ""} data-testid="input-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Additional notes..." rows={2} {...field} value={field.value || ""} data-testid="textarea-notes" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <FormLabel>Active</FormLabel>
                      <p className="text-xs text-muted-foreground">Show in main grid</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        data-testid="switch-active"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
                  {editingPortal ? 'Update' : 'Add Portal'}
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
              Delete Job Portal
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Are you sure you want to delete this job portal? This action cannot be undone.
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
