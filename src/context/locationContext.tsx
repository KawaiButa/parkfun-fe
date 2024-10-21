"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";


const LocationContext = createContext<{
  location: number[]| null;
}>({ location: null });
const LocationContextProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<number[] | null>(null);
  useEffect(() => {
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation([position.coords.longitude, position.coords.latitude]);
        });
    }
    
  }, []);
  return <LocationContext.Provider value={{ location }}>{children}</LocationContext.Provider>;
};

const useLocation = () => useContext(LocationContext);

export { useLocation, LocationContextProvider };
