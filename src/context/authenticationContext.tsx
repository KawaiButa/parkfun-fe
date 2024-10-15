"use client";
import { ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { AuthenticationContext, Session, SessionContext } from "@toolpad/core";
import { useRouter } from "next/navigation";

const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
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
        localStorage.removeItem("booking");
        router.push("/logout");
      },
    };
  }, []);
  useEffect(() => {
    authentication.signIn();
  }, [authentication]);
  return (
    <AuthenticationContext.Provider value={authentication}>
      <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
    </AuthenticationContext.Provider>
  );
};

const useSession = () => useContext(SessionContext);

export { useSession, SessionProvider };
