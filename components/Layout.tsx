
import React from 'react';
import { MessageSquare, Zap, Target, Building2 } from 'lucide-react';
import { TabType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setTab: (tab: TabType) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setTab }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#f5f5f7] text-[#1d1d1f]">
      {/* Sidebar - Apple Style */}
      <aside className="w-full md:w-64 glass md:h-screen sticky top-0 z-50 flex flex-col border-r border-gray-200 shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-xl">
            <Building2 size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Bionic</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button
            onClick={() => setTab('concierge')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'concierge' ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">AI Concierge</span>
          </button>
          <button
            onClick={() => setTab('multiplier')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'multiplier' ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Zap size={20} />
            <span className="font-medium">Agent Multiplier</span>
          </button>
          <button
            onClick={() => setTab('hunter')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === 'hunter' ? 'bg-black text-white shadow-lg' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Target size={20} />
            <span className="font-medium">Predictive Hunter</span>
          </button>
        </nav>

        <div className="p-6 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-3 glass p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">Director of Growth</p>
              <p className="text-xs text-gray-500">Elite Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
