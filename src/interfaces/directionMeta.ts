import { Dayjs } from "dayjs";

export interface DirectionMeta {
  lengthInMeters: number;
  travelTimeInSeconds: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  departureTime: Dayjs;
  arrivalTime: Dayjs;
}
