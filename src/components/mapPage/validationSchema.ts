
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  position: Yup.array().of(Yup.number().required()),
  type: Yup.string().required(),
  price: Yup.array().of(Yup.number().required()).min(2),
  time: Yup.array().min(2).max(2),
  radius: Yup.number().required().positive(),
  width: Yup.number().required().positive(),
  height: Yup.number().required().positive(),
  length: Yup.number().required().positive(),
  services: Yup.array().of(Yup.string()),
});

export default validationSchema;