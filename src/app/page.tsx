"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<{ sentiment: string; confidence: number; processingTimeMs: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeSentiment = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError("");
    setResult(null);
    
    try {
      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.detail || "Analysis failed");
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unable to connect to the model server.");
    } finally {
      setLoading(false);
    }
  };

  const sampleTexts = [
    "আমি তোমাকে অনেক ভালোবাসি",
    "এই প্রোডাক্টটি খুবই খারাপ, আমি হতাশ",
    "আজকের আবহাওয়া মোটামুটি ভালো"
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6 md:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        
        <header className="border-b border-slate-800 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hugging Face Transformer Active
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            Bengali<span className="text-blue-500">NLP</span> Sentinel
          </h1>
          <p className="text-slate-400">Contextual Sentiment Analysis for Bengali Text using DistilBERT.</p>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <label className="block text-sm font-bold text-slate-300 mb-2">Input Bengali Text</label>
              <textarea 
                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none font-medium"
                placeholder="এখানে আপনার মতামত লিখুন..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {sampleTexts.map((sample, i) => (
                  <button 
                    key={i}
                    onClick={() => setText(sample)}
                    className="whitespace-nowrap px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors border border-slate-600"
                  >
                    {sample.substring(0, 20)}...
                  </button>
                ))}
              </div>

              <button 
                onClick={analyzeSentiment}
                disabled={loading || !text.trim()}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Sentiment"
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col gap-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
              
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Analysis Results</h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              {!result && !error && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p>Awaiting text input...</p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-blue-400 animate-pulse">
                  <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
                  <p className="font-bold">Running model inference...</p>
                </div>
              )}

              {result && !loading && (
                <div className="flex flex-col flex-1">
                  
                  {/* Primary Sentiment Banner */}
                  <div className={`p-6 rounded-2xl mb-6 flex flex-col items-center justify-center relative overflow-hidden ${
                    result.sentiment === 'Positive' || result.sentiment === '5 stars' || result.sentiment === '4 stars' 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : result.sentiment === 'Negative' || result.sentiment === '1 star' || result.sentiment === '2 stars'
                        ? 'bg-rose-500/10 border border-rose-500/30'
                        : 'bg-blue-500/10 border border-blue-500/30'
                  }`}>
                    <p className={`text-5xl font-black mb-2 ${
                      result.sentiment === 'Positive' || result.sentiment === '5 stars' || result.sentiment === '4 stars'  
                        ? 'text-emerald-400' 
                        : result.sentiment === 'Negative' || result.sentiment === '1 star' || result.sentiment === '2 stars'
                          ? 'text-rose-400'
                          : 'text-blue-400'
                    }`}>
                      {result.sentiment.includes('star') 
                        ? (parseInt(result.sentiment) >= 4 ? 'Positive' : parseInt(result.sentiment) <= 2 ? 'Negative' : 'Neutral') 
                        : result.sentiment}
                    </p>
                    <p className="text-slate-400 text-sm font-bold">Predicted Sentiment</p>
                  </div>

                  {/* Metrics */}
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-slate-300 mb-1">
                        <span>Model Confidence</span>
                        <span className="text-white">{result.confidence.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${result.confidence > 80 ? 'bg-emerald-500' : result.confidence > 50 ? 'bg-orange-500' : 'bg-red-500'}`} 
                          style={{ width: `${result.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm font-bold text-slate-300 mb-1">
                        <span>Processing Latency</span>
                        <span className="text-white">{result.processingTimeMs}ms</span>
                      </div>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>
          </div>
          
        </main>
      </div>
    </div>
  );
}
