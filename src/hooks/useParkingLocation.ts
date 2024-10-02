"use client";

import { AxiosError } from "axios";

import { useProfile } from "@/context/profileContext";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";
import AxiosInstance from "@/utils/axios";

export const useParkingLocation = () => {
  const { profile } = useProfile();
  const createParkingLocation = async (formData: ParkingLocationFormData) => {
    try {
      const res = await AxiosInstance.post("/parking-location", { ...formData, partnerId: profile!.partner?.id });
      if (res.status === 201) return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        if (message instanceof Array) throw new Error(message.join(" "));
        throw new Error(message);
      }
      throw err;
    }
  };

  return { createParkingLocation };
};
