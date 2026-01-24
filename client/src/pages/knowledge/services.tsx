import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, HelpCircle } from "lucide-react";
import { mockKnowledgeBase } from "@/lib/mock-data";

export default function Services() {
  const [search, setSearch] = useState("");

  const filteredData = mockKnowledgeBase.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase()) || 
    item.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
          <p className="text-muted-foreground mt-1">
            Service details, FAQs, and internal documentation.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search knowledge base..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredData.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" />
                    {item.title}
                  </CardTitle>
                  <CardDescription>{item.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="text-sm text-foreground/80 leading-relaxed">
                {item.content}
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  Common Questions
                </h4>
                <Accordion type="single" collapsible className="w-full">
                  {item.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-sm py-2">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
