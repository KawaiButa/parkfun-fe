import { RegisterOptions } from "react-hook-form";

export interface FormField {
  key: string;
  label: string;
  type?: string;
}

export interface FormFieldWithReactHookValidation extends FormField {
  rule?: Omit<RegisterOptions, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">;
}
