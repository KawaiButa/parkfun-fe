"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import ParkingSlotForm from "@/components/parkingSlotForm/parkingSlotForm";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { ParkingSlot } from "@/interfaces/parkingSlot";

const EditParkingSlotPage = ({ params }: { params: { id: number } }) => {
  const [parkingSlot, setParkingSlot] = useState<ParkingSlot | null>();
  const {parkingLocationList, fetchParkingLocation} = useParkingLocation();
  const { fetchOneParkingSlot } = useParkingSlot();
  const router = useRouter();
  useEffect(() => {
    fetchOneParkingSlot(params.id)
      .then((value) => setParkingSlot(value))
      .catch(() => router.back());
    fetchParkingLocation()
  }, []);
  return <ParkingSlotForm parkingLocationList={parkingLocationList ?? []} initValue={parkingSlot} />;
};

export default EditParkingSlotPage;
