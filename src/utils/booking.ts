"use client"
import { AxiosError } from "axios";

import { BookingFormData } from "@/interfaces/bookingFormData";

import AxiosInstance from "./axios";

const bookParkingLocation = async (formData: BookingFormData & {amount: number}) => {
  const {parkingSlotId, time, ...data } = formData
  const startAt = time[0]
  const endAt = time[1]
  try{
    const result = await AxiosInstance.post("/payment", {...data, parkingSlotId, startAt, endAt})
    if(result.status === 201) return result.data;
    return null;
  } catch(err) {
    if(err instanceof AxiosError) throw err;
    throw new Error("Error when booking parking location");
  }
}
export {bookParkingLocation}