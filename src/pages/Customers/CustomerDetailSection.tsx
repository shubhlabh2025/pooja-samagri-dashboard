import { Trash2 } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface Order {
  id: string;
  amount: number;
  status: string;
  deliveryStatus: string;
  rating?: number;
}

const CustomerDetailSection: React.FC = () => {
  const name = "Yesh Bandaru";
  const phone = "+91 9573274439";
  const orders: Order[] = [
    {
      id: "24238419",
      amount: 456,
      status: "paid",
      deliveryStatus: "Delivered",
    },
    {
      id: "29251619",
      amount: 295,
      status: "paid",
      deliveryStatus: "Delivered",
    },
    {
      id: "37758034",
      amount: 1257,
      status: "paid",
      deliveryStatus: "Delivered",
    },
    {
      id: "28983265",
      amount: 567,
      status: "paid",
      deliveryStatus: "Delivered",
    },
    {
      id: "32230293",
      amount: 270,
      status: "paid",
      deliveryStatus: "Delivered",
    },
  ];

  const totalAmount = orders.reduce((acc, order) => acc + order.amount, 0);

  return (
    <div className="bg-white p-6 rounded shadow-md w-full  mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-gray-600">Phone no</p>
        <p className="text-sm font-medium">{phone}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-md mb-6">
        <div className="text-center py-4 border-r">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">Total amount</p>
          <p className="text-2xl font-semibold">{totalAmount}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Order(s)</h3>
        {/* <div className="space-y-4">
          {orders.map((order) => (
            <Link to="/OrderDetailSection">
              <div
                key={order.id}
                className="flex items-center justify-between border-b pb-2 last:border-b-0"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
                  <span className="font-medium">#{order.id}</span>
                  <div className="flex gap-2 mt-1 sm:mt-0">
                    <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-semibold text-gray-700">
                      {order.status}
                    </span>
                    <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Rs {order.amount}</span>
                  {order.rating && (
                    <span className="text-yellow-500 text-sm">
                      {"\u2605".repeat(order.rating)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div> */}
        <div className="divide-y">
          {orders.map((order) => {
            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">
                      <span className="font-medium">#{order.id}</span>
                    </div>
                    <div className="text-xs text-black-500 truncate max-w-[200px] flex gap-2 mt-1">
                      <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-semibold text-gray-700">
                        {order.status}
                      </span>
                      <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
                        {order.deliveryStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
                  <div className="text-sm text-black-500 font-semibold">
                    <span className="font-medium">Rs {order.amount}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailSection;
