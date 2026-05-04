import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link } from 'react-router-dom';
import { compareColleges, getColleges } from '../api';
import {
  Plus,
  X,
  IndianRupee,
  TrendingUp,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Building,
  ExternalLink
} from 'lucide-react';

// Safe URL formatter
function formatUrl(url: string | undefined | null): string {
  if (!url || url.trim() === '') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

const ComparePage = () => {
  const location = useLocation();
  const initialCollegeId = location.state?.preselectedCollege;

  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialCollegeId ? [initialCollegeId] : []
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch search results
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['collegesSearch', searchQuery],
    queryFn: () => getColleges({ search: searchQuery, limit: 8 }),
    enabled: searchQuery.trim().length > 0,
  });

  // Fetch comparison data
  const { data: compareData, isLoading: isCompareLoading, isError } = useQuery({
    queryKey: ['compare', selectedIds.join(',')],
    queryFn: () => compareColleges(selectedIds),
    enabled: selectedIds.length >= 2,
    retry: 1,
  });

  const handleAddCollege = (id: number) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) {
      alert('You can only compare up to 3 colleges at once.');
      return;
    }
    setSelectedIds([...selectedIds, id]);
    setSearchQuery('');
  };

  const handleRemoveCollege = (id: number) => {
    setSelectedIds(selectedIds.filter((cid) => cid !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Compare Colleges</h1>
        <p className="text-slate-600">Select 2 to 3 colleges to compare side-by-side.</p>
      </div>

      {/* College Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Add Colleges to Compare ({selectedIds.length}/3)
        </h3>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          {/* Search Box */}
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search college by name, city or state..."
              className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={selectedIds.length >= 3}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50 max-h-72 overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                ) : (searchResults?.colleges?.length ?? 0) === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No colleges found for "{searchQuery}"</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {searchResults?.colleges?.map((c) => (
                      <li key={c.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={selectedIds.includes(c.id)}
                          onClick={() => handleAddCollege(c.id)}
                        >
                          <div>
                            <div className="font-medium text-slate-900 text-sm">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.location}, {c.state}</div>
                          </div>
                          {selectedIds.includes(c.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-slate-400 flex-shrink-0" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Selected slots */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 relative">
                {selectedIds[i] ? (
                  <div className="h-12 flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 min-w-[130px]">
                    <span className="text-sm font-semibold text-emerald-800 truncate mr-6">College {i + 1}</span>
                    <button
                      onClick={() => handleRemoveCollege(selectedIds[i])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-12 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg px-6 min-w-[130px] text-slate-400 text-sm">
                    Empty slot
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comparison Area */}
      {selectedIds.length < 2 ? (
        <div className="bg-slate-50 py-16 px-4 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Add colleges to begin</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Search and select at least 2 colleges above to view their side-by-side comparison.
          </p>
        </div>
      ) : isCompareLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>Failed to load comparison data. Please try removing a college and re-adding it.</p>
        </div>
      ) : compareData && (compareData.colleges?.length ?? 0) >= 2 ? (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr>
                <th className="p-4 align-bottom w-1/4 bg-white sticky left-0 z-10 border-b border-r border-slate-200">
                  <span className="text-sm font-semibold text-slate-500 uppercase">Features</span>
                </th>
                {compareData.colleges.map((c) => {
                  const url = formatUrl(c.website);
                  return (
                    <th key={c.id} className="p-4 align-top w-1/4 border-b border-r border-slate-200 bg-slate-50 last:border-r-0">
                      <div className="flex flex-col h-full relative">
                        <button
                          onClick={() => handleRemoveCollege(c.id)}
                          className="absolute -top-2 -right-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-200 z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <img
                          src={c.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'}
                          alt={c.name}
                          className="h-32 w-full object-cover rounded-lg mb-4 border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800';
                          }}
                        />
                        <h3 className="font-bold text-base text-slate-900 mb-1">{c.name}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mb-3 flex-grow">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0" /> {c.location}, {c.state}
                        </p>
                        <Link to={`/colleges/${c.id}`} className="btn-secondary text-center w-full text-sm py-2 mb-2">
                          View Details
                        </Link>
                        {url && (
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-center w-full text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center justify-center gap-1 py-1"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Official Website
                          </a>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Rating</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {Number(c.rating).toFixed(1)}
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Placement</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <TrendingUp className="w-4 h-4" /> {Math.round(c.placement_percentage)}%
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Avg Package</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center font-semibold text-slate-900">
                      <IndianRupee className="w-4 h-4 mr-0.5" /> {Number(c.avg_package).toFixed(1)} LPA
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Annual Fees</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex flex-col">
                      <span className="flex items-center font-semibold text-slate-900">
                        <IndianRupee className="w-4 h-4 mr-0.5" /> {(c.fees / 100000).toFixed(2)} Lakhs
                      </span>
                      <span className="text-xs text-slate-500">per year approx.</span>
                    </div>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Type</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">{c.type}</span>
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200">Programs</td>
                {compareData.colleges.map((c) => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <span className="font-semibold text-slate-900">{c.courses?.length ?? 0} specializations</span>
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default ComparePage;
