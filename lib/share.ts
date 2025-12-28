export function buildShareText({
  insight,
  symbol,
}: {
  insight: string;
  symbol: string;
}) {
  return `🤖 ${symbol} AI Insight:\n${insight}`;
}

