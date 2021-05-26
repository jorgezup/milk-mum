import axios from 'axios';
import { Field, Form, Formik } from 'formik';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import router from 'next/router';
import React, { useState } from "react";
import { toast } from 'react-toastify';
import useSWR, { mutate } from 'swr';
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
  date: Date,
  formattedDate: string
}

type CowCoveragesProps = {
  id: number;
  coverageDate: Date;
  birthEstimate: Date;
  semen: boolean;
  bull: boolean;
  cria: {
    name: string;
    birthDate: Date;
  }
}

type CowWeightProps = {
  id: number;
  weight: number;
  date: Date;
}

type ICow = {
  id: number;
  name: string;
  born: string;
  image: string;
  age: number;
  milkings: MilkingProps[];
  coverages: CowCoveragesProps[];
  weights: CowWeightProps[];
}

interface CowProps {
  cow: ICow;
}

const AnimalSchema = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  weight: Yup.number().required('Peso é obrigatório'),
  born: Yup.date().required('Data de nascimento é obrigatória'),
})

const fetcher = (url: string) => api.get(url).then(res => res.data)

export default function AnimalEdit(props) {
  const { data: cow, error, isValidating } = useSWR(`/vacas/${props.cow.id}`, fetcher, { initialData: props.cows })

  const [selectedFile, setSelectedFile] = useState(null)

  if (isValidating) {
    return (
      <div style={{ flex: 1 }}>
        <p>Validating</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ flex: 1 }}>
        <p>Erro ao carregar os dados</p>
      </div>
    )
  }

  if (!cow) {
    return (
      <div style={{ flex: 1 }}>
        <p>Carregando...</p>
      </div>
    )
  }


  const imageUploaded = async function (file) {
    if (!file) {
      return
    }

    const uploadData = new FormData()
    uploadData.append('files', file)


    const uploadRes = await axios({
      method: 'POST',
      url: `${process.env.NEXT_PUBLIC_API_URL}/upload`,
      data: uploadData
    })


    return uploadRes.data[0]
  }

  async function onSubmit(values, actions) {
    try {
      const data = {
        name: values.name,
        born: moment(values.born).format('YYYY-MM-DD'),
        // image: await imageUploaded(selectedFile)
      }

      mutate(`vacas/${cow.id}`, data, false)

      const response = await api.put(`vacas/${cow.id}`, data)

      if (response.status === 200) {
        const dataWeight = {
          vacaId: response.data.id,
          weight: values.weight,
          date: moment(Date.now()).format('YYYY-MM-DD')
        }

        mutate(`pesos/${cow.weight.id}`, dataWeight, false)

        await api.put(`pesos/${cow.weight.id}`, dataWeight)

        mutate(`vacas/${cow.id}`)

        toast.success('Editado com sucesso')
        router.push('/listar-animais')

        if (selectedFile) {
          const imageResponse = await api.put(`/vacas/${cow.id}`, {
            image: await imageUploaded(selectedFile)
          })
          if ((!imageResponse) || (imageResponse.status !== 200)) {
            toast.error(`Erro ao adicionar imagem da Vaca ${response.data.name}.
            \nContate o administrador`)
          }
        }
      }
      else {
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro inesperado.')
      router.push(`/`)
    }
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

  return (
    <>
      <Head>
        <title>{cow.name} | MilkMum</title>
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <h2>Editar Animal</h2>
          <BackButton />
        </header>

        <Formik
          initialValues={{
            name: cow.name,
            weight: cow.weight.weight,
            born: moment(cow.born).format('YYYY-MM-DD'),
            image: cow.image
          }}
          validationSchema={AnimalSchema}
          onSubmit={onSubmit}
        >
          {({ errors, touched }) => (
            <Form className={styles.form}>
              <label htmlFor="">Nome</label>
              <Field name="name" type="text" />
              {errors.name && touched.name ? (
                <div className={styles.message}>
                  {errors.name}
                </div>
              ) : null}

              <label htmlFor="">Peso</label>
              <Field name="weight" type="number" />
              {errors.weight && touched.weight ? (
                <div className={styles.message}>
                  {errors.weight}
                </div>
              ) : null}

              <label htmlFor="">Nascimento</label>
              <Field name="born" type="date" />
              {errors.born && touched.born ? (
                <div className={styles.message}>
                  {errors.born}
                </div>
              ) : null}

              <label htmlFor="">Foto</label>

              {
                cow.image && cow.image !== null &&
                <Image
                  src={`${cow.image}`}
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
                onFileSelectError={({ error }) => alert(error)}
              />

              <div className={styles.buttons}>
                <button type="button" className={styles.delete} onClick={handleDelete}>Deletar</button>
                <button type="submit" className={styles.confirm}>Editar</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params

  const data = await fetcher(`/vacas/${id}`)

  const cow = {
    id,
    name: data.name,
    born: moment(data.born).format('YYYY-MM-DD'),
    image: data?.image?.url === undefined ? '' : data.image.url,
    weight: data.weights.sort((a, b) => (a.id > b.id) ? -1 : 1)?.[0],
  }

  return {
    props: {
      cow,
    },
  }
}

// export const getStaticPaths: GetStaticPaths = async () => {
//   const cows = await fetcher(`/vacas`)

//   const paths = cows.map((cow: ICow) => ({
//     params: { id: cow.id.toString() }
//   }))

//   return {
//     paths,
//     fallback: true
//   }
// }

// export const getStaticProps: GetStaticProps = async ({ params }) => {
//   const { id } = params

//   const data = await fetcher(`/vacas/${id}`)

//   const cow = {
//     id,
//     name: data.name,
//     born: moment(data.born).format('YYYY-MM-DD'),
//     image: data?.image?.url === undefined ? '' : data.image.url,
//     weight: data.weights.sort((a, b) => (a.id > b.id) ? -1 : 1)?.[0],

//   }

//   return {
//     props: {
//       cow,
//     },
//   }
// }