/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useReducer, useRef } from "react";

const MapLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const reactAzureMapRef = useRef<any | null>(null);
  const forceUpdate = useReducer(() => ({}), {})[1];
  useEffect(() => {
    import("react-azure-maps").then((value) => {
      (reactAzureMapRef.current = value);
      forceUpdate()
    });
  }, []);
  return (
    <>
      {reactAzureMapRef.current && (
        <reactAzureMapRef.current.AzureMapsProvider>
          <>{children}</>
        </reactAzureMapRef.current.AzureMapsProvider>
      )}
    </>
  );
};

export default MapLayout;
