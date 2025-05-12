
import PriceChart from "@/components/PriceChart";
import CumulativeProfitChart from "@/components/CumulativeProfitChart";

export default function MainCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-3">
        <PriceChart />
      </div>
    </div>
  );
}
