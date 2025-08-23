import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import type { Event } from "@shared/schema";

interface EventCardProps {
  event: Event;
  onClick: (eventId: number) => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const formatDate = (dateString: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatPrice = (price: string | null) => {
    const numPrice = parseFloat(price || '0');
    return numPrice === 0 ? 'Free' : `$${numPrice}`;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      technology: 'bg-blue-100 text-blue-800',
      business: 'bg-green-100 text-green-800',
      health: 'bg-pink-100 text-pink-800',
      sports: 'bg-orange-100 text-orange-800',
      arts: 'bg-purple-100 text-purple-800',
      music: 'bg-red-100 text-red-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card 
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(event.id)}
      data-testid={`card-event-${event.id}`}
    >
      <div className="aspect-video bg-gradient-to-r from-indigo-500 to-purple-600 relative overflow-hidden rounded-t-lg">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover"
            data-testid={`img-event-${event.id}`}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            <Calendar className="h-12 w-12" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800" data-testid={`text-price-${event.id}`}>
            {formatPrice(event.price)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge className={getCategoryColor(event.category)} data-testid={`text-category-${event.id}`}>
            {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            <span data-testid={`text-attendees-${event.id}`}>{event.attendees || 0} attending</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2" data-testid={`text-title-${event.id}`}>
          {event.title}
        </h3>
        
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span data-testid={`text-date-${event.id}`}>{formatDate(event.date)}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span data-testid={`text-location-${event.id}`}>{event.city}</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-3 line-clamp-2" data-testid={`text-description-${event.id}`}>
          {event.description}
        </p>
      </CardContent>
    </Card>
  );
}
