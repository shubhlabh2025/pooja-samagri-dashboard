import type { OrderDetailMainCardProps } from "@/interfaces/orders";

const OrderItemSummaryCard = ({ orderDetails }: OrderDetailMainCardProps) => {
  return (
    <div className="flex flex-col rounded-[12px] bg-white">
      <div className="flex justify-between border-b border-[#E9E9EB]  pt-3 pb-2">
        <p className="text-[16px] text-[#02060c73]">Order Details</p>
        <p className="text-[16px] text-[#02060c73]">
          Total Items:{" "}
          {orderDetails.order_items.reduce(
            (acc, item) => acc + item.quantity,
            0,
          )}
        </p>
      </div>
      <div className="hide-scrollbar flex flex-col divide-y divide-slate-200 overflow-y-auto rounded-b-[12px] border-x border-b border-slate-200 bg-white">
        {orderDetails.order_items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-4 py-2 transition-colors duration-200 ease-in-out hover:bg-slate-50"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.product_variant.images[0]}
                alt={item.product_variant.name}
                className="h-12 w-12 flex-shrink-0 rounded-md object-cover"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-slate-800">
                  {item.product_variant.name}
                </p>

                <p className="text-sm text-slate-500">
                  {item.product_variant.display_label}
                </p>
              </div>
            </div>

            <div className="flex flex-col text-right">
              <div className="flex items-end gap-2">
                <p className="text-[12px] text-slate-600 line-through">
                  ₹{(item.quantity * item.mrp).toLocaleString("en-IN")}
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  ₹{(item.quantity * item.price).toLocaleString("en-IN")}
                </p>
              </div>
              <p className="text-xs text-slate-500">
                qty: {item.quantity} x ₹{item.price.toLocaleString("en-IN")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemSummaryCard;
