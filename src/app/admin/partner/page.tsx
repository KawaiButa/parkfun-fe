"use client";
import { ChangeEvent, useEffect, useState } from "react";

import { Add, Delete, Edit, FilterList } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useRouter } from "next/navigation";

import SearchBox from "@/components/searchBox/searchBox";
import SelectInput from "@/components/selectInput/selectInput";
import { usePartner } from "@/hooks/usePartner";

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: unknown) => string;
}

const columns: readonly Column[] = [
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
  const { partnerList, setPartnerList, fetchPartners } = usePartner();
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const data = await fetchPartners();
    const filteredData = data?.filter(({ user: { name } }) => name.includes(event.target.value));
    setPartnerList(filteredData);
  };
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    fetchPartners().then((data) => setPartnerList(data));
  }, []);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          color="secondary"
          sx={{
            fontWeight: "600",
            flexGrow: 1,
            alignSelf: "center",
          }}
        >
          User management
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },
            }}
            onClick={() => router.push("/user/add")}
          >
            Add partner
          </Button>
          <IconButton
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },
            }}
          >
            <Add
              sx={{
                fontSize: "30px",
              }}
            />
          </IconButton>
        </Box>
      </Box>
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
            options={["All", "Admin", "Partner"]}
            label="Role"
            color="secondary"
            sx={{
              borderRadius: "40px",
              padding: "0 20px",
            }}
          />
        </Box>
        <Box maxWidth={"sm"}>
          <SearchBox onChange={handleSearch} />
        </Box>
      </Container>
      <Box sx={{ width: "100%", overflow: "auto" }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              sx={{
                alignSelf: "center",
                fontWeight: "600",
              }}
            >
              User list
            </Typography>
            <TablePagination
              rowsPerPageOptions={[10, 25, 100]}
              component="div"
              count={partnerList?.length ?? 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Box>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, fontWeight: "600" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {partnerList &&
                partnerList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = _.get(row, column.id);
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number" ? column.format(value) : value}
                          </TableCell>
                        );
                      })}
                      <TableCell width={120}>
                        <IconButton onClick={() => router.push(`/user/edit/${row.id}`)}>
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => router.push(`/user/delete/${row.id}`)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
};
export default User;
