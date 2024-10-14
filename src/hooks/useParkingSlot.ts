import { useState } from "react";

import { AxiosError } from "axios";
import { ObjectIterateeCustom } from "lodash";

import { ParkingSlot } from "@/interfaces/parkingSlot";
import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";
import AxiosInstance from "@/utils/axios";
import { filterAndSearch } from "@/utils/utils";

import { useUploadImage } from "./useUploadImage";

export const useParkingSlot = () => {
  const { uploadImage, getPublicUrl, replaceImage } = useUploadImage("parkingSlot");
  const [parkingSlotList, setParkingSlotList] = useState<ParkingSlot[] | null>(null);
  const createParkingSlot = async (formData: ParkingSlotFormData) => {
    try {
      const { images } = formData;
      const imagePaths = await Promise.all(
        images.map((image) => {
          if (image instanceof File) return uploadImage(image);
          return image;
        })
      );
      const imageUrls = await Promise.all(imagePaths.map((path) => getPublicUrl(path)));
      const res = await AxiosInstance.post("/parking-slot", { ...formData, images: imageUrls });
      if (res.status === 201) return res.data;
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Error when uploading image");
    }
  };
  const updateParkingSlot = async (parkingSlot: ParkingSlot, formData: ParkingSlotFormData) => {
    try {
      const { images, ...data } = formData;
      await Promise.all(
        parkingSlot.images.map((image, index) => {
          if (images[index] instanceof File) {
            const hostName = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/parkingLocation/";
            const key = image.url.split(hostName)[0];
            return replaceImage(images[index], key);
          }
          return parkingSlot.images;
        })
      );
      const res = await AxiosInstance.put(`/parking-slot/${parkingSlot.id}`, data);
      if (res.status === 200) {
        const updatedParkingSlotList = parkingSlotList?.filter((slot) => slot.id !== parkingSlot.id);
        setParkingSlotList([...(updatedParkingSlotList ?? [])]);
        return res.data;
      }
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Erro when updating parking slot");
    }
  };
  const fetchParkingSlot = async (props?: {
    searchParam: string;
    searchField: string;
    filter: ObjectIterateeCustom<ParkingSlot, boolean>;
  }) => {
    try {
      const res = await AxiosInstance.get("/parking-slot");
      if (res.status === 200) {
        if (props) {
          const filteredData = filterAndSearch({ data: res.data.data, ...props });
          setParkingSlotList(filteredData);
          return filteredData;
        }
        setParkingSlotList(res.data.data);
        return res.data.data;
      }
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Error when fetching parking slot data");
    }
  };
  const deleteParkingSlot = async (id: number) => {
    try {
      const res = await AxiosInstance.delete(`/parking-slot/${id}`);
      if (res.status === 204) setParkingSlotList(parkingSlotList?.filter((a) => a.id !== id) || []);
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Error when deleting parking slot");
    }
  };
  const fetchOneParkingSlot = async (id: number) => {
    try {
      const res = await AxiosInstance.get(`/parking-slot/${id}`);
      if (res.status === 200) {
        return res.data as ParkingSlot;
      }
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Error when fetching parking slot");
    }
  };
  return {
    createParkingSlot,
    fetchParkingSlot,
    parkingSlotList,
    fetchOneParkingSlot,
    deleteParkingSlot,
    updateParkingSlot,
  };
};
