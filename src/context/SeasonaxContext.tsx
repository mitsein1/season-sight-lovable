
import { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";

interface SeasonaxContextType {
  asset: string;
  setAsset: (asset: string) => void;
  startDay: string;
  endDay: string;
  setDateRange: (start: string, end: string) => void;
  year: number;
  setYear: (year: number) => void;
  yearsBack: number;
  setYearsBack: (years: number) => void;
  refreshData: () => void;
  refreshCounter: number;
}

const SeasonaxContext = createContext<SeasonaxContextType | undefined>(undefined);

export function SeasonaxProvider({ children }: { children: ReactNode }) {
  const [asset, setAsset] = useState("AAPL");
  const [startDay, setStartDay] = useState("01-01"); // MM-DD format (January 1st)
  const [endDay, setEndDay] = useState("12-31"); // MM-DD format (December 31st)
  const [year, setYear] = useState(new Date().getFullYear());
  const [yearsBack, setYearsBack] = useState(10);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const setDateRange = useCallback((start: string, end: string) => {
    setStartDay(start);
    setEndDay(end);
  }, []);

  const refreshData = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  const value = useMemo(() => ({
    asset,
    setAsset,
    startDay,
    endDay,
    setDateRange,
    year,
    setYear,
    yearsBack,
    setYearsBack,
    refreshData,
    refreshCounter,
  }), [asset, startDay, endDay, year, yearsBack, refreshCounter, setDateRange, refreshData]);

  return (
    <SeasonaxContext.Provider value={value}>
      {children}
    </SeasonaxContext.Provider>
  );
}

export function useSeasonax() {
  const context = useContext(SeasonaxContext);
  if (context === undefined) {
    throw new Error("useSeasonax must be used within a SeasonaxProvider");
  }
  return context;
}
