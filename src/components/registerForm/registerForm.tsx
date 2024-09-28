"use client";
import { Button, Container, ContainerOwnProps, styled } from "@mui/material";
import { useForm } from "react-hook-form";

import { FormFieldWithReactHookValidation } from "@/interfaces/formField";
import { RegisterFormData } from "@/interfaces/registerFormData";
import { registerNewUser } from "@/utils/authentication";

import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";
const StyledFormTextField = styled((props: FormTextInputProps) => (
  <FormTextInput
    sx={{
      height: "40px",
    }}
    outlineColor={"primary"}
    {...props}
  />
))();
const fieldDataWithValidation: Array<FormFieldWithReactHookValidation | Array<FormFieldWithReactHookValidation>> = [
  {
    key: "name",
    label: "Your name",
    rule: {
      required: "Please enter your name",
    },
    type: "text",
  },
  {
    label: "Email",
    key: "email",
    rule: {
      required: "Please enter your email",
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Invalid email address",
      },
    },
    type: "email",
  },
  [
    {
      label: "Password",
      key: "password",
      rule: {
        required: "Please enter your password",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters long",
        },
      },
      type: "password",
    },
    {
      label: "Confirm password",
      key: "confirmPassword",
      rule: {
        required: "Please enter your password",
        minLength: {
          value: 8,
          message: "Password must be at least 8 characters long",
        },
        validate: {
          match: (value, formField) => value === formField.password || "Confirm password is not matched",
        },
      },
      type: "password",
    },
  ],
  {
    key: "phoneNumber",
    label: "Phone number",
  },
];

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

  const buildForm = (fieldLists: Array<FormFieldWithReactHookValidation | Array<FormFieldWithReactHookValidation>>) => {
    return fieldLists.map((field) => {
      if (Array.isArray(field)) {
        const key = field.reduce((acc, { key }) => (acc += key + "_"), "formTextField_");
        return (
          <Container key={key} sx={{ display: "flex", flexDirection: "row", gap: "10px" }} disableGutters>
            {buildForm(field)}
          </Container>
        );
      }
      const { key, label, rule } = field;
      return <StyledFormTextField key={key} name={key} label={label} rule={rule} control={control} />;
    });
  };
  return (
    <ContainerFlexColumn
      {...props}
      component={"form"}
      maxWidth="sm"
      sx={{
        ...props.sx,
        backgroundColor: "var(--secondary-color)",
        padding: "30px",
        borderRadius: "10px",
        gap: "10px",
      }}
    >
      {buildForm(fieldDataWithValidation)}
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
    </ContainerFlexColumn>
  );
};
export default RegisterForm;
