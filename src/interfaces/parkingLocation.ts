import { Partner } from "./partner";

export interface ParkingLocation {
  id: number;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  access: string;
  partner?: Partner;
  pricingOption: string;
  pricingValue: number;
  partnerId?: number;
}