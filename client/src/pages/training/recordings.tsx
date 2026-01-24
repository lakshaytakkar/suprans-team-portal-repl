import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Calendar, User, Mic } from "lucide-react";
import { mockRecordings } from "@/lib/mock-data";
import { format } from "date-fns";

export default function Recordings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Call Recordings</h1>
        <p className="text-muted-foreground mt-1">
          Review past calls and meetings for quality assurance.
        </p>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meeting Details</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRecordings.map((recording) => (
              <TableRow key={recording.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                      <Mic className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{recording.title}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-3 w-3" />
                    {recording.agent}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(recording.date), 'MMM d, yyyy')}
                  </div>
                </TableCell>
                <TableCell>{recording.duration}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {recording.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs font-normal">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                    <Play className="mr-2 h-3 w-3" /> Play
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
