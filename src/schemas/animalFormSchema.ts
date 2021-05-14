import * as Yup from 'yup'

export default Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  weight: Yup.number().required('Peso é obrigatório'),
  born: Yup.date().required('Data de nascimento é obrigatória'),
})