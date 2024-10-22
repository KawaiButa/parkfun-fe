import { Meta, StoryObj } from "@storybook/react";

import { ImageUpload } from "./ImageUpload";
import { noImage } from "../../../public/images";
const meta: Meta<typeof ImageUpload> = {
  title: "Forms/ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: "text",
      description: "Width of the upload area",
    },
    height: {
      control: "text",
      description: "Height of the upload area",
    },
    src: {
      control: "text",
      description: "Source URL for the initial image",
    },
  },
};

export default meta;

type Story = StoryObj<typeof ImageUpload>;

export const Basic: Story = {
  render: (args) => <ImageUpload {...args} />,
  args: {
    width: "300px",
    height: "300px",
    src: undefined,
  },
};

export const WithInitialImage: Story = {
  render: (args) => <ImageUpload {...args} />,
  args: {
    width: "300px",
    height: "300px",
    src: noImage.src,
  },
};

export const CustomSize: Story = {
  render: (args) => <ImageUpload {...args} />,
  args: {
    width: "500px",
    height: "300px",
    src: "https://via.placeholder.com/500x300",
  },
};
