import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import OrderAddressComponent from "./OrderAddressComponent";
import PaymentSummaryCard from "./PaymentSummaryCard";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHooks";
import {
  fetchOrderById,
  selectSelectedOrderDetail,
  selectOrderLoading,
} from "@/slices/orderSlice";
import OrderItemSummaryCard from "./OrderItemSummaryCard";
import { CircleX } from "lucide-react";
import OrderStatusUpdateCard from "./OrderStatusUpdateCard";
import { createOrderApi } from "@/api/ordersAPI";
import axiosClient from "@/api/apiClient";

const OrderDetailSection: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const orderDetails = useAppSelector(selectSelectedOrderDetail);
  const loading = useAppSelector(selectOrderLoading);
  const orderApi = createOrderApi(axiosClient);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [id]);

  // if (loading || !orderDetails) return <Loader />;
  // if (!orderDetails) return <ErrorScreen message="Order not found" />;

  const date = new Date(orderDetails?.createdAt ?? "").toLocaleDateString();
  const time = new Date(orderDetails?.createdAt ?? "").toLocaleTimeString();

  if (loading) {
    return <div></div>;
  }

  const downloadInvoice = async () => {
    if (id) {
      try {
        const response = await orderApi.downloadInvoice(id);

        // Create blob from response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `invoice_${id}.pdf`; // or use order number if available
        document.body.appendChild(link);
        link.click();

        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading invoice:", error);
        // Handle error (show toast, etc.)
      }
    }
  };

  return (
    <div className="relative bg-white p-6 rounded shadow-md w-full mx-auto space-y-6">
      <span
        className="absolute right-4 items-center text-[#2480ff] cursor-pointer font-semibold"
        onClick={() => navigate(-1)}
      >
        <CircleX />
      </span>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">
            {orderDetails?.order_number != null
              ? `#${orderDetails.order_number + 1000}`
              : ""}
          </h2>
          <p className="text-sm text-gray-600">
            Oder Date: {date} <br />
            Time: {time}
          </p>

          <div className="flex flex-col lgap-2 mt-1 gap-2">
            <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-semibold text-gray-700">
              Payment status: {orderDetails?.payment_details.status}
              <br />
            </span>
            <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold capitalize">
              Order Status: {orderDetails?.status}
            </span>
          </div>
        </div>
      </div>
      {orderDetails && <OrderStatusUpdateCard orderDetails={orderDetails} />}

      {orderDetails?.order_address && (
        <OrderAddressComponent orderAddress={orderDetails.order_address} />
      )}
      {orderDetails && <OrderItemSummaryCard orderDetails={orderDetails} />}

      {orderDetails && <PaymentSummaryCard orderDetails={orderDetails} />}
      {orderDetails?.status === "delivered" ? (
        <button
          onClick={downloadInvoice}
          className="w-full mt-4 bg-[#2480ff] text-white font-bold py-2 rounded shadow"
        >
          INVOICE
        </button>
      ) : (
        <></>
      )}
    </div>
  );
};

export default OrderDetailSection;
