import { Container, Typography } from "@mui/material";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ContainerFlexColumn
      sx={{
        width: {
          xs: "90%",
        },
        padding: "10px !important",
        marginTop: "30px",
        backgroundColor: "var(--secondary-text-color)",
        borderRadius: "10px",
        alignSelf: "center",
        alignContent: "center",
      }}
      disableGutters
    >
      <Container sx={{ justifyContent: "space-between", display: "flex" }}>
        <Typography variant="h5" fontWeight={"500"}>
          Profile
        </Typography>
      </Container>
      {children}
    </ContainerFlexColumn>
  );
};

layout.propTypes = {};

export default layout;
