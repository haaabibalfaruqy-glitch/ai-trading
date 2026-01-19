import { SystemMode } from "@/lib/types";

interface Props {
  systemMode: SystemMode;
}

export default function SystemStatusPanel({ systemMode }: Props) {
  return <SystemStatus systemMode={systemMode} />;
}
