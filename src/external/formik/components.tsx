import React from 'react';
import { Formik, Field as FormikField } from 'formik';
import { FormProps, FormFieldProps } from './types';

export const Form: React.FC<FormProps<any>> = ({
  initialValues,
  onSubmit,
  validationSchema,
  children,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit}>
          {children}
        </form>
      )}
    </Formik>
  );
};

export const Field: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = 'text',
  required,
  disabled,
}) => {
  return (
    <div className="form-field">
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <FormikField
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="form-input"
      />
    </div>
  );
}; 