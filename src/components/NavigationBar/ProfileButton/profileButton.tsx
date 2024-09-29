"use client";
import { MouseEvent, useState } from "react";

import { alpha, Button, Container, Menu, MenuItem, MenuProps, styled } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useProfile } from "@/context/profileContext";
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
    color: "var(--container-color)",
    boxShadow: "var(--dropdown-menu-shadow)",
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
  const { profile, setProfile } = useProfile();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  function handleLogout(event: MouseEvent): void {
    event.preventDefault();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("profile");
    setProfile(null);
    router.push("/");
    handleClose();
  }
  function handleProfile(event: MouseEvent): void {
    event.preventDefault();
    router.push("/profile");
    handleClose();
  }
  return (
    <Container
      sx={{
        display: {
          md: "flex",
          xs: "none",
        },
        width: "fit-content",
        gap: "10px",
        paddingRight: "0",
      }}
    >
      {profile ? (
        <>
          <Button
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
        </>
      ) : (
        <>
          <Button
            color="secondary"
            variant="contained"
            sx={{
              fontWeight: "500",
            }}
          >
            <Link href="/auth/login">Login</Link>
          </Button>
          <Button
            color="secondary"
            variant="contained"
            sx={{
              fontWeight: "500",
            }}
          >
            <Link href="/auth/signup">Sign up</Link>
          </Button>
        </>
      )}
    </Container>
  );
};

export default ProfileButton;
