export interface FilterState {
  category: string;
  searchTerm: string;
  dateFilter: 'any' | 'week' | 'weekend' | 'next-week';
  priceFilter: {
    free: boolean;
    paid: boolean;
  };
  distanceFilter: string;
}

export interface EventCardProps {
  event: Event;
  onClick: (eventId: number) => void;
}

export interface EventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}
