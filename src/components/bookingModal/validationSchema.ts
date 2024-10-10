import * as yup from "yup";

import { BookingFormData } from "@/interfaces/bookingFormData";
export const bookingValidationSchema:yup.ObjectSchema<BookingFormData> = yup.object({
  parkingSlotId: yup.number().required(),
  services: yup.array(yup.number().required()),
  time: yup.array(yup.number().required()).length(2).required(),
})