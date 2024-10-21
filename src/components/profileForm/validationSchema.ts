import * as Yup from "yup";

const profileSchema = Yup.object().shape({
  name: Yup.string().required("Username is required").min(2, "Username must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number must not empty"),
  address: Yup.string().nullable().required(),
});

export default profileSchema;
