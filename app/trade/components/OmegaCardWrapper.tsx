import { OmegaCard } from "@/components/OmegaCard";
import { computeTrend } from "./TrendCalculator";

export default function OmegaCardWrapper({
  coinList,
  observedCoin,
  setObservedCoin,
  cinemaMode,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragLeave,
}: any) {
  const N = 30;

  return (
    <>
      {coinList.map((coin: any, idx: number) => {
        const rawValues = coin.realSeries || coin.liveData || [];
        const values = rawValues.slice(-N);
        const trend = computeTrend(values);

        return (
          <div
            key={coin.name}
            draggable
            onDragStart={(e) => handleDragStart(e, coin.name, idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDrop={(e) => handleDrop(e, idx)}
            onDragLeave={handleDragLeave}
          >
            <OmegaCard
              coin={coin}
              values={values}
              systemMode="idle"
              onView={() => setObservedCoin({ coin, values })}
            />
          </div>
        );
      })}
    </>
  );
}
