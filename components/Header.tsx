import React from 'react';
import { Globe2, Plane } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="bg-ocean-blue p-2 rounded-lg">
              <Globe2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Sponsor<span className="text-ocean-blue">Seeker</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
             <nav className="flex gap-4 text-sm font-medium text-slate-600">
               <a href="#" className="hover:text-ocean-blue transition-colors">How it Works</a>
               <a href="#" className="hover:text-ocean-blue transition-colors">Resources</a>
               <a href="#" className="hover:text-ocean-blue transition-colors">About</a>
             </nav>
             <div className="flex items-center gap-1 text-xs font-semibold text-brand-green bg-green-50 px-3 py-1 rounded-full border border-green-100">
                <Plane className="w-3 h-3" />
                <span>Global Search Active</span>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;