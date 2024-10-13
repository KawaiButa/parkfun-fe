"use client";

import { useEffect, useState } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import PartnerForm from "@/components/partnerForm/partnerForm";
import { usePartner } from "@/hooks/usePartner";
import { Partner } from "@/interfaces";
const EditPartner = ({ params }: { params: { id: number } }) => {
  const router = useRouter();
  const { fetchOnePartner } = usePartner();
  const [partner, setPartner] = useState<Partner | null>();
  useEffect(() => {
    fetchOnePartner(params.id)
      .then((value) => {
        setPartner(value);
      })
      .catch(() => router.back());
  }, []);
  return (
    <Box>
      <Box sx={{ display: "flex", marginBottom: "20px", justifyContent: "space-between" }}>
        <Typography
          variant="h5"
          color="secondary"
          sx={{
            fontWeight: "600",
          }}
        >
          Add partner
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => router.back()}>
          Back
        </Button>
      </Box>
      <PartnerForm initValue={partner} />
    </Box>
  );
};

export default EditPartner;
