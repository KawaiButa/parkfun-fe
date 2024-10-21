import * as yup from "yup";

import { BookingFormData } from "@/interfaces/bookingFormData";
export const bookingValidationSchema:yup.ObjectSchema<BookingFormData> = yup.object({
  parkingSlotId: yup.number().required(),
  serviceIds: yup.array(yup.number().required()),
  time: yup.array().length(2).required(),
})