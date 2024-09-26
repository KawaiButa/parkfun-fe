"use client";
import { KeyboardDoubleArrowLeft } from "@mui/icons-material";
import { Button, Container, ContainerOwnProps, FormGroup, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

import { RegisterFormData } from "@/interfaces/registerFormData";
import { registerNewUser } from "@/utils/authentication";

import FormTextInput from "../formTextInput/formTextInput";

const RegisterForm = (props: ContainerOwnProps) => {
  const { handleSubmit, control } = useForm<RegisterFormData>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
    },
  });
  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerNewUser(data);
    if (result) {
      alert(`You have successfully logged in ${JSON.stringify(result)}`);
    }
  };
  return (
    <Container
      {...props}
      component={"form"}
      maxWidth="sm"
      sx={{
        ...props.sx,
        backgroundColor: "var(--secondary-color)",
        padding: "30px",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
      }}
    >
      <Container
        sx={{
          padding: "0 !important",
        }}
      >
        <Typography
          component={"a"}
          href="/login"
          sx={{
            fontSize: {
              xs: "12px",
              md: "16px",
            },
          }}
          color="var(--secondary-text-color)"
        >
          <KeyboardDoubleArrowLeft sx={{ fontSize: "18px", transform: "translateY(4px)" }} />
          {" Already have an account"}
        </Typography>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{
            fontWeight: "600",
            fontSize: {
              xs: "30px",
              md: "40px",
            },
            transform: "translateY(10px)",
          }}
        >
          Register new account
        </Typography>
      </Container>
      <FormTextInput
        label="Your name"
        name="name"
        control={control}
        rule={{
          required: "Please enter your name",
        }}
        type="text"
        sx={{
          height: "40px",
        }}
      />
      <FormTextInput
        label="Email"
        name="email"
        control={control}
        rule={{
          required: "Please enter your email",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address",
          },
        }}
        type="email"
        sx={{
          height: "40px",
        }}
      />
      <FormGroup row={true} sx={{ gap: "20px" }}>
        <FormTextInput
          label="Password"
          name="password"
          control={control}
          rule={{
            required: "Please enter your password",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
          }}
          sx={{
            flex: 1,
          }}
          type="password"
        />
        <FormTextInput
          label="Confirm password"
          name="confirmPassword"
          control={control}
          rule={{
            required: "Please enter your password",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long",
            },
            validate: {
              match: (value, formField) => value === formField.password || "Confirm password is not matched",
            },
          }}
          sx={{
            flex: 1,
          }}
          type="password"
        />
      </FormGroup>
      <FormTextInput
        name={"phoneNumber"}
        label="Phone number"
        control={control}
        sx={{
          transform: "translateY(-20px)",
        }}
      />
      <Button
        variant="contained"
        type="submit"
        onClick={handleSubmit(onSubmit)}
        sx={{
          fontSize: "20px",
          fontWeight: "500",
        }}
      >
        Start booking
      </Button>
    </Container>
  );
};

export default RegisterForm;
