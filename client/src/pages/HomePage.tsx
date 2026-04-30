import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, TrendingUp, Award, Clock } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-emerald-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              Discover Your Perfect <span className="text-emerald-400">Engineering College</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl">
              Compare top colleges, explore detailed campus insights, and make the best decision for your future career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/colleges" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Explore Colleges
              </Link>
              <Link to="/compare" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors text-center">
                Compare Options
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Use Campus Finder?</h2>
            <p className="mt-4 text-lg text-slate-600">Everything you need to make an informed decision.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Placement Insights</h3>
              <p className="text-slate-600">Get detailed data on highest packages, average packages, and top recruiting companies.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Location & Campus</h3>
              <p className="text-slate-600">Find colleges in your preferred states and cities with details on campus infrastructure.</p>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Side-by-Side Compare</h3>
              <p className="text-slate-600">Evaluate up to 3 colleges simultaneously to see how they stack up against each other.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-emerald-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Award className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-6">Ready to find your dream college?</h2>
          <p className="text-xl text-emerald-100 mb-10">Join thousands of students who found their perfect match with Campus Finder.</p>
          <Link to="/register" className="bg-white text-emerald-900 hover:bg-slate-100 px-8 py-4 rounded-lg font-bold text-lg transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
