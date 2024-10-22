/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Radio,
  RadioGroup,
  RadioProps,
  Stack,
  Typography,
} from "@mui/material";
import { Control, Controller, RegisterOptions } from "react-hook-form";

export interface FormTextInputProps<T, K>
  extends Omit<FormControlLabelProps, "onChange" | "label" | "name" | "control"> {
  name: string;
  control: Control<any, unknown>;
  label?: string;
  rule?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  options: Array<T>;
  multiple?: boolean;
  fullWidth?: boolean;
  transformLabel?: (value: T, options?: T[]) => string;
  transformValue?: (value: T, options?: T[]) => K;
  transformHelperText?: (value: T, options?: T[]) => string;
  radioProps?: RadioProps;
  direction?: "row" | "column";
}

const FormRadioInput = <T, K>(props: FormTextInputProps<T, K>) => {
  const {
    name,
    control,
    rule,
    label,
    direction,
    fullWidth,
    transformValue,
    transformLabel,
    options,
    radioProps,
    ...radioInputProps
  } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rule}
      render={({ field: { onChange, value: fieldValue }, fieldState: { error } }) => (
        <>
          <FormControl
            sx={{
              width: fullWidth ? "100%" : "fit-content",
            }}
          >
            <Typography fontWeight={500}>{label}</Typography>
            <Stack sx={{ padding: "0 10px" }} width={fullWidth ? "100%" : "fit-content"}>
              <RadioGroup row={direction === "row"} name={name} value={fieldValue}>
                {options.map((option) => {
                  const value = transformValue ? transformValue(option, options) : option;
                  const label = transformLabel ? transformLabel(option, options) : (option as string);
                  return (
                    <FormControlLabel
                      key={label}
                      value={value}
                      control={<Radio {...radioProps} />}
                      label={label}
                      onChange={(e) => onChange(e)}
                      {...radioInputProps}
                    />
                  );
                })}
              </RadioGroup>
              <FormHelperText
                error={Boolean(error)}
                sx={{
                  ":first-letter": {
                    textTransform: "uppercase",
                  },
                }}
              >
                {error?.message}
              </FormHelperText>
            </Stack>
          </FormControl>
        </>
      )}
    />
  );
};

export { FormRadioInput };
