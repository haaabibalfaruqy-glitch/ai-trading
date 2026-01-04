"use client";
import React from "react";

interface Props {
  data: any; // bisa diganti dengan tipe candle atau insight string
}

export default function OmegaCard({ data }: Props) {
  return (
    <div className="p-4 border rounded shadow">
      <h4 className="font-bold">{data?.symbol || "SYMBOL"}</h4>
      <p>{data?.insight || data?.price || "-"}</p>
    </div>
  );
}
