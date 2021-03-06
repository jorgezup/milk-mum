import { Field, Form, Formik } from "formik"
import moment from "moment"
import router from "next/router"
import React from "react"
import { FiX } from "react-icons/fi"
import { toast } from "react-toastify"
import * as Yup from 'yup'
import Modal from "../../Modal"
import { api } from "../../services/api"
import styles from './styles.module.scss'


const OrdenhaSchema = Yup.object().shape({
  firstMilking: Yup.string().required('Se não houve retirada, inserir o valor 0.'),
  secondMilking: Yup.string().required('Se não houve retirada, inserir o valor 0.'),
  date: Yup.date().required('Data é obrigatória')
})


const ModalEditOrdenha = ({ isOpen, setIsOpen, milkingEdit }) => {
  
  async function onSubmit (values) {
    try {
      const data = {
        firstMilking: values.firstMilking,
        secondMilking: values.secondMilking,
        date: moment(values.formattedDate).format()
      }
      
      const response = await api.put(`ordenhas/${milkingEdit.id}`, data)
  
      if (response.status === 200) {
        toast.success('Editado com sucesso')
        router.push(`/visualizar-animal/${milkingEdit.vacaId}`)
        setIsOpen(false)
      }

    } catch (error) {
      console.error(error)
      toast.error('Erro inesperado.')
      router.push(`/`)
    }
  }
  
  const handleCloseModal = () => {
    setIsOpen(false)
  }
  
  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Editar Ordenha</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCloseModal}/>
          </button>
        </header>

        <Formik 
          initialValues={{
            ...milkingEdit,
            date: moment(milkingEdit.date).format('YYYY-MM-DD')
          }}
          validationSchema={OrdenhaSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{milkingEdit.cow}</span>
              </div>
              
              <label htmlFor="firstMilking">1a Ordenha</label>
              <Field 
                name="firstMilking" 
                type="number" 
                placeholder="Valor em Kg. Ex.: 12,2 (12 quilos e 200 gramas)"
              />
              {errors.firstMilking && touched.firstMilking ? (
                <div className={styles.message}>
                  {errors.firstMilking}
                </div>
              ) : null}

              <label htmlFor="secondMilking">2a Ordenha</label>
              <Field 
                name="secondMilking" 
                type="number"
                placeholder="Valor em Kg. Ex.: 12,2 (12 quilos e 200 gramas)"
              />
              {errors.secondMilking && touched.secondMilking ? (
                <div className={styles.message}>
                  {errors.secondMilking}
                </div>
              ) : null}

              <label htmlFor="date">Data</label>{}
              <Field name="date" type="date"/>
              {errors.date && touched.date ? (
                <div className={styles.message}>
                  {errors.date}
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

export default ModalEditOrdenha 