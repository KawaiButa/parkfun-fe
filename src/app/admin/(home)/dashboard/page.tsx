"use client";
import React, { ReactNode, useEffect, useState } from "react";

import { ShowChart } from "@mui/icons-material";
import { Box, BoxProps, ContainerProps, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts";
import { LineChart } from "@mui/x-charts/LineChart";
import dayjs from "dayjs";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";
import { StatisticField, useStatistic } from "@/hooks/useStatistic";
import { Period } from "@/interfaces/statisticsQuery";

const AdminDashboard = () => {
  const { getCombinedStatistics, getDetailData } = useStatistic();
  const [combinedStatistics, setCombinedStatistics] = useState<{
    newCustomersCount: number;
    newParkingLocationsCount: number;
    newPartnersCount: number;
    bookingsCount: number;
    totalIncome: number;
  } | null>(null);
  const [dataTableyPeriod, setDataByPeriod] = useState<
    { label: string; data: { period: number | string; amount: number }[] }[] | null
  >(null);
  useEffect(() => {
    getCombinedStatistics({ period: Period.MONTH }).then((res) => setCombinedStatistics(res));
    getDetailData(StatisticField.USER, { period: Period.MONTH }).then((e) => setDataByPeriod(e));
  }, [Period.MONTH]);
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
      {combinedStatistics && (
        <Box
          sx={{
            borderRadius: "10px",
            gap: "10px",
            margin: "0",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "flex-start", gap: "10px" }}>
            <DataContainer
              onClick={() =>
                getDetailData(StatisticField.BOOKING, { period: Period.MONTH }).then((data) => setDataByPeriod(data))
              }
              label={"Sales"}
              data={combinedStatistics.bookingsCount}
              sx={{
                "&:hover": {
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                },
              }}
              helperTag="120%"
              helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
            >
              {combinedStatistics.bookingsCount} booking time this month
            </DataContainer>
            <DataContainer
              onClick={() =>
                getDetailData(StatisticField.INCOME, { period: Period.MONTH }).then((data) => setDataByPeriod(data))
              }
              label={"Revenue"}
              data={combinedStatistics?.totalIncome.toFixed(2)}
              helperTag="105%"
              helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
              sx={{
                "&:hover": {
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                },
              }}
            >
              You earned {combinedStatistics?.totalIncome.toFixed(2)} in total income this month.
            </DataContainer>
            <DataContainer
              onClick={() =>
                getDetailData(StatisticField.USER, { period: Period.MONTH }).then((data) => setDataByPeriod(data))
              }
              label={"Customers"}
              data={combinedStatistics.newCustomersCount}
              helperTag="105%"
              helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
              sx={{
                "&:hover": {
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                },
              }}
            >
              You gained {combinedStatistics?.newCustomersCount} new customers this month
            </DataContainer>
            <DataContainer
              label={"Partner"}
              onClick={() =>
                getDetailData(StatisticField.PARTNER, { period: Period.MONTH }).then((data) => setDataByPeriod(data))
              }
              data={combinedStatistics.newPartnersCount}
              helperTag="105%"
              helperIcon={<ShowChart sx={{ fontSize: "14px", marginRight: "10px" }} />}
              sx={{
                "&:hover": {
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: "2px",
                  cursor: "pointer",
                },
              }}
            >
              {combinedStatistics.newPartnersCount} partners have registered lately.
            </DataContainer>
          </Box>
        </Box>
      )}

      {dataTableyPeriod && (
        <Box sx={{ display: "flex", gap: "20px" }}>
          <Box sx={{ width: "70%", borderRadius: "5px", backgroundColor: "secondary.light", margin: "0" }}>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                marginBottom: "10px",
              }}
            >
              {getLabel(Period.MONTH)}
            </Typography>
            <StatisticLineChart
              height="500px"
              data={dataTableyPeriod}
              transformXAxisLabel={(value) => dayjs(value).format(getDateFormat(Period.MONTH))}
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
              Growth overview
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
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: "600",
                  }}
                >
                  {dataTableyPeriod[1].data[dataTableyPeriod[1].data.length - 1].amount.toFixed(2)}
                </Typography>
              </Box>

              <StatisticBarChart
                data={dataTableyPeriod}
                sx={{
                  height: "80%",
                }}
                transformXAxisLabel={(value) => dayjs(value).format(getDateFormat(Period.MONTH))}
              />
            </Box>
          </Box>
        </Box>
      )}
    </ContainerFlexColumn>
  );
};
interface StatisticBarChart extends BoxProps {
  data: { label: string; data: { period: number | string; amount: number }[] }[];
  transformXAxisLabel?: (value: string) => string;
}
const StatisticBarChart = (props: StatisticBarChart) => {
  const { sx, data, transformXAxisLabel } = props;
  return (
    <Box {...props}>
      <BarChart
        series={[{ data: data[0].data.map(({ amount }) => amount), label: data[0].label }]}
        xAxis={[
          {
            scaleType: "band",
            data: data[0].data.map(({ period }) => (transformXAxisLabel ? transformXAxisLabel("" + period) : period)),
          },
        ]}
        sx={{
          "& rect.MuiBarElement-root": {
            width: "1.24rem !important",
            borderRadius: "10px",
          },
          ...sx,
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
interface StatisticLineChartProps extends BoxProps {
  width?: number | string;
  height?: number | string;
  data: { label: string; data: { period: number | string; amount: number }[] }[];
  transformXAxisLabel?: (value: string) => string;
}
const StatisticLineChart = (props: StatisticLineChartProps) => {
  const { width, height, data, transformXAxisLabel, sx } = props;
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
        series={data.map(({ data, label }) => ({ data: data.map(({ amount }) => amount), label }))}
        xAxis={[
          {
            scaleType: "point",
            data: data.flatMap(({ data }) =>
              data.map(({ period }) => (transformXAxisLabel ? transformXAxisLabel("" + period) : period))
            ),
          },
        ]}
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
const DataContainer = <T,>(props: DataContainerProps<T>) => {
  const { label, data, helperTag, helperIcon, children, sx, ...containerProps } = props;
  return (
    <ContainerFlexColumn
      sx={{
        borderRadius: "10px",
        width: "fit-content",
        padding: "20px",
        gap: "10px",
        margin: "0",
        backgroundColor: "white",
        ...sx,
      }}
      {...containerProps}
    >
      <Typography>{label}</Typography>
      <Box
        sx={{
          display: "flex",
          gap: "10px",
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {data as string}
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
const getDateFormat = (period: Period): string => {
  switch (period) {
    case Period.MONTH:
      return "YYYY-MM";
    case Period.DAY:
      return "YYYY-MM-DD";
    default:
      return "YYYY";
  }
};
const getLabel = (period: Period): string => {
  switch (period) {
    case Period.MONTH:
      return "This month's statistics";
    case Period.DAY:
      return "Today's statistics";
    default:
      return "This week's statistics";
  }
};

export default AdminDashboard;
