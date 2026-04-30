import { useState } from "react";
import { daysAgo, toIsoDate } from "./utils";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;
}

interface Props {
  value: DateRange;
  onChange: (next: DateRange) => void;
}

const presets: { label: string; days: number }[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 90 days", days: 90 },
  { label: "This year", days: 365 },
];

const DateRangePicker = ({ value, onChange }: Props) => {
  const [activePreset, setActivePreset] = useState<number | null>(30);

  const applyPreset = (days: number) => {
    setActivePreset(days);
    onChange({
      from: toIsoDate(daysAgo(days)),
      to: toIsoDate(new Date()),
    });
  };

  const handleManual = (key: keyof DateRange) => (v: string) => {
    setActivePreset(null);
    onChange({ ...value, [key]: v });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.days}
            onClick={() => applyPreset(p.days)}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              activePreset === p.days
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500">From</label>
          <input
            type="date"
            value={value.from}
            max={value.to}
            onChange={(e) => handleManual("from")(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-500">To</label>
          <input
            type="date"
            value={value.to}
            min={value.from}
            max={toIsoDate(new Date())}
            onChange={(e) => handleManual("to")(e.target.value)}
            className="rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>
    </div>
  );
};

export default DateRangePicker;
