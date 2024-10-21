"use client";
import { useState } from "react";

import { AxiosError } from "axios";
import { ObjectIterateeCustom, set } from "lodash";
import queryString from "query-string";

import { Partner } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";

export function usePartner() {
  const [partnerList, setPartnerList] = useState<Partner[] | null>();
  const { uploadImage, getPublicUrl, replaceImage } = useUploadImage("avatar");
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(10);
  const [count, setCount] = useState(0);
  
  const fetchPartners = async (props?: {
    searchParam: string;
    searchField: string;
    filter: ObjectIterateeCustom<Partner, boolean>;
  }) => {
    const queryObject: { page: number; take: number; field?: string; keyword?: string } = { page, take };
    if (props && props.searchParam) {
      const { searchField, searchParam } = props;
      set(queryObject, "field", searchField);
      set(queryObject, "keyword", searchParam);
    }
    try {
      const res = await AxiosInstance.get("/partner?" + queryString.stringify(queryObject));
      if (res.status === 200) {
        const {meta, data} = res.data;
        setCount(meta.itemCount);
        setPartnerList(data);
        return data as Partner[];
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

  const udpatePartner = async (props: { partner: Partner; formData: PartnerFormData }) => {
    const {
      partner,
      formData: { email, password, image, ...data },
    } = props;
    if (!email || !password) return;
    try {
      if (image instanceof File) {
        const key = partner.user.image.url.split(
          process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/avatar/"
        )[1];
        await replaceImage(image, key);
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
  };
  return {
    take,
    page,
    count,
    partnerList,
    setPartnerList,
    createPartner,
    fetchPartners,
    deletePartner,
    fetchOnePartner,
    setTake,
    setPage,
    udpatePartner,
  };
}
