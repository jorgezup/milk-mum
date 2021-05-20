import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import router from 'next/router';
import React, { useState } from "react";
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { BackButton } from '../../components/BackButton';
import { InputFile } from '../../components/InputFile';
import { api } from "../../services/api";
import styles from './styles.module.scss';

type MilkingProps = {
  id: number,
  firstMilking: number,
  secondMilking: number,
  total: number,
  date: string,
  formattedDate: string
}

interface CowProps {
  cow: {
    id: number;
    name: string;
    weightId: number;
    weight: number;
    born: string;
    childbirth: string;
    image: string;
    milkings: MilkingProps[];
  }
}

const AnimalSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  weight: Yup.number().required('Peso é obrigatório'),
  born: Yup.date().required('Data de nascimento é obrigatória'),
})


export default function AnimalEdit({ cow }: CowProps) {
  const [selectedFile, setSelectedFile] = useState(null)

  const imageUploaded = async function(file) {
    if (!file) {
      return
    }
    
    const uploadData = new FormData()
    uploadData.append('files', file)

    const uploadRes = await axios({
      method: 'POST',
      url: `${process.env.API_URL}upload`,
      data: uploadData
    })

    if (uploadRes.status !== 200) {
      toast.error('Erro ao fazer upload da Imagem')
    }
    return uploadRes.data[0]
  }

  async function handleDelete() {
    const confirmMessage = confirm(`Deseja remover ${cow.name} ?`)

    if (confirmMessage) {
      const response = await api.delete(`vacas/${cow.id}`)
    
      if (response.status !== 200) {
        toast.error('Erro ao deletar animal')
      }
  
      toast.success('Animal removido')
      router.push('/listar-animais')
    }
  }

  async function onSubmit(values, actions) {
    const data = {
      uid: values.name.toLocaleLowerCase(),
      Name: values.name,
      Born: moment(values.born).format('YYYY-MM-DD'),
      childBirth: values.childbirth ? moment(values.childbirth).format('YYYY-MM-DD') : null,
      image: await imageUploaded(selectedFile)
    }

    const response = await api.put(`vacas/${cow.id}`, data)

    if (response.status === 200) {
      const dataWeight = {
        vacaId: response.data.id,
        weight: values.weight,
      }

      await api.put(`pesos/${cow.weightId}`, dataWeight)

      toast.success('Editado com sucesso')
      router.push('/listar-animais')
    }
    else {
      toast.error('Erro ao adicionar.')
    }
  }


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Editar Animal</h2>
        <BackButton />
      </header>

      <Formik
        initialValues={{
          name: cow.name,
          weightId: cow.weightId,
          weight: cow.weight,
          born: moment(cow.born).format('YYYY-MM-DD'),
          image: cow.image
        }}
        validationSchema={AnimalSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
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

            {
              cow.image && cow.image !== null &&
              <Image 
                src={`${process.env.NEXT_PUBLIC_API_URL}${cow.image}`} 
                alt={cow.name}
                layout="intrinsic"
                objectFit="cover"
                width={300}
                height={220}
                priority={true} 
              />
            }

            <InputFile 
              onFileSelectSuccess={(file) => setSelectedFile(file)}
              onFileSelectError={({error}) => alert(error)}
            />

            <div className={styles.buttons}>
              <button type="button" className={styles.delete} onClick={handleDelete}>Deletar</button>
              <button type="submit" className={styles.confirm}>Editar</button>
            </div>            
          </Form>
        )}
      </Formik>


  
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params

  const response = await api.get(`vacas/${id}`)
  
  const cow = {
    id,
    name: response.data.name,
    weightId: response.data.weights.sort((a, b) => (a.id > b.id) ? -1 : 1)[0]?.id,
    weight: response.data.weights.sort((a, b) => (a.id > b.id) ? -1 : 1)[0]?.weight,
    born: moment(response.data.born).format('YYYY-MM-DD'),
    childbirth: moment(response.data.childBirth).format('YYYY-MM-DD'),
    // image: Object.entries(response.data.image).length !== 0 ? response.data.image?.url : '',
    image:response.data.image ? response.data.image?.url : '',
    milkings: response.data.milkings.map((milking: MilkingProps) => {
      return {
        ...milking,
        firstMilking: milking.firstMilking.toLocaleString('pt-BR'),
        secondMilking: milking.secondMilking.toLocaleString('pt-BR'),
        total: (milking.firstMilking + milking.secondMilking).toLocaleString('pt-BR'),
        formattedDate: new Intl.DateTimeFormat('pt-BR').format(new Date(milking.date))
      }
    })
  }

  return {
    props: {
      cow,
    },
  }
}