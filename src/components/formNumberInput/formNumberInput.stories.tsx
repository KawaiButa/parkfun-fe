import React from 'react';

import { Box, ThemeProvider, createTheme } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import { FormNumberInput } from './formNumberInput';

const theme = createTheme();

type FormNumberInputProps = Parameters<typeof FormNumberInput>[0];

const StoryComponent = ({ args }: { args: FormNumberInputProps }) => {
  const { control } = useForm({
    defaultValues: {
      [args.name]: args.defaultValue || 0
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: 2 }}>
        <FormNumberInput {...args} control={control} />
      </Box>
    </ThemeProvider>
  );
};

const meta: Meta<typeof FormNumberInput> = {
  title: 'Forms/FormNumberInput',
  component: FormNumberInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    min: {
      control: 'number',
      description: 'Minimum allowed value'
    },
    max: {
      control: 'number',
      description: 'Maximum allowed value'
    },
    step: {
      control: 'number',
      description: 'Step increment/decrement value'
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state of the input'
    },
    defaultValue: {
      control: 'number',
      description: 'Default value for the input'
    }
  },
};

export default meta;

type Story = StoryObj<typeof FormNumberInput>;

export const Basic: Story = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'basicNumber',
    defaultValue: 0,
    min: 0,
    max: 100,
    step: 1,
  },
};

export const CustomStep: Story = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'stepNumber',
    defaultValue: 0,
    min: 0,
    max: 1,
    step: 0.1,
  },
};

export const WithConstraints: Story = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'constrainedNumber',
    defaultValue: 5,
    min: 0,
    max: 10,
    step: 1,
  },
};

export const Disabled: Story = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'disabledNumber',
    defaultValue: 0,
    disabled: true,
    min: 0,
    max: 100,
    step: 1,
  },
};

export const WithInitialValue: Story = {
  render: (args) => (
    <StoryComponent args={args} />
  ),
  args: {
    name: 'presetNumber',
    defaultValue: 42,
    min: 0,
    max: 100,
    step: 1,
  },
};