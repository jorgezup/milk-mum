import axios from "axios";
import { Field, Form, Formik } from "formik";
import moment from "moment";
import router from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { BackButton } from "../../components/BackButton";
import { InputFile } from "../../components/InputFile";
import animalFormSchema from "../../schemas/animalFormSchema";
import { api } from "../../services/api";
import styles from './styles.module.scss';

export default function AnimalRegister() {
  const [selectedFile, setSelectedFile] = useState(null)

  const imageUploaded = async function(file) {
    try {
      if (!file) {
        return
      }
      
      const uploadData = new FormData()
      uploadData.append('files', file)
      
      const uploadRes = await axios({
        method: 'POST',
        url: `${process.env.NEXT_PUBLIC_API_URL}upload`,
        data: uploadData
      })

      if (uploadRes.status !== 200) {
        toast.error('Erro ao fazer upload da Imagem')
      }
      return uploadRes.data[0]
    } catch(error) {
      console.error(error)
      toast.error('Erro ao adicionar imagem.')
      router.push(`/`)
    }
  }
    
  
  async function onSubmit(values) {
    try {
      const data = {
        name: values.name,
        born: moment(values.born).format('YYYY-MM-DD'),
        image: selectedFile ? await imageUploaded(selectedFile) : ''
      }

      const response = await api.post('vacas', data)

      if (response.status === 200) {
        const dataWeight = {
          vacaId: response.data.id,
          weight: values.weight,
          date: moment(Date.now()).format('YYYY-MM-DD')
        }

        await api.post('pesos', dataWeight)

        toast.success('Cadastrado com sucesso')
        router.push('/listar-animais')
      }
      else {
        toast.error('Erro ao adicionar.')
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro inesperado.')
      router.push(`/`)
    }
  }

  const handleCancel = () => {
    router.push('/listar-animais')
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Cadastro de Animal</h2>
        <BackButton />
      </header>

      <Formik
        validationSchema={animalFormSchema} 
        onSubmit={onSubmit}
        
        initialValues ={{
          name: '',
          weight: '',
          born: '',
        }} 
      >
        {({ values, errors, touched }) => (
          <Form className={styles.form}>
            <label htmlFor="">Nome</label>
            <Field name="name" type="text"/>
            {errors.name && touched.name ? (
              <div className={styles.message}>
                {errors.name}
              </div>
            ) : null}
          
            <label htmlFor="">Peso</label>
            <Field name="weight" type="number"/>
            {errors.weight && touched.weight ? (
              <div className={styles.message}>
                {errors.weight}
              </div>
            ) : null}

            <label htmlFor="">Nascimento</label>
            <Field name="born" type="date"/>
            {errors.born && touched.born ? (
              <div className={styles.message}>
                {errors.born}
              </div>
            ) : null}

            <label htmlFor="">Foto</label>
            <InputFile 
              onFileSelectSuccess={(file) => setSelectedFile(file)}
              onFileSelectError={({error}) => alert(error)}
            />

            <div className={styles.buttons}>
              <button 
                type="button" 
                className={styles.cancel}
                onClick={handleCancel}
              >
                Cancelar
              </button>
              
              <button 
                type="submit"
                className={styles.confirm}>
                  Cadastrar
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}