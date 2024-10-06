import * as yup from "yup";

import { LoginFormData } from "@/interfaces/loginFormData";

export const loginValidationSchema:yup.ObjectSchema<LoginFormData> =  yup.object({
  email: yup.string().required("Please enter your email").email("Please enter valid email address"),
  password: yup.string().required("Please enter your password").min(8, "Password must be at least 8 characters long"),
});
