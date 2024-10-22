import { useState } from 'react';

import { Button } from '@mui/material';
import { Meta, StoryObj } from '@storybook/react';

import ProfilePopOver from './profilePopOver';

const meta: Meta<typeof ProfilePopOver> = {
  title: 'Popovers/ProfilePopover',
  component: ProfilePopOver,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProfilePopOver>;

export const Default: Story = {
  render: function DefaultStory() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const linkList = [
      { label: 'Profile', href: '/profile', onClick: handleClose },
      { label: 'Settings', href: '/settings', onClick: handleClose },
      { label: 'Logout', onClick: () => {
          handleClose();
          alert('Logging out...');
        }
      },
    ];

    return (
      <>
        <Button variant="contained" onClick={handleClick}>
          Open Profile Menu
        </Button>
        <ProfilePopOver
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          linkList={linkList}
        />
      </>
    );
  },
};
