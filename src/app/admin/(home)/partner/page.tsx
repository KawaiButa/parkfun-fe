"use client";
import { useEffect, useState } from "react";

import { Add, FilterList } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import { PageContainer, PageContainerToolbar, useDialogs } from "@toolpad/core";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

import DataTable from "@/components/dataTable/dataTable";
import SearchBox from "@/components/searchBox/searchBox";
import SelectInput from "@/components/selectInput/selectInput";
import useDebounce from "@/hooks/useDebounce";
import { useNotify } from "@/hooks/useNoti";
import { usePartner } from "@/hooks/usePartner";
import { TableColumn } from "@/interfaces/tableColumn";

const columns: TableColumn[] = [
  { id: "id", label: "ID" },
  { id: "user.name", label: "Name" },
  {
    id: "user.email",
    label: "Email",
    align: "center",
  },
  {
    id: "type.name",
    label: "Bussiness type",
    align: "center",
  },
  {
    id: "user.phoneNumber",
    label: "Phone number",
    align: "right",
  },
  {
    id: "location",
    label: "Location",
    align: "right",
  },
];

const User = () => {
  const { partnerList, fetchPartners, deletePartner, take, count, setTake, setPage, page } = usePartner();
  const [filter, setFilter] = useState({});
  const router = useRouter();
  const [searchField, setSearchField] = useState(0);
  const dialog = useDialogs();
  const {showError, showSuccess} = useNotify()
  const [loading, setLoading] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const debouncedValue = useDebounce(searchParam, 0);
  useEffect(() => {
      setLoading(true);
      const { id: key } = columns[searchField];
      fetchPartners({ searchParam: debouncedValue, searchField: key, filter }).finally(() => {
        setLoading(false);
      });
    
  }, [page, take, debouncedValue]);
  const handleDeletePartner = async (id: number) => {
    try {
      const isDelete = await dialog.confirm("Are you sure you want to delete");
      if (isDelete) {
        await deletePartner(id);
        showSuccess("Successfully deleted partner");
        const { id: key } = columns[searchField];
        fetchPartners({ searchParam: debouncedValue, searchField: key, filter });
      }
    } catch (err) {
      showError(`Failed to delete partner with error ${(err as AxiosError).message}`)
    }
  };
  return (
    <PageContainer
      slots={{
        toolbar: () => (
          <PageContainerToolbar>
            <Button startIcon={<Add />} variant="contained" onClick={() => router.push("partner/add")}>
              Create
            </Button>
          </PageContainerToolbar>
        ),
      }}
      sx={{
        backgroundColor: "background.default",
        borderRadius: "10px",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
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
            options={["All", "Individual", "Company"]}
            label="Type"
            color="secondary"
            sx={{
              borderRadius: "40px",
              padding: "0 20px",
            }}
            onChange={({ target: { value } }) => {
              if (typeof value === "string") value = (value as string).toLowerCase();
              if (value === "all" && Object.hasOwn(filter, "type")) {
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
            loading={loading}
            pageSize={take}
            currentPage={page}
            onChangePage={setPage}
            onChangePageSize={setTake}
            count={count}
            data={partnerList ?? []}
            columns={columns}
            deleteItem={(value) => handleDeletePartner(value.id)}
            editItem={(value) => router.push("partner/" + value.id)}
            transformKey={(value) => "" + value.id}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default User;
