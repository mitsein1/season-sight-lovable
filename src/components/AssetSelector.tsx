
import { useState } from "react";
import { useSeasonax } from "@/context/SeasonaxContext";
import { availableAssets } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";


export default function AssetSelector() {
  const { asset, setAsset, refreshData } = useSeasonax();
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    setAsset(value);
    setOpen(false);
    refreshData();
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="asset-select" className="seasonax-label whitespace-nowrap">
        Asset:
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            id="asset-select"
            className="w-[180px]"
            value={asset}
            onChange={(e) => {
              setAsset(e.target.value.toUpperCase());
            }}
            onFocus={() => setOpen(true)}
          />
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Cerca asset..." />
            <CommandList>
              <CommandEmpty>Nessun asset trovato.</CommandEmpty>
              <CommandGroup>
                {Array.isArray(availableAssets) && availableAssets.length > 0 ? (
                  availableAssets.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => handleSelect(option.value)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          asset === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))
                ) : (
                  <CommandItem>No assets available</CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
