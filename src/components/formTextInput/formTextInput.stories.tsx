import React, { useState } from "react";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, InputAdornment, IconButton } from "@mui/material";
import type { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { FormTextInput, FormTextInputProps } from "./formTextInput";

interface StoryWrapperProps {
  args: FormTextInputProps;
}

const StoryComponent = ({ args }: StoryWrapperProps) => {
  const { control } = useForm({
    defaultValues: {
      [args.name]: args.slotProps?.textField?.defaultValue || "",
    },
  });

  return (
    <Box sx={{ width: "500px", display: "flex", justifyContent: "center", mb: 2 }}>
      <FormTextInput {...args} control={control} />
    </Box>
  );
};

const meta: Meta<typeof FormTextInput> = {
  title: "Forms/FormTextInput",
  component: FormTextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label for the input field",
    },
    helperText: {
      control: "text",
      description: "Helper text displayed under the input field",
    },
    outlineColor: {
      control: "text",
      description: "Custom color for the input outline",
    },
    startAdornment: {
      control: "object",
      description: "Adornment element at the start of the input field",
    },
    endAdornment: {
      control: "object",
      description: "Adornment element at the end of the input field",
    },
    rule: {
      control: "object",
      description: "Validation rules for the input field",
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormTextInput>;

export const Basic: Story = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: "basicText",
    label: "Basic Text Input",
    helperText: "Enter some text",
    slotProps: {
      textField: {
        defaultValue: "",
      },
    },
  },
};

export const WithValidation: Story = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: "validatedText",
    label: "Validated Text Input",
    helperText: "Input must have at least 3 characters",
    rule: {
      required: "This field is required",
      minLength: {
        value: 3,
        message: "Minimum length is 3 characters",
      },
    },
    slotProps: {
      textField: {
        defaultValue: "",
      },
    },
  },
};

export const WithAdornment: Story = {
  render: function WithAdornmentStory(args) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);

    return (
      <StoryComponent
        args={{
          ...args,
          startAdornment: <InputAdornment position="start">@</InputAdornment>,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          type: showPassword ? "text" : "password",
        }}
      />
    );
  },
  args: {
    name: "password",
    label: "Password Input",
    helperText: "Click the eye to toggle password visibility",
    slotProps: {
      textField: {
        defaultValue: "",
      },
    },
  },
};

export const CustomOutlineColor: Story = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: "coloredOutline",
    label: "Custom Outline Color",
    outlineColor: "primary",
    helperText: "This field has a custom outline color",
    slotProps: {
      textField: {
        defaultValue: "",
      },
    },
    sx: {
      "& fieldset.MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--primary-color)",
      },
    },
  },
};
