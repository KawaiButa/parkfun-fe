import { AxiosError } from "axios";

import { PaymentRecord } from "@/interfaces/paymentRecord";
import AxiosInstance from "@/utils/axios";

export const usePaymentRecord = () => {
  const fetchOnePaymentRecord = async (id: number) => {
    try {
      const res = await AxiosInstance.get("/payment-record/" + id);
      if (res.status === 200) return res.data as PaymentRecord;
      return null;
    } catch (err) {
      if (err instanceof AxiosError) throw err;
      throw new Error("Error when fetching payment record");
    }
  };
  return { fetchOnePaymentRecord };
};
