import { useState, useEffect, ChangeEvent, useRef } from "react";

import { Box, BoxProps } from "@mui/material";
interface ImageUpload extends BoxProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void,
}
export const ImageUpload = (props: BoxProps) => {
  const {onChange, ...remain} = props;
  const [selectedFile, setSelectedFile] = useState<File>();
  const [preview, setPreview] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    const file = e.target.files[0];
    if(onChange)
      onChange(e);
    setSelectedFile(file);
  };

  function handleClick(): void {
    if (inputRef.current) inputRef.current.click();
  }

  return (
    <Box {...remain} onClick={() => handleClick()}>
      <input type="file" onChange={onSelectFile} hidden ref={inputRef} />
      {selectedFile && (
        <img
          src={preview}
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
