import React, { useState } from 'react';
import { Search, Sparkles, Loader2, MapPin } from 'lucide-react';
import { SearchStatus } from '../types';

interface SearchSectionProps {
  onSearch: (query: string, country: string) => void;
  status: SearchStatus;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, status }) => {
  const [jobQuery, setJobQuery] = useState('');
  const [country, setCountry] = useState('Australia');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobQuery.trim() && country.trim()) {
      onSearch(jobQuery.trim(), country.trim());
    }
  };

  return (
    <div className="bg-slate-900 py-16 sm:py-24 relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-gold rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 right-0 w-64 h-64 bg-ocean-blue rounded-full blur-3xl"></div>
        </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
          Find Companies Offering <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">
            Visa Sponsorship Worldwide
          </span>
        </h1>
        <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
          Use our AI-powered agent to scrape current listings and find companies actively sponsoring international talent in your target country.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-ocean-blue rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative flex flex-col sm:flex-row items-stretch bg-white rounded-xl shadow-2xl p-2 gap-2">
            
            {/* Role Input */}
            <div className="flex-1 flex items-center bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none px-2">
                <Search className="h-5 w-5 text-slate-400 ml-2" />
                <input
                type="text"
                value={jobQuery}
                onChange={(e) => setJobQuery(e.target.value)}
                placeholder="Job title or Industry..."
                className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none text-base bg-transparent"
                disabled={status === SearchStatus.LOADING}
                />
            </div>

            <div className="hidden sm:block w-px bg-slate-200 my-2"></div>

            {/* Country Input */}
            <div className="sm:w-1/3 flex items-center bg-slate-50 sm:bg-transparent rounded-lg sm:rounded-none px-2">
                <MapPin className="h-5 w-5 text-slate-400 ml-2" />
                <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country..."
                className="w-full px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none text-base bg-transparent"
                disabled={status === SearchStatus.LOADING}
                />
            </div>

            <button
              type="submit"
              disabled={status === SearchStatus.LOADING || !jobQuery.trim() || !country.trim()}
              className="bg-ocean-blue hover:bg-cyan-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed sm:w-auto w-full"
            >
              {status === SearchStatus.LOADING ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="hidden sm:inline">Searching</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Find</span>
                </>
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-slate-400">
          <span>Popular:</span>
          {[
              { label: 'Software in USA', job: 'Software Engineering', loc: 'USA' },
              { label: 'Nursing in UK', job: 'Nursing', loc: 'United Kingdom' },
              { label: 'Mining in Australia', job: 'Mining', loc: 'Australia' },
              { label: 'Tech in Germany', job: 'Tech', loc: 'Germany' }
          ].map((item) => (
             <button 
                key={item.label}
                onClick={() => {
                    setJobQuery(item.job);
                    setCountry(item.loc);
                    onSearch(item.job, item.loc);
                }}
                className="hover:text-brand-gold underline decoration-slate-600 underline-offset-4 hover:decoration-brand-gold transition-all"
             >
                {item.label}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;