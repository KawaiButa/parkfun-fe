"use client";
import React, { ChangeEvent, useState } from "react";

import LoadingButton from "@mui/lab/LoadingButton";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableProps,
  TableRow,
} from "@mui/material";
import _ from "lodash";

import { TableColumn } from "@/interfaces/tableColumn";

interface DataTableProps<T> extends TableProps {
  data: T[];
  columns: TableColumn[];
  onRowClick?: (value: T) => void;
  deleteItem?: (value: T) => void;
  editItem?: (value: T) => void;
  transformKey: (value: T) => string;
}
const DataTable = <T,>(props: DataTableProps<T>) => {
  const { deleteItem, editItem, columns, onRowClick, data, transformKey, ...remain } = props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  return (
    <>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={data?.length ?? 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <TableContainer
        {...remain}
        sx={{
          minHeight: "150px",
          maxHeight: "60vh",
          overflow: "auto",
        }}
      >
        <Table stickyHeader>
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
              <TableCell key={"action"} style={{ minWidth: "100px", fontWeight: "600" }}>
                {"Action"}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              const key = transformKey(row);
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={key}>
                  {columns.map((column) => {
                    const value = _.get(row, column.id);
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        onClick={() => {
                          if (onRowClick) onRowClick(row);
                        }}
                        sx={{
                          cursor: onRowClick ? "pointer" : "default",
                        }}
                      >
                        {column.format ? column.format(value) : value}
                      </TableCell>
                    );
                  })}
                  <TableCell width={220}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (editItem) editItem(row);
                      }}
                      sx={{
                        mr: "10px",
                      }}
                    >
                      Edit
                    </Button>
                    <DeleteRowButton
                      onClick={() => {
                        if (deleteItem) deleteItem(row);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

const DeleteRowButton = (props: { onClick: () => void }) => {
  const [loading, setLoading] = useState(false);
  return (
    <LoadingButton
      loading={loading}
      variant="contained"
      color="error"
      onClick={async () => {
        setLoading(true);
        await props.onClick();
        setLoading(false);
      }}
    >
      Delete
    </LoadingButton>
  );
};

export default DataTable;
