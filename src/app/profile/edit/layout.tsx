import { Container } from "@mui/material";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <Container>{children}</Container>;
};

layout.propTypes = {};

export default layout;
