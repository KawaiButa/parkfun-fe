import * as yup from "yup";

import { ParkingLocationFormData } from "@/interfaces/parkingLocationForm";

export const parkingLocationSchema: yup.ObjectSchema<ParkingLocationFormData> = yup.object({
  name: yup.string().required("The name is required"),
  address: yup.string().required("The address is required"),
  lat: yup.number().optional(),
  lng: yup.number().optional(),
  description: yup.string().required(),
  access: yup.string().required(),
  partnerId: yup.number().required(),
  paymentMethodId: yup.number().required(),
  pricingOptionId: yup.number().required(),
  imageList: yup.array().length(4, "Please provide at leasst 4 images").required(),
});
