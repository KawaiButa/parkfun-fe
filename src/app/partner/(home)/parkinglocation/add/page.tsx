import { Container } from "@mui/material";

import ParkingLocationForm from "@/components/parkingLocationForm/parkingLocationFrom";

const Parking = () => {
  return (
    <Container
      sx={{
        backgroundColor: "background.default",
        borderRadius: "10px",
      }}
    >
        <ParkingLocationForm />
    </Container>
  );
};

export default Parking;
