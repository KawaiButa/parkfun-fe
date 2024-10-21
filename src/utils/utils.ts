"use client"
import { AxiosError } from "axios";
import dayjs, { Dayjs } from "dayjs";

import { constants } from "@/constants";

import AxiosInstance from "./axios";


const validateEmptyString = (value: string) => (value.length === 0 ? null : value);
const timeToSeconds = (time: Dayjs) => {
  const hours = time.hour();
  const minutes = time.minute();
  const seconds = time.second();
  return hours * 3600 + minutes * 60 + seconds;
};

function getNearestRoundTime(date: Dayjs, interval: number = 30): Dayjs {
  const minutes = date.minute();
  const roundedMinutes = Math.ceil(minutes / interval) * interval;

  return date.startOf("hour").add(roundedMinutes, "minute");
}

function secondToDayTime(seconds: number): Dayjs {
  const midnight = dayjs().startOf("day");
  const time = midnight.add(seconds, "second");
  return time;
}

const getDuration = (startAt: number, endAt: number) => {
  if (startAt < endAt) return endAt - startAt;
  return 86400 - (startAt - endAt);
};

const getFee = async (parkingSlotId: number): Promise<number> => {
  try{
    const res = await AxiosInstance.get(`payment/fee/${parkingSlotId}`)
    return res.data;
  } catch(err) {
    if(err instanceof AxiosError) throw err;
    else throw new Error("Error when fetching payment fee");
  }

}
const TILE_SIZE: number = 256;
const MIN_LATITUDE: number = -85.05112878;
const MAX_LATITUDE: number = 85.05112878;
const MIN_LONGITUDE: number = -180;
const MAX_LONGITUDE: number = 180;

interface GeoPoint {
  lat: number;
  lng: number;
}

function getZoomLevelForPoint(lat: number, lng: number, mapWidth: number, mapHeight: number): number {
  const latRadian = (lat * Math.PI) / 180;
  const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRadian / 2));

  const zoomX = Math.log2(((mapWidth / TILE_SIZE) * 360) / (lng + 180));
  const zoomY = Math.log2(((mapHeight / TILE_SIZE) * 2 * Math.PI) / (mercatorY + Math.PI));

  return Math.floor(Math.min(zoomX, zoomY, 23)); // 23 is the maximum zoom level in Azure Maps
}

// Function to calculate zoom level for an array of points
function getZoomLevelForPoints(points: GeoPoint[], mapWidth: number, mapHeight: number): number {
  if (points.length === 0) {
    return 0;
  }

  let minLat = MAX_LATITUDE;
  let maxLat = MIN_LATITUDE;
  let minLon = MAX_LONGITUDE;
  let maxLon = MIN_LONGITUDE;

  for (const point of points) {
    minLat = Math.max(MIN_LATITUDE, Math.min(minLat, point.lat));
    maxLat = Math.min(MAX_LATITUDE, Math.max(maxLat, point.lat));
    minLon = Math.max(MIN_LONGITUDE, Math.min(minLon, point.lng));
    maxLon = Math.min(MAX_LONGITUDE, Math.max(maxLon, point.lng));
  }

  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  const latDiff = maxLat - minLat;
  const lonDiff = maxLon - minLon;

  if(!latDiff && !lonDiff) return constants.DEFAULT_ZOOM_LEVEL 
  const latZoom = Math.log2(360 / latDiff);
  const lonZoom = Math.log2(360 / lonDiff);

  return Math.ceil(Math.max(latZoom, lonZoom, getZoomLevelForPoint(centerLat, centerLon, mapWidth, mapHeight))) - 1;
}
function calculateZoomLevel(input: GeoPoint | GeoPoint[], mapWidth: number, mapHeight: number): number {
  if (Array.isArray(input)) {
    return getZoomLevelForPoints(input, mapWidth, mapHeight);
  } else {
    return getZoomLevelForPoint(input.lat, input.lng, mapWidth, mapHeight);
  }
}

export {
  validateEmptyString,
  getDuration,
  timeToSeconds,
  getNearestRoundTime,
  secondToDayTime,
  calculateZoomLevel,
  getFee
};
