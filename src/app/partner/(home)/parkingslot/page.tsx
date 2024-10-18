"use client";
import React, { useEffect, useState } from "react";

import { Add, Check, ErrorOutline, FilterList } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import { PageContainer, PageContainerToolbar, useDialogs, useNotifications } from "@toolpad/core";
import { useRouter } from "next/navigation";

import DataTable from "@/components/dataTable/dataTable";
import SearchBox from "@/components/searchBox/searchBox";
import SelectInput from "@/components/selectInput/selectInput";
import { useParkingSlot } from "@/hooks/useParkingSlot";
import { useParkingSlotType } from "@/hooks/useParkingSlotType";
import { ParkingSlotType } from "@/interfaces/parkingSlotType";
import { TableColumn } from "@/interfaces/tableColumn";

const columns: TableColumn[] = [
  { id: "id", label: "ID" },
  { id: "name", label: "Name" },
  {
    id: "parkingLocation.id",
    label: "Parking Location",
    align: "center",
  },
  {
    id: "price",
    label: "Price",
    align: "center",
    format: (value: number) => `$${value.toFixed(2)}`,
  },
  {
    id: "parkingLocation.paymentMethod.name",
    label: "Payment method",
    align: "center",
  },
  {
    id: "isAvailable",
    label: "Status",
    align: "center",
    format: (value: boolean) => (
      <Box
        sx={{ display: "flex", borderRadius: "20px", justifyContent: "space-evenly" }}
        color={value ? "success.main" : "error.main"}
      >
        {" "}
        {value ? (
          <>
            {" "}
            <Check /> Available
          </>
        ) : (
          <>
            <ErrorOutline />
            Ocuppied
          </>
        )}
      </Box>
    ),
  },
];
const ParkSlotPage = () => {
  const { fetchParkingSlot, deleteParkingSlot, parkingSlotList, page, take, setPage, setTake, count } =
    useParkingSlot();
  const [filter, setFilter] = useState({});
  const [searchParam, setSearchParam] = useState("");
  const router = useRouter();
  const [searchField, setSearchField] = useState(0);
  const { parkingSlotTypeList, fetchParkingSlotType } = useParkingSlotType();
  const notifications = useNotifications();
  const dialogs = useDialogs();
  useEffect(() => {
    const { id: key } = columns[searchField];
    fetchParkingSlot({ searchParam, searchField: key, filter });
    fetchParkingSlotType();
  }, [searchParam, filter]);

  const handleDeletePartner = async (id: number) => {
    const selectedSlot = parkingSlotList?.find((a) => a.id == id)!.name;
    if (!selectedSlot) return;
    const isAccepted = await dialogs.confirm(
      `Are you sure you want to delete parking location ${selectedSlot} with id ${id}?`
    );
    if (isAccepted) {
      try {
        await deleteParkingSlot(id);
        notifications.show(`Successfully deleted location ${selectedSlot}`, {
          severity: "success",
          autoHideDuration: 3000,
        });
        const { id: key } = columns[searchField];
        fetchParkingSlot({ searchParam, searchField: key, filter });
      } catch (err) {
        notifications.show((err as Error).message, {
          severity: "error",
          autoHideDuration: 5000,
        });
      }
    }
  };

  return (
    <PageContainer
      sx={{
        backgroundColor: "background.default",
        borderRadius: "10px",
        padding: "10px 30px !important",
        mt: "20px",
      }}
      slots={{
        toolbar: () => (
          <PageContainerToolbar>
            <Button startIcon={<Add />} variant="contained" onClick={() => router.push("parkingslot/add")}>
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
            options={["All", ...(parkingSlotTypeList ?? [])]}
            label="Pricing option"
            color="secondary"
            sx={{
              width: "180px",
              borderRadius: "40px",
              padding: "0 20px",
            }}
            transformToLabel={(value) => {
              if (typeof value !== "string") return (value as ParkingSlotType).name;
              return value;
            }}
            transformToValue={(value) => {
              if (typeof value !== "string") return (value as ParkingSlotType).name;
              return value;
            }}
            onChange={({ target: { value } }) => {
              if (typeof value === "string") value = value as string;
              if (value === "All" && Object.hasOwn(filter, "type")) {
                delete (filter as object & { type?: object })["type"];
                const { ...remain } = filter;
                setFilter(remain);
              } else setFilter({ ...filter, type: { name: value } });
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
            pageSize={take}
            data={parkingSlotList ?? []}
            currentPage={page}
            count={count}
            onChangePage={setPage}
            onChangePageSize={setTake}
            deleteItem={(value) => handleDeletePartner(value.id)}
            editItem={(value) => {
              router.push(`parkingslot/${value.id}`);
            }}
            columns={columns}
            transformKey={(value) => "" + value.id}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};
export default ParkSlotPage;
