export interface Coupon {
  id: string;
  offer_code: string;
  description: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  min_discount_value: number | null;
  max_discount_value: number | null;
  min_order_value: number;
  offer_type?: "NEW_USER" | "ALL_USER";
  start_date: string;
  end_date: string;
  is_active: boolean;
  usage_limit_per_user: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// If you need to support the additional fields for your form,
// you can extend the interface:
export interface ExtendedCoupon extends Coupon {
  offer_type?: "NEW_USER" | "ALL_USER";
  offer_per_user?: boolean;
}

export interface CreateCoupon {
  offer_code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  description: string;
  min_discount_value?: number;
  max_discount_value?: number;
  min_order_value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

export type UpdateCoupon = Partial<CreateCoupon>;
