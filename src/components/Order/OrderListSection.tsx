import React, { useRef } from "react";
import userAvatar from "@/assets/user.png";
import { Link } from "react-router-dom";
import type { Order, User } from "@/interfaces/orders";
import type { PaginationMeta } from "@/interfaces/Pagination";
import { X } from "lucide-react";

interface Props {
  orders: Order[];
  pagination?: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}
const OrderListSection: React.FC<Props> = ({
  orders,
  pagination,
  currentPage,
  onPageChange,
  searchQuery,
  onSearchChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const totalPages = pagination?.totalPages || 1;
  const MAX_BUTTONS = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MAX_BUTTONS / 2));
  const endPage = Math.min(totalPages, startPage + MAX_BUTTONS - 1);
  if (endPage - startPage < MAX_BUTTONS - 1) {
    startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
  }

  const pageButtons = [];
  for (let i = startPage; i <= endPage; i++) {
    pageButtons.push(i);
  }
  const getDisplayName = (user: User) => {
    const firstName = user?.first_name?.trim();
    const lastName = user?.last_name?.trim();

    if (firstName && lastName) return `${firstName} ${lastName}`;
    if (firstName) return firstName;
    if (lastName) return lastName;

    return user?.phone_number || "Anonymous";
  };
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 text-lg border-l-4 border-blue-500 flex justify-between items-center">
        <span className="font-semibold text-gray-800">
          Orders List ({pagination?.totalItems})
        </span>
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search order number..."
            className="px-3 py-2 border border-gray-200 rounded text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-sm text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="divide-y">
        {orders.map((order) => (
          <Link to={`/order/${order.id}`} key={order.id}>
            <div className="flex justify-between items-center px-6 py-4 hover:bg-blue-50">
              <div className="flex items-center gap-4">
                <img
                  src={userAvatar}
                  alt="user"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {getDisplayName(order.user)}
                  </div>
                  <div className="text-xs text-black-500">
                    Status: {order.status}
                  </div>
                  <span className="bg-black text-xs px-2 py-0.5 rounded text-white font-semibold">
                    #{order.order_number + 1000}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Prev
          </button>
          {pageButtons.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-100 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderListSection;
