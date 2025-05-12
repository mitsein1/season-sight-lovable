
import { useEffect, useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchPriceSeries, PriceSeries } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PriceChart() {
  const { asset, year, setYear, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PriceSeries | null>(null);
  const [chartData, setChartData] = useState<{ date: string; price: number }[]>([]);
  const [yearOptions, setYearOptions] = useState<number[]>([]);

  // Generate year options from 2000 to current year
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
    setYearOptions(years);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchPriceSeries(asset, year);
        setData(result);
        
        // Transform data for chart
        const formattedData = result.dates.map((date, index) => ({
          date: date,
          price: result.prices[index],
        }));
        setChartData(formattedData);
      } catch (error) {
        console.error("Failed to fetch price series:", error);
        toast.error("Failed to load price data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [asset, year, refreshCounter]);

  const formatYAxis = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  };

  const formatTooltip = (value: number) => {
    return [value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }), 'Price'];
  };

  const handleYearChange = (value: string) => {
    setYear(Number(value));
  };

  return (
    <Card className="seasonax-card h-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">
            Price History - {asset}
          </CardTitle>
          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Anno" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((yearOption) => (
                <SelectItem key={yearOption} value={yearOption.toString()}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading && <div className="flex justify-center items-center h-64">Loading...</div>}
        {!loading && !data && <div className="flex justify-center items-center h-64">No data available</div>}
        {!loading && data && (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    // Display abbreviated months
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short' });
                  }}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  width={60}
                  tick={{ fontSize: 12 }}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={formatTooltip}
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#1a5fb4" 
                  dot={false} 
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
