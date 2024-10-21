import * as Yup from "yup";

const profileSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required").min(2, "First Name must be at least 2 characters"),
  lastName: Yup.string().required("Last Name is required").min(2, "Last Name must be at least 2 characters"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  phoneNumber: Yup.string().required("Phone number must not empty").length(10),
  address: Yup.string(),
});

export default profileSchema;
