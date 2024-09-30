import { Button, Container, ContainerOwnProps, FormControl, Input, Typography, TypographyProps } from "@mui/material";

import { constants } from "@/constants";

import BookingTimePicker from "./bookingTimePicker/bookingTimePicker";
const StyledTypography = ({ children, ...props }: TypographyProps) => (
  <Typography variant="h6" color="secondary" {...props}>
    {children}
  </Typography>
);
function BookingForm(props: ContainerOwnProps) {
  return (
    <Container
      maxWidth="md"
      {...props}
      sx={{
        ...props.sx,
        backgroundColor: "var(--form-background-color)",
        borderRadius: "10px",
        padding: {
          xs: "15px",
          md: "20px 20px",
        },
        gap: "20px",
        display: "flex",
        flexDirection: {
          xs: "column",
          md: "row",
        },
      }}
    >
      <Container
        sx={{
          height: {
            xs: "200px",
            md: "unset",
          },
          width: {
            xs: "100%",
            md: "50%",
          },
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "var(--secondary-color)",
          minWidth: "200px",
        }}
      />
      <FormControl
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column-reverse",
          }}
          disableGutters
        >
          <Typography
            variant="h2"
            color="secondary"
            sx={{
              fontWeight: "bold",
              fontSize: {
                xs: "30px",
                md: "40px",
              },
            }}
          >
            {constants.PROJECT_NAME}
          </Typography>
          <StyledTypography
            sx={{
              fontSize: {
                xs: "15px",
                md: "20px",
              },
            }}
          >
            Simplify your parking experience
          </StyledTypography>
        </Container>
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          1. Choose your location
        </StyledTypography>
        <Container
          sx={{
            width: "100%",
            height: "45px",
            borderRadius: "5px",
            backgroundColor: "var(--secondary-text-color)",
            padding: "6px",
          }}
        >
          <Input placeholder="Search here" disableUnderline={true} />
        </Container>
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          2. Select the time and duration
        </StyledTypography>
        <BookingTimePicker />
        <StyledTypography
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          3. Continue to checkout and start parking!!!!
        </StyledTypography>
        <Button
          color="primary"
          variant="contained"
          sx={{
            fontWeight: "bold",
          }}
        >
          Book
        </Button>
      </FormControl>
    </Container>
  );
}

export default BookingForm;
