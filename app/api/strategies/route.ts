import { NextResponse } from 'next/server';

export async function GET() {
  const strategies = [
    { id: '1', name: 'BTC/USD', description: 'Bitcoin trading', return: 27850 },
    { id: '2', name: 'ETH/USD', description: 'Ethereum trading', return: 1845 },
    { id: '3', name: 'BNB/USD', description: 'Binance Coin trading', return: 305 },
    { id: '4', name: 'ADA/USD', description: 'Cardano trading', return: 0.45 },
    { id: '5', name: 'SOL/USD', description: 'Solana trading', return: 25.8 },
  ];

  return NextResponse.json(strategies);
}
