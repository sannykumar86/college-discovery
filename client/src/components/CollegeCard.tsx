import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, TrendingUp, Star } from 'lucide-react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  return (
    <Link to={`/colleges/${college.id}`} className="card flex flex-col h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={college.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'} 
          alt={college.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1 shadow-sm">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          {college.rating}
        </div>
        <div className="absolute top-3 left-3 bg-emerald-600 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm">
          {college.type}
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors">
          {college.name}
        </h3>
        
        <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-4">
          <MapPin className="w-4 h-4" />
          {college.location}, {college.state}
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Est. Fees:</span>
            <span className="font-semibold text-slate-900 flex items-center">
              <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
              {(college.fees / 100000).toFixed(2)} L/yr
            </span>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Placement:</span>
            <span className="font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              {college.placement_percentage}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollegeCard;
