"use client";
import { MouseEvent, useContext, useState } from "react";

import Menu from "@mui/icons-material/Menu";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import { AuthenticationContext } from "@toolpad/core";
import Link from "next/link";

import { useSession } from "@/context/authenticationContext";

import SecondaryContainedButton from "../secondaryContainedButton/secondaryContainedButton";
import ProfilePopOver from "./profilePopOver/profilePopOver";

const NavigationBar = () => {
  const authentication = useContext(AuthenticationContext);
  const session = useSession();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleLogout(event: MouseEvent): void {
    event.preventDefault();
    authentication?.signOut();
    handleClose();
  }
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
          <Link href="/">PARKFUN</Link>
        </Typography>
        {session ? (
          <>
            <SecondaryContainedButton
              sx={{
                borderRadius: "30px",
                padding: "10px 30px",
              }}
              onClick={handleClick}
            >
              {session?.user?.name}
            </SecondaryContainedButton>
            <ProfilePopOver
              linkList={[
                { label: "Profile", href: "/home/profile" },
                { label: "Log out", onClick: handleLogout },
              ]}
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              color="secondary.contrastText"
              sx={{
                p: 0,
              }}
            />
          </>
        ) : (
          <Box sx={{ display: "flex", gap: "10px" }}>
            <SecondaryContainedButton
              sx={{
                fontWeight: "500",
              }}
            >
              <Link href="/auth/login">Login</Link>
            </SecondaryContainedButton>
            <SecondaryContainedButton
              sx={{
                fontWeight: "500",
              }}
            >
              <Link href="/auth/signup">Sign up</Link>
            </SecondaryContainedButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
