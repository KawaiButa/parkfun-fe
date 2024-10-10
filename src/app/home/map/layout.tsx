"use client";

import { AzureMapsProvider } from "react-azure-maps";

const MapLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <AzureMapsProvider>
        <>{children}</>
      </AzureMapsProvider>
    </>
  );
};

export default MapLayout;
