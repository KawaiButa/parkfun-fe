"use client";
import { useState } from "react";

import { AxiosError } from "axios";
import { ObjectIterateeCustom } from "lodash";

import { Partner } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";
import AxiosInstance from "@/utils/axios";
import { filterAndSearch } from "@/utils/utils";

import { useUploadImage } from "./useUploadImage";

export function usePartner() {
  const [partnerList, setPartnerList] = useState<Partner[] | null>();
  const { uploadImage, getPublicUrl, replaceImage } = useUploadImage("avatar");
  const fetchPartners = async (props?: {
    searchParam: string;
    searchField: string;
    filter: ObjectIterateeCustom<Partner, boolean>;
  }) => {
    try {
      const res = await AxiosInstance.get("/partner");
      if (res.status === 200) {
        if (props) {
          const filteredData = filterAndSearch({ data: res.data, ...props });
          setPartnerList(filteredData);
          return filteredData;
        }
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
      if (image) data.image = getPublicUrl(await uploadImage(image as File));
      const res = await AxiosInstance.post("/partner", { ...data, role: "partner" });
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
        setPartnerList([...(partnerList?.filter((a) => a.id === id) ?? [])]);
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

  const fetchOnePartner = async (id: number) => {
    try {
      const res = await AxiosInstance.get(`/partner/${id}`);
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

  const udpatePartner = async (props: {partner: Partner, formData: PartnerFormData}) => {
    const {partner, formData: {email, password, image, ...data}} = props;
    if(email !== partner.user.email && !password) return;
    try {
      if(image instanceof File){
        const key = partner.user.image.url.split(process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/avatar/")[1];
        await replaceImage(image, key)
      }
      const res = await AxiosInstance.patch(`/partner/${partner.id}`, data);
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
  }
  return { partnerList, setPartnerList, createPartner, fetchPartners, deletePartner, fetchOnePartner, udpatePartner};
}
