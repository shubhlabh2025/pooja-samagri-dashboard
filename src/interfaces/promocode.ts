export interface Offer {
  code: string;
  description: string;
  discount_type: string;
  discount_value: string;
  min_discount_value: string;
  max_discount_value: string;
  min_order_value: string;
  offer_type: string;
  offer_per_user: boolean;
  offer_status: boolean;
  start_date: Date;
  end_date: Date;
}
