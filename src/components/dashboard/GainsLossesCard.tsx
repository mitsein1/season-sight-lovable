
import { useState, useEffect } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchGainsLosses } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function GainsLossesCard() {
  const { asset, startDay, endDay, yearsBack, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    gains: number;
    losses: number;
    gain_pct: number;
    loss_pct: number;
    max_gain: number;
    max_loss: number;
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchGainsLosses(asset, startDay, endDay, yearsBack);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch gains/losses:", error);
        toast.error("Failed to load gains/losses data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [asset, startDay, endDay, yearsBack, refreshCounter]);

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2 pt-4 px-6">
        <CardTitle className="text-lg font-semibold text-slate-800">Gains / Losses</CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {loading ? (
          <div className="flex justify-center py-8">Loading...</div>
        ) : !data ? (
          <div className="flex justify-center py-8 text-slate-500">No data available</div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-slate-800">Gains</h3>
              <div className="text-3xl font-bold text-seasonax-positive mt-2">{data.gains}</div>
              <div className="text-sm text-slate-500">Gains</div>
              <div className="mt-4">
                <div className="text-base font-semibold text-seasonax-positive">+{data.gain_pct.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">Average Gain</div>
              </div>
              <div className="mt-2">
                <div className="text-base font-semibold text-seasonax-positive">+{data.max_gain.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">Max Gain</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-slate-800">Losses</h3>
              <div className="text-3xl font-bold text-seasonax-negative mt-2">{data.losses}</div>
              <div className="text-sm text-slate-500">Losses</div>
              <div className="mt-4">
                <div className="text-base font-semibold text-seasonax-negative">{data.loss_pct.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">Average Loss</div>
              </div>
              <div className="mt-2">
                <div className="text-base font-semibold text-seasonax-negative">{data.max_loss.toFixed(2)}%</div>
                <div className="text-xs text-slate-500">Max Loss</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
