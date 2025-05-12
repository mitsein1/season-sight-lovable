
import { useEffect, useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { fetchPatternStatistics, YearlyStatistic } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

export default function StatisticsTable() {
  const { asset, startDay, endDay, yearsBack, refreshCounter } = useSeasonax();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<YearlyStatistic[] | null>(null);
  const [filteredData, setFilteredData] = useState<YearlyStatistic[] | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Use startDay and endDay directly as MM-DD strings
        console.log(`Fetching pattern statistics with: asset=${asset}, startDay=${startDay}, endDay=${endDay}`);
        
        const result = await fetchPatternStatistics(asset, startDay, endDay);
        setData(result);
      } catch (error) {
        console.error("Failed to fetch pattern statistics:", error);
        toast.error("Failed to load statistical data");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [asset, startDay, endDay, refreshCounter]);

  // Filter data based on yearsBack
  useEffect(() => {
    if (!data) {
      setFilteredData(null);
      return;
    }

    const currentYear = new Date().getFullYear();
    const filteredByYears = data.filter(item => {
      return item.year >= (currentYear - yearsBack);
    });

    setFilteredData(filteredByYears);
  }, [data, yearsBack]);

  return (
    <Card className="seasonax-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Yearly Statistics ({startDay} - {endDay}) - Last {yearsBack} years
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && <div className="flex justify-center items-center h-64">Loading...</div>}
        {!loading && (!filteredData || filteredData.length === 0) && (
          <div className="flex justify-center items-center h-64">
            No data available
          </div>
        )}
        {!loading && filteredData && filteredData.length > 0 && (
          <div className="overflow-auto max-h-96">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead className="w-16">Year</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead className="text-right">Start Price</TableHead>
                  <TableHead className="text-right">End Price</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                  <TableHead className="text-right">Profit %</TableHead>
                  <TableHead className="text-right">Max Rise</TableHead>
                  <TableHead className="text-right">Max Drop</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row) => (
                  <TableRow key={row.year}>
                    <TableCell className="font-medium">{row.year}</TableCell>
                    <TableCell>{row.start_date || "N/A"}</TableCell>
                    <TableCell>{row.end_date || "N/A"}</TableCell>
                    <TableCell className="text-right">
                      {row.start_price !== undefined ? row.start_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.end_price !== undefined ? row.end_price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {row.profit !== undefined ? row.profit.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }) : "N/A"}
                    </TableCell>
                    <TableCell className={`text-right ${row.profit_percentage !== undefined ? (row.profit_percentage >= 0 ? 'text-green-600' : 'text-red-600') : ''}`}>
                      {row.profit_percentage !== undefined ? `${row.profit_percentage.toFixed(2)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {row.max_rise !== undefined ? `${row.max_rise.toFixed(2)}%` : "N/A"}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {row.max_drop !== undefined ? `${row.max_drop.toFixed(2)}%` : "N/A"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
