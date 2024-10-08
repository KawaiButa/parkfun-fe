"use client"
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
  const debouncedValue = useDebounce(param, 500);
  const search = (value: string) => {
    client
      .path("/geocode")
      .get({ queryParameters: { query: value } })
      .then((res) => {
        if (isUnexpected(res)) {
          throw res.body.error;
        }

        if (res.body.features) {
          const result =  (res.body.features ?? []);
          setLocation(result);
        }
        return [];
      });
  };
  useEffect(() => {
    search(debouncedValue);
  }, [debouncedValue])
  return { locations, setParam };
};
