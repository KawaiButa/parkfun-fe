import * as yup from "yup";

import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";

export const parkingLocationSchema: yup.ObjectSchema<ParkingLocationFormData> = yup.object({
  name: yup.string().required("The name is required"),
  address: yup.string().required("The address is required"),
  lat: yup.number().required(),
  lng: yup.number().required(),
  description: yup.string().required(),
  access: yup.string().required(),
  paymentMethodId: yup.number().required(),
  pricingOptionId: yup.number().required(),
  images: yup.array().length(4, "Please provide at least 4 images").required(),
});
