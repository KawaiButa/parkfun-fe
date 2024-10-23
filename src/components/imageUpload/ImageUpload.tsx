import { ChangeEvent, useRef } from "react";

import { Box, BoxProps } from "@mui/material";
export interface ImageUploadProps extends BoxProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  src?: string;
}
export const ImageUpload = (props: ImageUploadProps) => {
  const { src, onChange, ...remain } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    if (onChange) onChange(e);
  };

  function handleClick(): void {
    if (inputRef.current) inputRef.current.click();
  }

  return (
    <Box
    onClick={() => handleClick()}
    sx={{
      "&:hover": {
        cursor: "pointer",
      },
      border: "1px solid black"
    }}
    {...remain}
    >
      <input type="file" onChange={onSelectFile} hidden ref={inputRef} />
      {src && (
        <img
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </Box>
  );
};
