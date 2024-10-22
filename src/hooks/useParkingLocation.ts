"use client";

import { useState } from "react";

import { AxiosError } from "axios";
import { ObjectIterateeCustom, set } from "lodash";
import queryString from "query-string";

import { ParkingLocation } from "@/interfaces";
import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";
import { SearchParkingLocationData } from "@/interfaces/searchParkingLocationData";
import AxiosInstance from "@/utils/axios";

import { useUploadImage } from "./useUploadImage";
export interface SearchedParkingLocation extends Omit<ParkingLocation, "images"> {
  minPrice: number;
  images: string[];
  partnerId: number;
  distance: number;
  parkingSlotIds: number[]
}

export const useParkingLocation = () => {
  const [page, setPage] = useState(1);
  const [take, setTake] = useState(20);
  const [count, setCount] = useState(0);
  const [parkingLocationList, setParkingLocationList] = useState<ParkingLocation[] | null>(null);
  const { uploadImage, getPublicUrl, replaceImage } = useUploadImage("parkingLocation");
  const fetchParkingLocation = async (props?: {
    searchParam: string;
    searchField: string;
    filter: ObjectIterateeCustom<ParkingLocation, boolean>;
  }) => {
    try {
      const queryObject: { page: number; take: number; field?: string; keyword?: string } = { page, take };
      if (props && props.searchParam) {
        const { searchField, searchParam } = props;
        set(queryObject, "field", searchField);
        set(queryObject, "keyword", searchParam);
      }
      const res = await AxiosInstance.get("/parking-location?" + queryString.stringify(queryObject));
      if (res.status === 200) {
        const data = res.data.data;
        const { itemCount } = res.data.meta;
        setParkingLocationList(data);
        setCount(itemCount);
        return parkingLocationList?.concat(data);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data.message;
        if (message instanceof Array) throw new Error(message.join(" "));
        throw new Error(message);
      }
      throw error;
    }
  };
  const createParkingLocation = async (formData: ParkingLocationFormData) => {
    try {
      const { images, ...remainData } = formData;
      const imageUrls = await Promise.all(
        images.map(async (file) => {
          if (file instanceof File) {
            const path = await uploadImage(file);
            return await getPublicUrl(path);
          }
          return file;
        })
      );
      const res = await AxiosInstance.post("/parking-location", {
        ...remainData,
        images: imageUrls,
      });
      if (res.status === 201) return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        if (message instanceof Array) throw new Error(message.join(" "));
        throw new Error(message);
      }
      throw err;
    }
  };
  const deleteParkingLocation = async (id: number) => {
    try {
      const result = await AxiosInstance.delete(`/parking-location/${id}`);
      if (result.status === 204) setParkingLocationList([...(parkingLocationList?.filter((a) => a.id !== id) ?? [])]);
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new Error(message);
      }
      throw err;
    }
  };
  const fetchOneParkingLocation = async (id: number): Promise<ParkingLocation | null> => {
    try {
      const res = await AxiosInstance.get(`/parking-location/${id}`);
      if (res.status === 200) return res.data;
      return null;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new Error(message);
      }
      throw err;
    }
  };
  const updateParkingLocation = async (
    parkingLocation: ParkingLocation,
    formData: Omit<ParkingLocationFormData, "id" | "address" | "name">
  ) => {
    try {
      const { images, ...data } = formData;
      if(!parkingLocation.images) return;
      const oldImageUrl = parkingLocation.images.map(({ url }) => url);
      const hostName = process.env.NEXT_PUBLIC_SUPABASE_URL + "/storage/v1/object/public/parkingLocation/";
      await Promise.all(
        images.map(async (file, index) => {
          const key = oldImageUrl[index].split(hostName)[1];
          if (file instanceof File) {
            const path = await replaceImage(file, key);
            return getPublicUrl(path);
          }
          return file;
        })
      );
      const res = await AxiosInstance.patch(`/parking-location/${parkingLocation.id}`, data);
      if (res.status === 200) return res.data;
    } catch (err) {
      if (err instanceof AxiosError) {
        const message = err.response?.data.message;
        throw new Error(message);
      }
      throw err;
    }
  };

  const searchParkingLocation = async (formData: SearchParkingLocationData) => {
    try {
      const { time, position,services, price, ...data} = formData;
      if (position.length != 2) return;
      if (time.length != 2) return;
      const res = await AxiosInstance.get(
        "/parking-location?" +
          queryString.stringify({
            ...data,
            services: services?.join("-"),
            lng: position[0],
            lat: position[1],
            startAt: time[0],
            endAt: time[1],
            priceStartAt: price ? price[0] : 0,
            priceEndAt: price? price[1] : 100,
            page: 1,
            take: 200,
          })
      );
      if (res.status === 200) {
        const { data } = res.data;
        return data as SearchedParkingLocation[];
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
  return {
    createParkingLocation,
    fetchOneParkingLocation,
    fetchParkingLocation,
    count,
    page,
    take,
    setTake,
    setPage,
    parkingLocationList,
    searchParkingLocation,
    deleteParkingLocation,
    updateParkingLocation,
  };
};
