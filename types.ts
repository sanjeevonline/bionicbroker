
export type TabType = 'concierge' | 'multiplier' | 'hunter';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface MarketingContent {
  professionalListing: string;
  instagramCaption: string;
  flyerPoints: string[];
}

export interface RoomAnalysis {
  architecturalStyle: string;
  topSellingFeatures: string[];
}

export interface PropertyLead {
  id: string;
  address: string;
  yearsOwned: number;
  estimatedEquity: string;
  estimatedValue: string;
  ownerName: string;
  propensityScore?: number;
  propensityReasoning?: string;
  propensityCategory?: 'Hot' | 'Warm' | 'Stable';
}
