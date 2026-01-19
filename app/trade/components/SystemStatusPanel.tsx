// app/trade/components/SystemStatusPanel.tsx
import { Trend } from "./TrendCalculator";

interface Props {
  systemMode: "idle" | "active" | "maintenance";
  trend: Trend;
}

export default function SystemStatusPanel({ systemMode, trend }: Props) {
  return (
    <div className="status-panel p-3 bg-gray-700 text-white rounded-lg mb-4">
      <p>System Mode: {systemMode}</p>
      <p>Market Trend: {trend}</p>
    </div>
  );
}
