
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface MetricRowProps {
  label: string;
  value: string | number;
  valueType?: "positive" | "negative" | "neutral";
}

interface MetricsCardProps {
  title: string;
  metrics: MetricRowProps[];
  isLoading?: boolean;
  hasData?: boolean;
}

const MetricRow = ({ label, value, valueType = "neutral" }: MetricRowProps) => {
  let valueClass = "neutral-value";
  if (valueType === "positive") valueClass = "positive-value";
  if (valueType === "negative") valueClass = "negative-value";

  return (
    <div className="flex justify-between items-center py-1.5 border-b border-dashed last:border-b-0">
      <span className="seasonax-label">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
};

export default function MetricsCard({
  title,
  metrics,
  isLoading = false,
  hasData = true,
}: MetricsCardProps) {
  return (
    <Card className="seasonax-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <div className="py-6 text-center">Loading...</div>}
        {!isLoading && !hasData && (
          <div className="py-6 text-center text-muted-foreground">
            No data available
          </div>
        )}
        {!isLoading && hasData && (
          <div className="space-y-1">
            {metrics.map((metric, index) => (
              <MetricRow
                key={index}
                label={metric.label}
                value={metric.value}
                valueType={metric.valueType}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
