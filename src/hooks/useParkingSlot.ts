import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";
import AxiosInstance from "@/utils/axios";

export const useParkingSlot = () => {
  const createParkingSlot = async (formData: ParkingSlotFormData) => {
    const res = await AxiosInstance.post("/parkingSlot", formData);
    if(res.status === 200)
      return res.data;
    return null
  };
  return {createParkingSlot}
};
