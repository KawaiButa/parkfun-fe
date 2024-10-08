import { useState } from "react";

import { AxiosError } from "axios";

import { ParkingSlotType } from "@/interfaces/parkingSlotType";
import AxiosInstance from "@/utils/axios";

export const useParkingSlotType = () => {
  const [parkingSlotTypeList, setParkingSlotTypeList] = useState<ParkingSlotType[] | null>(null);
  const fetchParkingSlotType = async () => {
    try {
      const res = await AxiosInstance.get("/parking-slot-type");
      if (res.status === 200){
        setParkingSlotTypeList(res.data);
        return res.data;
      }
    } catch (error) {
      if(error instanceof AxiosError) throw error;
      throw new Error("Error when fetching slot type")
    }
  };

  return { parkingSlotTypeList, fetchParkingSlotType };
}