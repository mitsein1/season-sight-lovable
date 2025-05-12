
import PatternReturnsChart from "@/components/PatternReturnsChart";
import CumulativeProfitChart from "@/components/CumulativeProfitChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function PatternCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <CumulativeProfitChart />
      </div>
      <div>
        <PatternReturnsChart />
      </div>
    </div>
  );
}
