"use client";

import dynamic from "next/dynamic";

const MapPageWithoutSSR = dynamic(() => import("@/components/bookingPage/bookingPage"), {
  ssr: false,
});
const Page = () => {
  return  <MapPageWithoutSSR />;
};
export default Page;
