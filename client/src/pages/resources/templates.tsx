import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, MessageSquare, Mail, Phone, AlertCircle } from "lucide-react";
import { mockTemplates } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function Templates() {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "You can now paste it into your message.",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sales Templates</h1>
        <p className="text-muted-foreground mt-1">
          Ready-to-use scripts, templates, and objection handlers.
        </p>
      </div>

      <Tabs defaultValue="scripts" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="scripts">Scripts</TabsTrigger>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="objections">Objections</TabsTrigger>
        </TabsList>

        <TabsContent value="scripts" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTemplates.scripts.map((script) => (
              <Card key={script.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4 text-blue-500" />
                    {script.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-muted p-3 rounded-md text-sm italic border border-border/50">
                    "{script.content}"
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => copyToClipboard(script.content)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Script
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emails" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockTemplates.emails.map((email) => (
              <Card key={email.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4 text-purple-500" />
                    {email.title}
                  </CardTitle>
                  <CardDescription>Subject: {email.subject}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-muted p-4 rounded-md text-sm whitespace-pre-wrap border border-border/50 font-mono text-xs">
                    {email.content}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => copyToClipboard(email.content)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Body
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockTemplates.messages.map((msg) => (
              <Card key={msg.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4 text-green-500" />
                    {msg.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between gap-4">
                  <div className="bg-muted p-3 rounded-md text-sm border border-border/50">
                    {msg.content}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => copyToClipboard(msg.content)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Message
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="objections" className="mt-6 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {mockTemplates.objections.map((obj) => (
              <Card key={obj.id} className="border-l-4 border-l-orange-500">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base text-orange-700 dark:text-orange-400">
                    <AlertCircle className="h-4 w-4" />
                    Objection: "{obj.title}"
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Suggested Response:</span>
                    <div className="text-sm">
                      {obj.response}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="w-full border" onClick={() => copyToClipboard(obj.response)}>
                    <Copy className="mr-2 h-4 w-4" /> Copy Response
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
