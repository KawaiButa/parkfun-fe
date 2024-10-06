import { ParkingLocation } from "./parkingLocation";

export interface ParkingLocationFormData extends Omit<ParkingLocation, "id" | "partner" | "paymentMethod" | "pricingOption" | "imageUrls"> {
  paymentMethodId: number;
  pricingOptionId: number;
  imageList: Array<File>;
}