
import { useState, useEffect } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { format, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DateRangePicker() {
  const { startDay, endDay, setDateRange, refreshData } = useSeasonax();
  
  // Parse MM-DD format to Date objects
  const parseDate = (dateStr: string): Date => {
    const currentYear = new Date().getFullYear();
    return parse(`${currentYear}-${dateStr}`, 'yyyy-MM-dd', new Date());
  };

  const [startDate, setStartDate] = useState<Date>(parseDate(startDay));
  const [endDate, setEndDate] = useState<Date>(parseDate(endDay));
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Validate date range
  const validateDateRange = () => {
    // Get day of year for both dates (ignoring year)
    const startMonth = startDate.getMonth();
    const startDayOfMonth = startDate.getDate();
    const endMonth = endDate.getMonth();
    const endDayOfMonth = endDate.getDate();
    
    if (startMonth > endMonth || (startMonth === endMonth && startDayOfMonth > endDayOfMonth)) {
      setError("La data di inizio deve essere prima della data di fine");
      return false;
    }
    
    setError(null);
    return true;
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!selectingEnd) {
      setStartDate(date);
      setSelectingEnd(true);
    } else {
      setEndDate(date);
      setSelectingEnd(false);
      setShowCalendar(false);
    }
  };
  
  // Update the context when dates change
  useEffect(() => {
    if (validateDateRange()) {
      const formattedStart = format(startDate, 'MM-dd');
      const formattedEnd = format(endDate, 'MM-dd');
      setDateRange(formattedStart, formattedEnd);
      refreshData();
    }
  }, [startDate, endDate, setDateRange, refreshData]);
  
  return (
    <div className="flex items-center gap-2">
      <span className="seasonax-label">Periodo:</span>
      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              error && "border-red-500"
            )}
            onClick={() => {
              setShowCalendar(true);
              setSelectingEnd(false);
            }}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>
              {format(startDate, 'dd MMM')} - {format(endDate, 'dd MMM')}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectingEnd ? endDate : startDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Disable year selection, only allow selecting month and day
              return false;
            }}
            initialFocus
            className="p-3 pointer-events-auto"
            footer={
              <div className="px-4 pt-0 pb-3 text-center">
                <p className="text-sm text-muted-foreground">
                  {selectingEnd ? "Seleziona data di fine" : "Seleziona data di inizio"}
                </p>
              </div>
            }
          />
        </PopoverContent>
      </Popover>
      
      {error && (
        <Alert variant="destructive" className="mt-2 py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
