
import { useEffect, useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchCumulativeProfit, CumulativeProfitItem } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { toast } from "sonner";

interface ChartPoint {
  year: number;
  cumulative: number;
}

export default function CumulativeProfitChart() {
  const { asset, startDay, endDay, yearsBack, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CumulativeProfitItem[] | null>(null);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchCumulativeProfit(asset, startDay, endDay);
        setData(result);

        // 1) Ordina per anno
        const sorted = [...result].sort((a, b) => a.year - b.year);

        // 2) Calcola cumulato
        let cum = 0;
        const cumulPoints: ChartPoint[] = sorted.map(({ year, cumulative_profit }) => {
          cum += cumulative_profit;              // accumulo
          return { year, cumulative: parseFloat(cum.toFixed(2)) };
        });

        // 3) Filtra gli ultimi `yearsBack` anni
        const currentYear = new Date().getFullYear();
        const filtered = cumulPoints.filter(pt => pt.year >= currentYear - yearsBack + 1);

        setChartData(filtered);
      } catch (error) {
        console.error("Failed to fetch cumulative profit:", error);
        toast.error("Failed to load cumulative profit data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [asset, startDay, endDay, yearsBack, refreshCounter]);

  const formatYAxis = (value: number) => `${value.toFixed(2)}%`;
  const formatTooltip = (value: number) => [`${value.toFixed(2)}%`, "Cumulative"];

  return (
    <Card className="bg-white shadow-sm h-full">
      <CardHeader className="pb-2 pt-4 px-6">
        <CardTitle className="text-lg font-semibold text-slate-800">
          Cumulative Profit ({startDay} – {endDay})
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        {loading && <div className="flex justify-center items-center h-64">Loading...</div>}
        {!loading && (!data || data.length === 0) && (
          <div className="flex justify-center items-center h-64 text-slate-500">No data available</div>
        )}
        {!loading && data?.length > 0 && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="year"
                  tick={{ fontSize: 12 }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis
                  dataKey="cumulative"
                  tickFormatter={formatYAxis}
                  width={60}
                  tick={{ fontSize: 12 }}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  formatter={formatTooltip}
                  labelFormatter={(year) => `Year: ${year}`}
                />
                <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                <Line
                  type="monotone"
                  dataKey="cumulative"
                  stroke="#3584e4"
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  strokeWidth={2}
                  animationDuration={1000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
