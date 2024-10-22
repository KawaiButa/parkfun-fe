import React from 'react';

import { Box } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { FormRadioInput, FormTextInputProps } from './formRadioInput';

const StoryComponent = <T, K>({ args }: { args: FormTextInputProps<T, K> }) => {
  const { control } = useForm({
    defaultValues: {
      [args.name]: args.options[0],
    },
  });

  return (
    <Box sx={{ width: '500px', display: 'flex', justifyContent: 'center' }}>
      <FormRadioInput {...args} control={control} />
    </Box>
  );
};

const meta: Meta<typeof FormRadioInput> = {
  title: 'Forms/FormRadioInput',
  component: FormRadioInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'radio',
      options: ['row', 'column'],
      defaultValue: 'column',
    },
    label: {
      control: 'text',
    },
    radioProps: {
      control: false,
    },
  },
};

export default meta;

type BasicStory = StoryObj<typeof FormRadioInput<string, string>>;
type ComplexStory = StoryObj<typeof FormRadioInput<ColorOption, number>>;

export const Basic: BasicStory = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: 'fruits',
    label: 'Select a fruit',
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

export const WithTransformFunctions: ComplexStory = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: 'colors',
    label: 'Choose a color',
    options: colorOptions,
    transformLabel: (option: ColorOption) => `${option.name} (${option.hex})`,
    transformValue: (option: ColorOption) => option.id,
    transformHelperText: (option: ColorOption) => option.description,
    direction: 'row',
  },
};

export const WithValidation: BasicStory = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: 'paymentMethod',
    label: 'Select Payment Method',
    options: ['Credit Card', 'PayPal', 'Crypto'],
    rule: { required: 'Please select a payment method' },
    direction: 'column',
  },
};

export const FullWidth: BasicStory = {
  render: (args) => <StoryComponent args={args} />,
  args: {
    name: 'settings',
    label: 'Settings',
    options: ['Enable notifications', 'Dark mode', 'Auto-update'],
    direction: 'row',
    fullWidth: true,
    sx: {
      '& .MuiFormControlLabel-root': {
        marginRight: 4,
      },
    },
  },
};
