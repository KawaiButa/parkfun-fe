import { ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: "right" | "center";
  format?: (value: any) => string | ReactNode;
}
