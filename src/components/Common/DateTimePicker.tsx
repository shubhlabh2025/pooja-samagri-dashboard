import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeProps {
  dateLabel?: string;
  timeLabel?: string;
  value?: string;
  error?: string;
  onChange?: (combinedLocalDateTime: string | undefined) => void;
}

export function DateTimePicker({
  dateLabel = "Date",
  timeLabel = "Time",
  value,
  error,
  onChange,
}: DateTimeProps) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : new Date()
  );

  const extractTime = (iso?: string) => {
    if (!iso) return getInitialTime(); // fallback to now
    const d = new Date(iso);
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getInitialTime = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
  };

  const [time, setTime] = React.useState<string>(extractTime(value));

  React.useEffect(() => {
    if (value) {
      const parsedDate = new Date(value);
      setDate(parsedDate);
      setTime(extractTime(value));
    }
  }, [value]);

  const emitCombinedDateTime = (d: Date | undefined, t: string) => {
    if (!d) {
      onChange?.(undefined);
      return;
    }

    const [hours, minutes] = t.split(":").map(Number);
    const combined = new Date(d);
    combined.setHours(hours || 0);
    combined.setMinutes(minutes || 0);
    combined.setSeconds(0);

    const isoString = combined.toISOString(); // "2025-06-22T08:58:00.000Z"
    onChange?.(isoString);
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setOpen(false);
    emitCombinedDateTime(selectedDate, time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    emitCombinedDateTime(date, newTime);
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="date-picker" className="px-1">
            {dateLabel}
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className="w-32 justify-between font-normal"
              >
                {date ? date.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                captionLayout="dropdown"
                onSelect={handleDateChange}
                disabled={(d) =>
                  d < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col gap-3">
          <Label htmlFor="time-picker" className="px-1">
            {timeLabel}
          </Label>
          <Input
            type="time"
            id="time-picker"
            step="60"
            value={time}
            onChange={handleTimeChange}
            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
