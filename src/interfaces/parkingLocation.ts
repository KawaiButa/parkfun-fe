import { Partner } from "./partner";
import { PaymentMethod } from "./paymentMethod";
import { PricingOption } from "./pricingOption";
export interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  access: string;
  partner?: Partner;
  paymentMethod?: PaymentMethod,
  pricingOption: PricingOption;
  partnerId?: number;
  imageUrls: Array<string>;
}