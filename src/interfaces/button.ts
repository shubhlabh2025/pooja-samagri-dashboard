import type { Product } from "./product";
import type { ProductVariant } from "./product-variant";

export interface TriggerProductVariantBottomSheetProps {
  product: Product;
}

export interface AddToCartCounterProps {
  productVariant: ProductVariant;
}
