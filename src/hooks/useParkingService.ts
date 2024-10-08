import { useState } from "react";

import { AxiosError } from "axios";

import { ParkingService } from "@/interfaces/parkingService";
import AxiosInstance from "@/utils/axios";

export const useParkingService = () => {
  const [parkingServiceList, setParkingServiceList] = useState<ParkingService[] | null>(null);
  const fetchParkingService = async () => {
    try {
      const res = await AxiosInstance.get("parking-service");
      if (res.status === 200) {
        setParkingServiceList(res.data);
        return res.data;
      }
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      throw new Error("Error when fetching parking service");
    }
  };
  return { parkingServiceList, fetchParkingService };
}