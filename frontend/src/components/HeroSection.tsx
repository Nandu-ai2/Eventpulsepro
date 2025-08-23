import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar } from "lucide-react";

interface HeroSectionProps {
  onSearch: (interest: string, location: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  const [interest, setInterest] = useState("");
  const [location, setLocation] = useState("all");

  const handleSearch = () => {
    onSearch(interest, location);
  };

  return (
    <section className="bg-gradient-to-br from-indigo-600 to-purple-600 py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Amazing Events</h1>
          <p className="text-xl text-purple-100 max-w-2xl mx-auto">
            Find and join events that match your interests. Connect with like-minded people in your city.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  type="text"
                  placeholder="What are you interested in?"
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-4 py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white"
                  data-testid="input-interest"
                />
              </div>
              <div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="w-full px-4 py-3 text-gray-900 border-0 focus:ring-2 focus:ring-white" data-testid="select-location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    <SelectItem value="san francisco">San Francisco, CA</SelectItem>
                    <SelectItem value="new york">New York, NY</SelectItem>
                    <SelectItem value="los angeles">Los Angeles, CA</SelectItem>
                    <SelectItem value="chicago">Chicago, IL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="bg-white text-indigo-600 font-semibold py-3 px-6 hover:bg-gray-100"
                data-testid="button-search"
              >
                <Search className="mr-2 h-4 w-4" />
                Find Events
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
