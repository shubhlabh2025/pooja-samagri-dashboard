import type { FC } from "react";
import { TrendingUp, ShoppingCart, SquareX } from "lucide-react";
import OrderAcceptReject from "@/components/Order/OrderAcceptReject";
import OrderListSection from "@/components/Order/OrderListSection";

const DashboardPage: FC = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800">Orders</h2>
        <p className="text-sm text-gray-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Orders"
          value="4,320"
          icon={<ShoppingCart className="text-blue-600" />}
        />
        <Card
          title="Completed Orders"
          value="2,209"
          icon={<ShoppingCart className="text-green-600" />}
        />
        <Card
          title="In-Progress orders"
          value="1,119"
          icon={<TrendingUp className="text-indigo-600" />}
        />
        <Card
          title="Rejected Orders"
          value="10"
          icon={<SquareX className="text-red-600" />}
        />
      </div>

      {/* Charts Section */}
      <OrderAcceptReject></OrderAcceptReject>
      <OrderListSection></OrderListSection>
    </div>
  );
};

export default DashboardPage;

// Internal Card component
const Card = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm flex items-center gap-4">
    <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);
