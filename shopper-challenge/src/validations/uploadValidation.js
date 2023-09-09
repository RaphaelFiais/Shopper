import * as Yup from 'yup'

export const uploadValidation = Yup.object({
  product_code: Yup.number('Não é do tipo numerico').required(
    'Codigo do produto está faltando',
  ),
  new_price: Yup.number('Não é do tipo numerico').required('Preço faltando'),
})
