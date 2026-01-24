import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, MapPin, Users, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import PublicLayout from "@/components/public/PublicLayout";
import type { Event } from "@shared/schema";
import { format } from "date-fns";

import delhiSeminarImage from "@/assets/images/events/delhi-seminar.png";
import mumbaiCantonImage from "@/assets/images/events/mumbai-canton-preview.png";
import bangaloreWorkshopImage from "@/assets/images/events/bangalore-workshop.png";
import hyderabadSummitImage from "@/assets/images/events/hyderabad-summit.png";
import puneMeetupImage from "@/assets/images/events/pune-meetup.png";

const eventImageMap: Record<string, string> = {
  'Delhi': delhiSeminarImage,
  'Mumbai': mumbaiCantonImage,
  'Chennai': delhiSeminarImage, // Use Delhi image as fallback for Chennai
  'Bangalore': bangaloreWorkshopImage,
  'Hyderabad': hyderabadSummitImage,
  'Pune': puneMeetupImage,
};

const defaultEventImage = delhiSeminarImage;

function getEventImage(city: string): string {
  return eventImageMap[city] || defaultEventImage;
}

function formatEventDate(date: Date | string, endDate?: Date | string | null): string {
  const startDate = new Date(date);
  if (endDate) {
    const end = new Date(endDate);
    if (startDate.toDateString() === end.toDateString()) {
      return format(startDate, "MMMM d, yyyy");
    }
    return `${format(startDate, "MMMM d")} - ${format(end, "d, yyyy")}`;
  }
  return format(startDate, "MMMM d, yyyy");
}

export default function PublicEventsPage() {
  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ["/api/public/events"],
  });

  return (
    <PublicLayout>
      <section className="bg-gradient-to-br from-[#F34147] to-[#1e1e1e] py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20">
              Upcoming Events
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Business Events
            </h1>
            <p className="text-xl text-white/80">
              Connect with industry experts, learn from successful entrepreneurs, and discover new opportunities at our exclusive business events across India.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded mb-2" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
              <p className="text-muted-foreground">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <Card className="overflow-hidden group cursor-pointer hover-elevate h-full" data-testid={`card-event-${event.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getEventImage(event.city)}
                        alt={event.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        <Badge className="bg-[#F34147] text-white border-0">
                          {event.type === 'ibs' ? 'IBS Workshop' : 'Seminar'}
                        </Badge>
                        {event.status === 'sold_out' && (
                          <Badge className="bg-gray-800 text-white border-0">
                            Sold Out
                          </Badge>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="flex items-center gap-2 text-white text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{formatEventDate(event.date, event.endDate)}</span>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[#F34147] transition-colors line-clamp-2">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-4 text-muted-foreground text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{event.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{event.capacity} seats</span>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                        {event.description}
                      </p>
                      <div className="flex items-center text-[#F34147] text-sm font-medium">
                        Learn More <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Host an Event?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Partner with Suprans to organize business seminars, workshops, or networking events in your city.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-[#F34147] hover:bg-[#d63840]" data-testid="button-contact-events">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
