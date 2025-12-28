import StrategyDetails from '@/components/StrategyDetails';

interface Props {
  params: { id: string };
}

export default function StrategyPage({ params }: Props) {
  return (
    <main className="container mx-auto px-6 py-10">
      <StrategyDetails id={params.id} />
    </main>
  );
}

