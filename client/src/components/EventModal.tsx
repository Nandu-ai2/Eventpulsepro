import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Share, CheckCircle, HelpCircle, XCircle } from "lucide-react";
import { useRsvpMutation } from "@/hooks/useEvents";
import type { Event } from "@shared/schema";

interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const [rsvpStatus, setRsvpStatus] = useState<string>("");
  const { toast } = useToast();
  const rsvpMutation = useRsvpMutation();

  if (!event) return null;

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

  const handleRsvpSubmit = async () => {
    if (!rsvpStatus) {
      toast({
        title: "Please select an RSVP option",
        variant: "destructive",
      });
      return;
    }

    try {
      await rsvpMutation.mutateAsync({
        eventId: event.id,
        userId: 1, // In a real app, this would come from auth
        status: rsvpStatus,
      });

      toast({
        title: "RSVP submitted successfully!",
        description: `You've marked yourself as ${rsvpStatus.replace('-', ' ')} for this event.`,
      });

      onClose();
    } catch (error) {
      toast({
        title: "Failed to submit RSVP",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description || '',
          url: window.location.href,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied to clipboard!",
        });
      } catch (error) {
        toast({
          title: "Unable to copy link",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-event">
        <div className="relative">
          {/* Event image */}
          <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
            {event.imageUrl ? (
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                className="w-full h-full object-cover rounded-lg"
                data-testid="img-modal-event"
              />
            ) : (
              <div className="text-white text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-semibold">Event Image</p>
              </div>
            )}
          </div>
          
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-bold mb-2" data-testid="text-modal-title">
              {event.title}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Event details for {event.title}
            </DialogDescription>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span data-testid="text-modal-date">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span data-testid="text-modal-location">{event.city}</span>
                  </div>
                </div>
              </div>
              <div>
                <Badge 
                  variant={formatPrice(event.price) === 'Free' ? 'secondary' : 'default'}
                  className="bg-green-100 text-green-800"
                  data-testid="text-modal-price"
                >
                  {formatPrice(event.price)}
                </Badge>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
              <p className="text-gray-600 leading-relaxed" data-testid="text-modal-description">
                {event.description}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">RSVP for this event</h3>
              <RadioGroup value={rsvpStatus} onValueChange={setRsvpStatus} className="grid grid-cols-3 gap-3">
                <Label 
                  htmlFor="Yes" 
                  className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all hover:border-indigo-300 ${
                    rsvpStatus === 'Yes' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  data-testid="label-rsvp-going"
                >
                  <RadioGroupItem value="Yes" id="Yes" className="sr-only" />
                  <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">Going</div>
                </Label>
                
                <Label 
                  htmlFor="Maybe" 
                  className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all hover:border-indigo-300 ${
                    rsvpStatus === 'Maybe' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  data-testid="label-rsvp-maybe"
                >
                  <RadioGroupItem value="Maybe" id="Maybe" className="sr-only" />
                  <HelpCircle className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">Maybe</div>
                </Label>
                
                <Label 
                  htmlFor="No" 
                  className={`border-2 rounded-lg p-3 text-center cursor-pointer transition-all hover:border-indigo-300 ${
                    rsvpStatus === 'No' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                  data-testid="label-rsvp-not-going"
                >
                  <RadioGroupItem value="No" id="No" className="sr-only" />
                  <XCircle className="h-6 w-6 text-red-500 mx-auto mb-1" />
                  <div className="text-sm font-medium">Can't Go</div>
                </Label>
              </RadioGroup>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleRsvpSubmit}
                className="flex-1"
                disabled={rsvpMutation.isPending}
                data-testid="button-submit-rsvp"
              >
                {rsvpMutation.isPending ? "Submitting..." : "Confirm RSVP"}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                data-testid="button-share"
              >
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
