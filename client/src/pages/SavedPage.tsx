import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { getSavedColleges } from '../api';
import { useAuth } from '../context/AuthContext';
import CollegeCard from '../components/CollegeCard';
import { Bookmark, Search, User as UserIcon } from 'lucide-react';

const SavedPage = () => {
  const { user } = useAuth();
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ['savedList'],
    queryFn: getSavedColleges
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-4rem)]">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold text-3xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{user?.name}</h1>
          <p className="text-slate-500">{user?.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <Bookmark className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-bold text-slate-900">Your Saved Colleges</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 h-80 rounded-xl border border-slate-200">
              <div className="bg-slate-200 h-40 rounded-lg mb-4"></div>
              <div className="bg-slate-200 h-6 w-3/4 mb-2 rounded"></div>
              <div className="bg-slate-200 h-4 w-1/2 mb-8 rounded"></div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-xl border border-red-100 text-center">
          Failed to load your saved colleges. Please try again.
        </div>
      ) : data?.saved && data.saved.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.saved.map((college) => (
            <div key={college.id} className="relative group">
              <CollegeCard college={college} />
              <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                <div className="bg-slate-900/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  Saved on {new Date(college.saved_at!).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 py-16 px-4 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-400">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No saved colleges yet</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Explore our database of top engineering colleges and save the ones you are interested in for quick access later.
          </p>
          <Link to="/colleges" className="btn-primary inline-flex items-center gap-2">
            <Search className="w-4 h-4" /> Explore Colleges
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedPage;
