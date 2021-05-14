import { Field, Form, Formik } from "formik"
import moment from "moment"
import router from "next/router"
import React from "react"
import { toast } from "react-toastify"
import Modal from "../../Modal"
import { api } from "../../services/api"
import styles from './styles.module.scss'

const ModalEditOrdenha = ({ isOpen, setIsOpen, milkingEdit }) => {

  async function onSubmit (values) {
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
    else {
      toast.error('Erro ao editar.')
    }
  }

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Editar Ordenha</h2>
        </header>

        <Formik 
          onSubmit={onSubmit}
          initialValues={milkingEdit}
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

              <label htmlFor="formattedDate">Data</label>{}
              <Field name="formattedDate" type="date"/>
              {errors.formattedDate && touched.formattedDate ? (
                <div className={styles.message}>
                  {errors.formattedDate}
                </div>
              ) : null}

              <div className={styles.buttons}>
                <button type="button" className={styles.cancel}>Cancelar</button>
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