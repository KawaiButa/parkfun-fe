"use client";
import * as yup from "yup";

import { PartnerType } from "@/interfaces/partner";
import { PartnerFormData } from "@/interfaces/partnerFormData";
import { validateEmptyString } from "@/utils/utils";
export const partnerValidationSchema: yup.ObjectSchema<PartnerFormData> = yup.object({
  name: yup.string().required("The name is required"),
  email: yup.string().required("The email address is required").email("The email is invalid"),
  phoneNumber: yup.string().required("The phone number is required"),
  location: yup.string().required("The location is required"),
  description: yup.string().optional(),
  type: yup.mixed<PartnerType>().required(),
  avatarUrl: yup.string().notRequired().url().nullable().transform(validateEmptyString),
  password: yup.string().required().default(window.crypto.randomUUID().split("-").join("")),
});
