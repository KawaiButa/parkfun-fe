import { ReactNode, useState } from "react";

import {
  BaseSelectProps,
  FormControl,
  InputLabel,
  MenuItem,
  MenuProps,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
interface SelectInputProps<T, K> extends BaseSelectProps {
  options: Array<T>;
  menuProps?: Partial<MenuProps>;
  transformToLabel?: (data: T) => string;
  transformToValue?: (data: T) => K;
}

const SelectInput = <T, K>(props: SelectInputProps<T, K>) => {
  const { onChange, options, label, menuProps, transformToLabel, transformToValue, ...remain } = props;
  const [selectedValue, setSelectedValue] = useState<T>(options[0]);
  function handleOnChange(event: SelectChangeEvent<unknown>, child: ReactNode): void {
    event.preventDefault();
    setSelectedValue(event.target.value as T);
    if (onChange) onChange!(event, child);
  }

  return (
    <FormControl
      size="small"
      sx={{
        width: "100%",
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select
        autoWidth
        value={selectedValue}
        onChange={handleOnChange}
        input={<OutlinedInput label={label} />}
        MenuProps={menuProps}
        {...remain}
      >
        {options.map((rawValue) => {
          const label = transformToLabel ? transformToLabel(rawValue) : String(rawValue);
          const value = transformToValue ? transformToValue(rawValue) : String(rawValue);
          return (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
