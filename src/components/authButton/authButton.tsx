"use client";
import { useState, MouseEvent } from "react";

import { Container, ContainerProps, styled, Typography, TypographyProps } from "@mui/material";
import { useRouter } from "next/navigation";
const StyledTypography = styled((props: TypographyProps) => {
  const { sx, ...remain } = props;
  return (
    <Typography
      {...remain}
      sx={{
        ...sx,
        fontSize: {
          xs: "14px",
          md: "20px",
        },
        alignSelf: "center",
        fontWeight: 600,
      }}
      {...props}
      color="secondary"
    />
  );
})();
const AuthButton = (props: ContainerProps) => {
  const [pathName, setPathName] = useState(window.location.pathname !== "/auth/signup" ? "Login" : "Signup");
  const buttonText = pathName === "Login" ? "Sign up" : "Login";
  const router = useRouter();
  function handleChangePage(event: MouseEvent, href: string): void {
    event.preventDefault();
    router.replace(href);
    setPathName(buttonText);
  }

  return (
    <Container {...props}>
      <Typography variant="h4" color="primary" align="center" fontWeight={"600"}>
        {pathName}
      </Typography>
      <Container
        sx={{
          width: {
            xs: "170px",
            md: "225px",
          },
          height: "40px",
          padding: "0 20px",
          marginTop: "10px",
          backgroundColor: "var(--secondary-text-color)",
          borderRadius: "20px",
          border: "none",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <Container
          sx={{
            width: "55%",
            height: "40px",
            padding: "0 10px !important",
            backgroundColor: "var(--primary-color)",
            borderRadius: "20px",
            position: "absolute",
            left: pathName == "Login" ? "0%" : "45%",
            transition: "all ease-in-out 0.5s",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <StyledTypography
            sx={{
              fontSize: {
                xs: "14px",
                md: "20px",
              },
            }}
          >
            {pathName}
          </StyledTypography>
        </Container>
        <StyledTypography
          sx={{
            alignSelf: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          component={"button"}
          onClick={(e) => handleChangePage(e, "/auth/login")}
        >
          Login
        </StyledTypography>
        <StyledTypography
          sx={{
            alignSelf: "center",
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
          }}
          component={"button"}
          onClick={(e) => handleChangePage(e, "/auth/signup")}
        >
          Sign up
        </StyledTypography>
      </Container>
    </Container>
  );
};

AuthButton.propTypes = {};

export default AuthButton;
