import { useState } from "react";

import { AxiosError } from "axios";

import { PartnerType } from "@/interfaces/partnerType";
import AxiosInstance from "@/utils/axios";

export const usePartnerType = () => {
  const [partnerTypeList, setPartnerTypeList] = useState<PartnerType[] | null>(null);

  const fetchPartnerType = async () => {
    try {
      const res = await AxiosInstance.get("/partner-type");
      if (res.status === 200) {
        setPartnerTypeList(res.data);
        return res.data;
      }
      return null;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new Error(message);
      }
      throw err;
    }
  };
  return { fetchPartnerType, partnerTypeList };
};
