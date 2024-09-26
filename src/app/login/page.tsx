import { Container } from "@mui/material";

import LoginForm from "@/components/loginForm/loginForm";


const page = () => {
  return (
    <Container sx={{
      margin: "auto",
      marginTop: "20vh"
    }}>
      <LoginForm />
    </Container>
  );
};

export default page;