"use client";
import { MouseEvent, useState } from "react";

import Menu from "@mui/icons-material/Menu";
import { AppBar, Toolbar, IconButton, Typography, Box } from "@mui/material";
import Link from "next/link";

import { useProfile } from "@/context/profileContext";

import SecondaryContainedButton from "../secondaryContainedButton/secondaryContainedButton";
import ProfilePopOver from "./profilePopOver/profilePopOver";

const NavigationBar = () => {
  const { profile, setProfile } = useProfile();
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    setProfile(null);
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
        {profile ? (
          <>
            <SecondaryContainedButton
              sx={{
                borderRadius: "30px",
                padding: "10px 30px",
              }}
              onClick={handleClick}
            >
              {profile?.name}
            </SecondaryContainedButton>
            <ProfilePopOver
              linkList={[
                { label: "Profile", href: "/profile" },
                { label: "Log out", onClick: handleLogout },
              ]}
              open={open}
              onClose={handleClose}
              anchorEl={anchorEl}
              sx={{
                "& a": {
                  color: "secondary.main",
                },
                "& .MuiPopover-paper": {
                  padding: "5px 15px",
                },
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
