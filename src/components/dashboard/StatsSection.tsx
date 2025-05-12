
import StatisticsTable from "@/components/StatisticsTable";
import GainsLossesCard from "./GainsLossesCard";
import TechnicalMetricsCard from "./TechnicalMetricsCard";

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <StatisticsTable />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GainsLossesCard />
        <TechnicalMetricsCard />
      </div>
    </div>
  );
}
