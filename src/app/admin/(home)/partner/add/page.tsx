"use client";

import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";

import PartnerForm from "@/components/partnerForm/partnerForm";
const AddPartner = () => {
  
  const router = useRouter();

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
      <PartnerForm />
    </Box>
  );
};

export default AddPartner;
