import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { stages, services } from "@/lib/mock-data";
import { Plus, Trash2, GripVertical, Save } from "lucide-react";

export default function Settings() {
  const [localStages, setLocalStages] = useState(stages);
  const [localServices, setLocalServices] = useState(services);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your CRM pipeline, services, and preferences.
        </p>
      </div>

      <Tabs defaultValue="pipeline" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">Pipeline Stages</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pipeline" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages</CardTitle>
              <CardDescription>
                Customize the stages of your sales pipeline. Drag to reorder.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localStages.map((stage, index) => (
                <div key={stage.id} className="flex items-center gap-4 p-3 bg-card border rounded-md group">
                  <GripVertical className="h-5 w-5 text-muted-foreground/50 cursor-grab" />
                  <div className={`h-4 w-4 rounded-full bg-${stage.color}-500`} />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <Input defaultValue={stage.label} className="h-9" />
                  </div>
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Add New Stage
              </Button>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Catalog</CardTitle>
              <CardDescription>
                Manage the services/products your team is selling.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {localServices.map((service) => (
                <div key={service.id} className="flex items-center gap-4 p-3 bg-card border rounded-md group">
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Service Name</Label>
                      <Input defaultValue={service.name} className="h-9" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Category</Label>
                      <Input defaultValue={service.category} className="h-9" />
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="mt-5 opacity-0 group-hover:opacity-100 transition-opacity text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Add Service
              </Button>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Email & WhatsApp Templates</CardTitle>
              <CardDescription>
                Standardize communications with pre-built templates.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Welcome Email Template</Label>
                <Textarea 
                  className="min-h-[150px]" 
                  defaultValue={`Hi {client_name},\n\nThank you for your interest in {service_name}. We are excited to help you with your business goals.\n\nBest regards,\n{user_name}`} 
                />
              </div>
              <div className="space-y-2">
                <Label>Follow-up WhatsApp Template</Label>
                <Textarea 
                  className="min-h-[100px]" 
                  defaultValue={`Hello {client_name}, just checking in regarding our discussion about {service_name}. Let me know if you have any questions!`} 
                />
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 bg-muted/20 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Templates
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6 space-y-6">
           <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure when and how users get notified.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">New Lead Assignment</Label>
                  <p className="text-sm text-muted-foreground">Notify user when a new lead is assigned to them</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Daily Digest</Label>
                  <p className="text-sm text-muted-foreground">Send a summary of tasks every morning at 9 AM</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Deal Won Alerts</Label>
                  <p className="text-sm text-muted-foreground">Notify the whole team when a big deal is closed</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
             <CardFooter className="border-t px-6 py-4 bg-muted/20 flex justify-end">
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
