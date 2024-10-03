import { Container, Typography } from "@mui/material";

import BookingForm from "@/components/bookingForm/bookingForm";
import { constants } from "@/constants";

export default function Home() {
  return (
    <>
      <Container
        sx={{
          margin: 0,
          width: "100%",
          maxWidth: "100% !important",
          gap: "20px",
          backgroundImage: "linear-gradient(to right, var(--secondary-color), transparent)",
          height: "100vh",
          display: "flex",
          justifyContent: "flex-end",
          alignContent: "center",
          flexWrap: "wrap",
          padding: {
            xs: "10px",
          },
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Container maxWidth="md" sx={{ marginLeft: 0, marginRight: "auto", height: "fit-content" }}>
          <Typography
            variant="h2"
            color="primary"
            sx={{
              fontWeight: "bold",
              fontSize: {
                xs: "40px",
                md: "100px",
              },
            }}
          >
            {constants.PROJECT_NAME}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: "15px",
                md: "20px",
              },
              color: "var(--secondary-text-color)",
            }}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur illum dolor sit, reiciendis magnam
            fugit nulla culpa nemo eaque alias assumenda maiores ducimus repellendus aut, exercitationem cupiditate
            autem quia accusantium?
          </Typography>
        </Container>
        <BookingForm sx={{ display: "flex", flexDirection: "row-reverse", marginRight: 0, height: "fit-content" }} />
      </Container>
    </>
  );
}
