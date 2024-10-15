import { Booking } from "./booking";

export interface PaymentRecord {
  id: number;
  booking: Booking;
  amount: number;
  transactionId: string;
  isRefunded: boolean;
  createAt: Date;
  deleteAt?: Date;
  receiptUrl: string;
}
