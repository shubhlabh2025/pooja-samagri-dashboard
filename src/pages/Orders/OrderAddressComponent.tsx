import type { DeliveryDetailCardProps } from "@/interfaces/orders";
import { Home, MapPin, User } from "lucide-react";

const OrderAddressComponent = ({ orderAddress }: DeliveryDetailCardProps) => {
  return (
    <div className="flex flex-col rounded-[12px] bg-white">
      <div className="flex pt-3 pb-2">
        <p className="text-[16px] text-[#02060c73]">Delivery Details</p>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-[12px] px-4 py-3">
        <div className="flex w-full items-center gap-3">
          <User size={20} color="#212121" strokeWidth={2} />
          <div className="flex gap-1.5">
            <p className="text-[14px] leading-4 font-semibold whitespace-nowrap text-[#212121]">
              {orderAddress.name}
            </p>
            <p className="text-[14px] leading-4 text-[#333333]">
              {orderAddress.phone_number.replace("+91", "")}
            </p>
          </div>
        </div>
        <div className="w-[96%] border border-b"></div>
        <div className="flex w-full items-center gap-3">
          <Home size={20} color="#212121" strokeWidth={2} />
          <div className="flex flex-col gap-1.5">
            <p className="text-[14px] leading-4">
              {orderAddress.address_line1}, {orderAddress.address_line2},
              {orderAddress.city}, {orderAddress.state}, {orderAddress.pincode}
            </p>
            {orderAddress.landmark && (
              <span className="text-[14px] leading-4 text-[#333333]">
                {orderAddress.landmark}
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full items-center gap-3">
          <MapPin size={20} color="#212121" strokeWidth={2} />
          <div className="flex flex-col gap-1.5">
            <a
              href={`https://www.google.com/maps?q=${orderAddress.lat},${orderAddress.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] leading-4 text-blue-600 underline hover:text-blue-800"
            >
              Landmark
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAddressComponent;
