import React from 'react';
import { Company, GroundingSource, SearchStatus } from '../types';
import { ExternalLink, MapPin, Briefcase, Building2, Info } from 'lucide-react';

interface ResultsSectionProps {
  status: SearchStatus;
  companies: Company[];
  rawText?: string;
  sources: GroundingSource[];
  query: string;
  country: string;
}

const ResultsSection: React.FC<ResultsSectionProps> = ({ status, companies, rawText, sources, query, country }) => {
  if (status === SearchStatus.IDLE) {
    return null;
  }

  if (status === SearchStatus.ERROR) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
            <h3 className="text-red-800 font-semibold text-lg mb-2">Search Failed</h3>
            <p className="text-red-600">Something went wrong while fetching data. Please check your API key and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header for Results */}
      <div className="flex justify-between items-end mb-8">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">
                {status === SearchStatus.LOADING ? `Scouring the web for opportunities in ${country}...` : `Results for "${query}" in ${country}`}
            </h2>
            <p className="text-slate-500 mt-1">
                {status === SearchStatus.SUCCESS && `${companies.length > 0 ? companies.length : 'No specific'} companies found via AI search.`}
            </p>
         </div>
      </div>

      {/* Structured Results Grid */}
      {companies.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {companies.map((company, index) => (
            <div 
                key={company.id || index} 
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-ocean-blue group-hover:bg-blue-100 transition-colors">
                    <Building2 className="w-6 h-6" />
                </div>
                {company.sponsorshipType && (
                    <span className="text-xs font-semibold bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {company.sponsorshipType}
                    </span>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 mb-1">{company.name}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">{company.industry}</p>
              
              <div className="space-y-2 mb-6 flex-grow">
                 <div className="flex items-center text-sm text-slate-600 gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span>{company.location}</span>
                 </div>
                 <div className="flex items-start text-sm text-slate-600 gap-2">
                    <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-3">{company.description}</span>
                 </div>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-100">
                {company.website ? (
                    <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors gap-2"
                    >
                        Visit Career Page
                        <ExternalLink className="w-4 h-4" />
                    </a>
                ) : (
                    <button disabled className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-lg text-sm font-medium cursor-not-allowed">
                        Website Not Available
                    </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fallback Text View (if JSON parse failed but we have text, or just empty list) */}
      {!companies.length && rawText && status === SearchStatus.SUCCESS && (
         <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-12 prose prose-slate max-w-none">
            <h3 className="text-lg font-semibold mb-4">AI Summary</h3>
            <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {rawText}
            </div>
         </div>
      )}

      {/* Grounding Sources */}
      {sources.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Sources & Verified Listings
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sources.map((source, idx) => (
                    <a 
                        key={idx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600 hover:text-ocean-blue hover:border-ocean-blue transition-all truncate"
                    >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{source.title || source.uri}</span>
                    </a>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default ResultsSection;