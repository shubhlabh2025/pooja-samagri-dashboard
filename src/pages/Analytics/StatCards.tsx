import { ShoppingBag, IndianRupee, TrendingUp } from "lucide-react";
import { formatINR, formatNumber } from "./utils";

interface Props {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

const StatCards = ({ totalOrders, totalRevenue, averageOrderValue }: Props) => {
  const items = [
    {
      label: "Orders Received",
      value: formatNumber(totalOrders),
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Sales",
      value: formatINR(totalRevenue),
      icon: IndianRupee,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Avg. Order Value",
      value: formatINR(averageOrderValue),
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {items.map((it) => (
        <div
          key={it.label}
          className="flex items-center gap-4 rounded-lg border bg-white p-5 shadow-sm"
        >
          <div className={`rounded-md p-3 ${it.bg}`}>
            <it.icon className={`h-6 w-6 ${it.color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500">{it.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{it.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;
