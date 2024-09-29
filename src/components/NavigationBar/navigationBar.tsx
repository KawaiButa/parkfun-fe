import Menu from "@mui/icons-material/Menu";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import Link from "next/link";

import ProfileButton from "./ProfileButton/profileButton";

const NavigationBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            mr: {
              xs: 0,
              md: 2,
            },
          }}
        >
          <Menu />
        </IconButton>
        <Typography
          variant="h3"
          color="secondary"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: {
              xs: "30px",
              md: "40px",
            },
          }}
        >
          <Link href="/">
            PARKFUN
          </Link>
        </Typography>
          <ProfileButton />
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
