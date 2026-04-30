import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getColleges, getFilters } from '../api';
import CollegeCard from '../components/CollegeCard';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const CollegesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  // Extract params from URL
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const location = searchParams.get('location') || '';
  const type = searchParams.get('type') || '';
  const maxFees = searchParams.get('maxFees') || '';
  const sortBy = searchParams.get('sortBy') || 'rating';

  // Fetch filters list
  const { data: filtersDef } = useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
    staleTime: Infinity,
  });

  // Fetch colleges list
  const { data: collegesData, isLoading, isError } = useQuery({
    queryKey: ['colleges', { search, page, location, type, maxFees, sortBy }],
    queryFn: () => getColleges({ search, page, limit: 12, location, type, maxFees, sortBy, sortOrder: 'desc' }),
  });

  // Handle URL updates smoothly
  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    // Change to page 1 on filter update
    if (key !== 'page') newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header and Search */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Explore Colleges</h1>
          <p className="text-slate-600">Discover and compare the best engineering colleges.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name or location..."
              className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-l-lg focus:ring-emerald-500 focus:border-emerald-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary rounded-l-none border border-transparent">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex justify-between items-center border-b border-slate-200 pb-4">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
          
          <div className="text-sm text-slate-500">
            {collegesData?.pagination.total || 0} results
          </div>
        </div>

        {/* Sidebar Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0 space-y-6`}>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                <Filter className="h-4 w-4" /> Filters
              </h3>
              {(location || type || maxFees || search) && (
                <button onClick={clearFilters} className="text-xs text-red-500 hover:text-red-700 hover:underline">
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-5">
              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Sort By</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  value={sortBy}
                  onChange={(e) => updateParam('sortBy', e.target.value)}
                >
                  <option value="rating">Highest Rating</option>
                  <option value="placement_percentage">Highest Placement %</option>
                  <option value="fees">Lowest Fees</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Institution Type</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  value={type}
                  onChange={(e) => updateParam('type', e.target.value)}
                >
                  <option value="">All Types</option>
                  {filtersDef?.types.map((t: string) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                  value={location}
                  onChange={(e) => updateParam('location', e.target.value)}
                >
                  <option value="">All Locations</option>
                  {filtersDef?.locations.map((loc: string) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Max Fees Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Max Fees (per annum)
                </label>
                <input 
                  type="range" 
                  className="w-full accent-emerald-600"
                  min="0" 
                  max="1000000" 
                  step="50000"
                  value={maxFees || "1000000"}
                  onChange={(e) => updateParam('maxFees', e.target.value)}
                />
                <div className="text-xs text-slate-500 mt-1 flex justify-between">
                  <span>₹0</span>
                  <span className="font-medium text-emerald-700">
                    ₹{parseInt(maxFees || "1000000") / 100000} Lakhs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-slate-800">
              {isLoading ? 'Loading...' : `${collegesData?.pagination.total || 0} Colleges Found`}
            </h2>
          </div>

          {/* Active filter pills */}
          {(location || type || maxFees || search) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                  "{search}" <button onClick={() => updateParam('search', '')}><X className="w-3.5 h-3.5 hover:text-emerald-900" /></button>
                </span>
              )}
              {type && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                  {type} <button onClick={() => updateParam('type', '')}><X className="w-3.5 h-3.5 hover:text-emerald-900" /></button>
                </span>
              )}
              {location && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-200">
                  {location} <button onClick={() => updateParam('location', '')}><X className="w-3.5 h-3.5 hover:text-emerald-900" /></button>
                </span>
              )}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 h-80 rounded-xl border border-slate-200">
                  <div className="bg-slate-200 h-40 rounded-lg mb-4"></div>
                  <div className="bg-slate-200 h-6 w-3/4 mb-2 rounded"></div>
                  <div className="bg-slate-200 h-4 w-1/2 mb-8 rounded"></div>
                  <div className="bg-slate-200 h-4 w-full rounded"></div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
              Failed to load colleges. Please try again later.
            </div>
          ) : collegesData?.colleges.length === 0 ? (
            <div className="bg-slate-50 text-slate-600 p-12 rounded-xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No colleges found</h3>
              <p>Try adjusting your search or filters to see more results.</p>
              <button onClick={clearFilters} className="mt-4 text-emerald-600 hover:text-emerald-700 font-medium">Clear all filters</button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {collegesData?.colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination */}
              {collegesData?.pagination.totalPages && collegesData.pagination.totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center gap-2">
                  <button 
                    onClick={() => updateParam('page', String(page - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-md border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <span className="text-sm font-medium text-slate-700 px-4">
                    Page {page} of {collegesData.pagination.totalPages}
                  </span>
                  
                  <button 
                    onClick={() => updateParam('page', String(page + 1))}
                    disabled={page === collegesData.pagination.totalPages}
                    className="p-2 rounded-md border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default CollegesPage;
