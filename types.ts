export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  location: string;
  description: string;
  sponsorshipType?: string; // e.g., TSS 482 (AU), H1B (US), Blue Card (EU)
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface SearchResult {
  companies: Company[];
  rawText?: string;
  sources: GroundingSource[];
}

export enum SearchStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}