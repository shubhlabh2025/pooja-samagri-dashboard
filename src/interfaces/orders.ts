export interface PaymentDetails {
  status: string;
  amount: number;
  currency: string;
  method: string;
}

export interface User {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string;
}

export interface Order {
  id: string;
  status: string;
  order_number: number;
  delivered_at: string | null;
  expected_delivery_date: string;
  cancellation_reason: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  payment_details: PaymentDetails;
  user: User;
}

export interface updateStatus {
  success: boolean;
  message: string;
}

export interface OrderDetailMainCardProps {
  orderDetails: AllOrderDetail;
}

export interface DeliveryDetailCardProps {
  orderAddress: AllOrderDetail["order_address"];
}

export interface orderItem {
  quantity: number;
  mrp: number;
  price: number;
  product_variant_id: string;
  product_variant: {
    name: string;
    images: string[];
    display_label: string;
  };
}
export interface OrderDetail {
  id: string;
  status:
    | "pending"
    | "accepted"
    | "processing"
    | "packed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rejected"
    | "refunded"
    | "returned";
  order_number: 1;
  delivered_at: string | null;
  expected_delivery_date: string;
  cancellation_reason: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  order_items: orderItem[];
  payment_details: {
    status: "created" | "captured" | "failed" | "refunded" | "pending" | "paid";
    amount: number;
    currency: "INR";
    method: "card" | "netbanking" | "upi" | "wallet" | "cod" | null;
  };
}

export interface OrderAddress {
  name: string;
  phone_number: string;
  city: string;
  pincode: string;
  state: string;
  address_line1: string;
  address_line2: string | null;
  landmark: string;
  lat: number;
  lng: number;
}

export interface OrderHistory {
  status:
    | "pending"
    | "accepted"
    | "processing"
    | "packed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rejected"
    | "refunded"
    | "returned";
  comment: string | null;
  updatedBy: "user" | "admin" | "system";
  createdAt: string;
}

export interface OrderCoupon {
  offer_code: string;
  discount_amount: number;
  discount_type: "percentage" | "fixed";
  createdAt: string;
}

export interface OrderCharge {
  name: string;
  amount: number;
}

export interface AllOrderDetail {
  id: string;
  status:
    | "pending"
    | "accepted"
    | "processing"
    | "packed"
    | "shipped"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "rejected"
    | "refunded"
    | "returned";
  order_number: number;
  delivered_at: string | null;
  expected_delivery_date: string;
  cancellation_reason: string | null;
  createdAt: string;
  updatedAt: string;
  user_id: string;
  order_items: orderItem[];
  payment_details: {
    status: "created" | "captured" | "failed" | "refunded" | "pending" | "paid";
    amount: number;
    currency: "INR";
    method: "card" | "netbanking" | "upi" | "wallet" | "cod" | null;
  };
  order_charges: OrderCharge[];
  order_address: OrderAddress;
  order_histories: OrderHistory[];
  order_coupons: OrderCoupon[] | [];
}
