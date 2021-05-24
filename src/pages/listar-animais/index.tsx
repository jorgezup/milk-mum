import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { GiCow } from 'react-icons/gi'
import useSWR from 'swr'
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


export default function AnimalList(props) {
  const initialData = props.data
  const { data: cows, error } = useSWR(`/vacas`, fetcher, { initialData})


  if (!cows) {
    return (
      <div style={{flex: 1}}>
        <p>Carregando...</p>
      </div>
    )
  }

  // const [cows, setCows] = useState<ICow[]>([])

  // useEffect(() => {
  //   async function getCows() {
  //     const response = await api.get('vacas')
  //     const cowData = response.data.map((cow: ICow) => {
  //       return {
  //         ...cow,
  //         weights: cow?.weights?.sort((a:IWeight, b:IWeight) => (a.id > b.id) ? -1 : 1),
  //         milkings: cow?.milkings?.sort((a:IMilking, b:IMilking) => (a.id > b.id) ? -1 : 1),
  //       }
  //     })
  //     setCows(cowData)
  //   }
  //   getCows()
  // }, [])

  // const handleViewCow = (cow) => {
  //   // AnimalRegister(cow.id)
  //   router.push(`visualizar-animal/${cow.id}`)
  // }

  // const { isFallback } = useRouter()

  // if (isFallback) {
  //   return <p>Carregando</p>
  // }

  return (
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
  )
}

export const getStaticProps = async() => {
  const cows: ICow[] = await fetcher(`/vacas`)
  
  return {
    props: {
      cows
    }
  }
}

// export const getServerSideProps: GetServerSideProps = async() => {
//   const cows: ICow[] = await fetcher(`/vacas`)
//   // const {data: cows} = useFetch('/vacas')
//   return { 
//     props: {
//       cows
//     }
//   }
// }