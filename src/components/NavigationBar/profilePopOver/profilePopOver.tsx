import { MouseEvent } from "react";

import { Button, Popover, PopoverProps, Stack } from "@mui/material";
import Link from "next/link";


interface ProfilePopoverProps extends PopoverProps {
  linkList: { label: string; href?: string; onClick?: (event: MouseEvent) => void }[];
}
const ProfilePopOver = (props: ProfilePopoverProps) => {
  const { linkList, ...popoverProps } = props;
  return (
    <Popover
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      {...popoverProps}
    >
      <Stack p={0}>
        {linkList.map(({ label, href, onClick }) => (
          <Button variant="text" key={href} onClick={onClick} fullWidth sx={{
            px: 5,
            py: 1

          }}>
            <Link href={href ?? ""}>{label}</Link>
          </Button>
        ))}
      </Stack>
    </Popover>
  );
};
export default ProfilePopOver;
