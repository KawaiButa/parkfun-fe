import { useState } from "react";

import { AxiosError } from "axios";

import { Booking } from "@/interfaces/booking";
import AxiosInstance from "@/utils/axios";

export const useBooking = () => {
  const [bookingList, setBookingList] = useState<Booking[] | null>(null);

  const fetchBooking = async () => {
    try {
      const res = await AxiosInstance.get("/booking");
      if (res.status === 200) {
        setBookingList(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (error) {
      if(error instanceof AxiosError) throw error;
    }
  };
  const fetchOnePaymentRecord = async (id: number) => {
    try{
      const res = await AxiosInstance.get(`/payment-record/${id}`);
      if(res.status === 200) return res.data;
      return null;
    } catch (error) {
      if(error instanceof AxiosError) throw error;
      throw new Error("Error when fetching payment record");
    }
  }
  return { fetchBooking, fetchOnePaymentRecord, bookingList };
}