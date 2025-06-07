import React, { useState } from "react";
import userAvatar from "../../assets/user.png";
import { Link } from "react-router-dom";

interface OrderData {
  id: number;
  name: string;
  price: number;
  avatar: string;
  date: string;
  status: string;
}

const mockUsers: OrderData[] = [
  {
    id: 1,
    name: "Isabella Christensen",
    price: 249.99,
    avatar: "./user.png",
    date: "11 MAY 12:56",
    status: "pending",
  },
  {
    id: 2,
    name: "Mathilde Andersen",
    price: 149.5,
    avatar: "/avatars/male-1.png",
    date: "11 MAY 10:35",
    status: "completed",
  },
  {
    id: 3,
    name: "Karla Sorensen",
    price: 399.0,
    avatar: "/avatars/female-2.png",
    date: "9 MAY 17:38",
    status: "Payment Pending",
  },
  {
    id: 4,
    name: "Ida Jorgensen",
    price: 89.75,
    avatar: "/avatars/female-1.png",
    date: "19 MAY 12:56",
    status: "pending",
  },
  {
    id: 5,
    name: "Albert Andersen",
    price: 520.0,
    avatar: "/avatars/male-1.png",
    date: "21 JULY 12:56",
    status: "pending",
  },
];

const statusOptions = ["All", "pending", "completed", "Payment Pending"];

const OrderListSection: React.FC = () => {
  //   const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  //   const toggleStatus = (status: string) => {
  //     setSelectedStatuses((prev) =>
  //       prev.includes(status)
  //         ? prev.filter((s) => s !== status)
  //         : [...prev, status]
  //     );
  //   };

  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredOrders =
    statusFilter === "All"
      ? mockUsers
      : mockUsers.filter((order) => order.status === statusFilter);

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-semibold text-gray-800">Orders List</span>
          <div className="flex items-center gap-2">
            <label htmlFor="status" className="text-sm text-gray-600">
              Filter:
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="divide-y">
        {filteredOrders.map((user) => (
          <Link to="/OrderDetailSection" key={user.id}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3">
              <div className="flex items-center gap-4">
                <img
                  src={userAvatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {user.name}
                  </div>
                  <div className="text-xs text-black-500 truncate max-w-[200px]">
                    {user.date}
                  </div>
                  <span className="bg-black text-xs px-2 py-0.5 rounded font-semibold text-white">
                    {user.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                <div className="text-sm text-black-500 font-semibold">
                  Rs. {user.price.toFixed(2)}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderListSection;
