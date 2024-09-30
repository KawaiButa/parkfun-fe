import { Button, ButtonProps } from "@mui/material";
const SecondaryContainedButton = (props: ButtonProps) => {
  return <Button variant="contained" color="secondary" {...props} />;
};

export default SecondaryContainedButton;
