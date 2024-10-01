import { ReactNode, useState } from "react";

import { BaseSelectProps, FormControl, InputLabel, MenuItem, MenuProps, OutlinedInput, Select, SelectChangeEvent } from "@mui/material";
interface SelectInputProps extends BaseSelectProps {
  options: Array<string>;
  menuProps?: Partial<MenuProps>,
}

const SelectInput = (props: SelectInputProps) => {
  const {onChange , options, label, menuProps, ...remain} = props;
  const [selectedValue, setSelectedValue] = useState<string>(options[0]);
  function handleOnChange(event: SelectChangeEvent<unknown>, child: ReactNode): void {
    event.preventDefault();
    setSelectedValue(event.target.value as string);
    if(onChange)
      onChange!(event, child);
  }

  return (
    <FormControl size="small">
      <InputLabel>{label}</InputLabel>
      <Select
        autoWidth
        value={selectedValue}
        onChange={handleOnChange}
        input={<OutlinedInput label={label} />}
        MenuProps={menuProps}
        {...remain}
      >
        {options.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectInput;
