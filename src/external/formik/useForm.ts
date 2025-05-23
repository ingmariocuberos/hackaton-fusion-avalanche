import { useFormik } from 'formik';
import { FormConfig } from './types';

export const useForm = <T extends Record<string, any>>(config: FormConfig<T>) => {
  const formik = useFormik({
    ...config,
    validateOnBlur: true,
    validateOnChange: true,
  });

  return {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    handleChange: formik.handleChange,
    handleBlur: formik.handleBlur,
    handleSubmit: formik.handleSubmit,
    setFieldValue: formik.setFieldValue,
    setFieldTouched: formik.setFieldTouched,
    resetForm: formik.resetForm,
    isValid: formik.isValid,
    isSubmitting: formik.isSubmitting,
  };
}; 