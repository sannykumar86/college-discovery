import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCollegeDetail, checkSaved, saveCollege, unsaveCollege } from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  MapPin, 
  IndianRupee, 
  TrendingUp, 
  Star, 
  Bookmark, 
  BookmarkCheck, 
  ExternalLink,
  BookOpen,
  Award,
  Users,
  Building,
  GraduationCap
} from 'lucide-react';

const CollegeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data: college, isLoading, isError } = useQuery({
    queryKey: ['college', id],
    queryFn: () => getCollegeDetail(id!),
    enabled: !!id
  });

  const { data: savedStatus } = useQuery({
    queryKey: ['saved', id],
    queryFn: () => checkSaved(id!),
    enabled: !!id && isAuthenticated
  });

  const saveMutation = useMutation({
    mutationFn: saveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved', id] });
      queryClient.invalidateQueries({ queryKey: ['savedList'] });
    }
  });

  const unsaveMutation = useMutation({
    mutationFn: unsaveCollege,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved', id] });
      queryClient.invalidateQueries({ queryKey: ['savedList'] });
    }
  });

  const handleSaveToggle = () => {
    if (!isAuthenticated) {
      alert('Please log in to save colleges');
      return;
    }
    if (savedStatus?.saved) {
      unsaveMutation.mutate(parseInt(id!));
    } else {
      saveMutation.mutate(parseInt(id!));
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-64 bg-slate-200 rounded-2xl mb-8"></div>
        <div className="h-10 w-1/3 bg-slate-200 rounded mb-4"></div>
        <div className="flex gap-4 mb-8">
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
            <div className="h-6 w-24 bg-slate-200 rounded"></div>
        </div>
        <div className="h-64 bg-slate-200 rounded-xl"></div>
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-100 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-2">College Not Found</h2>
          <p>We couldn't load the details for this college. It may have been removed or the URL is incorrect.</p>
          <Link to="/colleges" className="mt-6 inline-block btn-primary">Back to Colleges</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] pb-12">
      {/* Hero Section Container */}
      <div className="bg-white border-b border-slate-200 pt-8 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="text-sm font-medium text-slate-500 mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link to="/colleges" className="hover:text-emerald-600">Colleges</Link>
            <span>/</span>
            <span className="text-slate-800 line-clamp-1">{college.name}</span>
          </nav>

          {/* Main Info */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8">
            <div className="w-full lg:w-32 lg:h-32 xl:w-40 xl:h-40 rounded-2xl overflow-hidden border border-slate-100 shadow-sm flex-shrink-0 bg-white p-2">
                <img 
                  src={college.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'} 
                  alt={college.name} 
                  className="w-full h-full object-cover rounded-xl"
                />
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-600 text-sm font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {college.location}, {college.state}
                    </span>
                    <span className="flex items-center gap-1">
                      <Building className="w-4 h-4" /> {college.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-4 h-4" /> Est. {college.established_year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500 hidden sm:block" /> 
                      {college.rating} Rating ({college.reviewStats.count} Reviews)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveToggle}
                    disabled={saveMutation.isPending || unsaveMutation.isPending}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                      savedStatus?.saved 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {savedStatus?.saved ? (
                      <><BookmarkCheck className="w-5 h-5" /> Saved</>
                    ) : (
                      <><Bookmark className="w-5 h-5" /> Save</>
                    )}
                  </button>
                  {college.website && (
                    <a 
                      href={college.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2"
                    >
                      Website <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar gap-8 border-b border-white">
            {['overview', 'courses', 'placements', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 text-sm font-semibold capitalize whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-emerald-600 text-emerald-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="col-span-1 lg:col-span-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <h2 className="text-xl font-bold text-slate-900 mb-4">About the College</h2>
                  <p className="text-slate-600 leading-relaxed text-left" dangerouslySetInnerHTML={{ __html: college.description?.replace(/\n/g, '<br/>') || 'No description available for this institution.' }} />
                </section>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-emerald-600 mb-1 flex justify-center"><Users className="w-6 h-6" /></div>
                    <div className="text-2xl font-bold text-slate-900">{college.total_students}+</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Students</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-emerald-600 mb-1 flex justify-center"><TrendingUp className="w-6 h-6" /></div>
                    <div className="text-2xl font-bold text-slate-900">{college.placement_percentage}%</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Placement</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-emerald-600 mb-1 flex justify-center"><IndianRupee className="w-6 h-6" /></div>
                    <div className="text-2xl font-bold text-slate-900">{college.avg_package}L</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Avg Package</div>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                    <div className="text-emerald-600 mb-1 flex justify-center"><BookOpen className="w-6 h-6" /></div>
                    <div className="text-2xl font-bold text-slate-900">{college.courses?.length || 0}</div>
                    <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Total Courses</div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" /> Courses Offered
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {college.courses?.map((course: string, i: number) => (
                    <div key={i} className="flex items-center p-4 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 transition-colors group">
                      <GraduationCap className="w-8 h-8 text-slate-400 group-hover:text-emerald-500 mr-4 transition-colors" />
                      <div>
                        <h4 className="font-semibold text-slate-800">{course}</h4>
                        <p className="text-xs text-slate-500 mt-1">B.Tech / B.E. Program</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Placements Tab */}
            {activeTab === 'placements' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" /> Placement Statistics
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-xl border border-emerald-100 text-center">
                    <span className="text-sm font-semibold text-emerald-700 uppercase tracking-wider block mb-2">Highest Package</span>
                    <span className="text-4xl font-extrabold text-slate-900 flex justify-center items-center">
                      <IndianRupee className="w-6 h-6 mr-1" />
                      {college.highest_package} <span className="text-xl ml-1 text-slate-600">LPA</span>
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                    <span className="text-sm font-semibold text-blue-700 uppercase tracking-wider block mb-2">Average Package</span>
                    <span className="text-4xl font-extrabold text-slate-900 flex justify-center items-center">
                      <IndianRupee className="w-6 h-6 mr-1" />
                      {college.avg_package} <span className="text-xl ml-1 text-slate-600">LPA</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-slate-800 mb-3">Overall Placement Record</h3>
                  <div className="w-full bg-slate-100 rounded-full h-4 mb-2">
                    <div className="bg-emerald-500 h-4 rounded-full" style={{ width: `${college.placement_percentage}%` }}></div>
                  </div>
                  <p className="text-sm text-slate-600 text-right">{college.placement_percentage}% students placed</p>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500" /> Student Reviews
                  </h2>
                  <div className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="font-bold text-amber-700">{college.reviewStats.avgRating}</span>
                    <span className="text-sm text-amber-700 font-medium">({college.reviewStats.count} reviews)</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {college.reviews?.length > 0 ? (
                    college.reviews.map((review: any) => (
                      <div key={review.id} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-slate-100 text-slate-600 font-bold rounded-full flex items-center justify-center">
                            {review.user_name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{review.user_name}</p>
                            <div className="flex mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-slate-400 ml-auto block">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-800 mt-2">{review.title}</h4>
                        <p className="text-slate-600 mt-1 text-sm">{review.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-slate-500 py-8">No reviews yet.</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1">
            {/* Sticky Sidebar */}
            <div className="sticky top-24 space-y-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Quick Facts</h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Fee Structure</p>
                    <p className="font-medium text-slate-900 flex items-center">
                      <IndianRupee className="w-4 h-4 mr-1 text-slate-400" />
                      {(college.fees / 100000).toFixed(2)} Lakhs <span className="text-sm font-normal text-slate-500 ml-1">/ year</span>
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Accepted Exams</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {college.accepted_exams?.map((exam: string, i: number) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-md">
                          {exam}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4 mt-2 border-t border-slate-100">
                    <Link to="/compare" state={{ preselectedCollege: college.id }} className="w-full btn-secondary flex justify-center items-center text-sm">
                      Compare this college
                    </Link>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CollegeDetailPage;
