import { Container, Typography } from "@mui/material";

import BookingForm from "@/components/bookingForm/bookingForm";

export default function Home() {
  return (
    <>
      <Container
        sx={{ margin: 0, width: "100%", maxWidth: "100% !important", marginTop: "30px", backgroundImage: "linear-gradient(to right, black, transparent)"}}
      >
        <BookingForm sx={{ display: "flex", flexDirection: "row-reverse", marginRight: 0}} />
        <Container
          maxWidth="md"
          sx={{ marginLeft: 0, marginRight: "auto", marginTop: "10vw", height: "100vh" }}
        >
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
            PARKFUN
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: {
                xs: "15px",
                md: "20px",
              },
            }}
          >
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aspernatur illum dolor sit, reiciendis magnam
            fugit nulla culpa nemo eaque alias assumenda maiores ducimus repellendus aut, exercitationem cupiditate
            autem quia accusantium?
          </Typography>
        </Container>
      </Container>
    </>
  );
}
