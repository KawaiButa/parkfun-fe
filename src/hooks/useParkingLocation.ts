"use client";

import { useState } from "react";

import { AxiosError } from "axios";

import { ParkingLocation } from "@/interfaces";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";

export const useParkingLocation = () => {
  const [ parkingLocationList, setParkingLocationList ] = useState<ParkingLocation[] | null>(null);
  const { uploadImage, getPublicUrl } = useUploadImage("parkingLocation");
  const fetchParkingLocation = async () => {
    try {
      const res = await AxiosInstance.get("/parking-location");
      if (res.status === 200) {
        setParkingLocationList(res.data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        if (message instanceof Array) throw new Error(message.join(" "));
        throw new Error(message);
      }
      throw error;
    }
  };
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

  return { createParkingLocation, fetchParkingLocation, parkingLocationList };
};
