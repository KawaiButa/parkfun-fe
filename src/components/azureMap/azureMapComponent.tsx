import React, { ReactElement, useEffect, useState } from "react";

import { IconOptions, MapMouseEvent } from "azure-maps-control";
import {
  AuthenticationType,
  AzureMap,
  AzureMapDataSourceProvider,
  AzureMapFeature,
  AzureMapLayerProvider,
  AzureMapPopup,
  FeatureType,
  useAzureMaps,
} from "react-azure-maps";

import { constants } from "@/constants";

const AzureMapComponent = <T,>(props: {
  data: T[];
  render: (value: T) => ReactElement;
  renderPopUp?: (value: T) => ReactElement;
  iconOptions?: IconOptions;
  onClick?: (value: T) => void;
}) => {
  const { data, render, renderPopUp, onClick, iconOptions } = props;
  const [userLocation, setUserLocation] = useState<number[] | null>(null);
  const { mapRef, isMapReady } = useAzureMaps();
  const [popUpOption, setPopupOption] = useState({});
  const [center, setCenter] = useState<number[]>([0, 0]);
  const [selected, setSelected] = useState<T | null>(null);
  useEffect(() => {
    if (mapRef) {
      mapRef.events.add("ready", () => {
        navigator.geolocation.getCurrentPosition((position) => {
          setCenter([position.coords.longitude, position.coords.latitude]);
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        });
      });
    }
  }, [mapRef, isMapReady]);
  useEffect(() => {
    if (mapRef) {
      mapRef.setCamera({ center: center, zoom: 16 });
    }
  }, [center]);
  const option = {
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: constants.AZURE_MAP_KEY,
    },
    center: center ?? [0, 0],
    zoom: 1,
    view: "auto",
  };
  return (
    <>
      <div style={{ height: "100vh", width: "100%" }}>
        <AzureMap options={option}>
          <link href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" rel="stylesheet" />
          <>
            <AzureMapDataSourceProvider id="userLocation AzureMapDataSourceProvider">
              {userLocation && (
                <>
                  <AzureMapLayerProvider
                    type="SymbolLayer"
                    options={{
                      iconOptions: {
                        image: "pin-red",
                      },
                    }}
                  />
                  <AzureMapFeature
                    id={"user"}
                    type="Point"
                    coordinate={userLocation}
                    properties={{
                      id: "user",
                    }}
                  />
                </>
              )}
            </AzureMapDataSourceProvider>
            <AzureMapDataSourceProvider id="multiItem AzureMapDataSourceProvider">
              <AzureMapLayerProvider
                options={{
                  iconOptions: iconOptions,
                }}
                events={{
                  click: (e: MapMouseEvent) => {
                    if (e.shapes && e.shapes.length > 0) {
                      const feature = e.shapes[0] as unknown as { data: FeatureType };
                      setSelected(feature.data.properties ?? null);
                      setPopupOption({
                        position: [feature.data.geometry.coordinates[0], feature.data.geometry.coordinates[1]],
                        pixelOffset: [0, -30],
                      });
                      if (onClick) {
                        onClick(feature.data.properties);
                      }
                    }
                  },
                }}
                type="SymbolLayer"
              />
              {data.map((value) => render(value))}
            </AzureMapDataSourceProvider>
            {selected && renderPopUp && (
              <AzureMapPopup isVisible={true} options={popUpOption} popupContent={renderPopUp(selected)} />
            )}
          </>
        </AzureMap>
      </div>
    </>
  );
};
export default AzureMapComponent;
