import { Partner } from "./partner";
import { User } from "./user";

export interface PartnerFormData extends Omit<Partner & User, "id" | "user" | "partner"| "role">{
  password: string;
  image?: File;
}