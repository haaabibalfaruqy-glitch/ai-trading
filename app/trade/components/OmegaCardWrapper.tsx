import { OmegaCard } from "@/components/OmegaCard";
import { Trend } from "./TrendCalculator";

interface Props {
  coin: any;
  idx: number;
  realSeries: number[] | null;
  liveData: number[][];
  N: number;
  search: string;
  systemMode: string;
  onView: () => void;
}

export default function OmegaCardWrapper({
  coin,
  idx,
  realSeries,
  liveData,
  N,
  search,
  systemMode,
  onView
}: Props) {
  const values = realSeries?.slice(-N) || liveData[idx];

  return (
    <OmegaCard
      coin={coin}
      values={values}
      search={search}
      systemMode={systemMode}
      onView={onView}
    />
  );
}
