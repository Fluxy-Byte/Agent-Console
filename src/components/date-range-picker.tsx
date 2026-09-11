import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, type DateRange } from "@/components/calendar";
import { cn } from "@/lib/utils";

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(value.from ?? new Date());

  const label = value.from ? (value.to ? `${formatDate(value.from)} – ${formatDate(value.to)}` : formatDate(value.from)) : "Selecione";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("w-full justify-start gap-2 font-normal", !value.from && "text-muted-foreground", className)}
        >
          <CalendarIcon className="size-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <Calendar month={month} onMonthChange={setMonth} selected={value} onSelect={onChange} />
        {(value.from || value.to) && (
          <Button type="button" variant="ghost" size="sm" className="mt-2 w-full" onClick={() => onChange({})}>
            Limpar
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
