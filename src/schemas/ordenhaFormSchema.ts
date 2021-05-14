import * as Yup from 'yup'

export default Yup.object().shape({
  firstMilking: Yup.string().required('Nome é obrigatório'),
  secondMilking: Yup.number().required('Peso é obrigatório'),
  born: Yup.date().required('Data de nascimento é obrigatória'),
})