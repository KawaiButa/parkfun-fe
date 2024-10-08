
export interface ParkingSlotFormData {
  parkingSlotTypeId: number;
  name: string;
  width: number;
  height: number;
  length: number;
  price: number;
  parkingLocationId: number;
  images: Array<File | string>;
  startAt: number;
  endAt: number;
  space: number;
  parkingServiceIds: number[];
}
