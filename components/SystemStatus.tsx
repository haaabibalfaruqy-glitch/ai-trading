interface Props {
  systemMode: string;
}

export default function SystemStatus({ systemMode }: Props) {
  return (
    <div className="bg-gray-800 p-3 rounded-xl">
      System Status: {systemMode}
    </div>
  );
}
