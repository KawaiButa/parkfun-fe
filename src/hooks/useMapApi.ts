"use client";
import { useEffect, useState } from "react";

import { AzureKeyCredential } from "@azure/core-auth";
import MapsSearch, { FeaturesItemOutput, isUnexpected } from "@azure-rest/maps-search";

import { constants } from "@/constants";

import useDebounce from "./useDebounce";

const credential = new AzureKeyCredential(constants.AZURE_MAP_KEY);
const client = MapsSearch(credential);

export const useSearchMapAPI = () => {
  const [param, setParam] = useState("");
  const [locations, setLocation] = useState<FeaturesItemOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedValue = useDebounce(param, 200);
  const search = (value: string) => {
    if(value === "") return
    client
      .path("/geocode")
      .get({ queryParameters: { query: value } })
      .then((res) => {
        setIsLoading(false);
        if (isUnexpected(res)) {
          throw res.body.error;
        }
        if (res.body.features) {
          const result = res.body.features ?? [];
          setLocation(result);
        }
      });
  };
  useEffect(() => {
    setIsLoading(true)
    search(debouncedValue);
  }, [debouncedValue]);
  return { locations, isLoading, setParam};
};
