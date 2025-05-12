
import { useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import AssetSelector from "./AssetSelector";
import DateRangePicker from "./DateRangePicker";
import YearsBackSelector from "./YearsBackSelector";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { downloadCSV } from "@/services/api";

export default function Navbar() {
  const { asset, startDay, endDay } = useSeasonax();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCSV(asset, startDay, endDay);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="sticky top-0 z-10 border-b bg-white shadow-sm backdrop-blur-md">
      <div className="container mx-auto py-3 px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-seasonax-primary">
              Seasonax
            </h1>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <AssetSelector />
            <DateRangePicker />
            <YearsBackSelector />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
