import * as yup from "yup";
export const bookingFormValidation = yup.object({
  lat: yup.number().required("Please enter a location"),
  lng: yup.number().required("Please enter a location"),
  startAt: yup.date().required("Please select a time"),
  endAt: yup.date().required("Please select a time"),
});
