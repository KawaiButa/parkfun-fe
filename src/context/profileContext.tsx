"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

import { User } from "@/interfaces";

const ProfileContext = createContext<{
  profile: User | null;
  setProfile: Dispatch<SetStateAction<User | null>>;
}>({ profile: null, setProfile: () => {} });
const ProfileContextProvider = ({ children }: { children: ReactNode }) => {
  const profileData = window.localStorage.getItem("profile");
  const token = window.localStorage.getItem("accessToken");
  const checkedData = token && profileData ? JSON.parse(profileData!) : null;
  const [profile, setProfile] = useState<User | null>(checkedData);
  return <ProfileContext.Provider value={{ profile, setProfile }}>{children}</ProfileContext.Provider>;
};

const useProfile = () => useContext(ProfileContext);

export { useProfile, ProfileContextProvider };
