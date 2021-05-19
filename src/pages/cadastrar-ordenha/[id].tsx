import { Field, Form, Formik } from "formik";
import { GetServerSideProps } from "next";
import Router from "next/router";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { BackButton } from "../../components/BackButton";
import { api } from "../../services/api";
import { formatDate } from "../../util/formatDate";
import styles from './styles.module.scss';


export default function AnimalRegister({ data }) {
  const [firstMilking, setFirstMilking] = useState('')
  const [secondMilking, setSecondMilking] = useState('')
  const [date, setDate] = useState<any>(formatDate(new Date()))

  function resetValues() {
    setFirstMilking('')
    setSecondMilking('')
    setDate(formatDate(new Date()))
  }

  function handleCancel() {
    resetValues()
  }

  async function handleCreateMilking(event: FormEvent) {
    event.preventDefault()

    const ordenha = {
      vacaId: data.id,
      firstMilking,
      secondMilking,
      date: new Date(date)
    }

    const response = await api.post('ordenhas', {
      ...ordenha
    })

    if (response.status === 200) {
      toast.success('Ordenha cadastrada')
      Router.back()
    }

    resetValues()
  }

  async function onSubmit(values, actions) {
    if (!values.firstMilking || !values.secondMilking) {
      toast.error('Inserir o valor da ordenha!')
    }
    else {
      const ordenha = {
        vacaId: data.id,
        firstMilking: values.firstMilking,
        secondMilking: values.secondMilking,
        date: values.milkingDate ? new Date(values.milkingDate).toISOString() : new Date().toISOString()
      }
  
      const response = await api.post('ordenhas', ordenha)
  
      if (response.status === 200) {
        toast.success('Ordenha cadastrada')
        Router.back()
      }
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Cadastro da Ordenha</h2>
        <BackButton />
      </header>

      <Formik 
        onSubmit={onSubmit}
        initialValues={{
          firstMilking: '',
          secondMilking: '',
          milkingDate: ''
        }}
        render={({ values, errors, touched }) => (
          <Form className={styles.form}>
            <label htmlFor="">Nome</label>
            <input 
              type="text" 
              placeholder="Nome do Animal"
              value={data.name}
              disabled
            />
            
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

            <label htmlFor="milkingDate">Data</label>
            <Field name="date" type="date"/>
            {errors.milkingDate && touched.milkingDate ? (
              <div className={styles.message}>
                {errors.milkingDate}
              </div>
            ) : null}

            <div className={styles.buttons}>
              <button type="button" onClick={handleCancel} className={styles.cancel}>Cancelar</button>
              <button type="submit" className={styles.confirm}>Cadastrar</button>
            </div>

          </Form>
        )}
      />

      {/* <form 
        className={styles.form} 
        onSubmit={handleCreateMilking}>

        <label htmlFor="">Nome</label>
        <input 
          type="text" 
          placeholder="Nome do Animal"
          value={data.name}
          disabled
        />

        <label htmlFor="">1a ordenha</label>
        <input 
          placeholder="Primeira Ordenha"
          value={firstMilking}
          onChange={event => setFirstMilking(event.target.value)}
        />

        <label htmlFor="">2a ordenha</label>
        <input 
          placeholder="Segunda Ordenha"
          value={secondMilking}
          onChange={event => setSecondMilking(event.target.value)}
        />

        <label htmlFor="">Data</label>
        <input 
          type="date"
          value={date}
          onChange={event => setDate(event.target.value)}
        />
      

        <div className={styles.buttons}>
          <button type="button" onClick={handleCancel} className={styles.cancel}>Cancelar</button>
          <button type="submit" className={styles.confirm}>Cadastrar</button>
        </div>
        
      </form> */}
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params
  
  const response = await api.get(`vacas/${id}`)
  
  const data = {
    id,
    name: response.data.name,
  }
  
  return {
    props: {
      data,
    },
  }
}