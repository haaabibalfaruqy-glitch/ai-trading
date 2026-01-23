'use client';

import { useState, useCallback, useMemo } from 'react';
import { Share2, Twitter, Linkedin, Copy, Check } from 'lucide-react';

interface ShareCard {
  id: string;
  title: string;
  insight: string;
  metric: string;
  emoji: string;
  bgGradient: string;
}

const SHARE_CARDS: ShareCard[] = [
  {
    id: '1',
    title: 'Portfolio Performance',
    insight: 'Up 2.3% this week with strong momentum in tech stocks',
    metric: '+$2,847',
    emoji: '📈',
    bgGradient: 'from-[#22ff88]/10 to-[#5363ff]/10',
  },
  {
    id: '2',
    title: 'Win Streak',
    insight: 'Executed 7 profitable trades in a row with 87% accuracy',
    metric: '7x Wins',
    emoji: '🔥',
    bgGradient: 'from-[#ff5555]/10 to-[#ff8c00]/10',
  },
  {
    id: '3',
    title: 'Market Insight',
    insight:
      'Bitcoin showing strong support at $43,500. Watch this level for potential breakout.',
    metric: 'Live Analysis',
    emoji: '💡',
    bgGradient: 'from-[#5363ff]/10 to-[#22ff88]/10',
  },
  {
    id: '4',
    title: 'Risk Management',
    insight:
      'Portfolio diversification improved by 12% with reduced correlation',
    metric: 'Optimized',
    emoji: '🎯',
    bgGradient: 'from-[#22ff88]/10 to-[#ff5555]/10',
  },
];

export default function SocialSharing() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const cards = useMemo(() => SHARE_CARDS, []);

  const generateShareText = useCallback((card: ShareCard) => {
    return `${card.emoji} ${card.title}

"${card.insight}"

Result: ${card.metric}

Trading with AI 🚀`;
  }, []);

  const handleCopy = useCallback(
    (card: ShareCard) => {
      navigator.clipboard.writeText(generateShareText(card));
      setCopiedId(card.id);
      setTimeout(() => setCopiedId(null), 2000);
    },
    [generateShareText]
  );

  const handleShareTwitter = useCallback(
    (card: ShareCard) => {
      const text = encodeURIComponent(generateShareText(card));
      window.open(
        `https://twitter.com/intent/tweet?text=${text}`,
        '_blank'
      );
    },
    [generateShareText]
  );

  const handleShareLinkedin = useCallback(
    (card: ShareCard) => {
      const text = encodeURIComponent(generateShareText(card));
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=https://copilot.ai&title=${text}`,
        '_blank'
      );
    },
    [generateShareText]
  );

  return (
    <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Share2 className="text-[#22ff88]" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-white">
            Share Your Wins
          </h3>
          <p className="text-sm text-[#9aa0c8]">
            Show off your trading insights • Connect with other traders
          </p>
        </div>
      </div>

      {/* Share Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {cards.map((card) => {
          const isActive = selectedCard === card.id;

          return (
            <div
              key={card.id}
              onClick={() =>
                setSelectedCard(isActive ? null : card.id)
              }
              className={`bg-gradient-to-br ${card.bgGradient} border-2 rounded-xl p-6 cursor-pointer transition-all hover:shadow-lg ${
                isActive
                  ? 'border-[#22ff88] shadow-[#22ff88]/20'
                  : 'border-[#22ff88]/20 hover:border-[#22ff88]/50'
              }`}
            >
              {/* Card Content */}
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-3xl">{card.emoji}</span>
                  <span className="text-lg font-bold text-[#22ff88]">
                    {card.metric}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">
                  {card.title}
                </h4>
                <p className="text-sm text-[#9aa0c8] leading-relaxed">
                  {card.insight}
                </p>
              </div>

              {/* Expanded Actions */}
              {isActive && (
                <div className="border-t border-[#22ff88]/20 pt-4 space-y-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(card);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#22ff88]/20 text-[#22ff88] hover:bg-[#22ff88]/30 transition font-semibold text-sm"
                  >
                    {copiedId === card.id ? (
                      <>
                        <Check size={16} /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} /> Copy Text
                      </>
                    )}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareTwitter(card);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#1DA1F2]/20 text-[#1DA1F2] hover:bg-[#1DA1F2]/30 text-xs font-semibold"
                    >
                      <Twitter size={14} /> Twitter
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareLinkedin(card);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#0A66C2]/20 text-[#0A66C2] hover:bg-[#0A66C2]/30 text-xs font-semibold"
                    >
                      <Linkedin size={14} /> LinkedIn
                    </button>
                  </div>

                  <div className="bg-[#0B1220] rounded-lg p-3 border border-[#22ff88]/10 text-xs text-[#9aa0c8] max-h-20 overflow-y-auto">
                    <p className="italic">
                      {generateShareText(card)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
        <h4 className="text-sm font-bold text-white mb-3">
          Share Impact
        </h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#22ff88]">847</p>
            <p className="text-xs text-[#9aa0c8] mt-1">
              Views This Week
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#5363ff]">156</p>
            <p className="text-xs text-[#9aa0c8] mt-1">
              Engagements
            </p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#ff5555]">32</p>
            <p className="text-xs text-[#9aa0c8] mt-1">
              New Followers
            </p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-6 bg-[#0B1220]/50 rounded-lg p-4 border border-[#22ff88]/10">
        <p className="text-xs text-[#9aa0c8] leading-relaxed">
          📢 <span className="font-semibold">Sharing Tips:</span>{' '}
          Celebrate your wins to build social proof and attract more
          traders. Engage with the community by commenting on others'
          insights.
        </p>
      </div>
    </div>
  );
}
