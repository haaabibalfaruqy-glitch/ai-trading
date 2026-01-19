import dynamic from "next/dynamic";

const LiveProfitTableComponent = dynamic(
  () => import("./LiveProfitTable"),
  {
    loading: () => (
      <div className="w-full bg-[#0B0F18] border border-[#1F2937] rounded-xl p-4">
        <div className="h-32 flex items-center justify-center text-gray-500">
          Loading profit table...
        </div>
      </div>
    ),
    ssr: true,
  }
);

export default LiveProfitTableComponent;
