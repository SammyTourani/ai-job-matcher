import { useState } from 'react';
import { Search, MapPin, Filter, X } from 'lucide-react';
import { SearchFilters } from '@/types';
import { EXPERIENCE_LEVELS, JOB_TYPES, SALARY_RANGES } from '@/utils/constants';
import { debounce } from '@/utils/helpers';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  // Debounced search function
  const debouncedSearch = debounce((newFilters: SearchFilters) => {
    onSearch(newFilters);
  }, 300);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedSearch(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onSearch({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof SearchFilters];
    return value !== undefined && value !== '' && value !== null;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Main search bar */}
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, companies, or skills..."
              value={filters.query || ''}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Location search */}
        <div className="lg:w-64 relative">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input pl-10 w-full"
            />
          </div>
        </div>
        
        {/* Filter toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-outline flex items-center gap-2 ${
              showFilters ? 'bg-blue-50 text-blue-700 border-blue-300' : ''
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] h-5 flex items-center justify-center">
                {Object.values(filters).filter(Boolean).length}
              </span>
            )}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-ghost flex items-center gap-2 text-gray-500"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>
      
      {/* Advanced filters */}
      {showFilters && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={filters.experienceLevel || ''}
                onChange={(e) => handleFilterChange('experienceLevel', e.target.value || undefined)}
                className="input w-full"
              >
                <option value="">All Levels</option>
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Job Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Type
              </label>
              <select
                value={filters.jobType || ''}
                onChange={(e) => handleFilterChange('jobType', e.target.value || undefined)}
                className="input w-full"
              >
                <option value="">All Types</option>
                {JOB_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Salary Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Salary Range
              </label>
              <select
                value={filters.salaryMin || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    const range = SALARY_RANGES.find(r => r.min.toString() === value);
                    handleFilterChange('salaryMin', range?.min);
                    handleFilterChange('salaryMax', range?.max);
                  } else {
                    handleFilterChange('salaryMin', undefined);
                    handleFilterChange('salaryMax', undefined);
                  }
                }}
                className="input w-full"
              >
                <option value="">Any Salary</option>
                {SALARY_RANGES.map((range, index) => (
                  <option key={index} value={range.min}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Remote Option */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Style
              </label>
              <div className="flex items-center">
                <input
                  id="remote-only"
                  type="checkbox"
                  checked={filters.remoteOnly || false}
                  onChange={(e) => handleFilterChange('remoteOnly', e.target.checked || undefined)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remote-only" className="ml-2 text-sm text-gray-700">
                  Remote only
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}