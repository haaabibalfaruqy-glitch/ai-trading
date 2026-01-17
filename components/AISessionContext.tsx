"use client";

export default function AISessionContext({
  level,
}: {
  level: "partial" | "full";
}) {
  return (
    <div
      className="
        mb-6
        rounded-2xl
        border
        bg-[#0B1220]
        px-5 py-4
        text-sm
        shadow-[inset_0_1px_0_#ffffff08]
        transition
        border-[#1F2937]
      "
    >
      <div className="flex items-center gap-2 mb-1">
        <span
          className={`w-2 h-2 rounded-full ${
            level === "full" ? "bg-[#22ff88]" : "bg-yellow-400"
          }`}
        />
        <span className="font-semibold text-white">
          AI Session Context
        </span>
      </div>

      <p className="text-gray-400 text-[12px] leading-relaxed">
        {level === "full"
          ? "Execution layer has full market context and capital calibration."
          : "Execution layer is running with limited market context. Some AI reasoning paths are inactive."}
      </p>

      {level === "partial" && (
        <div className="mt-3 text-[11px] text-gray-500">
          Most consistent users operate with full context enabled.
        </div>
      )}
    </div>
  );
}
