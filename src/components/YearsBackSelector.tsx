
import { useSeasonax } from "@/context/SeasonaxContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function YearsBackSelector() {
  const { yearsBack, setYearsBack, refreshData } = useSeasonax();

  const handleChange = (value: string) => {
    setYearsBack(Number(value));
    refreshData();
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="years-back-select" className="seasonax-label whitespace-nowrap">
        Years back:
      </label>
      <Select value={yearsBack.toString()} onValueChange={handleChange}>
        <SelectTrigger id="years-back-select" className="w-[100px]">
          <SelectValue placeholder="Years" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="3">3 years</SelectItem>
          <SelectItem value="5">5 years</SelectItem>
          <SelectItem value="10">10 years</SelectItem>
          <SelectItem value="15">15 years</SelectItem>
          <SelectItem value="20">20 years</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
