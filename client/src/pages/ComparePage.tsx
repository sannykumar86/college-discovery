import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { compareColleges, getColleges } from '../api';
import { CollegeDetail } from '../types';
import { 
  Plus, 
  X, 
  IndianRupee, 
  TrendingUp, 
  Star, 
  MapPin, 
  CheckCircle2, 
  AlertCircle,
  Building
} from 'lucide-react';

const ComparePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Allow passing an initial college ID from the detail page via state
  const initialCollegeId = location.state?.preselectedCollege;
  
  const [selectedIds, setSelectedIds] = useState<number[]>(
    initialCollegeId ? [initialCollegeId] : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch search results for adding a college
  const { data: searchResults, isLoading: isSearchLoading } = useQuery({
    queryKey: ['collegesSearch', searchQuery],
    queryFn: () => getColleges({ search: searchQuery, limit: 5 }),
    enabled: searchQuery.length > 2,
  });

  // Fetch comparison data when ids change
  const { data: compareData, isLoading: isCompareLoading, isError } = useQuery({
    queryKey: ['compare', selectedIds.join(',')],
    queryFn: () => compareColleges(selectedIds),
    enabled: selectedIds.length >= 2,
  });

  // Handle URL updates or browser navigation if we wanted to (keeping it local state for simplicity here)

  const handleAddCollege = (id: number) => {
    if (selectedIds.includes(id)) return;
    if (selectedIds.length >= 3) {
      alert("You can only compare up to 3 colleges at once.");
      return;
    }
    setSelectedIds([...selectedIds, id]);
    setSearchQuery('');
  };

  const handleRemoveCollege = (id: number) => {
    setSelectedIds(selectedIds.filter(cid => cid !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Compare Colleges</h1>
        <p className="text-slate-600">Select 2 to 3 colleges to compare their fees, placements, and courses side-by-side.</p>
      </div>

      {/* College Selector Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 relative z-10">
        <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-4">
          Add Colleges to Compare ({selectedIds.length}/3)
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search for a college to add..."
              className="w-full pl-4 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
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

            {/* Dropdown Results */}
            {searchQuery.length > 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50 max-h-64 overflow-y-auto">
                {isSearchLoading ? (
                  <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                ) : searchResults?.colleges.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">No colleges found</div>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {searchResults?.colleges.map(c => (
                      <li key={c.id}>
                        <button
                          className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          disabled={selectedIds.includes(c.id)}
                          onClick={() => handleAddCollege(c.id)}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{c.name}</div>
                            <div className="text-xs text-slate-500">{c.location}, {c.state}</div>
                          </div>
                          {selectedIds.includes(c.id) ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Plus className="w-5 h-5 text-slate-400" />
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 border-b md:border-b-0 border-slate-100 hide-scrollbar">
            {/* Visualizer for selected IDs (before loading deep data) */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 relative">
                {selectedIds[i] ? (
                  <div className="h-12 flex items-center bg-emerald-50 border border-emerald-200 rounded-lg px-3 min-w-[120px] max-w-[200px]">
                    <span className="text-sm font-semibold text-emerald-800 truncate mr-6">College {i+1}</span>
                    <button 
                      onClick={() => handleRemoveCollege(selectedIds[i])}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="h-12 flex items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg px-6 min-w-[120px] text-slate-400 text-sm">
                    Empty slot
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Comparison Area */}
      {selectedIds.length < 2 ? (
        <div className="bg-slate-50 py-16 px-4 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
            <Building className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Add colleges to begin</h3>
          <p className="text-slate-600 max-w-md mx-auto">
            Please search and select at least 2 colleges from the bar above to view their side-by-side comparison.
          </p>
        </div>
      ) : isCompareLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <p>Failed to load comparison data. Please try clearing your selection and trying again.</p>
        </div>
      ) : compareData && compareData.colleges.length >= 2 ? (
        <div className="overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr>
                <th className="p-4 align-bottom w-1/4 bg-white sticky left-0 z-10 border-b border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                  <span className="text-sm font-semibold text-slate-500 uppercase">Features</span>
                </th>
                {compareData.colleges.map(c => (
                  <th key={c.id} className="p-4 align-top w-1/4 border-b border-r border-slate-200 bg-slate-50 last:border-r-0">
                    <div className="flex flex-col h-full relative">
                      <button 
                        onClick={() => handleRemoveCollege(c.id)}
                        className="absolute -top-2 -right-2 p-1.5 bg-white text-slate-400 hover:text-red-500 rounded-full shadow-sm border border-slate-200 z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img src={c.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'} alt={c.name} className="h-32 w-full object-cover rounded-lg mb-4 border border-slate-200" />
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{c.name}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-1 mb-4 flex-grow">
                        <MapPin className="w-3.5 h-3.5" /> {c.location}, {c.state}
                      </p>
                      <Link to={`/colleges/${c.id}`} className="btn-secondary text-center w-full text-sm py-2">
                        View Details
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              
              {/* Rating Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Rating</td>
                {compareData.colleges.map(c => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {c.rating}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Placement Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Placement Record</td>
                {compareData.colleges.map(c => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center gap-1 font-bold text-emerald-600">
                      <TrendingUp className="w-4 h-4" /> {c.placement_percentage}%
                    </div>
                  </td>
                ))}
              </tr>

              {/* Avg Package Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Average Package</td>
                {compareData.colleges.map(c => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <div className="flex items-center font-semibold text-slate-900">
                      <IndianRupee className="w-4 h-4 mr-0.5" /> {c.avg_package} LPA
                    </div>
                  </td>
                ))}
              </tr>
              
              {/* Fees Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Annual Fees</td>
                {compareData.colleges.map(c => (
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

              {/* Type Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Institution Type</td>
                {compareData.colleges.map(c => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm font-medium">{c.type}</span>
                  </td>
                ))}
              </tr>

              {/* Total Courses Row */}
              <tr className="hover:bg-slate-50">
                <td className="p-4 font-medium text-slate-700 bg-white sticky left-0 z-10 border-r border-slate-200 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">Programs Offered</td>
                {compareData.colleges.map(c => (
                  <td key={c.id} className="p-4 border-r border-slate-200 last:border-r-0">
                    <span className="font-semibold text-slate-900">{c.courses.length} Specializations</span>
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
