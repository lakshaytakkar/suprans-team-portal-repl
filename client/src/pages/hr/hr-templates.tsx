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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { 
  Search, 
  Plus, 
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Loader2,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Filter
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { insertHrTemplateSchema, type HrTemplate } from "@shared/schema";

const categoryConfig: Record<string, { label: string; color: string; description: string }> = {
  interview_invite: { label: "Interview Invite", color: "bg-blue-100 text-blue-800", description: "Invite candidates for interviews" },
  rejection: { label: "Rejection", color: "bg-red-100 text-red-800", description: "Politely decline candidates" },
  follow_up: { label: "Follow Up", color: "bg-amber-100 text-amber-800", description: "Follow up with candidates" },
  offer_letter: { label: "Offer Letter", color: "bg-green-100 text-green-800", description: "Job offer communications" },
  onboarding: { label: "Onboarding", color: "bg-purple-100 text-purple-800", description: "New hire onboarding messages" },
  screening: { label: "Screening", color: "bg-cyan-100 text-cyan-800", description: "Initial screening calls" },
  document_request: { label: "Document Request", color: "bg-orange-100 text-orange-800", description: "Request documents from candidates" },
  joining_reminder: { label: "Joining Reminder", color: "bg-indigo-100 text-indigo-800", description: "Remind candidates about joining date" },
};

const typeConfig: Record<string, { label: string; icon: any; color: string }> = {
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-green-600" },
  email: { label: "Email", icon: Mail, color: "text-blue-600" },
  sms: { label: "SMS", icon: Phone, color: "text-amber-600" },
};

// Extend the shared schema with form-specific handling (placeholders as comma-separated string)
const formSchema = insertHrTemplateSchema.omit({ placeholders: true }).extend({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
  content: z.string().min(1, "Content is required"),
  placeholders: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function HrTemplatesPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<HrTemplate | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<HrTemplate | null>(null);

  const { data: templates = [], isLoading } = useQuery<HrTemplate[]>({
    queryKey: ['/api/hr/templates'],
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      type: "whatsapp",
      subject: "",
      content: "",
      placeholders: "",
      isActive: true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        ...data,
        placeholders: data.placeholders ? data.placeholders.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return apiRequest('POST', '/api/hr/templates', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/templates'] });
      setDialogOpen(false);
      form.reset();
      toast({ title: "Template created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error creating template", description: String(error), variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormData> }) => {
      const payload = {
        ...data,
        placeholders: data.placeholders ? data.placeholders.split(',').map(s => s.trim()).filter(Boolean) : [],
      };
      return apiRequest('PATCH', `/api/hr/templates/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/templates'] });
      setDialogOpen(false);
      setEditingTemplate(null);
      form.reset();
      toast({ title: "Template updated successfully" });
    },
    onError: (error) => {
      toast({ title: "Error updating template", description: String(error), variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/hr/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/hr/templates'] });
      setDeleteConfirmId(null);
      toast({ title: "Template deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting template", description: String(error), variant: "destructive" });
    },
  });

  const handleOpenDialog = (template?: HrTemplate) => {
    if (template) {
      setEditingTemplate(template);
      form.reset({
        name: template.name,
        category: template.category,
        type: template.type,
        subject: template.subject || "",
        content: template.content,
        placeholders: template.placeholders?.join(', ') || "",
        isActive: template.isActive ?? true,
      });
    } else {
      setEditingTemplate(null);
      form.reset();
    }
    setDialogOpen(true);
  };

  const onSubmit = (data: FormData) => {
    if (editingTemplate) {
      updateMutation.mutate({ id: editingTemplate.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to clipboard" });
  };

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = 
      template.name.toLowerCase().includes(search.toLowerCase()) ||
      template.content.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    const matchesType = typeFilter === "all" || template.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const groupedByType = {
    whatsapp: filteredTemplates.filter(t => t.type === 'whatsapp'),
    email: filteredTemplates.filter(t => t.type === 'email'),
    sms: filteredTemplates.filter(t => t.type === 'sms'),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">HR Templates</h1>
          <p className="text-muted-foreground">Message templates for recruitment communications</p>
        </div>
        <Button onClick={() => handleOpenDialog()} data-testid="button-add-template">
          <Plus className="h-4 w-4 mr-2" />
          Add Template
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(typeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const count = templates.filter(t => t.type === key).length;
          return (
            <Card 
              key={key}
              className={`cursor-pointer transition-all hover-elevate ${typeFilter === key ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setTypeFilter(typeFilter === key ? "all" : key)}
              data-testid={`card-type-${key}`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-muted-foreground">{config.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card className="hover-elevate" data-testid="card-total-usage">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted text-purple-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {templates.reduce((acc, t) => acc + (t.usageCount || 0), 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Uses</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-templates"
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-category-filter">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>{config.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                All ({filteredTemplates.length})
              </TabsTrigger>
              {Object.entries(typeConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <TabsTrigger 
                    key={key}
                    value={key}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                  >
                    <Icon className={`h-4 w-4 mr-1 ${config.color}`} />
                    {config.label} ({groupedByType[key as keyof typeof groupedByType].length})
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="all" className="p-4">
              <TemplateGrid 
                templates={filteredTemplates}
                onEdit={handleOpenDialog}
                onDelete={setDeleteConfirmId}
                onCopy={copyToClipboard}
                onPreview={setPreviewTemplate}
              />
            </TabsContent>
            {Object.entries(typeConfig).map(([key]) => (
              <TabsContent key={key} value={key} className="p-4">
                <TemplateGrid 
                  templates={groupedByType[key as keyof typeof groupedByType]}
                  onEdit={handleOpenDialog}
                  onDelete={setDeleteConfirmId}
                  onCopy={copyToClipboard}
                  onPreview={setPreviewTemplate}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "Edit Template" : "Create New Template"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Interview Invitation - Sales" data-testid="input-template-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(categoryConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(typeConfig).map(([key, config]) => (
                            <SelectItem key={key} value={key}>{config.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch('type') === 'email' && (
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Email subject line" data-testid="input-subject" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Template content. Use {{placeholder}} for dynamic values."
                        rows={8}
                        data-testid="input-content"
                      />
                    </FormControl>
                    <FormDescription>
                      Use {"{{name}}"}, {"{{position}}"}, {"{{date}}"}, {"{{time}}"}, {"{{location}}"} as placeholders
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="placeholders"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placeholders (comma-separated)</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="name, position, date, time, location" data-testid="input-placeholders" />
                    </FormControl>
                    <FormDescription>
                      List the dynamic placeholders used in this template
                    </FormDescription>
                    <FormMessage />
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
                  data-testid="button-submit-template"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  {editingTemplate ? "Update Template" : "Create Template"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this template? This action cannot be undone.</p>
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
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Preview: {previewTemplate?.name}</DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge className={categoryConfig[previewTemplate.category]?.color}>
                  {categoryConfig[previewTemplate.category]?.label}
                </Badge>
                <Badge variant="outline">
                  {typeConfig[previewTemplate.type]?.label}
                </Badge>
              </div>
              {previewTemplate.subject && (
                <div>
                  <label className="text-xs text-muted-foreground">Subject</label>
                  <p className="font-medium">{previewTemplate.subject}</p>
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground">Content</label>
                <div className="mt-1 p-4 bg-muted rounded-lg whitespace-pre-wrap text-sm">
                  {previewTemplate.content}
                </div>
              </div>
              {previewTemplate.placeholders && previewTemplate.placeholders.length > 0 && (
                <div>
                  <label className="text-xs text-muted-foreground">Placeholders</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {previewTemplate.placeholders.map((p, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{`{{${p}}}`}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button 
              onClick={() => previewTemplate && copyToClipboard(previewTemplate.content)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Content
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function TemplateGrid({ 
  templates, 
  onEdit, 
  onDelete, 
  onCopy,
  onPreview 
}: { 
  templates: HrTemplate[];
  onEdit: (template: HrTemplate) => void;
  onDelete: (id: string) => void;
  onCopy: (text: string) => void;
  onPreview: (template: HrTemplate) => void;
}) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
        <p>No templates found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => {
        const TypeIcon = typeConfig[template.type]?.icon || FileText;
        return (
          <Card 
            key={template.id} 
            className="hover-elevate cursor-pointer"
            onClick={() => onPreview(template)}
            data-testid={`card-template-${template.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded bg-muted ${typeConfig[template.type]?.color}`}>
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sm leading-tight">{template.name}</h3>
                    <Badge className={`text-xs mt-1 ${categoryConfig[template.category]?.color}`}>
                      {categoryConfig[template.category]?.label || template.category}
                    </Badge>
                  </div>
                </div>
                {!template.isActive && (
                  <Badge variant="secondary" className="text-xs">Inactive</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {template.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Used {template.usageCount || 0} times
                </span>
                <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onCopy(template.content)}
                    data-testid={`button-copy-${template.id}`}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onEdit(template)}
                    data-testid={`button-edit-${template.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    onClick={() => onDelete(template.id)}
                    data-testid={`button-delete-${template.id}`}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
