export interface SearchParkingLocationData {
  
  lat: number;

  lng: number;

  radius: number;

  priceStartAt?: number;

  priceEndAt?: number;

  startAt?: number;

  endAt?: number;

  services?: string;  
}