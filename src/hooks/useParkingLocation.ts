"use client";

import { AxiosError } from "axios";

import { useProfile } from "@/context/profileContext";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";

export const useParkingLocation = () => {
  const { profile } = useProfile();
  const { uploadImage, getPublicUrl } = useUploadImage("parkingLocation");
  const createParkingLocation = async (formData: ParkingLocationFormData) => {
    try {
      const { imageList, ...remainData } = formData;
      const imageUrls = await Promise.all(
        imageList.map(async (file) => {
          const path = await uploadImage(file);
          return await getPublicUrl(path);
        })
      );
      const res = await AxiosInstance.post("/parking-location", {
        ...remainData,
        partnerId: profile!.partner?.id,
        images: imageUrls,
      });
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
