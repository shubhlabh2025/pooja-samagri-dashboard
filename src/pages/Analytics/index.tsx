import { useEffect, useState } from "react";
import axiosClient from "@/api/apiClient";
import {
  createAnalyticsApi,
  type SalesSummary,
  type TopCustomer,
} from "@/api/analyticsApi";
import DateRangePicker, { type DateRange } from "./DateRangePicker";
import StatCards from "./StatCards";
import SalesChart from "./SalesChart";
import TopCustomersTable from "./TopCustomersTable";
import { daysAgo, toIsoDate } from "./utils";
import { AlertCircle } from "lucide-react";

const analyticsApi = createAnalyticsApi(axiosClient);

const initialRange: DateRange = {
  from: toIsoDate(daysAgo(30)),
  to: toIsoDate(new Date()),
};

const AnalyticsPage = () => {
  const [range, setRange] = useState<DateRange>(initialRange);

  const [summary, setSummary] = useState<SalesSummary | null>(null);
  const [customers, setCustomers] = useState<TopCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      analyticsApi.getSalesSummary(range),
      analyticsApi.getTopCustomers({ ...range, limit: 50 }),
    ])
      .then(([summaryRes, customersRes]) => {
        if (cancelled) return;
        setSummary(summaryRes.data.data);
        setCustomers(customersRes.data.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load analytics"
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [range]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-2xl font-semibold text-gray-800">
          Sales Analytics
        </h2>
        <p className="text-sm text-gray-500">
          Track orders, revenue, and top customers over a date range.
        </p>
      </div>

      <DateRangePicker value={range} onChange={setRange} />

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <StatCards
        totalOrders={summary?.totalOrders || 0}
        totalRevenue={summary?.totalRevenue || 0}
        averageOrderValue={summary?.averageOrderValue || 0}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <SalesChart data={summary?.series || []} metric="orders" />
        <SalesChart data={summary?.series || []} metric="revenue" />
      </div>

      <TopCustomersTable customers={customers} isLoading={isLoading} />
    </div>
  );
};

export default AnalyticsPage;
