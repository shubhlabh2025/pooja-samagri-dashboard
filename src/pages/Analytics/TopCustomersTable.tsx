import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { TopCustomer } from "@/api/analyticsApi";
import { formatINR, formatNumber } from "./utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface Props {
  customers: TopCustomer[];
  isLoading: boolean;
}

type SortKey = "total_spent" | "order_count" | "name";

const TopCustomersTable = ({ customers, isLoading }: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>("total_spent");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const arr = [...customers];
    arr.sort((a, b) => {
      let av: number | string;
      let bv: number | string;
      if (sortKey === "name") {
        av = `${a.first_name || ""} ${a.last_name || ""}`.trim().toLowerCase();
        bv = `${b.first_name || ""} ${b.last_name || ""}`.trim().toLowerCase();
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [customers, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return null;
    return sortDir === "asc" ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  return (
    <div className="rounded-lg border bg-white shadow-sm">
      <div className="border-b px-5 py-4">
        <h3 className="text-base font-semibold text-gray-800">Top Customers</h3>
        <p className="text-xs text-gray-500">
          Customers who spent the most in the selected date range
        </p>
      </div>

      {isLoading ? (
        <div className="p-8 text-center text-sm text-gray-400">Loading…</div>
      ) : customers.length === 0 ? (
        <div className="p-8 text-center text-sm text-gray-400">
          No customer activity in this range.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-3 w-10">#</th>
                <th
                  className="cursor-pointer px-5 py-3 select-none"
                  onClick={() => toggleSort("name")}
                >
                  Customer <SortIcon k="name" />
                </th>
                <th className="px-5 py-3">Phone</th>
                <th
                  className="cursor-pointer px-5 py-3 text-right select-none"
                  onClick={() => toggleSort("order_count")}
                >
                  Orders <SortIcon k="order_count" />
                </th>
                <th
                  className="cursor-pointer px-5 py-3 text-right select-none"
                  onClick={() => toggleSort("total_spent")}
                >
                  Total Spent <SortIcon k="total_spent" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((c, idx) => {
                const phoneStripped = c.phone_number.replace("+91", "");
                const name =
                  [c.first_name, c.last_name].filter(Boolean).join(" ") ||
                  "Unnamed";
                return (
                  <tr key={c.user_id} className="hover:bg-blue-50/40">
                    <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <Link
                        to={`/customerDetails/${phoneStripped}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {name}
                      </Link>
                      {c.email && (
                        <div className="text-xs text-gray-500">{c.email}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {c.phone_number}
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums">
                      {formatNumber(c.order_count)}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold tabular-nums text-gray-900">
                      {formatINR(c.total_spent)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopCustomersTable;
