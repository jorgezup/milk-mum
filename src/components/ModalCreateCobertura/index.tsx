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
  coverageDate: Yup.date().required('Data estimada de cobertura é obrigatória'),
  birthEstimate: Yup.date().required('Data estimada de nascimento é obrigatória'),
})

const ModalCreateCobertura = ({ isOpen, setIsOpen, creatingCoverage }) => {
  async function onSubmit (values) {
    const data = {
      vacaId: creatingCoverage.id,
      bull: values.coverage === 'bull' ? true :  false,
      semen: values.coverage === 'semen' ? true :  false,
      coverageDate: moment(values.coverageDate).format(),
      birthEstimate: moment(values.birthEstimate).format()
    }

    const response = await api.post(`coberturas`, data)

    if (response.status === 200) {
      toast.success('Cadastrado com sucesso')
      router.push(`/visualizar-animal/${creatingCoverage.id}`)
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
          <h2>Registrar Cobertura</h2>
          <button type="button" title="Fechar">
            <FiX onClick={handleCancel}/>
          </button>
        </header>

        <Formik 
          initialValues={{
            coverage: '',
            coverageDate: moment().format('YYYY-MM-DD'),
            birthEstimate: '',
          }}
          validationSchema={CoverageSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{creatingCoverage.name}</span>
              </div>
              
              <div id="coverage-radio-group" className={styles.radioHeader}>Cobertura</div>
              <div role="group" aria-labelledby="coverage-radio-group" className={styles.radioGroup} >
                <label>
                  <Field type="radio" name="coverage" value="bull" />
                  Touro
                </label>
                <label>
                  <Field type="radio" name="coverage" value="semen" required/>
                  Inseminação
                </label>
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
                <button type="submit" className={styles.confirm}>Cadastrar</button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  )
}

export default ModalCreateCobertura