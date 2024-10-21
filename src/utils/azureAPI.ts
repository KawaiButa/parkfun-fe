"use client"
import axios from "axios";
import atlas from "azure-maps-control";
import dayjs from "dayjs";
import queryString from "query-string";

import { constants } from "@/constants";
import { AzureRoute } from "@/interfaces/azureRoute";
import { DirectionMeta } from "@/interfaces/directionMeta";

export const AzureAPI = {
  routing: async (origin: number[], destination: number[] | number[][]): Promise<AzureRoute[]> => {
    try {
      const res = await axios.post(
        "https://atlas.microsoft.com/route/matrix/sync/json?api-version=1.0&subscription-key=" +
          constants.AZURE_MAP_KEY,
        {
          origins: {
            type: "MultiPoint",
            coordinates: [origin],
          },
          destinations: {
            type: "MultiPoint",
            coordinates: destination[0] instanceof Array ? destination : [destination],
          },
        }
      );
      if (res.status == 200) {
        return (res.data.matrix[0] as { statusCode: number; response: { routeSummary: AzureRoute } }[]).map(
          ({ response: { routeSummary } }) => routeSummary
        ) as AzureRoute[];
      } else return [];
    } catch {
      throw new Error("Error when fetching route data from Azure.");
    }
  },
  directions: async (origin: number[], destination: number[] | number[][]) => {
    try {
      const res = await axios.get(
        "https://atlas.microsoft.com/route/directions/json?api-version=1.0&" + queryString.stringify({
          query: `${origin.join(",")}:${destination.join(",")}`,
        }),
        {
          headers: {
            "Subscription-Key": constants.AZURE_MAP_KEY,
          },
        }
      );
      if (res.status == 200) {
        return getFeaturesAndMetaData(res.data.routes)
      } else return null;
    } catch (err) {
      throw new Error("Error when fetching directions data from Azure."+(err as Error).message);
    }
  },
};

const getFeaturesAndMetaData = (
  routes: Array<{
    summary: {
      lengthInMeters: number;
      travelTimeInSeconds: number;
      trafficDelayInSeconds: number;
      trafficLengthInMeters: number;
      departureTime: string;
      arrivalTime: string;
    };
    legs: Array<{ points: Array<{ latitude: number; longitude: number }> }>;
  }>
):{featuresCollection: atlas.data.FeatureCollection, meta: DirectionMeta} => {
  const bounds: Array<number[]> = [];
  const features = routes.map((route, index) => {
    const multiLineCoords = route.legs.map((leg) => {
      return leg.points.map((coord) => {
        const position = [coord.longitude, coord.latitude];
        bounds.push(position);
        return position;
      });
    });
    const props = {
      ...route,
      resultIndex: index,
    };
    return new atlas.data.Feature(
      {
        type: "MultiLineString",
          coordinates: multiLineCoords,
        properties: props,
      }
    );
  })
  const {arrivalTime, departureTime} = routes[0].summary;
  return {
    featuresCollection: new atlas.data.FeatureCollection(features, atlas.data.BoundingBox.fromLatLngs(bounds as Array<number[]>)),
    meta: {
      ...routes[0].summary,
      departureTime: dayjs(departureTime),
      arrivalTime: dayjs(arrivalTime),
    },
  };
};
