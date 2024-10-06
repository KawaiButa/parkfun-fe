/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FormControl,
  FormControlLabel,
  FormControlLabelProps,
  FormHelperText,
  Radio,
  RadioGroup,
  RadioProps,
} from "@mui/material";
import { Control, Controller, RegisterOptions } from "react-hook-form";

export interface FormTextInputProps<T, K>
  extends Omit<FormControlLabelProps, "onChange" | "label" | "name" | "control"> {
  name: string;
  control: Control<any, unknown>;
  label?: string;
  rule?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
  options: Array<T>;
  transformLabel?: (value: T, options?: T[]) => string;
  transformValue?: (value: T, options?: T[]) => K;
  radioProps?: RadioProps;
}

const FormRadioInput = <T, K>(props: FormTextInputProps<T, K>) => {
  const { name, control, rule, transformValue, transformLabel, options, radioProps, ...radioInputProps } = props;
  return (
    <Controller
      name={name}
      control={control}
      rules={rule}
      render={({ field: { onChange, value: fieldValue }, fieldState: { error } }) => (
        <>
          <FormControl>
            <RadioGroup row name={name} value={fieldValue}>
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
          </FormControl>
        </>
      )}
    />
  );
};

export { FormRadioInput };
