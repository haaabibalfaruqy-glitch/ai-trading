interface Props {
  enabled: boolean;
}

export default function LiveProfitTable({ enabled }: Props) {
  if (!enabled) return null;

  return (
    <div className="w-full bg-[#0B0F18] border border-[#1F2937] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-white">
          Session Performance Snapshot
        </h3>

        <span className="text-[10px] px-2 py-1 rounded-full bg-green-500/10 text-green-400">
          Analysis Mode
        </span>
      </div>

      <p className="text-[11px] text-gray-400 mb-4">
        Displays simulated and session-based analytical outcomes for reference only
      </p>

      {/* Placeholder */}
      <div className="h-32 flex items-center justify-center text-gray-500 text-sm border border-dashed border-gray-700 rounded-lg">
        Performance data will appear during active analysis sessions
      </div>

      <p className="mt-3 text-[10px] text-gray-500 leading-relaxed">
        Figures shown are not live trading results, do not represent realized profit,
        and should not be interpreted as financial performance or guarantees.
      </p>
    </div>
  );
}
