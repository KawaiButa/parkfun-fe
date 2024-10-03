"use client";
import { ReactNode, useContext, useMemo, useState } from "react";

import { AuthenticationContext, Session, SessionContext } from "@toolpad/core";

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const profileData = window.localStorage.getItem("profile");
  const token = window.localStorage.getItem("accessToken");
  const data = token && profileData ? JSON.parse(profileData!) : null;
  const [session, setSession] = useState<Session | null>(
    data && { user: { email: data.email, name: data.name, image: data.avatarUrl } }
  );
  const authentication = useMemo(() => {
    return {
      signIn: () => {
        const profileData = window.localStorage.getItem("profile");
        const token = window.localStorage.getItem("accessToken");
        const data = token && profileData ? JSON.parse(profileData!) : null;
        if (data) setSession({ user: { email: data.email, name: data.name, image: data.avatarUrl } });
      },
      signOut: () => {
        setSession(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("profile");
      },
    };
  }, []);
  return (
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
    </AuthenticationContext.Provider>
  );
};

const useSession = () => useContext(SessionContext);

export { useSession, SessionProvider };
