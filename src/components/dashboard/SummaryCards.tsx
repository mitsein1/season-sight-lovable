import { useSeasonax } from "@/context/SeasonaxContext";
import { Card, CardContent } from "@/components/ui/card";
export default function SummaryCards() {
  const {
    asset
  } = useSeasonax();
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white shadow-sm">
        
      </Card>

      <Card className="bg-white shadow-sm">
        
      </Card>

      <Card className="bg-white shadow-sm">
        
      </Card>
    </div>;
}