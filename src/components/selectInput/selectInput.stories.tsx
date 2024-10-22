import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import SelectInput from './selectInput';

const meta: Meta<typeof SelectInput> = {
  title: 'Forms/SelectInput',
  component: SelectInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the select input',
    },
    options: {
      control: 'object',
      description: 'Options for the select input',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when the select value changes',
    },
    value: {
      control: 'text',
      description: 'Current value of the select input',
    },
  },
};

export default meta;

type Story = StoryObj<typeof SelectInput>;

export const Basic: Story = {
  render: (args) => (
    <Box sx={{ width: '300px' }}>
      <SelectInput {...args} />
    </Box>
  ),
  args: {
    label: 'Select an option',
    options: [
      { label: 'Option 1', value: 'option1' },
      { label: 'Option 2', value: 'option2' },
      { label: 'Option 3', value: 'option3' },
    ],
    value: 'option1',
    transformToLabel: (value) => (value as {label:string, value:string}).label
  },
};

export const WithDifferentDefaultValue: Story = {
  render: (args) => (
    <Box sx={{ width: '300px' }}>
      <SelectInput {...args} />
    </Box>
  ),
  args: {
    label: 'Choose your favorite fruit',
    options: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
      { label: 'Cherry', value: 'cherry' },
    ],
    value: 'banana',
    transformToLabel: (value) => (value as {label:string, value:string}).label

  },
};
