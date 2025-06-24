import type { AdBanner } from "./ad-banner";

export interface ConfigurationModel {
  id: number;
  name: string;
  image: string;
  phone_number: string;
  whatsapp_number: string;
  store_status: boolean;
  min_order_amount: number;
  delivery_charge: number;
  delivery_time: number;
  delivery_radius: number;
  ad_banners?: AdBanner[];
  announcement_text: string;
}
