import * as yup from "yup";

import { RegisterFormData } from "@/interfaces/registerFormData";
export const registerValidationSchema: yup.ObjectSchema<RegisterFormData> = yup.object({
  email: yup.string().required("The email address is required").email("The email is invalid"),
  name: yup.string().required("The name is required"),
  password: yup.string().required("The password is required").min(8, "The password must be at least 8 characters"),
  confirmPassword: yup
    .string()
    .required("The confirm password is required")
    .when("password", ([password]) =>
      yup
        .string()
        .min(8, "The confirm password must be at least 8 characters")
        .matches(password, "The password and confirm password do not match")
    ),
  phoneNumber: yup
    .string()
    .optional()
    .matches(/^\+?\d{1,15}$/, "The phone number is invalid")
    .min(10, "The phone number is invalid"),
});
