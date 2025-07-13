import type { Order, User } from "@/interfaces/orders";
import type { PaginationMeta } from "@/interfaces/Pagination";
import { useEffect, useRef, useState, type FC } from "react";
import { useNavigate } from "react-router";
import userAvatar from "../../assets/user.png";
import { formatDate } from "@/utils/Utils";
import DismissDialog from "../Common/DismissDialog";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { updateOrderStatus } from "@/slices/orderSlice";

interface Props {
  orders: Order[];
  pagination?: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const DEBOUNCE_MS = 200;

const getDisplayName = (user: User) => {
  const firstName = user?.first_name?.trim();
  const lastName = user?.last_name?.trim();

  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;

  return user?.phone_number || "Anonymous";
};

const OrderAcceptReject: FC<Props> = ({
  orders,
  pagination,
  currentPage,
  onPageChange,
  searchQuery,
  onSearchChange,
}) => {
  const [searchText, setSearchText] = useState(searchQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showDialog, setShowDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedAction, setSelectedAction] = useState<"accepted" | "rejected">(
    "accepted",
  );

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchText.trim());
    }, DEBOUNCE_MS);
    return () => clearTimeout(handler);
  }, [searchText]);

  // useEffect(() => {
  //   if (inputRef.current) inputRef.current.focus();
  // }, []);

  const totalPages = pagination?.totalPages || 1;
  const pageButtons = [...Array(Math.min(5, totalPages)).keys()].map(
    (i) => i + 1,
  );

  const handleStatusChange = () => {
    if (selectedOrderId) {
      dispatch(
        updateOrderStatus({ id: selectedOrderId, status: selectedAction }),
      );
      navigate(0);
      setShowDialog(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="border-b px-6 py-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">
          Pending Orders ({pagination?.totalItems})
        </h3>
        <input
          ref={inputRef}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by Order Number"
          className="border p-2 rounded text-sm"
        />
      </div>

      {/* Orders List */}
      <div className="divide-y">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => {
              navigate(`/order/${order.id}`);
            }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 hover:bg-blue-50 gap-3"
          >
            <div className="flex items-center gap-4">
              <img src={userAvatar} className="w-10 h-10 rounded-full" />
              <div>
                <div className="font-medium text-gray-900 text-sm">
                  {getDisplayName(order.user)}
                </div>
                <div className="text-xs text-black-500 truncate max-w-[200px]">
                  {formatDate(order.createdAt)}
                </div>
                <span className="bg-black text-xs px-2 py-0.5 rounded font-semibold text-white">
                  #{order.order_number + 1000}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-row items-center justify-end gap-2 sm:gap-6 w-full sm:w-auto">
              <div className="text-sm text-black-500 font-semibold">
                Rs.{order.payment_details.amount.toFixed(2)}
              </div>
              <div className="flex gap-2">
                <button
                  className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-full shadow hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrderId(order.id);
                    setSelectedAction("rejected");
                    setShowDialog(true);
                  }}
                >
                  Reject
                </button>
                <button
                  className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-full shadow hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrderId(order.id);
                    setSelectedAction("accepted");
                    setShowDialog(true);
                  }}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 justify-center py-4">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
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
            className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <DismissDialog
        open={showDialog}
        title={`${selectedAction === "accepted" ? "Approve" : "Reject"} Order`}
        message={`Are you sure you want to ${
          selectedAction === "accepted" ? "approve" : "reject"
        } this order?`}
        confirmLabel={selectedAction === "accepted" ? "Approve" : "Reject"}
        cancelLabel="Cancel"
        onConfirm={handleStatusChange}
        onCancel={() => setShowDialog(false)}
      />
    </div>
  );
};

export default OrderAcceptReject;
