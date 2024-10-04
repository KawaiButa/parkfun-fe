import { Checkbox, CheckboxProps, FormControlLabel, FormGroup } from "@mui/material";
import { Controller } from "react-hook-form";

import { FormTextInputProps } from "../formTextInput/formTextInput";

export interface FormCheckBoxInputProps<T, K> extends Pick<FormTextInputProps, "control" | "name" | "sx"> {
  options: Array<T>;
  transformValue?: (value: T) => K;
  transformLabel?: (value: T) => string;
  checkboxProps?: CheckboxProps;
}
const FormCheckboxInput = <T, K>(props: FormCheckBoxInputProps<T, K>) => {
  const { transformLabel, transformValue, options,...remain } = props;
  return (
    <Controller
      render={({ field: { onChange, value: fieldValue } }) => {
        return (
          <FormGroup>
            {options.map((option) => {
              const label = transformLabel ? transformLabel(option) : (option as string);
              const value = transformValue ? transformValue(options) : options;
              return (
                <FormGroup key={label}>
                  <FormControlLabel
                    label={label}
                    control={
                      <Checkbox
                        key={label}
                        value={value}
                        checked={fieldValue && fieldValue.includes(option)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            if (fieldValue) onChange([...fieldValue, option]);
                            else onChange([option]);
                          } else {
                            onChange((fieldValue as T[]).filter((item) => item !== option));
                          }
                        }}
                      />
                    }
                  />
                </FormGroup>
              );
            })}
          </FormGroup>
        );
      }}
      {...remain}
    />
  );
};

export default FormCheckboxInput;
