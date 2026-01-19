// app/trade/components/LiveProfitTableWrapper.tsx
interface Props {}

export default function LiveProfitTableWrapper(props: Props) {
  // dummy data
  const profits = [
    { user: "user123", profit: 500 },
    { user: "user456", profit: 1200 },
    { user: "user789", profit: 300 },
  ];

  return (
    <div className="live-profit-table mt-4 p-3 bg-gray-800 text-white rounded-lg">
      <h3 className="font-bold mb-2">Live Profit Table</h3>
      <ul>
        {profits.map((p, idx) => (
          <li key={idx}>
            {p.user}: ${p.profit}
          </li>
        ))}
      </ul>
    </div>
  );
}
