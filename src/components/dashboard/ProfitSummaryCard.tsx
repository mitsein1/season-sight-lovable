
import { useState, useEffect } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchProfitSummary } from "@/services/api";
import MetricsCard from "@/components/MetricsCard";
import { toast } from "sonner";

export default function ProfitSummaryCard() {
  const { asset, startDay, endDay, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const result = await fetchProfitSummary(asset, startDay, endDay);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch profit summary:", error);
        toast.error("Failed to load profit data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [asset, startDay, endDay, refreshCounter]);

  return (
    <MetricsCard
      title="Profit Summary"
      isLoading={loading}
      hasData={!!data}
      metrics={
        data
          ? [
              {
                label: "Total Profit",
                value: `${data.total_profit?.toFixed(2)}%`,
                valueType: data.total_profit >= 0 ? "positive" : "negative",
              },
              {
                label: "Average Profit",
                value: `${data.average_profit?.toFixed(2)}%`,
                valueType: data.average_profit >= 0 ? "positive" : "negative",
              },
            ]
          : []
      }
    />
  );
}
