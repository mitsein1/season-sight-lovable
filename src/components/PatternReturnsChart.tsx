
import { useEffect, useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchPatternReturns } from "@/services/api";
import { PatternReturnItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine
} from "recharts";
import { toast } from "sonner";

export default function PatternReturnsChart() {
  const { asset, startDay, endDay, yearsBack, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<PatternReturnItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchPatternReturns(asset, startDay, endDay);
        // filtra per yearsBack
        const currentYear = new Date().getFullYear();
        setChartData(
          data.filter(item => item.year >= currentYear - yearsBack)
        );
      } catch (e) {
        console.error(e);
        toast.error("Failed to load pattern returns");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [asset, startDay, endDay, yearsBack, refreshCounter]);

  const fmtAxis = (v: number) => `${v.toFixed(2)}%`;
  const fmtTip = (v: number) => [`${v.toFixed(2)}%`, "Return"];

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2 pt-4 px-6">
        <CardTitle className="text-lg font-semibold text-slate-800">Pattern Returns ({startDay}–{endDay})</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading && <div className="h-64 flex justify-center items-center">Loading…</div>}
        {!loading && chartData.length === 0 && <div className="h-64 flex justify-center items-center text-slate-500">No data</div>}
        {!loading && chartData.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={fmtAxis} width={60} tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
                <Tooltip formatter={fmtTip} labelFormatter={y => `Year: ${y}`} />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                <Bar dataKey="return" radius={[4, 4, 0, 0]}>
                  {chartData.map((e, i) =>
                    <Cell key={i} fill={e.return >= 0 ? "#2ec27e" : "#e01b24"} />
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
