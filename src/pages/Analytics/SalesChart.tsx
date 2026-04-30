import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import type { SalesSeriesPoint } from "@/api/analyticsApi";
import { formatINR, formatShortDate, formatNumber } from "./utils";

interface Props {
  data: SalesSeriesPoint[];
  metric: "orders" | "revenue";
}

const SalesChart = ({ data, metric }: Props) => {
  const isRevenue = metric === "revenue";
  const color = isRevenue ? "#16a34a" : "#2563eb";
  const gradientId = isRevenue ? "revenueGradient" : "ordersGradient";

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {isRevenue ? "Total Sales" : "Orders Received"}
        </h3>
        <span className="text-xs text-gray-400">
          {isRevenue ? "₹ per day" : "orders per day"}
        </span>
      </div>

      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center text-sm text-gray-400">
          No data for selected range
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis
              dataKey="date"
              tickFormatter={formatShortDate}
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis
              tickFormatter={(v) =>
                isRevenue
                  ? `₹${(Number(v) / 1000).toFixed(0)}k`
                  : formatNumber(Number(v))
              }
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              allowDecimals={false}
            />
            <Tooltip
              labelFormatter={(label) =>
                typeof label === "string" ? formatShortDate(label) : String(label)
              }
              formatter={(value) => {
                const n = Number(value);
                return isRevenue ? formatINR(n) : formatNumber(n);
              }}
              contentStyle={{ borderRadius: 8, fontSize: 13 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Area
              type="monotone"
              dataKey={metric}
              name={isRevenue ? "Revenue" : "Orders"}
              stroke={color}
              fill={`url(#${gradientId})`}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default SalesChart;
