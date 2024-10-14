"use client";
import React, { useEffect, useState } from "react";

import { Add, FilterList } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import { PageContainer, PageContainerToolbar, useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";

import DataTable from "@/components/dataTable/dataTable";
import SearchBox from "@/components/searchBox/searchBox";
import SelectInput from "@/components/selectInput/selectInput";
import { useParkingLocation } from "@/hooks/useParkingLocation";
import { ParkingSlot } from "@/interfaces/parkingSlot";
import { TableColumn } from "@/interfaces/tableColumn";

const columns: TableColumn[] = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  {
    id: "address",
    label: "Address",
    align: "center",
  },
  {
    id: "pricingOption.name",
    label: "Pricing option",
    align: "center",
  },
  {
    id: "paymentMethod.name",
    label: "Payment method",
    align: "right",
  },
  {
    id: "parkingSlots",
    label: "Available",
    align: "right",
    format: (value: ParkingSlot[]) => value.filter((a) => a.isAvailable).length + "/" + value.length,
  },
];
const ParkLocPage = () => {
  const { parkingLocationList, fetchParkingLocation, deleteParkingLocation } = useParkingLocation();
  const [filter, setFilter] = useState({});
  const [searchParam, setSearchParam] = useState("");
  const router = useRouter();
  const [searchField, setSearchField] = useState(0);
  const dialogs = useDialogs();
  const notifications = useNotifications();
  useEffect(() => {
    const { id: key } = columns[searchField];
    fetchParkingLocation({ searchParam, searchField: key, filter });
  }, [searchParam, filter]);

  const handleDeletePartner = async (id: number) => {
    const selectedLocation = parkingLocationList?.find((a) => a.id == id)!.name;
    if (!selectedLocation) return;
    const isAccepted = await dialogs.confirm(`Are you sure you want to delete parking location ${selectedLocation}?`);
    if (isAccepted) {
      try {
        await deleteParkingLocation(id);
        notifications.show(`Successfully deleted location ${selectedLocation}`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        const { id: key } = columns[searchField];
        fetchParkingLocation({ searchParam, searchField: key, filter });
      } catch (err) {
        notifications.show((err as Error).message, {
          severity: "error",
          autoHideDuration: 3000,
        });
      }
    }
  };

  return (
    <PageContainer
      sx={{
        backgroundColor: "background.default",
        borderRadius: "10px",
        padding:"10px 30px !important",
        mt: "20px",
      }}
      slots={{
        toolbar: () => (
          <PageContainerToolbar>
            <Button startIcon={<Add />} variant="contained" onClick={() => router.push("parkinglocation/add")}>
              Create
            </Button>
          </PageContainerToolbar>
        ),
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px",
          paddingRight: "20px",
        }}
        disableGutters
      >
        <Box
          sx={{
            alignSelf: "center",
            display: {
              xs: "none",
              md: "flex",
            },
            gap: "10px",
          }}
        >
          <FilterList
            sx={{
              fontSize: "32px",
            }}
          />
          <SelectInput
            options={["All", "Percentage", "Fixed"]}
            label="Pricing option"
            color="secondary"
            sx={{
              width: "180px",
              borderRadius: "40px",
              padding: "0 20px",
            }}
            onChange={({ target: { value } }) => {
              if (typeof value === "string") value = (value as string).toLowerCase();
              if (value === "all" && Object.hasOwn(filter, "pricingOption")) {
                delete (filter as object & { pricingOption?: object })["pricingOption"];
                const { ...remain } = filter;
                setFilter(remain);
              } else setFilter({ ...filter, pricingOption: { name: value } });
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: "10px" }}>
          <SelectInput
            options={columns.map(({ label }) => label)}
            label="Field"
            color="secondary"
            sx={{
              borderRadius: "40px",
              padding: "0 20px",
              minWidth: "80px",
              "& .MuiSelect-select.MuiSelect-outlined.MuiInputBase-input": {
                minWidth: "100px",
              },
            }}
            onChange={(event) => setSearchField(columns.findIndex(({ label }) => label === event.target.value))}
            autoWidth
          />
          <SearchBox value={searchParam} onChange={(e) => setSearchParam(e.target.value)} />
        </Box>
      </Container>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <DataTable
            data={parkingLocationList ?? []}
            deleteItem={(value) => handleDeletePartner(value.id)}
            editItem={(value) => {
              router.push(`parkinglocation/${value.id}`);
            }}
            columns={columns}
            transformKey={(value) => "" + value.id}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default ParkLocPage;
