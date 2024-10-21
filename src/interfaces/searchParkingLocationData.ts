import { Dayjs } from "dayjs";

export interface SearchParkingLocationData {
  position: number[];

  type?: number | string;

  price?: number[];

  time: Dayjs[];

  radius?: number;

  services?: number[];

  width?: number;

  height?: number;
  
  length?: number;
  
  lat: number;

  lng: number;

  priceStartAt?: number;

  priceEndAt?: number;

  startAt?: number;

  endAt?: number;

}
