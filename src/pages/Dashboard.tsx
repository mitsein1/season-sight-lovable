
import Navbar from "@/components/Navbar";
import MainCharts from "@/components/dashboard/MainCharts";
import PatternCharts from "@/components/dashboard/PatternCharts";
import SeasonalitySection from "@/components/dashboard/SeasonalitySection";
import StatsSection from "@/components/dashboard/StatsSection";
import TradeStatsCard from "@/components/TradeStatsCard";
import SummaryCards from "@/components/dashboard/SummaryCards";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <MainCharts />
        </div>
        <div className="mb-6">
          <SummaryCards />
        </div>
        <div className="mb-6">
          <PatternCharts />
        </div>
        <div className="mb-6">
          <TradeStatsCard />
        </div>
        <div className="mb-6">
          <SeasonalitySection />
        </div>
        <div className="mb-6">
          <StatsSection />
        </div>
      </div>
    </div>
  );
}
