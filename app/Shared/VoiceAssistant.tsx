// C:\ai_trading\app\Shared\VoiceAssistant.tsx

"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, MicOff, Volume2, Waves, Command } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

const AI_INSIGHTS = [
  "Market momentum looks bullish for tech stocks today",
  "Bitcoin showing strong support at $43,500 level",
  "Your portfolio is up 2.3% this week, great execution",
  "Consider taking partial profits on TSLA near $250",
  "Volatility increased 15% in the last 4 hours",
];

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* ================= INIT SPEECH API ================= */
  useEffect(() => {
    if (typeof window === "undefined") return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) handleUserMessage(text);
        else interim += text;
      }
      setTranscript(interim);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isProcessing]);

  /* ================= SPEECH SYNTHESIS (AI VOICE) ================= */
  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 0.9; // Deeper, more "AI" tone
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleUserMessage = useCallback((input: string) => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscript("");
    setIsProcessing(true);

    setTimeout(() => {
      const response = AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)];
      const aiMessage: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
      speak(response); // AI bicarakan jawabannya
    }, 1200);
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    isListening ? recognitionRef.current.stop() : recognitionRef.current.start();
  };

  return (
    <div className="relative w-full bg-[#0C1322] border border-white/[0.05] rounded-[2rem] p-6 overflow-hidden shadow-2xl">
      {/* Neural Background Decorator */}
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
        <Command size={120} />
      </div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-2xl ${isListening ? "bg-neon-pink/10" : "bg-neon-green/10"}`}>
            {isListening ? (
              <Waves className="text-neon-pink animate-pulse" size={24} />
            ) : (
              <Volume2 className="text-neon-green" size={24} />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Neural Assistant</h3>
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full animate-ping ${isListening ? "bg-neon-pink" : "bg-neon-green"}`} />
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                {isListening ? "Listening Mode" : "System Ready"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CHAT DISPLAY */}
      <div className="h-72 bg-black/40 backdrop-blur-inner border border-white/[0.05] rounded-2xl p-4 overflow-y-auto space-y-4 mb-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <Mic size={40} className="mb-2 text-gray-500" />
            <p className="text-xs text-gray-400 max-w-[180px]">
              "What's the current sentiment on Bitcoin?"
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "bg-neon-green text-black font-bold shadow-[0_4px_15px_rgba(34,255,136,0.3)]"
                  : "bg-white/[0.03] border border-white/[0.1] text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
            <div className="bg-white/[0.03] px-4 py-3 rounded-2xl border border-white/[0.1] flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* CONTROLS */}
      <div className="relative z-10 flex items-center gap-4">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold transition-all transform active:scale-95 ${
            isListening
              ? "bg-neon-pink text-white shadow-[0_0_25px_rgba(255,0,128,0.4)]"
              : "bg-white text-black hover:bg-neon-green"
          } disabled:opacity-50`}
        >
          {isListening ? <MicOff size={20} className="animate-pulse" /> : <Mic size={20} />}
          <span className="text-sm tracking-tight uppercase">
            {isListening ? "Deactivate Mic" : "Initialize Voice"}
          </span>
        </button>
      </div>

      {/* TRANSCRIPT POPUP */}
      {isListening && transcript && (
        <div className="absolute bottom-24 left-6 right-6 p-4 bg-neon-pink/10 border border-neon-pink/30 rounded-xl backdrop-blur-md animate-in slide-in-from-bottom-4">
          <p className="text-[11px] text-white/90 font-medium italic">"{transcript}..."</p>
        </div>
      )}
    </div>
  );
}