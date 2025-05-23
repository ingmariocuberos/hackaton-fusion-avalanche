import { setLocale } from "yup";

export const setYupLocale = () => {
  setLocale({
    mixed: {
      required: 'Este campo es requerido',
    },
    string: {
      email: 'Correo electrónico inválido',
      min: '${path} debe tener al menos ${min} caracteres',
    },
  });
};

