import { ReactElement } from "react";

import { Box, Slider, SliderProps, Stack, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

import { FormTextInputProps } from "../formRadioInput/formRadioInput";

export interface FormSliderInputProps<T, K> extends SliderProps, Pick<FormTextInputProps<T, K>, "control" | "rule"> {
  startAdornment?: (value: T) => ReactElement;
  endAdornment?: (value: T) => ReactElement;
  label?: string;
}
const FormSliderInput = <T, K>(props: FormSliderInputProps<T, K>) => {
  const { name, control, label, startAdornment, endAdornment, onChange: onInputChange, rule, ...sliderProps } = props;
  return (
    <Controller
      name={name ?? ""}
      control={control}
      rules={rule}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Box>
          <Typography fontWeight={500}>{label}</Typography>
          <Stack spacing={2} direction="row" sx={{ alignItems: "center", mb: 1, padding: "0px 10px" }}>
            {startAdornment && startAdornment(value)}
            {value instanceof Array && <Typography fontWeight={500}>{value[0]}</Typography>}
            <Slider
              aria-label="Volume"
              value={value}
              onChange={(e, value, activeThumb) => {
                onChange(value);
                if (onInputChange) onInputChange(e, value, activeThumb);
              }}
              {...sliderProps}
            />
            <Typography fontWeight={500}>{value instanceof Array ? value[1]: value}</Typography>
            {endAdornment && endAdornment(value)}
          </Stack>
          <Typography variant="caption" color="error">
            {error?.message}
          </Typography>
        </Box>
      )}
    />
  );
};

export default FormSliderInput;
