// app/trade/components/HeroSection.tsx
interface HeroSectionProps {
  heroProfit: number;
  bigWin: string | null;
}

export default function HeroSection({ heroProfit, bigWin }: HeroSectionProps) {
  return (
    <div className="hero-section p-4 bg-gray-800 text-white rounded-lg">
      <h2 className="text-xl font-bold">Hero Profit: ${heroProfit}</h2>
      {bigWin && <p className="mt-2 text-green-400">{bigWin}</p>}
    </div>
  );
}
