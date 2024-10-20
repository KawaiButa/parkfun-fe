import { Dayjs } from "dayjs";

export interface BookingFormData {
  
  parkingSlotId: number;
  time: Dayjs[],
  serviceIds?: number[];
}