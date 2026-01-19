import HeroVisual from "@/components/HeroVisual";
import HeroStats from "@/components/HeroStats";

interface HeroSectionProps {
  heroProfit: number;
  bigWin: string | null;
}

export default function HeroSection({ heroProfit, bigWin }: HeroSectionProps) {
  return (
    <div className="space-y-4">
      <HeroVisual />
      <HeroStats profit={heroProfit} win={bigWin} /> {/* sesuai props HeroStats */}
    </div>
  );
}
