"use client";
import { useState } from "react";

import { AxiosError } from "axios";

import { Partner } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";

export function usePartner() {
  const [partnerList, setPartnerList] = useState<Partner[] | null>();
  const { uploadImage, getPublicUrl } = useUploadImage("avatar");
  const fetchPartners = async () => {
    try {
      const res = await AxiosInstance.get("/partner");
      if (res.status === 200) {
        return res.data as Partner[];
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new AxiosError(message);
      }
      throw err;
    }
  };
  const createPartner = async (partnerFormData: PartnerFormData) => {
    try {
      const { image, ...partnerFormPayload } = partnerFormData;
      const data: Omit<PartnerFormData, "image"> & { image?: string } = { ...partnerFormPayload };
      if (image) data.image = getPublicUrl(await uploadImage(image));
      const res = await AxiosInstance.post("/partner", data);
      if (res.status === 200) {
        return res.data as Partner;
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new AxiosError(message);
      }
      throw err;
    }
  };
  const deletePartner = async (id: number) => {
    try {
      const res = await AxiosInstance.delete(`/partner/${id}`);
      if (res.status === 200) {
        return res.data as Partner;
      }
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new AxiosError(message);
      }
      throw err;
    }
  };
  return { partnerList, setPartnerList, createPartner, fetchPartners, deletePartner };
}
