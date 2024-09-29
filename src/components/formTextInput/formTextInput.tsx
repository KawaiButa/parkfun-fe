/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseTextFieldProps, TextField } from "@mui/material";
import { Control, Controller, RegisterOptions } from "react-hook-form";

export interface FormTextInputProps extends BaseTextFieldProps{
  name: string;
  control: Control<any, unknown>,
  label?: string;
  rule?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
  slotProps?: any,
  outlineColor?: string,
}

const FormTextInput = ( props: FormTextInputProps) => {
  const {name, control, label, rule, outlineColor, ...textFieldProps} = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rule}
      render={({
        field: { onChange, value },
        fieldState: { error },
      }) => (
        <TextField
          helperText={error?.message}
          error={Boolean(error)}
          onChange={onChange}
          value={value}
          fullWidth
          label={label}
            variant="outlined"
          {...textFieldProps}
          sx={{
            "& fieldset.MuiOutlinedInput-notchedOutline:hover": {
              borderColor: `var(--${outlineColor}-color) !important`,
            }
          }}
        />
      )}
    />
  );

};

export {FormTextInput};
