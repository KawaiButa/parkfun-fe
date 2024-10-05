import { User } from "./user";

export enum PartnerType {INDIVIDUAL="individual", COMPANY="company"}

export interface Partner {
  id: number;
  location: string;
  description?: string | null;
  type: PartnerType;
  phoneNumber: string;
  user: User;
}
