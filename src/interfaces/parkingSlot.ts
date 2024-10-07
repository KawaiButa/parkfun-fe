import { ParkingLocation } from "./parkingLocation";
import { ParkingSlotType } from "./parkingSlotType";
import { Service } from "./service";

export interface ParkingSlot {
  id: number;
  parkingLocation: ParkingLocation;
  isAvailable: boolean;
  type: ParkingSlotType;
  price: number;
  width: number;
  height: number;
  length: number;
  startTime: number;
  endTime: number;
  images: string[];
  services: Service[];
}