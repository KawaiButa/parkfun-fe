import { ParkingLocation } from "./parkingLocation";

export interface ParkingLocationFormData extends Omit<ParkingLocation, "id" | "partner" | "paymentMethod" | "pricingOption"> {
  paymentMethodId: number;
  pricingOptionId: number;
}