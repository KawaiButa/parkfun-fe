import * as yup from "yup";
export const bookingFormValidation = yup.object({
  lat: yup.number().required(),
  lng: yup.number().required(),
  startAt: yup.number().required(),
  endAt: yup.number().required(),
});
