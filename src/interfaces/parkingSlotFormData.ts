
export interface ParkingSlotFormData {
  parkingSlotTypeId: number;
  name: string;
  width: number;
  height: number;
  length: number;
  price: number;
  parkingLocationId: number;
  images: File[];
  startAt: number;
  endAt: number;
  space: number;
  parkingServiceIds: number[];
}
