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

const CoverageSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  birthDate: Yup.date().required('Data estimada de nascimento é obrigatória.'),
})

const ModalEditCalf = ({ isOpen, setIsOpen, calfEdit }) => {

  async function onSubmit (values) {
    try {
      const data = {
        name: values.name,
        birthDate: moment(values.birthDate).format()
      }

      const response = await api.put(`crias/${calfEdit.id}`, data)
  
      if (response.status === 200) {
        toast.success('Cadastrado com sucesso')
        router.push(`/visualizar-animal/${calfEdit.cowId}`)
        setIsOpen(false)
      }
      else {
        toast.error('Erro ao cadastrar.')
      }
    } catch(error) {
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
          <h2>Editar Cria</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCloseModal}/>
          </button>
        </header>

        <Formik 
          initialValues={{
            ...calfEdit,
            birthDate: moment(calfEdit.birthDate).format('YYYY-MM-DD'),
          }}
          validationSchema={CoverageSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="name">Nome</label>
              <Field 
                name="name" 
                type="text" 
              />
              {errors.name && touched.name ? (
                <div className={styles.message}>
                  {errors.name}
                </div>
              ) : null}              

              <label htmlFor="birthDate">Data de Nascimento</label>
              <Field name="birthDate" type="date"/>
              {errors.birthDate && touched.birthDate ? (
                <div className={styles.message}>
                  {errors.birthDate}
                </div>
              ) : null}

              <div className={styles.buttons}>
                <button type="submit" className={styles.confirm}>Editar</button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ModalEditCalf