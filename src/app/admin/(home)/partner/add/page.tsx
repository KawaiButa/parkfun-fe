"use client";

import { Suspense } from "react";

import { Box, Button, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

import PartnerForm from "@/components/partnerForm/partnerForm";
const AddPartner = () => {
  const router = useRouter();

  return (
    <Suspense>
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
          </Typography>{" "}
          <Button variant="contained" color="secondary" onClick={() => router.replace("/user")}>
            Back
          </Button>
        </Box>
        <PartnerForm />
      </Box>
    </Suspense>
  );
};

export default AddPartner;
