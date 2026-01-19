import LiveProfitTable from "@/components/LiveProfitTable";

export default function LiveProfitTableWrapper({ enabled }: { enabled: boolean }) {
  return <LiveProfitTable enabled={enabled} />;
}
