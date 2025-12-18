
import React, { useState } from 'react';
import Layout from './components/Layout';
import AIConcierge from './components/AIConcierge';
import AgentMultiplier from './components/AgentMultiplier';
import PredictiveHunter from './components/PredictiveHunter';
import { TabType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('concierge');

  return (
    <Layout activeTab={activeTab} setTab={setActiveTab}>
      {activeTab === 'concierge' && <AIConcierge />}
      {activeTab === 'multiplier' && <AgentMultiplier />}
      {activeTab === 'hunter' && <PredictiveHunter />}
    </Layout>
  );
};

export default App;
