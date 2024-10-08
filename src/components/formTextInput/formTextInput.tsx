/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactNode } from "react";

import { BaseTextFieldProps, TextField } from "@mui/material";
import { Control, Controller, RegisterOptions } from "react-hook-form";

export interface FormTextInputProps extends BaseTextFieldProps {
  name: string;
  control: Control<any, unknown>;
  label?: string;
  rule?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  slotProps?: any;
  outlineColor?: string;
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  onChange?: (event: any) => void;
}

const FormTextInput = (props: FormTextInputProps) => {
  const {
    name,
    control,
    label,
    rule,
    onChange: onInputChange,
    startAdornment,
    endAdornment,
    sx,
    outlineColor,
    ...textFieldProps
  } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rule}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <TextField
          helperText={error?.message}
          error={Boolean(error)}
          onChange={(e) => {
            onChange(e);
            if (onInputChange) onInputChange(e);
          }}
          InputProps={{
            startAdornment: startAdornment,
            endAdornment: endAdornment,
          }}
          value={value}
          fullWidth
          label={label}
          variant="outlined"
          {...textFieldProps}
          sx={{
            "& fieldset.MuiOutlinedInput-notchedOutline:hover": {
              borderColor: `var(--${outlineColor}-color) !important`,
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export { FormTextInput };
