import { Container, Typography } from "@mui/material";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container
      sx={{
        width: {
          xs: "90%",
        },
        padding: "10px !important",
        marginTop: "30px",
        backgroundColor: "var(--secondary-text-color)",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <Container sx={{ justifyContent: "space-between", display: "flex" }}>
        <Typography variant="h5" fontWeight={"500"}>
          Profile
        </Typography>
      </Container>
      {children}
    </Container>
  );
};

layout.propTypes = {};

export default layout;
