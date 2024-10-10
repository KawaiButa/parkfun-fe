import { AxiosError } from "axios";

import { BookingFormData } from "@/interfaces/bookingFormData";

import AxiosInstance from "./axios";

const bookParkingLocation = async (formData: BookingFormData) => {
  const {parkingSlotId, time, services } = formData
  const startTime = time[0]
  const endTime = time[1]
  try{
    const result = await AxiosInstance.post("/book", {parkingSlotId, startTime, endTime, services})
    if(result.status === 200) return result.data;
    return null;
  } catch(err) {
    if(err instanceof AxiosError) throw err;
    throw new Error("Error when booking parking location");
  }
}
export {bookParkingLocation}