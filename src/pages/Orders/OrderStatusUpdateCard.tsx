import CommentDialog from "@/components/Common/CommentDialog";
import { useAppDispatch } from "@/hooks/reduxHooks";
import type { OrderDetailMainCardProps } from "@/interfaces/orders";
import { updateOrderStatus } from "@/slices/orderSlice";
import { useState } from "react";
import { useNavigate } from "react-router";

const OrderStatusUpdateCard = ({ orderDetails }: OrderDetailMainCardProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  type OrderStatusAction =
    | "pending"
    | "accepted"
    | "rejected"
    | "cancelled"
    | "packed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "refunded"
    | "returned";

  const [selectedAction, setSelectedAction] =
    useState<OrderStatusAction>("pending");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleStatusChange = async (comment: string) => {
    if (!selectedOrderId) return;
    setIsLoading(true);
    try {
      await dispatch(
        updateOrderStatus({
          id: selectedOrderId,
          status: selectedAction,
          comment,
        })
      );
      setShowDialog(false);
      navigate(0); // Refresh page
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionButtons = (): {
    label: string;
    value: OrderStatusAction;
    color: string;
  }[] => {
    switch (orderDetails.status) {
      case "pending":
        return [
          { label: "Reject", value: "rejected", color: "bg-red-500" },
          { label: "Approve", value: "accepted", color: "bg-green-500" },
        ];
      case "accepted":
        return [
          { label: "Cancel", value: "cancelled", color: "bg-red-500" },
          { label: "Packed", value: "packed", color: "bg-orange-500" },
        ];
      case "packed":
        return [
          { label: "Cancel", value: "cancelled", color: "bg-red-500" },
          { label: "Shipped", value: "shipped", color: "bg-orange-500" },
        ];
      case "shipped":
        return [
          {
            label: "Out for Delivery",
            value: "out_for_delivery",
            color: "bg-yellow-500",
          },
        ];
      case "out_for_delivery":
        return [
          {
            label: "Mark as Delivered",
            value: "delivered",
            color: "bg-green-600",
          },
        ];
      case "delivered":
        return [
          { label: "Return", value: "returned", color: "bg-orange-600" },
          { label: "Refund", value: "refunded", color: "bg-red-600" },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="flex flex-col rounded-[12px] bg-white">
      <div className="flex pt-3 pb-2">
        <p className="text-[16px] text-[#02060c73]">Order Status</p>
      </div>
      <div className="flex w-full flex-col items-center gap-3 rounded-[12px] px-4 py-3">
        <div className="flex w-full items-center gap-3 justify-between">
          <div className="flex w-full gap-1.5 justify-between">
            <p className="text-[14px] leading-4 font-semibold text-[#212121]">
              Current Status: {orderDetails.status}
            </p>
            {orderDetails.payment_details.status == "created" ? (
              <div className="flex flex-row gap-2">
                <span className="p-3 bg-red-500 text-white rounded-2xl font-medium text-[12px]">
                  Payment Failed
                </span>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedOrderId(orderDetails.id);
                    setSelectedAction("accepted");
                    setShowDialog(true);
                  }}
                >
                  <span className="p-3 bg-green-500 text-white rounded-2xl font-medium text-[12px]">
                    Payment Received
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {getActionButtons().map(({ label, value, color }) => (
                  <button
                    key={value}
                    className={`text-xs px-3 py-1.5 ${color} text-white rounded-full shadow hover:shadow-md`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedOrderId(orderDetails.id);
                      setSelectedAction(value);
                      setShowDialog(true);
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-[96%] border border-b"></div>
      </div>

      <CommentDialog
        open={showDialog}
        heading={`${
          selectedAction.charAt(0).toUpperCase() + selectedAction.slice(1)
        } Order`}
        title={`Are you sure you want to ${selectedAction.replace(
          /_/g,
          " "
        )} this order?`}
        confirmLabel={isLoading ? "Saving..." : "Submit"}
        cancelLabel="Dismiss"
        loading={isLoading}
        onConfirm={(comment) => handleStatusChange(comment)}
        onCancel={() => setShowDialog(false)}
      />
    </div>
  );
};

export default OrderStatusUpdateCard;
