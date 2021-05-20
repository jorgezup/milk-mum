import { Field, Form, Formik } from "formik"
import moment from "moment"
import router from "next/router"
import React from "react"
import { FiX } from 'react-icons/fi'
import { toast } from "react-toastify"
import * as Yup from 'yup'
import Modal from "../../Modal"
import { api } from "../../services/api"
import styles from './styles.module.scss'

const WeightSchema = Yup.object().shape({
  weight: Yup.number().required('Peso é obrigatório'),
  date: Yup.date().required('Data é obrigatória.')
})

const ModalCreatePeso = ({ isOpen, setIsOpen, creatingWeight }) => {
  async function onSubmit (values) {
    try {
      const data = {
        vacaId: creatingWeight.id,
        weight: values.weight,
        date: moment(values.date).format()
      }
    
      const response = await api.post(`pesos`, data)
      
      if (response.status === 200) {
        toast.success('Cadastrado com sucesso')
        router.push(`/visualizar-animal/${creatingWeight.id}`)
        setIsOpen(false)
      }
      else {
        toast.error('Erro ao cadastrar.')
      }

    } catch (error) {
      console.error(error)
      toast.error('Erro inesperado.')
      router.push(`/`)
    }
  }

  function handleCloseModal() {
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Registrar Peso</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCloseModal}/>
          </button>
        </header>

        <Formik 
          initialValues={{
            weight: '',
            date: moment().format('YYYY-MM-DD'),
          }}
          validationSchema={WeightSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{creatingWeight.name}</span>
              </div>
              
              <label htmlFor="weight">Peso</label>
              <Field 
                name="weight" 
                type="number" 
                placeholder="Valor em Kg."
              />
              {errors.weight && touched.weight ? (
                <div className={styles.message}>
                  {errors.weight}
                </div>
              ) : null}

              <label htmlFor="date">Data</label>
              <Field name="date" type="date"/>
              {errors.date && touched.date ? (
                <div className={styles.message}>
                  {errors.date}
                </div>
              ) : null}

              <div className={styles.buttons}>
                <button type="submit" className={styles.confirm}>Cadastrar</button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ModalCreatePeso