import { FormikProps, useFormik } from "formik"
import React, { useState } from "react"
import { InputFile } from "../InputFile"
import styles from './styles.module.scss'

interface AnimalFormValues {
  name: string;
  weight: number;
}

interface OtherProps {
  message: string;
}

const AnimalForm = (props: OtherProps & FormikProps<AnimalFormValues>) => {

  const { touched, errors, isSubmitting, message } = props

  const [selectedFile, setSelectedFile] = useState(null)

  const formik = useFormik({
    initialValues: {
      name: '',
      weight: '',
      born: '',
      childbirth: '',
      selectedFile,
    },
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2))
    },
  })



  return (
    <form onSubmit={formik.handleSubmit}>
        <label htmlFor="">Nome</label>
        <input 
          type="text" 
          placeholder="Badocha"
          value={formik.values.name}
          onChange={formik.handleChange}
        />
        {touched.name && errors.name && <div>{errors.name}</div>}

        <label htmlFor="">Peso</label>
        <input 
          type="number" 
          placeholder="540"
          value={formik.values.weight}
          onChange={formik.handleChange}
        />

        <label htmlFor="">Nascimento</label>
        <input 
          type="date"
          value={formik.values.born}
          onChange={formik.handleChange}
        />

        <label htmlFor="">Parto</label>
        <input 
          type="date" 
          value={formik.values.childbirth}
          onChange={formik.handleChange}
        />
        
        <label htmlFor="">Foto</label>
        <InputFile 
          onFileSelectSuccess={(file) => setSelectedFile(file)}
          onFileSelectError={({error}) => alert(error)}
        />
        
        <div className={styles.buttons}>
          <button 
            type="button" 
            className={styles.cancel}>
              Cancelar
          </button>
          
          <button 
            type="submit" 
            className={styles.confirm}>
              Cadastrar
          </button>
        </div>
    </form>
  )
}

export default AnimalForm

