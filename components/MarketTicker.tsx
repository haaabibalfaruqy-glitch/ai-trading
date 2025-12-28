"use client";

export default function MarketTicker() {
  const items = [
    { pair: "BTC/USDT", change: "+1.83%" },
    { pair: "ETH/USDT", change: "+0.95%" },
    { pair: "SOL/USDT", change: "+3.12%" },
    { pair: "BNB/USDT", change: "+0.41%" },
    { pair: "XRP/USDT", change: "+2.27%" },
    { pair: "ADA/USDT", change: "+1.01%" },
  ];

  return (
    <div className="py-6 border-y border-[rgba(255,255,255,0.05)] mt-8 overflow-hidden">
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {[...items, ...items].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="font-medium">{item.pair}</span>
              <span className="text-green-400 text-sm font-semibold">
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
