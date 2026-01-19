'use client';

import React, { useState, useEffect } from 'react';
import { Award, Trophy, Flame, Star } from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress?: number; // 0-100
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  streak: number;
  badges: number;
  isCurrentUser: boolean;
}

const BADGES: Badge[] = [
  { id: '1', name: 'First Trade', icon: '🎯', description: 'Execute your first trade', unlocked: true, progress: 100 },
  { id: '2', name: 'Hot Streak', icon: '🔥', description: '5 wins in a row', unlocked: true, progress: 100 },
  { id: '3', name: 'Market Master', icon: '📈', description: 'Reach 50% accuracy', unlocked: true, progress: 100 },
  { id: '4', name: 'Risk Manager', icon: '🛡️', description: 'Keep losses under 2%', unlocked: false, progress: 78 },
  { id: '5', name: 'Profit Machine', icon: '💰', description: 'Make $10k profit', unlocked: false, progress: 45 },
  { id: '6', name: 'Perfect Day', icon: '⭐', description: '10+ wins in one day', unlocked: false, progress: 60 },
  { id: '7', name: 'Trading Legend', icon: '👑', description: '1000+ total points', unlocked: false, progress: 88 },
  { id: '8', name: 'Investor', icon: '💎', description: 'Hold a position for 30 days', unlocked: false, progress: 35 },
];

const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: 'TradeKing', points: 4850, streak: 12, badges: 7, isCurrentUser: false },
  { rank: 2, username: 'MarketWizard', points: 4620, streak: 9, badges: 6, isCurrentUser: false },
  { rank: 3, username: 'You', points: 2847, streak: 7, badges: 3, isCurrentUser: true },
  { rank: 4, username: 'CryptoGuru', points: 2340, streak: 5, badges: 4, isCurrentUser: false },
  { rank: 5, username: 'StockJockey', points: 1920, streak: 3, badges: 2, isCurrentUser: false },
];

