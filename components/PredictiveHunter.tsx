
import React, { useState } from 'react';
import { Target, TrendingUp, DollarSign, Clock, Search, BrainCircuit, Loader2, AlertCircle, ChevronRight, MapPin } from 'lucide-react';
import { PropertyLead } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_LEADS: PropertyLead[] = [
  { id: '1', ownerName: 'Richard & Linda Sterling', address: '422 N Canon Dr, Beverly Hills', yearsOwned: 9, estimatedEquity: '$3.1M', estimatedValue: '$5.8M' },
  { id: '2', ownerName: 'Marcus Vane', address: '1200 Sierra Alta Way, Hollywood Hills', yearsOwned: 2, estimatedEquity: '$400K', estimatedValue: '$4.2M' },
  { id: '3', ownerName: 'The Miller Family Trust', address: '8902 Wonderland Ave, LA', yearsOwned: 12, estimatedEquity: '$2.2M', estimatedValue: '$2.9M' },
  { id: '4', ownerName: 'Sarah Jenkins', address: '105 S Rockingham Ave, Brentwood', yearsOwned: 7, estimatedEquity: '$4.5M', estimatedValue: '$8.1M' },
  { id: '5', ownerName: 'Tech Peak LLC', address: '221 Ocean Ave, Santa Monica', yearsOwned: 1, estimatedEquity: '$1.2M', estimatedValue: '$12.5M' },
  { id: '6', ownerName: 'Gary Thompson', address: '556 Chalon Rd, Bel Air', yearsOwned: 15, estimatedEquity: '$8.0M', estimatedValue: '$11.2M' },
  { id: '7', ownerName: 'Elena Rodriguez', address: '1432 Blue Jay Way, Bird Streets', yearsOwned: 8, estimatedEquity: '$1.5M', estimatedValue: '$6.7M' },
  { id: '8', ownerName: 'Global Media Partners', address: '9021 Melrose Ave, West Hollywood', yearsOwned: 4, estimatedEquity: '$600K', estimatedValue: '$3.5M' },
  { id: '9', ownerName: 'Dr. Alistair Cook', address: '777 Mulholland Dr, Beverly Crest', yearsOwned: 6, estimatedEquity: '$2.8M', estimatedValue: '$5.1M' },
  { id: '10', ownerName: 'The Peterson Family', address: '300 Palisades Beach Rd, Pacific Palisades', yearsOwned: 10, estimatedEquity: '$5.2M', estimatedValue: '$9.4M' },
];

const PredictiveHunter: React.FC = () => {
  const [leads, setLeads] = useState<PropertyLead[]>(MOCK_LEADS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const simplifiedLeads = leads.map(l => ({
        id: l.id,
        yearsOwned: l.yearsOwned,
        equity: l.estimatedEquity,
        value: l.estimatedValue,
        address: l.address
      }));

      const topThree = await geminiService.identifyHighPropensitySellers(simplifiedLeads);
      
      const updatedLeads = leads.map(l => {
        const analysis = topThree.find((res: any) => res.id === l.id);
        if (analysis) {
          return {
            ...l,
            propensityScore: analysis.score,
            propensityReasoning: analysis.reasoning,
            propensityCategory: analysis.category
          };
        }
        return { ...l, propensityCategory: 'Stable' as const };
      });

      setLeads(updatedLeads);
      setHasAnalyzed(true);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highPropensityLeads = leads.filter(l => l.propensityCategory === 'Hot' || l.propensityCategory === 'Warm')
    .sort((a, b) => (b.propensityScore || 0) - (a.propensityScore || 0));

  return (
    <div className="space-y-8 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Predictive Hunter</h2>
          <p className="text-gray-500">Uncovering off-market opportunities through deep-learning move cycle analysis.</p>
        </div>
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="bg-black text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl disabled:opacity-50"
        >
          {isAnalyzing ? <Loader2 className="animate-spin" /> : <BrainCircuit size={20} />}
          {isAnalyzing ? 'Processing Farm Data...' : 'Run Propensity Analysis'}
        </button>
      </header>

      {hasAnalyzed && highPropensityLeads.length > 0 && (
        <section className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-red-500 flex items-center gap-2">
            <AlertCircle size={16} /> High Propensity Targets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highPropensityLeads.map((lead) => (
              <div 
                key={lead.id} 
                className={`p-6 rounded-[2rem] border-2 shadow-lg transition-all hover:scale-[1.02] ${
                  lead.propensityCategory === 'Hot' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-orange-50 border-orange-200'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    lead.propensityCategory === 'Hot' ? 'bg-red-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {lead.propensityCategory} Target
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black">{lead.propensityScore}%</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Match</p>
                  </div>
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{lead.ownerName}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
                  <MapPin size={12} /> {lead.address}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed bg-white/50 p-3 rounded-xl border border-white/50 italic">
                  "{lead.propensityReasoning}"
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">
          Farm Area Index <span className="ml-2 font-normal lowercase tracking-normal">({leads.length} records)</span>
        </h3>
        <div className="glass rounded-[2rem] overflow-hidden border border-white/40 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-wider">Owner / Address</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-wider">Years Owned</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-wider">Est. Equity</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-wider">Est. Value</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-wider">Status</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{lead.ownerName}</div>
                      <div className="text-xs text-gray-500">{lead.address}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm font-medium">{lead.yearsOwned} Years</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-green-600">{lead.estimatedEquity}</td>
                    <td className="px-6 py-4 text-sm font-bold">{lead.estimatedValue}</td>
                    <td className="px-6 py-4">
                      {lead.propensityCategory ? (
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider ${
                          lead.propensityCategory === 'Hot' ? 'text-red-500' : 
                          lead.propensityCategory === 'Warm' ? 'text-orange-500' : 'text-gray-400'
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            lead.propensityCategory === 'Hot' ? 'bg-red-500 shadow-[0_0_8px_red]' : 
                            lead.propensityCategory === 'Warm' ? 'bg-orange-500' : 'bg-gray-200'
                          }`} />
                          {lead.propensityCategory}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-wider italic">Awaiting AI</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 rounded-lg text-gray-300 hover:text-black hover:bg-white transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PredictiveHunter;
