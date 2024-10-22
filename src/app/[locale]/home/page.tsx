"use client";
import { useEffect, useState } from "react";

import { Box, Container, Grid2, Stack, Typography } from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import { useTranslations } from "next-intl";

import BookingForm from "@/components/bookingForm/bookingForm";
import { constants } from "@/constants";
import { useLocation } from "@/context/locationContext";
import { SearchedParkingLocation, useParkingLocation } from "@/hooks/useParkingLocation";

import { gosLogo, logo, nextJS } from "../../../../public/images";

export default function Home() {
  const t = useTranslations("home");
  const [parkingLocationList, setParkingLocationList] = useState<SearchedParkingLocation[] | null>(null);
  const { searchParkingLocation } = useParkingLocation();
  const { location } = useLocation();
  useEffect(() => {
    if (location)
      searchParkingLocation({
        position: location,
        radius: 20,
        time: [dayjs().startOf("day"), dayjs().startOf("day").add(5, "hour")],
      }).then((res) => setParkingLocationList(res ?? []));
  }, [location]);
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Container
        sx={{
          flex: 1,
          width: "100%",
          maxWidth: "100% !important",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "48px",
          p: { xs: 2, md: 5 },
          backgroundImage: "linear-gradient(to right, var(--secondary-color), transparent)",
        }}
      >
        <Container
          maxWidth="md"
          sx={{
            height: "fit-content",
          }}
        >
          <Typography
            variant="h2"
            color="primary"
            sx={{
              fontWeight: "bold",
              fontSize: { xs: "2.5rem", md: "6rem" },
            }}
          >
            {constants.PROJECT_NAME}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontSize: { xs: "0.875rem", md: "1.25rem" },
              color: "text.secondary",
            }}
          >
            {t("introduction")}
          </Typography>
        </Container>
        <BookingForm />
      </Container>

      <Box sx={{ width: "100%", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            {constants.PROJECT_NAME} - PARK YOUR LIFE IN SECONDS
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            {t("slogan")}
          </Typography>
        </Container>
      </Box>
      <Stack
        direction="row"
        gap={1}
        sx={{
          borderRadius: "5px",
          padding: "10px",
          backgroundColor: "background.default",
        }}
      >
        <Stack
          flexGrow={1}
          gap={2}
          sx={{
            flexDirection: {
              xs: "column",
              md: "row",
            },
          }}
        >
          {parkingLocationList &&
            parkingLocationList.map((parkingLocation) => (
              <>
                <Stack
                  direction="row"
                  key={parkingLocation.id}
                  gap={2}
                  flexGrow={1}
                  sx={{
                    backgroundColor: "background.paper",
                    borderRadius: 2,
                    p: 2,
                  }}
                >
                  <Image
                    src={parkingLocation.images[0]}
                    alt={parkingLocation.name}
                    width={250}
                    height={300}
                    style={{
                      borderRadius: "5px",
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Stack
                    gap={1}
                    sx={{
                      width: {
                        xs: "100%",
                        md: 300,
                      },
                    }}
                  >
                    <Typography variant="h5" fontWeight={500}>
                      {parkingLocation.name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {parkingLocation.address}
                    </Typography>
                    <Typography variant="body1" sx={{ color: "text.secondary" }}>
                      {parkingLocation.description}
                    </Typography>
                  </Stack>
                </Stack>
              </>
            ))}
        </Stack>
      </Stack>
      <Box sx={{ width: "100%", bgcolor: "background.default", color: "common.white", pt: 6, pb: 3 }}>
        <Container maxWidth="xl">
          <Grid2 container spacing={4}>
            <Grid2
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Stack direction="row" gap={2}>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "100%",
                    display: "flex",
                    padding: 1,
                    width: {
                      xs: 50,
                      md: 100,
                    },
                    height: {
                      xs: 50,
                      md: 100,
                    },
                  }}
                >
                  <Image
                    src={logo.src}
                    width={100}
                    height={100}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "100%",
                    display: "flex",
                    padding: 1,
                    width: {
                      xs: 50,
                      md: 100,
                    },
                    height: {
                      xs: 50,
                      md: 100,
                    },
                  }}
                >
                  <Image
                    src={gosLogo.src}
                    width={100}
                    height={100}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    backgroundColor: "white",
                    borderRadius: "100%",
                    display: "flex",
                    padding: 0.4,
                    width: {
                      xs: 50,
                      md: 100,
                    },
                    height: {
                      xs: 50,
                      md: 100,
                    },
                  }}
                >
                  <Image
                    src={nextJS.src}
                    width={100}
                    height={100}
                    alt="logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Stack>
            </Grid2>
            <Grid2
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Us
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Tel: +84 79 7675 026
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                C0013, Sarina Apt, 62 Hoang The Thien, An Loi Dong, Thu Duc city, HCMC, Vietnam
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box component="img" src="/golden-owl-logo.png" alt="Golden Owl" sx={{ height: "64px", mb: 2 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Golden Owl Solutions
                </Typography>
                <Typography variant="body2">Dedicated IT remote resource</Typography>
              </Box>
            </Grid2>
            <Grid2
              size={{
                xs: 12,
                md: 4,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {t("location")}
              </Typography>
              <Box sx={{ width: "100%", height: "192px" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.1258470790287!2d106.75518661533417!3d10.800984892310438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317526156c31adcd%3A0x8e2e3c7bc0140b25!2sSarina%20Apartment!5e0!3m2!1sen!2s!4v1625647382645!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </Box>
            </Grid2>
          </Grid2>
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: 1,
              borderColor: "grey.700",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <Box
                component="a"
                href="https://linkedin.com"
                sx={{
                  color: "secondary,contrastText",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#FCD34D",
                  },
                }}
              >
                Linkedin
              </Box>
              <span>|</span>
              <Box
                component="a"
                href="https://facebook.com"
                sx={{
                  color: "common.white",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#FCD34D",
                  },
                }}
              >
                Facebook
              </Box>
              <span>|</span>
              <Box
                component="a"
                href="https://twitter.com"
                sx={{
                  color: "common.white",
                  textDecoration: "none",
                  "&:hover": {
                    color: "#FCD34D",
                  },
                }}
              >
                Twitter
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              © 2024 ParkFun. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
