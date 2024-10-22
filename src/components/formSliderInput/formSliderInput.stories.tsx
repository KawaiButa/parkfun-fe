import { Box, Typography } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import FormSliderInput from './formSliderInput';

const meta: Meta<typeof FormSliderInput> = {
  title: 'Forms/FormSliderInput',
  component: FormSliderInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the slider input',
    },
    startAdornment: {
      control: 'object',
      description: 'Function to render start adornment',
    },
    endAdornment: {
      control: 'object',
      description: 'Function to render end adornment',
    },
    onChange: {
      action: 'changed',
      description: 'Function called when slider value changes',
    },
  },
};

export default meta;

type Story = StoryObj<typeof FormSliderInput>;

export const Basic: Story = {
  render: function BasicStory(args){
    const { control } = useForm({
      defaultValues: {
        [args.name as string]: 50,
      },
    });
    
    return (
      <Box sx={{ width: '300px' }}>
        <FormSliderInput {...args} control={control} />
      </Box>
    );
  },
  args: {
    name: 'slider',
    label: 'Volume Control',
    min: 0,
    max: 100,
    step: 1,
  },
};

export const WithAdornments: Story = {
  render: function WithAdornmentsStory(args){
    const { control } = useForm({
      defaultValues: {
        [args.name as string]: 30,
      },
    });
    
    return (
      <Box sx={{ width: '300px' }}>
        <FormSliderInput
          {...args}
          control={control}
          startAdornment={() => <Typography variant="body2">Min</Typography>}
          endAdornment={() => <Typography variant="body2">Max</Typography>}
        />
      </Box>
    );
  },
  args: {
    name: 'sliderWithAdornments',
    label: 'Volume Control with Adornments',
    min: 0,
    max: 100,
    step: 1,
  },
};

export const RangeSlider: Story = {
  render: function RangeSlider(args){
    const { control } = useForm({
      defaultValues: {
        [args.name as string]: [20, 80],
      },
    });
    
    return (
      <Box sx={{ width: '300px' }}>
        <FormSliderInput
          {...args}
          control={control}
          value={[20, 80]}
          valueLabelDisplay="auto"
          min={0}
          max={100}
          step={1}
        />
      </Box>
    );
  },
  args: {
    name: 'rangeSlider',
    label: 'Range Control',
    min: 0,
    max: 100,
    step: 1,
  },
};
