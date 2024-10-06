import { AxiosError } from "axios";

import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";

export const useParkingSlot = () => {
  const { uploadImage, getPublicUrl } = useUploadImage("parkingSlot");
  const createParkingSlot = async (formData: ParkingSlotFormData) => {
    try {
      const { images } = formData;
      const imagePaths = await Promise.all(images.map((image) => uploadImage(image)));
      const imageUrls = await Promise.all(imagePaths.map((path) => getPublicUrl(path)));
      const res = await AxiosInstance.post("/parking-slot", { ...formData, images: imageUrls });
      if (res.status === 201) return res.data;
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      else throw new Error("Error when uploading image");
    }
  };
  return { createParkingSlot };
};
