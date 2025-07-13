import { useEffect, useState, type FC } from "react";
import { TrendingUp, ShoppingCart, SquareX } from "lucide-react";
import OrderAcceptReject from "@/components/Order/OrderAcceptReject";
import OrderListSection from "@/components/Order/OrderListSection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import type { Order } from "@/interfaces/orders";
import { fetchOrders } from "@/slices/orderSlice";
import type { ApiResponse } from "@/interfaces/api-response";

const TABS = [
  {
    key: "pending",
    title: "Pending",
    icon: <ShoppingCart className="text-blue-600" />,
  },
  {
    key: "in_progress",
    title: "In-Progress",
    icon: <ShoppingCart className="text-green-600" />,
  },
  {
    key: "completed",
    title: "Completed",
    icon: <TrendingUp className="text-indigo-600" />,
  },
  {
    key: "rejected",
    title: "Rejected/Refunded",
    icon: <SquareX className="text-red-600" />,
  },
] as const;
type TabKey = "pending" | "in_progress" | "completed" | "rejected";

const DashboardPage: FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabKey>("pending");

  const [states, setStates] = useState({
    pending: {
      page: 1,
      query: "",
      data: undefined as ApiResponse<Order[]> | undefined,
    },
    in_progress: { page: 1, query: "", data: undefined },
    completed: { page: 1, query: "", data: undefined },
    rejected: { page: 1, query: "", data: undefined },
  });

  const fetchTabData = async (tabKey: keyof typeof states) => {
    const statusMap = {
      pending: "pending",
      in_progress: "accepted,processing,packed,shipped,out_for_delivery",
      completed: "delivered",
      rejected: "cancelled,rejected,refunded,returned",
    };

    const { page, query } = states[tabKey];
    const params = {
      status: statusMap[tabKey],
      page,
      pageSize: 2,
      order_number: query,
    };
    try {
      const result = await dispatch(fetchOrders(params)).unwrap();
      setStates((prev) => ({
        ...prev,
        [tabKey]: { ...prev[tabKey], data: result },
      }));
    } catch (error) {
      console.error(`${tabKey} orders failed`, error);
    }
  };

  useEffect(() => {
    fetchTabData(activeTab as keyof typeof states);
  }, [activeTab, states[activeTab].page, states[activeTab].query]);

  const current = states[activeTab as keyof typeof states];
  const commonProps = {
    orders: current.data?.data || [],
    pagination: current.data?.meta,
    currentPage: current.page,
    onPageChange: (page: number) =>
      setStates((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], page },
      })),
    searchQuery: current.query,
    onSearchChange: (query: string) =>
      setStates((prev) => ({
        ...prev,
        [activeTab]: { ...prev[activeTab], query, page: 1 },
      })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
        <p className="text-sm text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TABS.map((tab) => (
          <Card
            key={tab.key}
            title={tab.title}
            icon={tab.icon}
            isActive={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          />
        ))}
      </div>

      {activeTab === "pending" ? (
        <OrderAcceptReject {...commonProps} />
      ) : (
        <OrderListSection {...commonProps} />
      )}
    </div>
  );
};

const Card = ({
  title,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className={`cursor-pointer bg-white border rounded-lg p-4 shadow-sm flex items-center gap-4 transition-all ${
      isActive ? "border-blue-600 ring-2 ring-blue-100" : "border-gray-100"
    }`}
  >
    <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-m text-black">{title}</p>
    </div>
  </div>
);

export default DashboardPage;
