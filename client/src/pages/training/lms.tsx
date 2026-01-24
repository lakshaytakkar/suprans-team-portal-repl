import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayCircle, Clock, Award } from "lucide-react";
import { mockTrainingModules } from "@/lib/mock-data";

export default function LMS() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Center</h1>
          <p className="text-muted-foreground mt-1">
            Sharpen your sales skills with video modules.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-lg border">
          <Award className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">Your Score: 850 pts</span>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockTrainingModules.map((module) => (
          <Card key={module.id} className="group overflow-hidden cursor-pointer hover:shadow-md transition-all">
            <div className="relative aspect-video bg-muted">
              <img 
                src={module.thumbnail} 
                alt={module.title}
                className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                <PlayCircle className="h-12 w-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
              </div>
              <Badge className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/70 border-none text-white backdrop-blur-sm">
                {module.duration}
              </Badge>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-base line-clamp-1">{module.title}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <span className="capitalize">{module.type}</span> • Beginner
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[0%]" /> {/* Progress bar mockup */}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Not started</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
