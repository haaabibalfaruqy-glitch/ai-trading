interface Props {
  label: string;
  value: string | number;
  live?: boolean;
  icon?: string;
  dot?: boolean;
}

export default function StatItem({ label, value, live, icon, dot }: Props) {
  return (
    <div className="flex items-center gap-1">
      {icon && <span>{icon}</span>}
      {dot && <span className="w-2 h-2 bg-green-500 rounded-full" />}
      <span>{label}: {value}</span>
      {live && <span className="ml-1 text-green-400 animate-pulse">●</span>}
    </div>
  );
}
