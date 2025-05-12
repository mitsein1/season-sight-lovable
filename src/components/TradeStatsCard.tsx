
import { useState, useEffect } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchTradeStats } from "@/services/api";
import { TradeStats } from "@/types";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

export default function TradeStatsCard() {
  const { asset, startDay, endDay, yearsBack, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<TradeStats | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchTradeStats(asset, startDay, endDay, yearsBack);
        // Fix the property names to match our TradeStats type
        const fixedResult: TradeStats = {
          total_trades: result.total_trades,
          winning_trades: result.wins || 0, // Map from API 'wins' to our 'winning_trades'
          losing_trades: result.losses || 0, // Map from API 'losses' to our 'losing_trades'
          win_pct: result.win_pct,
          loss_pct: result.loss_pct
        };
        setData(fixedResult);
      } catch (e) {
        console.error("Failed to fetch trade stats:", e);
        toast.error("Errore nel caricamento delle Trade Statistics");
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [asset, startDay, endDay, yearsBack, refreshCounter]);

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <CardTitle className="text-xl font-semibold text-slate-800 mb-4">Trade Statistics</CardTitle>
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : !data ? (
          <div className="flex justify-center py-8 text-slate-500">No data available</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-slate-500 text-sm mb-1">Total Trades</div>
              <div className="text-2xl font-bold">{data.total_trades}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-500 text-sm mb-1">Winning Trades</div>
              <div className="text-2xl font-bold text-seasonax-positive">{data.winning_trades}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-500 text-sm mb-1">Losing Trades</div>
              <div className="text-2xl font-bold text-seasonax-negative">{data.losing_trades}</div>
            </div>
            <div className="text-center">
              <div className="text-slate-500 text-sm mb-1">Win %</div>
              <div className={`text-2xl font-bold ${data.win_pct >= 0 ? "text-seasonax-positive" : "text-seasonax-negative"}`}>
                {data.win_pct.toFixed(2)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-500 text-sm mb-1">Loss %</div>
              <div className={`text-2xl font-bold ${data.loss_pct >= 0 ? "text-seasonax-positive" : "text-seasonax-negative"}`}>
                {data.loss_pct.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
