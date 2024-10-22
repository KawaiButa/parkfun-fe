import { Meta, StoryObj } from "@storybook/react";
import dayjs, { Dayjs } from "dayjs";

import BookingTimePicker from "./bookingTimePicker";

const meta: Meta<typeof BookingTimePicker> = {
  title: `Components/BookingTimePicker`,
  component: BookingTimePicker,
  parameters: {
    layout: `centered`,
  },
  tags: [`autodocs`],
};

export default meta;

type BookingTimePickerProps = React.ComponentProps<typeof BookingTimePicker>;

type Story = StoryObj<BookingTimePickerProps>;
export const Default: Story= {
  args: {
    onStartChange: (value: Dayjs | null | null) => alert(`Start Time Changed:${value?.format()}`),
    onEndChange: (value: Dayjs | null | null) => alert(`End Time Changed:${value?.format()}`),
  },
};

export const CustomTimes: Story = {
  args: {
    defaultStartTime: dayjs().hour(10).minute(0),
    defaultEndTime: dayjs().hour(11).minute(0),
    onStartChange: (value: Dayjs | null) => alert(`Start Time Changed:${value?.format()}`),
    onEndChange: (value: Dayjs | null) => alert(`End Time Changed:${value?.format()}`),
  },
};

export const WithCustomSlotProps: Story = {
  args: {
    defaultStartTime: dayjs(),
    defaultEndTime: dayjs().add(30, "minutes"),
    slotProps: {
      container: {
        sx: { padding: "10px", backgroundColor: "gray" },
      },
      leftTimePicker: {
        sx: { width: "200px" },
      },
      rightTimePicker: {
        sx: { width: "200px" },
      },
    },
    onStartChange: (value: Dayjs | null) => alert(`Start Time Changed:${value?.format()}`),
    onEndChange: (value: Dayjs | null) => alert(`End Time Changed:${value?.format()}`),
  },
};
