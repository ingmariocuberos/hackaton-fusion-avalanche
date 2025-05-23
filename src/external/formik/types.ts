import { FormikConfig, FormikHelpers, FormikValues } from 'formik';

export interface FormConfig<T extends FormikValues> extends Omit<FormikConfig<T>, 'onSubmit'> {
  onSubmit: (values: T, formikHelpers: FormikHelpers<T>) => Promise<void>;
}

export interface FormFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface FormProps<T extends FormikValues> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validationSchema?: any;
  children: React.ReactNode;
} 