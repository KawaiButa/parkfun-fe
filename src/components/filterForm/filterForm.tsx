/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, SxProps, Theme } from "@mui/material";
import { Control } from "react-hook-form";

import FormCheckboxInput from "../formCheckboxInput/formCheckboxInput";
import { FormRadioInput } from "../formRadioInput/formRadioInput";
import FormSliderInput from "../formSliderInput/formSliderInput";
import { FormTextInput } from "../formTextInput/formTextInput";
export interface FilterItem<T, K> {
  label: string;
  name: string;
  type: "text" | "slider" | "checkbox" | "radio" | string;
  options?: T[];
  value?: T;
  onChange?: (value: T) => void;
  onClear?: () => void;
  disabled?: boolean;
  required?: boolean;
  width?: string | number;
  error?: boolean;
  helperText?: string;
  labelWidth?: number;
  fullWidth?: boolean;
  variant?: "filled" | "outlined" | "standard";
  margin?: "none" | "dense" | "normal";
  spacing?: number;
  direction?: "row" | "column";
  justifyContent?: "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
  alignItems?: "flex-start";
  min?: K;
  max?: K;
  transformValue?: (value: T) => K;
  transformLabel?: (value: T) => string;
  sx?: SxProps<Theme>;
}
export interface FilterFormProps {
  data: FilterItem<any, any>[];
  control: Control<any, unknown>;
  direction?: "row" | "column" | "row-reverse" | "column-reverse";
}

const FilterForm = (props: FilterFormProps) => {
  const { data, direction, control } = props;
  return (
    <Stack direction={direction}>
      {data.map(({ type, name, options, ...remain }) => {
        if (type === "text") return <FormTextInput key={name} control={control} name={name} {...remain} />;
        if (type === "checkbox" && options)
          return <FormCheckboxInput key={name} control={control} name={name} {...remain} options={options} />;
        if (type === "radio" && options)
          return <FormRadioInput key={name} name={name} control={control} options={options} {...remain} />;
        if(type === "slider")
          return <FormSliderInput key={name} control={control} name={name} {...remain} />
        return null;
      })}
    </Stack>
  );
};
export default FilterForm;
