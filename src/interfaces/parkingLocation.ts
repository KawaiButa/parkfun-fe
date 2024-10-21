
import { Image } from "./image";
import { ParkingSlot } from "./parkingSlot";
import { Partner } from "./partner";
import { PaymentMethod } from "./paymentMethod";
import { PricingOption } from "./pricingOption";
export interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  access: string;
  partner?: Partner;
  paymentMethod: PaymentMethod,
  pricingOption: PricingOption;
  description: string;
  images?: Image[];
  parkingSlots: ParkingSlot[];
}