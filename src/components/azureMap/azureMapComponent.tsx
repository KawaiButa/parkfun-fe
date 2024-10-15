"use client";
import React, { ReactElement } from "react";

import { IconOptions, MapMouseEvent } from "azure-maps-control";
import {
  AuthenticationType,
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapLayerProvider,
  FeatureType,
} from "react-azure-maps";

import { constants } from "@/constants";

const AzureMapComponent = <T,>(props: {
  data: T[];
  render: () => ReactElement;
  renderPopUp?: (value: T) => ReactElement;
  renderCenter?: () => ReactElement;
  iconOptions?: IconOptions;
  onClick?: (value: T) => void;
}) => {
  const { render, renderCenter, onClick, iconOptions } = props;
  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: constants.AZURE_MAP_KEY,
    },
    center: [0, 0],
    zoom: 1,
    view: "auto",
  };
  if (typeof window === "undefined") return <></>;
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <AzureMap options={option}>
          <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" rel="stylesheet" />
          <>
            <AzureMapDataSourceProvider id="center AzureMapDataSourceProvider">
              {renderCenter && renderCenter()}
            </AzureMapDataSourceProvider>
            <AzureMapDataSourceProvider id="parkingLocation AzureMapDataSourceProvider">
              <AzureMapLayerProvider
                options={{
                  iconOptions: iconOptions,
                }}
                
                events={{
                  click: (e: MapMouseEvent) => {
                    if (e.shapes && e.shapes.length > 0) {
                      const feature = e.shapes[0] as unknown as { data: FeatureType };
                      if (onClick) {
                        onClick(feature.data.properties);
                      }
                    }
                  },
                }}
                type="SymbolLayer"
              />
              {render && render()}
            </AzureMapDataSourceProvider>
          </>
        </AzureMap>
      </div>
    </>
  );
};
export default AzureMapComponent;