import dayjs from "dayjs";

export interface AzureRoute {
  lengthInMeters: number;
  travelTimeInSeconds: number;
  trafficDelayInSeconds: number;
  trafficLengthInMeters: number;
  departureTime: dayjs.Dayjs;
  arrivalTime: dayjs.Dayjs;
}
