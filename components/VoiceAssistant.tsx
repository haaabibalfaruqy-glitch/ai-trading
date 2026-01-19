'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const AI_INSIGHTS = [
  'Market momentum looks bullish for tech stocks today',
  'Bitcoin showing strong support at $43,500 level',
  'Your portfolio is up 2.3% this week, great execution',
  'Consider taking profits on TSLA if it reaches $250',
  'Volatility increased 15% in the last 4 hours',
];

export default function VoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              handleUserMessage(transcript);
            } else {
              interimTranscript += transcript;
            }
          }
          setTranscript(interimTranscript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle user message
  const handleUserMessage = (userInput: string) => {
    if (!userInput.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setTranscript('');
    setIsProcessing(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiInsight = AI_INSIGHTS[Math.floor(Math.random() * AI_INSIGHTS.length)];
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        role: 'assistant',
        content: aiInsight,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsProcessing(false);
    }, 800);
  };

  // Toggle voice recording
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setMessages([]);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="text-[#22ff88]" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-white">Voice Assistant</h3>
          <p className="text-sm text-[#9aa0c8]">Speak naturally • Get AI insights instantly</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="bg-[#161c2e] rounded-lg border border-[#22ff88]/10 h-64 overflow-y-auto mb-6 p-4 space-y-4">
        {messages.length === 0 && !isListening ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <Volume2 className="text-[#9aa0c8] opacity-50 mb-2" size={32} />
            <p className="text-[#9aa0c8] text-sm">Click mic to start • Ask about markets, trading, or your portfolio</p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-[#22ff88] text-[#0B1220] font-semibold'
                      : 'bg-[#0B1220] border border-[#22ff88]/20 text-[#9aa0c8]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-[#0B1220] border border-[#22ff88]/20 px-4 py-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#22ff88] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#22ff88] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-[#22ff88] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="bg-[#0B1220] border border-[#22ff88]/20 rounded-lg p-4 mb-6">
          <p className="text-xs text-[#9aa0c8] uppercase tracking-wide mb-2">Hearing...</p>
          <p className="text-white">{transcript}</p>
        </div>
      )}

      {/* Mic Button & Status */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-bold transition-all ${
            isListening
              ? 'bg-[#ff5555] text-white hover:scale-105'
              : 'bg-[#22ff88] text-[#0B1220] hover:scale-105 disabled:opacity-50'
          }`}
        >
          {isListening ? (
            <>
              <MicOff size={20} /> Stop
            </>
          ) : (
            <>
              <Mic size={20} /> Start Voice
            </>
          )}
        </button>

        {/* Status Indicator */}
        <div className="text-right text-xs">
          <p className={`font-semibold ${isListening ? 'text-[#22ff88]' : 'text-[#9aa0c8]'}`}>
            {isListening ? '🔴 Listening...' : '○ Ready'}
          </p>
          <p className="text-[#9aa0c8]">{messages.length} messages</p>
        </div>
      </div>

      {/* Feature Info */}
      <div className="mt-6 bg-[#0B1220]/50 rounded-lg p-4 border border-[#22ff88]/10">
        <p className="text-xs text-[#9aa0c8] leading-relaxed">
          💡 <span className="font-semibold">Powered by AI:</span> Analyzes market sentiment, portfolio performance, and trading opportunities in real-time. Try asking "What's the market sentiment?" or "Should I buy TSLA?"
        </p>
      </div>
    </div>
  );
}
