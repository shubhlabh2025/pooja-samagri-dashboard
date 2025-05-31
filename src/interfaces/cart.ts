export interface CartItem {
  name: string;
  mrp: number;
  price: number;
  image: string;
  brand_name: string;
  quantity: number;
  is_out_of_stock: boolean;
  display_label: string;
  product_id: string;
  variant_id: string;
}

export interface ReviewOrderProps {
  cartData: CartItem[];
  handleIncreaseProductQantity: (productId: string) => void;
  handleDecreaseProductQantity: (productId: string) => void;
}

export interface BillDetailProps {
  cartData: CartItem[];
}
