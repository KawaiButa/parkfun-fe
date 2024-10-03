"use client";

import { Close, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";

const EditProfileButton = () => {
  const isEdit = window.location.pathname.includes("/profile/edit");
  if (isEdit)
    return (
      <IconButton
        sx={{
          padding: "0",
        }}
        href="/profile"
      >
        <Close sx={{ fontSize: "22px" }} />
      </IconButton>
    );
  return (
    <IconButton
      sx={{
        padding: "0",
      }}
      href="/profile/edit"
    >
      <Edit sx={{ fontSize: "22px" }} />
    </IconButton>
  );
};

export default EditProfileButton;
