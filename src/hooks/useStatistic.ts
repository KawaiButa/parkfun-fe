import { AxiosError } from "axios";
import queryString from "query-string"

import { StatisticsQuery } from "@/interfaces/statisticsQuery";
import AxiosInstance from "@/utils/axios";
export enum StatisticField {
  USER = "user",
  INCOME = "income",
  BOOKING = "booking",
  PARTNER = "partner",
}
export const useStatistic = () => {
  const getCombinedStatistics = async (period?: StatisticsQuery) => {
    try{
      const res = await AxiosInstance.get("/statistics?" + queryString.stringify(period ?? {}));
      if(res.status === 200) return res.data;
      return null;
    } catch(err) {
      if(err instanceof AxiosError) throw err
      throw new Error("Error when fetching combined statistics");
    }
  }
  const getDetailData = async (type: StatisticField, period?: StatisticsQuery) => {
    try{
      const res = await AxiosInstance.get(`/statistics/${type}s?` + queryString.stringify(period ?? {}));
      if(res.status === 200) return res.data;
      return null;
    } catch(err) {
      if(err instanceof AxiosError) throw err
      throw new Error("Error when fetching combined statistics");
    }
  }
  return {getCombinedStatistics, getDetailData}
}