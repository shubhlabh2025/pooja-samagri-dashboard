import React from "react";

import userAvatar from "../../assets/user.png";
import { Link } from "react-router";

interface OrderData {
  id: number;
  name: string;
  price: number;
  avatar: string;
  date: string;
}

const mockUsers: OrderData[] = [
  {
    id: 1,
    name: "Isabella Christensen",
    price: 249.99,
    avatar: "./user.png",
    date: "11 MAY 12:56",
  },
  {
    id: 2,
    name: "Mathilde Andersen",
    price: 149.5,
    avatar: "/avatars/male-1.png",
    date: "11 MAY 10:35",
  },
  {
    id: 3,
    name: "Karla Sorensen",
    price: 399.0,
    avatar: "/avatars/female-2.png",
    date: "9 MAY 17:38",
  },
  {
    id: 4,
    name: "Ida Jorgensen",
    price: 89.75,
    avatar: "/avatars/female-1.png",
    date: "19 MAY 12:56",
  },
  {
    id: 5,
    name: "Albert Andersen",
    price: 520.0,
    avatar: "/avatars/male-1.png",
    date: "21 JULY 12:56",
  },
];

const OrderAcceptReject: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex items-center justify-between">
        <span className="font-semibold text-gray-800">Accept/Reject Orders</span>
        <span className="text-sm text-blue-600 hover:underline cursor-pointer">
          View All
        </span>
      </div>
      <div className="divide-y">
        {mockUsers.map((user) => (
          <Link to="/OrderDetailSection">
            <div
              key={user.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3"
            >
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
                </div>
              </div>

              <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                <div className="text-sm text-black-500 font-semibold">
                  Rs. {user.price.toFixed(2)}
                </div>
                <div className="flex gap-2">
                  <button className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-full shadow hover:shadow-md">
                    Reject
                  </button>
                  <button className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-full shadow hover:shadow-md">
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrderAcceptReject;
