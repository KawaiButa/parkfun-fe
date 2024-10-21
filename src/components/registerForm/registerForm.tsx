"use client";
import { useEffect } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { CircularProgress, Container, ContainerOwnProps, styled } from "@mui/material";
import { useNotifications } from "@toolpad/core";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { FormField } from "@/interfaces/formField";
import { RegisterFormData } from "@/interfaces/registerFormData";
import { registerNewUser } from "@/utils/authentication";

import { registerValidationSchema } from "./validationSchema";
import ContainerFlexColumn from "../containerFlexColumn/containerFlexColumn";
import { FormTextInput, FormTextInputProps } from "../formTextInput/formTextInput";
const StyledFormTextField = styled((props: FormTextInputProps) => (
  <FormTextInput
    slotProps={{
      textField: {
        sx: {
          "& fieldset": {
            borderColor: "secondary.contrastText",
          },
        },
      },
    }}
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
  const notifications = useNotifications();
  const router = useRouter();
  const { handleSubmit, control, formState: {isSubmitting, errors} } = useForm<RegisterFormData>({
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
    try {
      const result = await registerNewUser(data);
      if (result) {
        notifications.show(`You have signed in successfully.`, {
          severity: "success",
          autoHideDuration: 2000,
        });
        router.replace("/auth/login");
      }
    } catch (err) {
      if (err instanceof AxiosError)
        notifications.show(err.response?.data.message, {
          severity: "error",
          autoHideDuration: 2000,
        });
      else
        notifications.show((err as Error).message, {
          severity: "error",
          autoHideDuration: 2000,
        });
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
      return <StyledFormTextField key={key} name={key} label={label} control={control} type={type} />;
    });
  };
  useEffect(() => {
    if(Object.keys(errors).length > 0){
      notifications.show(Object.values(errors)[0].message, {
        severity: "error",
        autoHideDuration: 2000,
      });
      return;
    }
  },[errors])
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
        gap: "25px",
      }}
    >
      {buildForm(fieldDataWithValidation)}
      <LoadingButton
        type="submit"
        onClick={handleSubmit(onSubmit)}
        sx={{
          fontSize: "20px",
          fontWeight: "500",
        }}
        variant="contained"
        loadingIndicator={<CircularProgress />}
        loading={isSubmitting}
      >
        Start booking
      </LoadingButton>
    </ContainerFlexColumn>
  );
};
export default RegisterForm;
