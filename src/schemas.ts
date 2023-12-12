import * as yup from 'yup';

export const bodySchema = yup.object().shape({
  id: yup.string().required(),
  message: yup.string().required(),
});
