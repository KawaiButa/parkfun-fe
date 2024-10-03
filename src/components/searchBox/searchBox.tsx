import { Search } from "@mui/icons-material";
import {  IconButton, InputAdornment, OutlinedInput, OutlinedInputProps } from "@mui/material";

const SearchBox = (props: OutlinedInputProps) => {
  const { sx, ...remain } = props;
  return (
    <OutlinedInput
      placeholder="Search"
      size="small"
      sx={{
        width: "100%",
        fontSize: "16px",
        ...sx,
      }}
      color="secondary"
      endAdornment={
        <InputAdornment position="end">
          <IconButton edge="end">
            <Search />
          </IconButton>
        </InputAdornment>
      }
      {...remain}
    />
  );
};

export default SearchBox;
