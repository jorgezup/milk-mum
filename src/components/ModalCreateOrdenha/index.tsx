import { Field, Form, Formik } from "formik"
import moment from "moment"
import router from "next/router"
import React from "react"
import { FiX } from 'react-icons/fi'
import { toast } from "react-toastify"
import Modal from "../../Modal"
import { api } from "../../services/api"
import styles from './styles.module.scss'

const ModalCreateOrdenha = ({ isOpen, setIsOpen, creatingMilking }) => {
  async function onSubmit (values) {
    const data = {
      vacaId: creatingMilking.id,
      firstMilking: values.firstMilking,
      secondMilking: values.secondMilking,
      date: moment(values.date).format()
    }

    const response = await api.post(`ordenhas`, data)

    if (response.status === 200) {
      toast.success('Cadastrado com sucesso')
      router.push(`/visualizar-animal/${creatingMilking.id}`)
      setIsOpen(false)
    }
    else {
      toast.error('Erro ao cadastrar.')
    }
  }

  function handleCancel() {
    setIsOpen(false)
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Registrar Ordenha</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCancel}/>
          </button>
        </header>

        <Formik 
          onSubmit={onSubmit}
          initialValues={{
            firstMilking: '',
            secondMilking: '',
            date: moment().format('YYYY-MM-DD'),
          }}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{creatingMilking.name}</span>
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

export default ModalCreateOrdenha 