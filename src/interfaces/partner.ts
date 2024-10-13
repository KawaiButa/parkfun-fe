import { PartnerType } from "./partnerType";
import { User } from "./user";

export interface Partner {
  id: number;
  location: string;
  description?: string | null;
  type: PartnerType;
  phoneNumber: string;
  user: User;
}
