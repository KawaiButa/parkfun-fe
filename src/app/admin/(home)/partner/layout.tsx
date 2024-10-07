import { Container } from "@mui/material";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <Container
      maxWidth={"lg"}
      sx={{
        backgroundColor: "secondary.contrastText",
        color: "secondary.main",
        borderRadius: "10px",
        padding: "20px",
        marginTop: "30px",
      }}
    >
      {children}
    </Container>
  );
};

layout.propTypes = {};

export default layout;
