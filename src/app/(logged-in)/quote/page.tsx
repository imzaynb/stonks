"use client";

import { Stock, alphaVantageTimeSeriesDaily, findNameByTicker } from "@/lib/stocks";
import { USDollar, getCurrentDateInNY } from "@/lib/utils";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";

export default function QuotePage() {
  const today = getCurrentDateInNY();

  const [showStock, setShowStock] = useState<boolean>(false);
  const [stock, setStock] = useState<Stock | null>(null);
  const [ticker, setTicker] = useState<string>("");

  useEffect(() => {
    setShowStock(false);
  }, []);

  const handleSubmit = async () => {
    const stockOHLCV = await alphaVantageTimeSeriesDaily(ticker, "compact", today);
    const stockName = await findNameByTicker(ticker);

    if (stockOHLCV) {
      const createdStock: Stock = {
        ohlcv: stockOHLCV,
        name: stockName,
        ticker: ticker
      }

      setStock(createdStock);
      setShowStock(true);
    }
  }

  return (
    <main className="container">
      {showStock && stock ? (
        <div className="flex justify-center mt-6">One share of {stock.name} ({stock.ticker}) is worth {USDollar.format(stock.ohlcv.close)}.</div>
      ) : (
        <div className="mx-auto w-[min-content] space-y-4 mt-6">
          <Label>Query stock price.</Label>
          <Input placeholder="IBM" className="w-50" onChange={(e) => setTicker(e.target.value)} />
          <Button onClick={handleSubmit}> Submit Stock</Button>
        </div>
      )}
    </main>
  )
}