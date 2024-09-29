"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Container, ContainerOwnProps, styled } from "@mui/material";
import { useForm } from "react-hook-form";

import { FormField } from "@/interfaces/formField";
import { RegisterFormData } from "@/interfaces/registerFormData";
import { registerNewUser } from "@/utils/authentication";

import { registerValidationSchema } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";
const StyledFormTextField = styled((props: FormTextInputProps) => (
  <FormTextInput
    sx={{
      height: "40px",
    }}
    outlineColor="primary"
    {...props}
  />
))();
const fieldDataWithValidation: Array<FormField | Array<FormField>> = [
  {
    key: "name",
    label: "Your name",
    type: "text",
  },
  {
    label: "Email",
    key: "email",
    type: "email",
  },
  [
    {
      label: "Password",
      key: "password",
      type: "password",
    },
    {
      label: "Confirm password",
      key: "confirmPassword",
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
    resolver: yupResolver(registerValidationSchema),
  });
  const onSubmit = async (data: RegisterFormData) => {
    const result = await registerNewUser(data);
    if (result) {
      alert(`You have successfully logged in ${JSON.stringify(result)}`);
    }
  };

  const buildForm = (fieldLists: Array<FormField | Array<FormField>>) => {
    return fieldLists.map((field) => {
      if (Array.isArray(field)) {
        const key = field.reduce((acc, { key }) => (acc += key + "_"), "formTextField_");
        return (
          <Container key={key} sx={{ display: "flex", flexDirection: "row", gap: "10px" }} disableGutters>
            {buildForm(field)}
          </Container>
        );
      }
      const { key, label, type } = field;
      return <StyledFormTextField key={key} name={key} label={label} control={control} type={type}/>;
    });
  };
  return (
    <ContainerFlexColumn
      {...props}
      component="form"
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
