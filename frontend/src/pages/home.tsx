import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Calendar, AlertCircle, RefreshCw } from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { HeroSection } from "@/components/HeroSection";
import { FilterSidebar } from "@/components/FilterSidebar";
import { EventCard } from "@/components/EventCard";
import { EventModal } from "@/components/EventModal";
import type { Event } from "@shared/schema";
import type { FilterState } from "@/lib/types";

const categories = [
  { id: 'all', label: 'All Events' },
  { id: 'technology', label: 'Technology' },
  { id: 'business', label: 'Business' },
  { id: 'health', label: 'Health' },
  { id: 'sports', label: 'Sports' },
  { id: 'arts', label: 'Arts' },
  { id: 'music', label: 'Music' },
];

export default function Home() {
  const { data: events, isLoading, error, refetch } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    searchTerm: '',
    dateFilter: 'any',
    priceFilter: { free: true, paid: true },
    distanceFilter: 'any'
  });

  const handleEventClick = (eventId: number) => {
    const event = events?.find(e => e.id === eventId);
    if (event) {
      setSelectedEvent(event);
      setIsModalOpen(true);
    }
  };

  const handleSearch = (interest: string, location: string) => {
    setFilters(prev => ({ ...prev, searchTerm: interest }));
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];

    return events.filter(event => {
      // Category filter
      if (filters.category !== 'all' && event.category !== filters.category) {
        return false;
      }

      // Search filter
      const searchTerms = [filters.searchTerm, searchTerm].filter(Boolean);
      if (searchTerms.length > 0) {
        const searchQuery = searchTerms.join(' ').toLowerCase();
        const eventContent = [
          event.title,
          event.description,
          event.category,
          event.location,
          event.organizer
        ].join(' ').toLowerCase();
        
        if (!eventContent.includes(searchQuery)) {
          return false;
        }
      }

      // Date filter
      if (filters.dateFilter !== 'any') {
        const eventDate = new Date(event.date);
        const now = new Date();
        const oneWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        switch (filters.dateFilter) {
          case 'week':
            if (eventDate > oneWeek) return false;
            break;
          case 'weekend':
            const dayOfWeek = eventDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) return false;
            break;
          case 'next-week':
            const nextWeekStart = new Date(oneWeek.getTime());
            const nextWeekEnd = new Date(oneWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
            if (eventDate < nextWeekStart || eventDate > nextWeekEnd) return false;
            break;
        }
      }

      // Price filter
      const price = parseFloat(event.price || '0');
      const isFree = price === 0;
      const isPaid = price > 0;
      
      if (!filters.priceFilter.free && isFree) return false;
      if (!filters.priceFilter.paid && isPaid) return false;

      return true;
    });
  }, [events, filters, searchTerm]);

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      searchTerm: '',
      dateFilter: 'any',
      priceFilter: { free: true, paid: true },
      distanceFilter: 'any'
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">EventPulse</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
                  Discover
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
                  My Events
                </a>
                <a href="#" className="text-gray-700 hover:text-indigo-600 transition-colors duration-200 font-medium">
                  Create Event
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                type="search"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
                data-testid="input-search"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={filters.category === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
                data-testid={`button-category-${category.id}`}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <FilterSidebar filters={filters} onFiltersChange={setFilters} />

          {/* Events Grid */}
          <div className="lg:w-3/4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500" data-testid="text-event-count">
                  {isLoading ? 'Loading...' : `${filteredEvents.length} event${filteredEvents.length !== 1 ? 's' : ''} found`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => refetch()}
                  disabled={isLoading}
                  data-testid="button-refresh"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8" data-testid="loading-state">
                <Loader2 className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
                <p className="text-gray-600">Loading amazing events...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-8" data-testid="error-state">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Events</h3>
                  <p className="text-red-600 mb-4">Please check your connection and try again.</p>
                  <Button onClick={() => refetch()} variant="outline" data-testid="button-retry">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              </div>
            )}

            {/* Events Grid */}
            {!isLoading && !error && filteredEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="events-grid">
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={handleEventClick}
                  />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredEvents.length === 0 && (
              <div className="text-center py-12" data-testid="empty-state">
                <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Events Found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms.</p>
                <Button onClick={handleClearFilters} data-testid="button-clear-filters">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedEvent(null);
        }}
      />
    </div>
  );
}
