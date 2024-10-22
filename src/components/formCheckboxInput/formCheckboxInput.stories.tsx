import React from 'react';

import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import FormCheckboxInput, { FormCheckBoxInputProps } from './formCheckboxInput';


const StoryComponent = <T, K>({ args }: { args: FormCheckBoxInputProps<T, K> }) => {
  const { control } = useForm({
    defaultValues: {
      [args.name]: []
    }
  });

  return (
    <Box sx={{ width: '500px', display: "flex", justifyContent: "center" }}>
      <FormCheckboxInput {...args} control={control} />
    </Box>
  );
};

const meta: Meta<typeof FormCheckboxInput> = {
  title: 'Forms/FormCheckboxInput',
  component: FormCheckboxInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      defaultValue: 'column'
    },
    label: {
      control: 'text',
    },
    helperText: {
      control: 'text',
    },
  },
};

export default meta;

type BasicStory = StoryObj<typeof FormCheckboxInput<string, string>>;
type ColorStory = StoryObj<typeof FormCheckboxInput<ColorOption, number>>;
type SettingsStory = StoryObj<typeof FormCheckboxInput<string, string>>;

export const Basic: BasicStory = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'fruits',
    label: 'Select Fruits',
    options: ['Apple', 'Banana', 'Orange', 'Mango'],
    direction: 'column',
  },
};

interface ColorOption {
  id: number;
  name: string;
  hex: string;
  description: string;
}

const colorOptions: ColorOption[] = [
  { id: 1, name: 'Red', hex: '#FF0000', description: 'Primary color' },
  { id: 2, name: 'Blue', hex: '#0000FF', description: 'Secondary color' },
  { id: 3, name: 'Green', hex: '#00FF00', description: 'Background color' },
];

export const WithTransformFunctions: ColorStory = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'colors',
    label: 'Select Colors',
    options: colorOptions,
    transformLabel: (option: ColorOption) => `${option.name} (${option.hex})`,
    transformValue: (option: ColorOption) => option.id,
    transformHelperText: (option: ColorOption) => option.description,
    direction: 'column',
  },
};

export const RowDirection: SettingsStory = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'settings',
    label: 'Settings',
    options: ['Enable notifications', 'Dark mode', 'Auto-update'],
    direction: 'row',
    fullWidth: true,
    sx: {
      '& .MuiFormControlLabel-root': {
        marginRight: 4
      }
    }
  },
};