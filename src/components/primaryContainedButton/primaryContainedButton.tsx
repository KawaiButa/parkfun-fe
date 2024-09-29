import { Button, ButtonProps } from "@mui/material";
const PrimaryContainedButton = (props: ButtonProps) => {
  return <Button variant="contained" color="primary" {...props}/>;
};

export default PrimaryContainedButton;