export default function Gamification() {
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard' | 'streak'>('badges');
  const [currentStreak, setCurrentStreak] = useState(7);
  const [totalPoints, setTotalPoints] = useState(2847);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Slight random fluctuation
      if (Math.random() > 0.5) {
        setTotalPoints((prev) => prev + Math.floor(Math.random() * 50));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-gradient-to-br from-[#0B1220] to-[#070B14] rounded-2xl border border-[#22ff88]/10 p-6 mb-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="text-[#22ff88]" size={28} />
        <div>
          <h3 className="text-2xl font-bold text-white">Gamification</h3>
          <p className="text-sm text-[#9aa0c8]">Earn badges • Build streaks • Climb leaderboard</p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#22ff88]/10 to-[#5363ff]/10 rounded-xl p-4 border border-[#22ff88]/20">
          <Flame className="text-[#ff5555] mb-2" size={24} />
          <p className="text-3xl font-bold text-[#22ff88] mb-1">{currentStreak}</p>
          <p className="text-xs text-[#9aa0c8]">Win Streak</p>
        </div>
        <div className="bg-gradient-to-br from-[#5363ff]/10 to-[#22ff88]/10 rounded-xl p-4 border border-[#5363ff]/20">
          <Star className="text-[#5363ff] mb-2" size={24} />
          <p className="text-3xl font-bold text-[#5363ff] mb-1">{totalPoints}</p>
          <p className="text-xs text-[#9aa0c8]">Total Points</p>
        </div>
        <div className="bg-gradient-to-br from-[#ff8c00]/10 to-[#22ff88]/10 rounded-xl p-4 border border-[#ff8c00]/20">
          <Award className="text-[#ff8c00] mb-2" size={24} />
          <p className="text-3xl font-bold text-[#ff8c00] mb-1">3</p>
          <p className="text-xs text-[#9aa0c8]">Badges Earned</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-[#22ff88]/10">
        {(['badges', 'leaderboard', 'streak'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === tab
                ? 'text-[#22ff88] border-b-2 border-[#22ff88]'
                : 'text-[#9aa0c8] hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Badges Tab */}
      {activeTab === 'badges' && (
        <div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {BADGES.map((badge) => (
              <div
                key={badge.id}
                className={`rounded-xl p-4 border-2 text-center transition-all ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-[#22ff88]/20 to-[#5363ff]/20 border-[#22ff88]/50 hover:shadow-lg hover:shadow-[#22ff88]/20'
                    : 'bg-[#161c2e]/50 border-[#9aa0c8]/20 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <h4 className="text-xs font-bold text-white mb-1">{badge.name}</h4>
                <p className="text-xs text-[#9aa0c8] mb-3">{badge.description}</p>

                {!badge.unlocked && badge.progress !== undefined && (
                  <div className="w-full bg-[#0B1220] rounded-full h-1.5 overflow-hidden mb-2">
                    <div
                      className="bg-[#22ff88] h-full transition-all"
                      style={{ width: `${badge.progress}%` }}
                    ></div>
                  </div>
                )}

                {badge.unlocked ? (
                  <span className="text-xs text-[#22ff88] font-bold">✓ Unlocked</span>
                ) : (
                  <span className="text-xs text-[#9aa0c8]">{badge.progress}% Close</span>
                )}
              </div>
            ))}
          </div>

          {/* Badge Progress Info */}
          <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
            <p className="text-xs text-[#9aa0c8] leading-relaxed">
              🎖️ <span className="font-semibold">Achievement System:</span> Unlock badges by hitting milestones. Each badge gives bonus points and bragging rights on leaderboards!
            </p>
          </div>
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <div>
          <div className="space-y-2">
            {LEADERBOARD.map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  entry.isCurrentUser
                    ? 'bg-[#22ff88]/10 border-[#22ff88] shadow-lg shadow-[#22ff88]/20'
                    : 'bg-[#161c2e] border-[#22ff88]/10 hover:border-[#22ff88]/50'
                }`}
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#5363ff] flex items-center justify-center font-bold text-sm text-white">
                    {entry.rank}
                  </div>
                  <div>
                    <p className="font-bold text-white">{entry.username}</p>
                    <div className="flex gap-4 text-xs text-[#9aa0c8] mt-1">
                      <span>🔥 {entry.streak} Streak</span>
                      <span>🎖️ {entry.badges} Badges</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#22ff88]">{entry.points}</p>
                  <p className="text-xs text-[#9aa0c8]">Points</p>
                </div>
              </div>
            ))}
          </div>

          {/* Leaderboard Info */}
          <div className="mt-6 bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
            <p className="text-xs text-[#9aa0c8] leading-relaxed">
              🏆 <span className="font-semibold">Climb the Rankings:</span> Top performers get featured and exclusive perks. Compete fairly with automated detection of manipulation.
            </p>
          </div>
        </div>
      )}

      {/* Streak Tab */}
      {activeTab === 'streak' && (
        <div>
          <div className="bg-gradient-to-br from-[#ff5555]/10 to-[#22ff88]/10 rounded-xl p-8 border-2 border-[#ff5555] mb-6 text-center">
            <Flame className="text-[#ff5555] mx-auto mb-4" size={48} />
            <p className="text-5xl font-bold text-[#ff5555] mb-2">{currentStreak}</p>
            <p className="text-xl font-semibold text-white mb-4">Day Winning Streak!</p>
            <p className="text-[#9aa0c8] text-sm mb-6">
              Keep it alive! Your next trade will determine if your streak continues...
            </p>
            <div className="bg-[#0B1220] rounded-lg p-4 border border-[#ff5555]/20 text-left max-w-sm mx-auto">
              <p className="text-sm text-[#9aa0c8] mb-3">📊 Streak Statistics</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#9aa0c8]">Win Rate:</span>
                  <span className="text-[#22ff88] font-bold">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9aa0c8]">Consecutive Wins:</span>
                  <span className="text-[#22ff88] font-bold">{currentStreak}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9aa0c8]">Longest Streak:</span>
                  <span className="text-[#ff8c00] font-bold">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#9aa0c8]">Avg Profit/Trade:</span>
                  <span className="text-[#22ff88] font-bold">+$1,240</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Milestones */}
          <div className="bg-[#161c2e] rounded-lg p-4 border border-[#22ff88]/10">
            <h4 className="text-sm font-bold text-white mb-3">🎯 Streak Milestones</h4>
            <div className="space-y-2">
              {[3, 5, 7, 10, 15, 20, 25, 30].map((milestone) => (
                <div key={milestone} className="flex items-center justify-between text-sm">
                  <span className="text-[#9aa0c8]">{milestone} day streak</span>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${currentStreak >= milestone ? 'bg-[#22ff88]' : 'bg-[#9aa0c8]/30'}`}
                    ></div>
                    <span className={currentStreak >= milestone ? 'text-[#22ff88] font-bold' : 'text-[#9aa0c8]'}>
                      {currentStreak >= milestone ? '✓' : '◯'}
                    </span>
                    <span className="text-[#5363ff] font-bold">+{milestone * 100} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
