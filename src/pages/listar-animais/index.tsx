import moment from 'moment'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { GiCow } from 'react-icons/gi'
import { api } from '../../services/api'
import styles from './styles.module.scss'

type IWeight = {
  id: number;
  weight: number;
  date: Date;
}

type IMilking = {
  id: number,
  firstMilking: number,
  secondMilking: number,
  total: number,
  date: Date,
  formattedDate: string
}


type ICow = {
  id: number;
  name: string;
  milkings: IMilking[];
  weights: IWeight[];
}

const fetcher = (url: string) => api.get(url).then(res => res.data)

export default function AnimalList({cows}) {
  // const { data, error, isValidating } = useSWR('/vacas', fetcher, { initialData: props.cows })

  // const cows = data

  // if (isValidating) {
  //   return (
  //     <div style={{ flex: 1 }}>
  //       <p>Validating</p>
  //     </div>
  //   )
  // }

  // if (error) {
  //   return (
  //     <div style={{ flex: 1 }}>
  //       <p>Erro ao carregar os dados</p>
  //     </div>
  //   )
  // }

  const router = useRouter()

  if (router.isFallback) {
    return (
      <div style={{ flex: 1 }}>
        <p>Carregando...</p>
      </div>
    )
  }

  if (!cows) {
    return (
      <div style={{ flex: 1 }}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Listagem dos Animais | MilkMum</title>
      </Head>
      <div className={styles.container}>
        <header>
          <Link href="/cadastrar-animal">
            <button title="Cadastrar Vaca">
              <span>Cadastrar Vaca</span>
              <span>|</span>
              <GiCow />
            </button>
          </Link>
        </header>
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Peso</th>
              <th>1a ordenha</th>
              <th>2a ordenha</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {cows.map((cow: ICow) => (
              <Link
                key={cow?.id}
                href={`visualizar-animal/${cow.id}`}
              >
                <tr
                  key={cow.id}
                  title="Visualizar animal"
                >
                  <td>{cow?.name}</td>
                  {
                    cow.weights?.[0]?.weight
                      ? <td>{cow.weights?.[0]?.weight} kg</td>
                      : <td></td>
                  }
                  {
                    cow.milkings[0]?.firstMilking
                      ? <td>{(cow.milkings?.[0]?.firstMilking).toLocaleString('pt-BR')} kg</td>
                      : <td></td>
                  }
                  {
                    cow.milkings[0]?.secondMilking
                      ? <td>{(cow.milkings?.[0]?.secondMilking).toLocaleString('pt-BR')} kg</td>
                      : <td></td>
                  }
                  <td>
                    {
                      cow.milkings?.[0]
                        ? moment(cow.milkings?.[0].date).format('DD/MM/YYYY')
                        : moment(cow.weights?.[0].date).format('DD/MM/YYYY')
                    }
                  </td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </>

  )
}

export const getStaticProps:GetStaticProps = async () => {
  // const data: ICow[] = await fetcher(`/vacas`)
  const {data} = await api.get(`/vacas`)

  const cows = data.map((cow: ICow) => {
    return {
      ...cow,
      weights: cow?.weights?.sort((a:IWeight, b:IWeight) => (a.id > b.id) ? -1 : 1),
      milkings: cow?.milkings?.sort((a:IMilking, b:IMilking) => (a.id > b.id) ? -1 : 1),
    }
  })

  return {
    props: {
      cows
    },
    revalidate: 1
  }
}

// export const getServerSideProps: GetServerSideProps = async() => {
//   const cows: ICow[] = await fetcher(`/vacas`)

//   return { 
//     props: {
//       cows
//     }
//   }
// }