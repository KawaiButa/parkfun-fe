"use client";
import { MouseEvent, useContext, useState } from "react";

import { AppBar, Toolbar, Typography, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { AuthenticationContext } from "@toolpad/core";
import { useTranslations } from "next-intl";

import { constants } from "@/constants";
import { useSession } from "@/context/authenticationContext";
import { Link, usePathname, useRouter } from "@/i18n/routing";

import SecondaryContainedButton from "../secondaryContainedButton/secondaryContainedButton";
import ProfilePopOver from "./profilePopOver/profilePopOver";

const NavigationBar = () => {
  const t = useTranslations("navigationBar");
  const authentication = useContext(AuthenticationContext);
  const session = useSession();
  const router = useRouter();
  const pathName = usePathname();
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
        <Typography
          variant="h3"
          color="secondary"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: {
              xs: "1rem",
              md: "2rem",
            },
          }}
        >
          <Link href="/">{constants.PROJECT_NAME}</Link>
        </Typography>
        <FormControl
          size="small"
          sx={{
            width: "100px",
            mr: 2,
          }}
          color="secondary"
        >
          <InputLabel color="secondary">Lang</InputLabel>
          <Select
            label="Lang"
            onChange={(e) => {
              router.replace({ pathname: pathName}, { locale: e.target.value as string });
            }}
          >
            <MenuItem value="vi" color="secondary">
              Vi
            </MenuItem>
            <MenuItem value="en" color="secondary">
              En
            </MenuItem>
          </Select>
        </FormControl>

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
                { label: t("profile"), href: "/home/profile" },
                { label: t("logout"), onClick: handleLogout },
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
              <Link href="/auth/login">{t("login")}</Link>
            </SecondaryContainedButton>
            <SecondaryContainedButton
              sx={{
                fontWeight: "500",
              }}
            >
              <Link href="/auth/signup">{t("signUp")}</Link>
            </SecondaryContainedButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
