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
  coverage: Yup.string().required('Tipo de cobertura é obrigatório'),
  coverageDate: Yup.date().required('Data estimada de cobertura é obrigatória.'),
  birthEstimate: Yup.date().required('Data estimada de nascimento é obrigatória.'),
})

const ModalEditCobertura = ({ isOpen, setIsOpen, coverageEdit }) => {
  async function onSubmit (values) {
    try {
      const data = {
        vacaId: coverageEdit.vacaId.id,
        semen: values.coverage === 'semen' ? true :  false,
        coverageDate: moment(values.coverageDate).format(),
        birthEstimate: moment(values.birthEstimate).format()
      }
  
      const response = await api.put(`coberturas/${coverageEdit.id}`, data)
  
      if (response.status === 200) {
        toast.success('Cadastrado com sucesso')
        router.push(`/visualizar-animal/${coverageEdit.vacaId.id}`)
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
          <h2>Editar Cobertura</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCloseModal}/>
          </button>
        </header>

        <Formik 
          initialValues={{
            coverage: coverageEdit.semen ? "semen" : "bull",
            coverageDate: moment(coverageEdit.coverageDate).format('YYYY-MM-DD'),
            birthEstimate: moment(coverageEdit.birthEstimate).format('YYYY-MM-DD'),
          }}
          validationSchema={CoverageSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{coverageEdit.cow}</span>
              </div>
              
              <div id="coverage-radio-group" className={styles.radioHeader}>Cobertura</div>
              <div role="group" aria-labelledby="coverage-radio-group" className={styles.radioGroup} >
                <label>
                  <Field type="radio" name="coverage" value="bull" />
                  Touro
                </label>
                <label>
                  <Field type="radio" name="coverage" value="semen"/>
                  Inseminação
                </label>
                {errors.coverage && touched.coverage ? (
                  <div className={styles.message}>
                    {errors.coverage}
                  </div>
                ) : null}                
              </div>

              <label htmlFor="coverageDate">Data Estimada da Cobertura</label>
              <Field name="coverageDate" type="date"/>
              {errors.coverageDate && touched.coverageDate ? (
                <div className={styles.message}>
                  {errors.coverageDate}
                </div>
              ) : null}

              <label htmlFor="birthEstimate">Data Estimada do Nascimento</label>
              <Field name="birthEstimate" type="date"/>
              {errors.birthEstimate && touched.birthEstimate ? (
                <div className={styles.message}>
                  {errors.birthEstimate}
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

export default ModalEditCobertura