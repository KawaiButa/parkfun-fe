import { MouseEvent } from "react";

import { Button, Popover, PopoverProps } from "@mui/material";
import Link from "next/link";

import ContainerFlexColumn from "@/components/containerFlexColumn/containerFlexColumn";

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
      <ContainerFlexColumn>
        {linkList.map(({ label, href, onClick }) => (
          <Button variant="text" key={href} onClick={onClick}>
            <Link href={href ?? ""}>{label}</Link>
          </Button>
        ))}
      </ContainerFlexColumn>
    </Popover>
  );
};
export default ProfilePopOver;
