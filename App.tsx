
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchSection from './components/SearchSection';
import ResultsSection from './components/ResultsSection';
import { Company, GroundingSource, SearchStatus } from './types';
import { searchSponsorshipCompanies } from './services/geminiService';

const App: React.FC = () => {
  const [status, setStatus] = useState<SearchStatus>(SearchStatus.IDLE);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [rawText, setRawText] = useState<string | undefined>(undefined);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  
  // Favorites logic
  const [favorites, setFavorites] = useState<Company[]>(() => {
    const saved = localStorage.getItem('sponsor_seeker_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sponsor_seeker_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (company: Company) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === company.id || (f.name === company.name && f.location === company.location));
      if (isFav) {
        return prev.filter(f => !(f.id === company.id || (f.name === company.name && f.location === company.location)));
      } else {
        return [...prev, company];
      }
    });
  };

  const handleSearch = async (query: string, country: string) => {
    setStatus(SearchStatus.LOADING);
    setCompanies([]);
    setSources([]);
    setRawText(undefined);
    setCurrentQuery(query);
    setCurrentCountry(country);

    try {
      const result = await searchSponsorshipCompanies(query, country);
      setCompanies(result.companies);
      setSources(result.sources);
      setRawText(result.rawText);
      setStatus(SearchStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(SearchStatus.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Header />
      <main className="flex-grow">
        <SearchSection onSearch={handleSearch} status={status} />
        <ResultsSection 
            status={status} 
            companies={companies} 
            sources={sources} 
            rawText={rawText}
            query={currentQuery}
            country={currentCountry}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
        />
      </main>
      
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} SponsorSeeker Global. Powered by Google Gemini.</p>
            <p className="mt-2 text-xs">
                Disclaimer: Information is aggregated by AI from public sources. 
                Visa regulations change frequently. Always verify directly with the company or a registered migration agent in the specific country.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
