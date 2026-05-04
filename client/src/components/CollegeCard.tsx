import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, TrendingUp, Star, ExternalLink } from 'lucide-react';
import { College } from '../types';

interface CollegeCardProps {
  college: College;
}

// Safe URL formatter — always returns a valid absolute URL string
function formatUrl(url: string | undefined | null): string {
  if (!url || url.trim() === '') return '#';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `https://${trimmed}`;
}

const CollegeCard: React.FC<CollegeCardProps> = ({ college }) => {
  const websiteUrl = formatUrl(college.website);
  const hasWebsite = websiteUrl !== '#';

  return (
    <div className="card flex flex-col h-full">
      {/* Clickable image + info area */}
      <Link to={`/colleges/${college.id}`} className="flex flex-col flex-1 group">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={college.image_url || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'}
            alt={college.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800';
            }}
          />
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1 shadow-sm">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            {Number(college.rating).toFixed(1)}
          </div>
          <div className="absolute top-3 left-3 bg-emerald-600 px-2 py-1 rounded-md text-xs font-bold text-white shadow-sm">
            {college.type}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-base font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-emerald-700 transition-colors leading-snug">
            {college.name}
          </h3>

          <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{college.location}, {college.state}</span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Annual Fees</span>
              <span className="font-semibold text-slate-900 flex items-center">
                <IndianRupee className="w-3.5 h-3.5 mr-0.5" />
                {(college.fees / 100000).toFixed(1)}L
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 font-medium">Placement</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                {Math.round(college.placement_percentage)}%
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Website button — outside the Link to avoid nesting */}
      {hasWebsite && (
        <div className="px-5 pb-4">
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 bg-slate-50 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold rounded-lg border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-center gap-1.5"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Official Website
          </a>
        </div>
      )}
    </div>
  );
};

export default CollegeCard;
