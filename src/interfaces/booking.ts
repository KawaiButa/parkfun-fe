import { ParkingService } from "./parkingService";
import { ParkingSlot } from "./parkingSlot";
import { PaymentRecord } from "./paymentRecord";
import { User } from "./user";

export interface Booking {
  id: number;
  user: User,
  services: ParkingService[],
  status: string;
  amount: number;
  startAt: Date;
  fee: number;
  endAt?: Date;
  createAt: Date;
  parkingSlot: ParkingSlot,
  sessions?: PaymentRecord;
}