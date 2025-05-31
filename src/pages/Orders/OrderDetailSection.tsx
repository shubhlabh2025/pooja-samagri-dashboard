import React, { useState } from "react";
import { useNavigate } from "react-router";

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

const OrderDetailSection: React.FC = () => {
  const orderId = "#24238419";
  const date = "12 February";
  const time = "23:15";
  const status = "paid";
  const deliveryStatus = "Delivered";

  const customer = {
    name: "Yesh Bandaru",
    phone: "+91 9573274439",
    address: "indus19 opposite mohan school",
  };

  const items: OrderItem[] = [
    { name: "Pure Karpuram (Swastik pure Camphor) - 50 gms", price: 78, quantity: 1 },
    { name: "Aavu Pidakalu - small size", price: 7, quantity: 5 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [note, setNote] = useState("");

  const navigate = useNavigate()

  return (
    <div className="bg-white p-6 rounded shadow-md w-full mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-lg">{orderId}</h2>
          <p className="text-sm text-gray-600">{date} {time}</p>
          <div className="flex gap-2 mt-1">
            <span className="bg-gray-200 text-xs px-2 py-0.5 rounded font-semibold text-gray-700">
              ₹ {status}
            </span>
            <span className="bg-black text-white text-xs px-2 py-0.5 rounded font-semibold">
              {deliveryStatus}
            </span>
          </div>
        </div>
        <span className="flex items-center text-[#2480ff] cursor-pointer font-semibold"
        onClick={()=>{
            navigate(-1)
        }}
        >
           CLOSE
        </span>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-md font-semibold text-gray-800">{customer.name}</h3>
        <p className="text-sm text-gray-600">Phone no</p>
        <p className="text-sm font-medium mb-2">{customer.phone}</p>
        <p className="text-sm text-gray-600">Address:</p>
        <p className="text-sm font-medium mb-2">{customer.address}</p>
      </div>

      <div className="border-t pt-4 space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm text-gray-800">
            <span>{item.name}</span>
            <span className="font-medium">Rs. {item.price}×{item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-semibold text-gray-800 pt-3">
          <span>Subtotal</span>
          <span>₹ {subtotal}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-800">
          <span>To Pay</span>
          <span>₹ {subtotal}</span>
        </div>

        {/* <div className="mt-4">
          <label className="block text-sm text-gray-700 mb-1">Add note for customers:</label>
          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
          />
          <button className="mt-2 px-4 py-1.5 bg-[#2480ff] text-white font-medium text-sm rounded shadow">
            SAVE NOTE
          </button>
        </div> */}

        <button className="w-full mt-4 bg-[#2480ff] text-white font-bold py-2 rounded shadow">
          INVOICE
        </button>

        <div className="pt-4">
          <p className="font-medium text-sm text-gray-800">Payment: <span className="font-semibold">{status}</span></p>
          <p className="text-sm text-gray-700 font-semibold">Total: <span className="ml-2">Rs {subtotal}</span></p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailSection;