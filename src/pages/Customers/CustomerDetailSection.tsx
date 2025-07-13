import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import OrderListSection from "@/components/Order/OrderListSection";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { fetchOrders } from "@/slices/orderSlice";
import type { Order } from "@/interfaces/orders";
import type { PaginationMeta } from "@/interfaces/Pagination";

const CustomerDetailSection: React.FC = () => {
  const dispatch = useAppDispatch();
  const { userId } = useParams<{ userId: string }>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>();

  const fetchCustomerOrders = async () => {
    try {
      const params = {
        page: 1,
        pageSize: 100,
        phone_number: userId,
      };

      const result = await dispatch(fetchOrders(params)).unwrap();
      setOrders(result.data || []);
      setPagination(result.meta);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  useEffect(() => {
    if (userId) fetchCustomerOrders();
  }, []);

  const totalAmount = orders.reduce(
    (acc, order) => acc + order.payment_details.amount,
    0,
  );

  return (
    <div className="bg-white p-6 rounded shadow-md w-full mx-auto">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">Customer Details</h2>
        <p className="text-sm text-gray-600">Phone No</p>
        <p className="text-sm font-medium">{userId}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 border border-gray-100 rounded-md mb-6">
        <div className="text-center py-4 border-r">
          <p className="text-sm text-gray-600">Orders</p>
          <p className="text-2xl font-semibold">{orders.length}</p>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-semibold">{totalAmount}</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Recent Order(s)</h3>

        <OrderListSection
          orders={orders}
          pagination={pagination}
          currentPage={1}
          onPageChange={() => {}}
          searchQuery={""}
          onSearchChange={() => {}}
        />
      </div>
    </div>
  );
};

export default CustomerDetailSection;
