import { CredentialResponse } from "@react-oauth/google";

import { LoginFormData } from "@/interfaces/loginFormData";
import { RegisterFormData } from "@/interfaces/registerFormData";

import AxiosInstance from "./axios";
import { Profile } from "@/interfaces/profile";

async function loginWithEmailAndPassword({ email, password }: LoginFormData): Promise<Profile | null> {
  const res = await AxiosInstance.post("/auth/login", { email, password });
  if (res.status == 200) {
    localStorage.setItem("profile", JSON.stringify(res.data.user));
    return res.data.user;
  }
  return null;
}

async function handleLoginWithGoogleSuccess({ credential, clientId }: CredentialResponse) {
  const res = await AxiosInstance.post("/auth/google", {
    credential,
    clientId,
  });
  if (res.status == 200) {
    localStorage.setItem("profile", JSON.stringify(res.data.user));
  }
}

async function registerNewUser(data: RegisterFormData) {
  data.phoneNumber = Boolean(data.phoneNumber) ? data.phoneNumber : null;
  const res = await AxiosInstance.post("/auth/register", data);
  if (res.status == 201) {
    localStorage.setItem("profile", JSON.stringify(res.data.user));
    return res.data.user;
  }
  return null;
}
export { loginWithEmailAndPassword, handleLoginWithGoogleSuccess, registerNewUser };
