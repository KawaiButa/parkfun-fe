import { Box } from "@mui/material";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  //TODO: DEV ADMIN LAYOUT
  return <Box>{children}</Box>;
};

layout.propTypes = {};

export default layout;
