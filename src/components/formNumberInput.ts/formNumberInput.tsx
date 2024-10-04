import { forwardRef, ForwardedRef } from "react";

import { Unstable_NumberInput as BaseNumberInput, NumberInputProps } from "@mui/base/Unstable_NumberInput";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/system";
import { Controller } from "react-hook-form";

import { FormTextInputProps } from "../formTextInput/formTextInput";

export const FormNumberInput = forwardRef(function CustomNumberInput(
  props: NumberInputProps & Pick<FormTextInputProps, "control" | "name">,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={() => (
        <BaseNumberInput
          slots={{
            root: StyledInputRoot,
            input: StyledInput,
            incrementButton: StyledButton,
            decrementButton: StyledButton,
          }}
          slotProps={{
            incrementButton: {
              children: <AddIcon fontSize="small" />,
              className: "increment",
            },
            decrementButton: {
              children: <RemoveIcon fontSize="small" />,
            },
          }}
          {...props}
          ref={ref}
        />
      )}
    />
  );
});

const StyledInputRoot = styled("div")(
  () => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 400;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
`
);

const StyledInput = styled("input")(
  ({ theme }) => `
  font-size: 0.875rem;
  font-family: inherit;
  font-weight: 400;
  line-height: 1.375
  box-shadow: 0px 2px 4px ${theme.palette.mode === "dark" ? "rgba(0,0,0, 0.5)" : "rgba(0,0,0, 0.05)"};
  border-radius: 8px;
  margin: 0 8px;
  padding: 10px 12px;
  outline: 0;
  min-width: 0;
  width: 4rem;
  text-align: center;
  &:focus-visible {
    outline: 0;
  }
`
);

const StyledButton = styled("button")(
  () => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  line-height: 1.5;
  border-radius: 999px;
  width: 32px;
  height: 32px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 120ms;

  &:hover {
    cursor: pointer;
  }

  &:focus-visible {
    outline: 0;
  }

  &.increment {
    order: 1;
  }
`
);
