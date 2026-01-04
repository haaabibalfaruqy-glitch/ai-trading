interface Props {
  enabled: boolean;
}

export default function LiveProfitTable({ enabled }: Props) {
  if (!enabled) return null;

  return (
    <div className="w-full bg-gray-900 rounded-xl p-4">
      {/* Placeholder for live profit table */}
      Live Profit Table Placeholder
    </div>
  );
}
