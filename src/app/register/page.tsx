import { Container } from "@mui/material";

import RegisterForm from "@/components/registerForm/registerForm";


const page = () => {
  return (
    <Container sx={{
      margin: "auto",
      marginTop: "20vh"
    }}>
      <RegisterForm />
    </Container>
  );
};

export default page;