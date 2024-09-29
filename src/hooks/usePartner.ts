"use client";
import { useState } from "react";

import { AxiosError } from "axios";

import { Partner } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";
import AxiosInstance from "@/utils/axios";

export function usePartner() {
  const [partnerList, setPartnerList] = useState<Partner[] | null>();
  const fetchPartners = async () => {
    try {
      const res = await AxiosInstance.get("/partner");
      if (res.status === 200) {
        return res.data as Partner[]
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
      const res = await AxiosInstance.post("/partner", partnerFormData);
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
  return { partnerList, setPartnerList, createPartner, fetchPartners };
}
