"use client";
import * as yup from "yup";

import { PartnerFormData } from "@/interfaces/partnerFormData";
export const partnerValidationSchema: yup.ObjectSchema<PartnerFormData> = yup.object({
  name: yup.string().required("The name is required"),
  email: yup.string().required("The email address is required").email("The email is invalid"),
  phoneNumber: yup.string().required("The phone number is required"),
  location: yup.string().required("The location is required"),
  description: yup.string().required(),
  typeId: yup.number().required("The type is required"),
  image: yup
    .mixed<File | string>().required()
    .test("isFile", "The provided data is not image", (avatar) => (typeof avatar === "string" || avatar instanceof File)),
  password: yup.string().required().default(window.crypto.randomUUID().split("-").join("")),
});
