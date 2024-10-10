import { Box, Checkbox, CheckboxProps, FormControlLabel, FormGroup, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

import { FormTextInputProps } from "../formTextInput/formTextInput";

export interface FormCheckBoxInputProps<T, K> extends Pick<FormTextInputProps, "control" | "name" | "sx"> {
  options: Array<T>;
  transformValue?: (value: T) => K;
  transformLabel?: (value: T) => string;
  transformHelperText?: (value: T) => string;
  helperText?: string;
  checkboxProps?: CheckboxProps;
  direction?: "row" | "column";
  label?: string;
}
const FormCheckboxInput = <T, K>(props: FormCheckBoxInputProps<T, K>) => {
  const { transformLabel, transformValue, transformHelperText, helperText, label, options, direction, ...remain } =
    props;
  return (
    <Controller
      render={({ field: { onChange, value: fieldValue } }) => {
        return (
          <FormGroup>
            <Typography fontWeight={500}>{label}</Typography>
            <Box sx={{ padding: "0 10px" }}>
              {options.map((option) => {
                const label = transformLabel ? transformLabel(option) : (option as string);
                const value = transformValue ? transformValue(option) : option;
                return (
                  <FormGroup key={label}>
                    <FormControlLabel
                      label={label}
                      sx={{
                        display: "flex",
                        flexDirection: direction,
                      }}
                      control={
                        <Checkbox
                          key={label}
                          value={value}
                          checked={fieldValue && fieldValue.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              if (fieldValue) onChange([...fieldValue, value]);
                              else onChange([value]);
                            } else {
                              onChange((fieldValue as T[]).filter((item) => item !== value));
                            }
                          }}
                        />
                      }
                    />
                    <Typography variant="caption">{transformHelperText ? transformHelperText(option) : helperText}</Typography>
                  </FormGroup>
                );
              })}
            </Box>
          </FormGroup>
        );
      }}
      {...remain}
    />
  );
};

export default FormCheckboxInput;
