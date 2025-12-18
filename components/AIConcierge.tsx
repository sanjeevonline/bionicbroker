
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, ShieldCheck, Zap } from 'lucide-react';
import { Message } from '../types';
import { geminiService } from '../services/geminiService';

const AIConcierge: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to the Bionic Brokerage Concierge. How can I help you dominate the market today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [qualifiedLead, setQualifiedLead] = useState<{name: string, budget: string} | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Map messages to Gemini history format
      let history = newMessages.map(m => ({
        role: (m.role === 'assistant' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: m.content }]
      }));

      let response = await geminiService.chatWithConcierge(history);

      // Handle Function Calls (Lead Qualification)
      if (response.functionCalls && response.functionCalls.length > 0) {
        for (const fc of response.functionCalls) {
          if (fc.name === 'qualifyLead') {
            const { name, budget } = fc.args as any;
            
            // SIMULATE FIRESTORE UPDATE
            console.log(`[Firestore] Updating leads collection: { name: "${name}", budget: "${budget}", status: "qualified" }`);
            setQualifiedLead({ name, budget });

            // Send tool response back to Gemini to get the final textual answer
            const toolResult = { status: "success", message: `Lead ${name} with budget ${budget} has been marked as qualified in the Bionic CRM.` };
            
            // Add tool call and response to history
            history.push({
              role: 'model',
              parts: [{ functionCall: fc }]
            } as any);
            
            history.push({
              role: 'user', // Actually 'function' role in some SDKs, but here we provide result back
              parts: [{ functionResponse: { name: fc.name, response: toolResult, id: fc.id } }]
            } as any);

            // Get final response from AI after processing the tool
            response = await geminiService.chatWithConcierge(history);
          }
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response.text || "I've updated the records accordingly. Anything else?" }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Technical glitch in the matrix. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-160px)]">
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">AI Concierge</h2>
          <p className="text-gray-500">Your high-performance brokerage assistant.</p>
        </div>
        {qualifiedLead && (
          <div className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-2xl animate-bounce shadow-sm border border-green-200">
            <ShieldCheck size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Lead Qualified: {qualifiedLead.name}</span>
          </div>
        )}
      </header>

      <div className="flex-1 glass rounded-3xl p-6 mb-4 overflow-y-auto flex flex-col gap-4 relative">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'assistant' ? 'bg-black text-white' : 'bg-white border border-gray-200'
            }`}>
              {msg.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className={`max-w-[80%] px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'assistant' ? 'bg-white/80 border border-gray-100' : 'bg-black text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center shrink-0 animate-pulse">
              <Bot size={20} />
            </div>
            <div className="bg-white/50 px-5 py-3 rounded-2xl border border-gray-100">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="relative group">
        <div className="absolute -top-12 left-0 right-0 flex justify-center pointer-events-none">
           <div className="bg-black/5 text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full text-gray-400 flex items-center gap-1">
             <Zap size={10} /> Powered by Bionic Intelligence
           </div>
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="e.g. 'I'm John Doe looking for a $5M mansion in Bel Air'"
          className="w-full glass py-5 pl-8 pr-20 rounded-[2.5rem] focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-xl text-lg placeholder:text-gray-400 border border-white/50"
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-4 top-3 bottom-3 aspect-square bg-black text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-lg"
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
};

export default AIConcierge;
