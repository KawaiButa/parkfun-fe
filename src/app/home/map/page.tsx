/* eslint-disable @next/next/no-img-element */
"use client";

import dynamic from "next/dynamic";

const MapPageWithoutSSR = dynamic(() => import("@/components/mapPage/mapPage"), {
  ssr: false,
});
const Page = () => {
  return  <MapPageWithoutSSR />;
};
export default Page;
