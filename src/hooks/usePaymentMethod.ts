import { useState } from "react";

import { AxiosError } from "axios";

import { PaymentMethod } from "@/interfaces/paymentMethod";
import AxiosInstance from "@/utils/axios";

export const usePaymentMethod = () => {
  const [paymentMethodList, setPaymentMethodList] = useState<PaymentMethod[] | null>(null);

  const fetchPaymentMethod = async () => {
    try {
      const res = await AxiosInstance.get("/payment-method");
      if (res.status === 200) {
        setPaymentMethodList(res.data);
        return res.data;
      }
      return null;
    } catch (error) {
      if (error instanceof AxiosError) throw error;
      throw new Error("Error when fetching payment method list");
    }
  };

  return { fetchPaymentMethod, paymentMethodList };
};
