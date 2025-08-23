import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FilterState } from "@/lib/types";

interface FilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterSidebar({ filters, onFiltersChange }: FilterSidebarProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <aside className="lg:w-1/4">
      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Date</Label>
            <RadioGroup
              value={filters.dateFilter}
              onValueChange={(value) => updateFilter('dateFilter', value)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="any" data-testid="radio-date-any" />
                <Label htmlFor="any" className="text-sm text-gray-600">Any date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" data-testid="radio-date-week" />
                <Label htmlFor="week" className="text-sm text-gray-600">This week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekend" id="weekend" data-testid="radio-date-weekend" />
                <Label htmlFor="weekend" className="text-sm text-gray-600">This weekend</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="next-week" id="next-week" data-testid="radio-date-next-week" />
                <Label htmlFor="next-week" className="text-sm text-gray-600">Next week</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Price Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Price</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="free"
                  checked={filters.priceFilter.free}
                  onCheckedChange={(checked) =>
                    updateFilter('priceFilter', { ...filters.priceFilter, free: !!checked })
                  }
                  data-testid="checkbox-price-free"
                />
                <Label htmlFor="free" className="text-sm text-gray-600">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="paid"
                  checked={filters.priceFilter.paid}
                  onCheckedChange={(checked) =>
                    updateFilter('priceFilter', { ...filters.priceFilter, paid: !!checked })
                  }
                  data-testid="checkbox-price-paid"
                />
                <Label htmlFor="paid" className="text-sm text-gray-600">Paid</Label>
              </div>
            </div>
          </div>

          {/* Distance Filter */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">Distance</Label>
            <Select
              value={filters.distanceFilter}
              onValueChange={(value) => updateFilter('distanceFilter', value)}
            >
              <SelectTrigger className="w-full" data-testid="select-distance">
                <SelectValue placeholder="Any distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any distance</SelectItem>
                <SelectItem value="5">Within 5 miles</SelectItem>
                <SelectItem value="10">Within 10 miles</SelectItem>
                <SelectItem value="25">Within 25 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
