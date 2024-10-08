"use client";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";

import { PartnerFormData } from "@/interfaces/partnerFormData";
import { validateEmptyString } from "@/utils/utils";
export const partnerValidationSchema: yup.ObjectSchema<PartnerFormData> = yup.object({
  name: yup.string().required("The name is required"),
  email: yup.string().required("The email address is required").email("The email is invalid"),
  phoneNumber: yup.string().required("The phone number is required"),
  location: yup.string().required("The location is required"),
  description: yup.string().required(),
  typeId: yup.number().required("The type is required"),
  image: yup
    .mixed<File | string>()
    .required()
    .test("isFile", "The provided data is not image", (avatar) => typeof avatar === "string" || avatar instanceof File),
  avatarUrl: yup.string().notRequired().url().nullable().transform(validateEmptyString),
  password: yup.string().required().default(uuidv4()),
});
