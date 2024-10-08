import { ParkingLocation } from "./parkingLocation";

export interface ParkingLocationFormData extends Omit<ParkingLocation, "id" | "partner" | "paymentMethod" | "pricingOption" | "images"> {
  paymentMethodId: number;
  pricingOptionId: number;
  images: Array<File | string>;
}