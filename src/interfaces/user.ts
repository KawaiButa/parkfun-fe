import { Image } from "./image";
import { Partner } from "./partner";
import { Role } from "./role";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  partner?: Partner;
  image: Image;
}