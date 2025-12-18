
import React, { useState, useRef } from 'react';
import { Zap, Copy, Check, Loader2, Sparkles, FileText, Instagram, LayoutList, Camera, Image as ImageIcon, Trash2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { MarketingContent, RoomAnalysis } from '../types';

const AgentMultiplier: React.FC = () => {
  const [notes, setNotes] = useState('');
  const [results, setResults] = useState<MarketingContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Room Analysis State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [roomAnalysis, setRoomAnalysis] = useState<RoomAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!notes.trim()) return;
    setIsGenerating(true);
    try {
      const data = await geminiService.generateMarketingMagic(notes);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setRoomAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeRoom = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    try {
      const base64Data = selectedImage.split(',')[1];
      const data = await geminiService.analyzeRoomImage(base64Data, imageMimeType);
      setRoomAnalysis(data);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10 pb-20">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
            <Zap size={20} />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Agent Multiplier</h2>
        </div>
        <p className="text-gray-500">Scale your output by converting raw property data and images into elite marketing assets.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* LEFT COLUMN: INPUTS */}
        <section className="space-y-8">
          {/* Note Generator Card */}
          <div className="glass rounded-[2rem] p-8 shadow-sm border border-white/40">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Sparkles className="text-yellow-500" size={20} />
              Raw Property Notes
            </h3>
            <div className="relative">
              <textarea
                className="w-full h-64 bg-white/40 border-0 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-black transition-all text-base resize-none shadow-inner placeholder:text-gray-300"
                placeholder="Example: 3 bed, ocean view, needs work but great bones, $2M, Malibu hills location..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !notes.trim()}
              className="w-full mt-6 bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
            >
              {isGenerating ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
              {isGenerating ? 'Generating Assets...' : 'Generate Marketing Suite'}
            </button>
          </div>

          {/* Room Analysis Card */}
          <div className="glass rounded-[2rem] p-8 shadow-sm border border-white/40">
            <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
              <Camera className="text-blue-500" size={20} />
              Visual Asset Intelligence
            </h3>
            
            <div 
              onClick={() => !selectedImage && fileInputRef.current?.click()}
              className={`relative h-64 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer ${
                selectedImage ? 'border-transparent' : 'border-gray-200 hover:border-blue-400 bg-white/40'
              }`}
            >
              {selectedImage ? (
                <>
                  <img src={selectedImage} alt="Room preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedImage(null); setRoomAnalysis(null); }}
                      className="bg-white/20 backdrop-blur-md p-3 rounded-full hover:bg-white/40 text-white"
                    >
                      <Trash2 size={24} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">Upload Room Photo</p>
                  <p className="text-xs text-gray-400 mt-1">AI will analyze style and features</p>
                </div>
              )}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

            {selectedImage && (
              <button
                onClick={handleAnalyzeRoom}
                disabled={isAnalyzing}
                className="w-full mt-4 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all disabled:opacity-50"
              >
                {isAnalyzing ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isAnalyzing ? 'Analyzing Image...' : 'Run Vision Analysis'}
              </button>
            )}

            {roomAnalysis && (
              <div className="mt-6 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                <div className="mb-4">
                  <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.2em] mb-1">Architectural Style</p>
                  <p className="text-lg font-bold text-gray-900">{roomAnalysis.architecturalStyle}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.2em] mb-2">Key Selling Points</p>
                  <div className="space-y-2">
                    {roomAnalysis.topSellingFeatures.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: RESULTS */}
        <section className="space-y-6">
          {!results && !isGenerating ? (
            <div className="h-full min-h-[600px] glass rounded-[2rem] border-dashed border-2 border-gray-200 flex flex-col items-center justify-center text-gray-400 p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                <LayoutList size={32} className="opacity-20" />
              </div>
              <h4 className="font-semibold text-gray-600 mb-1">Marketing Suite Empty</h4>
              <p className="text-sm max-w-[200px]">Draft property notes on the left to activate your elite assets.</p>
            </div>
          ) : isGenerating ? (
            <div className="h-full min-h-[600px] glass rounded-[2rem] flex flex-col items-center justify-center p-12 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse" />
                <Zap className="animate-bounce text-black relative z-10" size={48} />
              </div>
              <p className="text-black font-bold text-lg">Bionic AI Multiplier at work...</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <MarketingCard 
                icon={<FileText size={18} className="text-blue-500" />}
                title="Professional Listing" 
                content={results.professionalListing} 
                onCopy={() => copyToClipboard(results.professionalListing, 'listing')} 
                isCopied={copiedKey === 'listing'}
              />
              <MarketingCard 
                icon={<Instagram size={18} className="text-pink-500" />}
                title="Instagram Caption" 
                content={results.instagramCaption} 
                onCopy={() => copyToClipboard(results.instagramCaption, 'social')} 
                isCopied={copiedKey === 'social'}
              />
              <MarketingCard 
                icon={<LayoutList size={18} className="text-green-500" />}
                title="Flyer Bullet Points" 
                content={results.flyerPoints.map(p => `• ${p}`).join('\n')} 
                onCopy={() => copyToClipboard(results.flyerPoints.join('\n'), 'flyer')} 
                isCopied={copiedKey === 'flyer'}
                isList
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const MarketingCard = ({ icon, title, content, onCopy, isCopied, isList }: { icon: React.ReactNode, title: string, content: string, onCopy: () => void, isCopied: boolean, isList?: boolean }) => (
  <div className="glass rounded-3xl p-6 relative group border border-white/60 shadow-md hover:shadow-xl transition-all">
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="font-bold text-gray-800 tracking-tight">{title}</h4>
      </div>
      <button 
        onClick={onCopy}
        className={`p-2 rounded-xl transition-all ${isCopied ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100'}`}
      >
        {isCopied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
    <div className={`text-sm text-gray-600 whitespace-pre-line leading-relaxed ${isList ? 'font-medium' : ''}`}>
      {content}
    </div>
  </div>
);

export default AgentMultiplier;
