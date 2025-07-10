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
