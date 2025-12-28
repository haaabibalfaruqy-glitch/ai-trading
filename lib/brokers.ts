export type BrokerKey = "binance" | "bybit" | "okx";

export const BROKERS: Record<BrokerKey, {
  name: string;
  affiliateUrl: string;
  cooldownHours: number;
  cooldownKey: string;
}> = {

binance: {
  name: "Binance",
  affiliateUrl: "...",
  cooldownHours: 24,
  cooldownKey: "binance_last_redirect",
},

  bybit: {
    name: "Bybit",
    affiliateUrl: "https://www.bybit.com/invite?ref=YYYY",
    cooldownHours: 24,
  cooldownKey: "bybit_last_redirect",
},
  okx: {
    name: "OKX",
    affiliateUrl: "https://www.okx.com/join/ZZZZ",
    cooldownHours: 24,
  cooldownKey: "okx_last_redirect",
},
};
