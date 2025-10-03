import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ResultsFiltersProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  filterType: string;
  onFilterTypeChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  wineTypes: string[];
  onReset: () => void;
}

const ResultsFilters: React.FC<ResultsFiltersProps> = ({
  sortBy,
  onSortChange,
  filterType,
  onFilterTypeChange,
  searchQuery,
  onSearchChange,
  wineTypes,
  onReset
}) => {
  const hasActiveFilters = filterType !== 'all' || searchQuery !== '';

  return (
    <div className="w-full space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search wines by name, winery, or region..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Sort By */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value">Best Value</SelectItem>
            <SelectItem value="price-low">Price (Low to High)</SelectItem>
            <SelectItem value="price-high">Price (High to Low)</SelectItem>
            <SelectItem value="rating">Highest Rating</SelectItem>
            <SelectItem value="savings">Most Savings</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter by Type */}
        <Select value={filterType} onValueChange={onFilterTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Wine Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {wineTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onReset}
            className="w-full sm:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filterType !== 'all' && (
            <Badge variant="secondary" className="gap-1">
              Type: {filterType}
              <button 
                onClick={() => onFilterTypeChange('all')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {searchQuery && (
            <Badge variant="secondary" className="gap-1">
              Search: {searchQuery}
              <button 
                onClick={() => onSearchChange('')}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsFilters;
