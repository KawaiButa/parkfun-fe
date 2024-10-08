import { useState } from "react";

import { AxiosError } from "axios";

import { PricingOption } from "@/interfaces/pricingOption";
import AxiosInstance from "@/utils/axios";

export const usePricingOption = () => {
  const [pricingOptionList, setPricingOption] = useState<PricingOption[] | null>();
  const fetchPricingOption = async () => {
    try{
      const res = await AxiosInstance.get("pricing-option");
      if(res.status === 200) {
        setPricingOption(res.data);
        return res.data;
      }
      return null;
    } catch(err) {
      if(err instanceof AxiosError) throw err;
      throw new Error("Error when fetching pricing option list");
    }
  }
  return {fetchPricingOption, pricingOptionList}
}
