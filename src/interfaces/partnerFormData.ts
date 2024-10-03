import { Partner } from "./partner";
import { User } from "./user";

export interface PartnerFormData extends Omit<Partner & User, "id" | "user">{
  password: string;
}