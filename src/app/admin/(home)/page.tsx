import React, { ReactNode } from "react";

import { ShowChart } from "@mui/icons-material";
import { Box, BoxProps, ContainerProps, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import _ from "lodash";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";
import { activeLot } from "@/data/activeLot";
import { incomeData } from "@/data/incomeData";
import { newUserData } from "@/data/newUserData";

const AdminDashboard = () => {
  return (
    <ContainerFlexColumn
      maxWidth="xl"
      sx={{
        gap: "10px",
        backgroundColor: "secondary.light",
        width: "100%",
        margin: "20px auto",
        borderRadius: "10px",
        padding: "20px",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          gap: "10px",
          margin: "0",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            marginBottom: "10px",
          }}
        >
          Summary
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
          <DataContainer
            label={"Expenses"}
            data="$5000"
            helperTag="80%"
            helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
          >
            You spent 3000 this month
          </DataContainer>
          <DataContainer
            label={"Sales"}
            data="1500"
            helperTag="120%"
            helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
          >
            You sold 1000 more items this month
          </DataContainer>
          <DataContainer
            label={"Customers"}
            data="200"
            helperTag="105%"
            helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
          >
            You gained 50 new customers this month
          </DataContainer>
          <DataContainer
            label={"Customers"}
            data="200"
            helperTag="105%"
            helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
          >
            You gained 50 new customers this month
          </DataContainer>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Box sx={{ width: "70%", borderRadius: "5px", backgroundColor: "secondary.light", margin: "0" }}>
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                marginBottom: "10px",
              }}
            >
              User & Parking lot
            </Typography>
            {/* TODO: ADD RADIO BUTTON TO ADD OPTIONAL FIELD  */}
          </Box>
          <UserLineChart
            height="500px"
            sx={{ backgroundColor: "secondary.contrastText", borderRadius: "10px", padding: "20px" }}
          />
        </Box>
        <Box
          sx={{
            width: "30%",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              marginBottom: "10px",
            }}
          >
            Income overview
          </Typography>
          <Box
            sx={{
              backgroundColor: "secondary.contrastText",
              borderRadius: "10px",
              height: "500px",
            }}
          >
            <Box
              sx={{
                paddingTop: "20px",
                marginLeft: "20px",
              }}
            >
              <Typography>This week income</Typography>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: "600",
                }}
              >
                {"$" + _.sum(incomeData).toLocaleString("en", {})}
              </Typography>
            </Box>

            <IncomeBarChart
              sx={{
                height: "80%",
              }}
            />
          </Box>
        </Box>
      </Box>
    </ContainerFlexColumn>
  );
};

const IncomeBarChart = (props: BoxProps) => {
  return (
    <Box {...props}>
      <BarChart
        series={[{ data: incomeData, label: "Income" }]}
        xAxis={[{ scaleType: "band", data: Array.from(Array(7), (_, i) => i + 1) }]}
        yAxis={[
          {
            colorMap: {
              type: "continuous",
              min: 0,
              max: 100000,
              color: ["#e6d60f", "#495E57"],
            },
            position: "right",
          },
        ]}
        sx={{
          "& rect.MuiBarElement-root": {
            width: "2.75rem !important",
            borderRadius: "10px",
          },
        }}
        leftAxis={null}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
      />
    </Box>
  );
};
interface IncomeChartProps extends BoxProps {
  width?: number | string;
  height?: number | string;
}
const UserLineChart = (props: IncomeChartProps) => {
  const { width, height, sx } = props;
  return (
    <Box
      sx={{
        width: width,
        height: height,
        margin: "20px 0",
        padding: "20px",
        ...sx,
      }}
      {...props}
    >
      <LineChart
        series={[
          { data: newUserData, label: "New user", color: "#e6d60f" },
          { data: activeLot, label: "Active lot", color: "#495E57" },
        ]}
        xAxis={[{ scaleType: "point", data: Array.from(Array(11), (_, i) => i + 1) }]}
        slotProps={{
          legend: {
            itemMarkHeight: 10,
          },
        }}
      />
    </Box>
  );
};

interface DataContainerProps<T> extends ContainerProps {
  label: string;
  data: T;
  helperTag?: string;
  helperIcon?: ReactNode;
  helperTagStyle?: string;

  children?: ReactNode;
}
const DataContainer = (props: DataContainerProps<string>) => {
  const { label, data, helperTag, helperIcon, children } = props;
  return (
    <ContainerFlexColumn
      sx={{
        borderRadius: "10px",
        width: "fit-content",
        padding: "20px",
        gap: "10px",
        margin: "0",
        backgroundColor: "white",
      }}
    >
      <Typography>{label}</Typography>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {data}
        </Typography>
        <Box
          sx={{
            backgroundColor: "primary.main",
            borderRadius: "5px",
            padding: "0 10px",
            display: "flex",
            alignItems: "center",
          }}
        >
          {helperIcon}
          {helperTag}
        </Box>
      </Box>
      {children}
    </ContainerFlexColumn>
  );
};

export default AdminDashboard;
