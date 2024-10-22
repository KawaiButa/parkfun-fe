import { Box } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';

import FilterForm, { FilterItem } from './filterForm';

const meta: Meta<typeof FilterForm> = {
  title: 'Forms/FilterForm',
  component: FilterForm,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof FilterForm>;

const filterData: FilterItem<unknown, unknown>[] = [
  {
    label: 'Search',
    name: 'search',
    type: 'text',
    variant: 'outlined',
    helperText: 'Enter your search term',
  },
  {
    label: 'Price Range',
    name: 'priceRange',
    type: 'slider',
    min: 0,
    max: 100,
    value: [20, 80],
  },
  {
    label: 'Categories',
    name: 'categories',
    type: 'checkbox',
    options: ['Option 1', 'Option 2', 'Option 3'],
  },
  {
    label: 'Select an Option',
    name: 'radioOption',
    type: 'radio',
    options: ['Choice 1', 'Choice 2', 'Choice 3'],
  },
];

export const Default: Story = {
  render: function DefaultStory (args) {
    const { control } = useForm({
      defaultValues: {
        search: '',
        priceRange: [20, 80],
        categories: [],
        radioOption: '',
      },
    });

    return (
      <Box sx={{ width: '400px' }}>
        <FilterForm {...args} data={filterData} control={control}/>
      </Box>
    );
  },
  args: {
    direction: 'column',
  },
};

export const RowDirection: Story = {
  render: function RowDirectionStory(args){
    const { control } = useForm({
      defaultValues: {
        search: '',
        priceRange: [20, 80],
        categories: [],
        radioOption: '',
      },
    });

    return (
      <Box sx={{ width: '400px' }}>
        <FilterForm {...args}  data={filterData} control={control}/>
      </Box>
    );
  },
  args: {
    direction: 'row',
  },
};

export const DisabledFields: Story = {
  render: function DisableField(args){
    const { control } = useForm({
      defaultValues: {
        search: '',
        priceRange: [20, 80],
        categories: [],
        radioOption: '',
      },
    });

    const disabledFilterData = filterData.map(item => ({
      ...item,
      disabled: true,
    }));

    return (
      <Box sx={{ width: '400px' }}>
        <FilterForm {...args} data={disabledFilterData} control={control}/>
      </Box>
    );
  },
  args: {
    direction: 'column',
  },
};
