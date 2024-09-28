"use client";
import { MouseEvent, useEffect, useState } from "react";

import { alpha, Button, Container, Menu, MenuItem, MenuProps, styled } from "@mui/material";
import { useRouter } from "next/navigation";
const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: "rgb(55, 65, 81)",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const ProfileButton = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; phoneNumber?: string } | undefined>(undefined);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  useEffect(() => {
    const localStorage = window.localStorage;
    const token = localStorage.getItem("accessToken");
    const profileData = localStorage.getItem("profile");
    if (token && profileData) {
      setProfile(JSON.parse(profileData));
    }
  }, []);
  function handleLogout(event: MouseEvent): void {
    event.preventDefault();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    setProfile(undefined);
    router.push("/");
    handleClose();
  }

  function handleProfile(event: MouseEvent): void {
    event.preventDefault();
    router.push("/profile");
    handleClose();
  
  }
  if (!profile) {
    return (
      <Container
        sx={{
          width: "fit-content",
          display: {
            md: "flex",
            xs: "none",
          },
          gap: "10px",
          paddingRight: "0",
        }}
      >
        <Button
          color="secondary"
          variant="contained"
          sx={{
            fontWeight: "500",
          }}
          href="auth/login"
        >
          Login
        </Button>
        <Button
          color="secondary"
          variant="contained"
          sx={{
            fontWeight: "500",
          }}
          href="auth/signup"
        >
          Sign-up
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{
      display: {
        md: "flex",
        xs: "none",
      },
      width: "fit-content",
    }}>
      <Button
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        color="secondary"
        variant="contained"
        sx={{
          borderRadius: "30px",
          padding: "10px 30px",
        }}
        onClick={handleClick}
      >
        {profile?.name}
      </Button>
      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleProfile}>Profile</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </StyledMenu>
    </Container>
  );
};

export default ProfileButton;
