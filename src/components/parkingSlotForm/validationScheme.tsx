"use client";
import * as yup from "yup";

import { ParkingSlotFormData } from "@/interfaces/parkingSlotFormData";

export const parkingSlotSchema: yup.ObjectSchema<ParkingSlotFormData> = yup.object({
  parkingLocationId: yup.number().required("Parking Location ID is required"),
  type: yup.number().required("Type is required"),
  space: yup.number().required("Space is required").min(1, "Space is at least one"),
  price: yup.number().required("Price is required"),
  width: yup.number().required("Width is required"),
  height: yup.number().required("Height is required"),
  length: yup.number().required("Length is required"),
  startTime: yup.date().required("Start Time is required"),
  endTime: yup.date().required("End Time is required"),
  images: yup.array().length(4, "Please provide at least 4 images").required("Images are required"),
  services: yup.array().required(),
});
