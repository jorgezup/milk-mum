import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaEdit, FaGenderless, FaWeight } from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';
import { TiWarning } from "react-icons/ti";
import { BackButton } from "../../components/BackButton";
import TableCalf from "../../components/TableCalf";
import TableCoverage from "../../components/TableCoverage";
import TableOrdenha from "../../components/TableOrdenha";
import TableWeight from "../../components/TableWeight";
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

const fetcher = (url: string) => api.get(url).then(res => res.data)

export default function AnimalDetails({cow}) {
  // const { data, error, isValidating } = useSWR(`/vacas/${props.cow.id}`, fetcher, { initialData: props.cow })
  
  // const cow = data

  const router = useRouter()

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

  if (!cow) {
    return (
      <div style={{ flex: 1 }}>
        <p>Carregando...</p>
      </div>
    )
  }

  if (router.isFallback) {
    return (
      <div style={{ flex: 1 }}>
        <p>Carregando...</p>
      </div>
    )
  }

  const lactationPeriod = 305 //dias
  const lactationPeriodMoreOneDay = lactationPeriod + 1  //dias

  const [isOpenTableOrdenha, setIsOpenTableOrdenha] = useState(false)
  const [isOpenTableWeight, setIsOpenTableWeight] = useState(false)
  const [isOpenTableCoverage, setIsOpenTableCoverage] = useState(false)
  const [isOpenTableCalf, setIsOpenTableCalf] = useState(false)

  const milkingRef = React.useRef(null)
  const weightRef = React.useRef(null)
  const coverageRef = React.useRef(null)
  const calfRef = React.useRef(null)

  const handleOpenTableOrdenha = () => {
    if (!isOpenTableOrdenha) {
      scrollToTarget(milkingRef)
    }
    setIsOpenTableOrdenha(!isOpenTableOrdenha)
  }

  const handleOpenTableWeight = () => {
    if (!isOpenTableWeight) {
      scrollToTarget(weightRef)
    }
    setIsOpenTableWeight(!isOpenTableWeight)

  }

  const handleOpenTableCoverage = () => {
    if (!isOpenTableCoverage) {
      scrollToTarget(coverageRef)
    }
    setIsOpenTableCoverage(!isOpenTableCoverage)
  }

  const handleOpenTableCalf = () => {
    if (!isOpenTableCalf) {
      scrollToTarget(calfRef)
    }
    setIsOpenTableCalf(!isOpenTableCalf)
  }

  const scrollToTarget = (sectionRef) => {
    setTimeout(() => {
      sectionRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }, 200);
  }

  return (
    <>
      <Head> 
        <title>{cow.name} | MilkMum</title>
      </Head>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.title}>
            <h2>{cow?.name}</h2>
            <Link href={`/editar-animal/${cow.id}`}>
              <a title="Editar animal">
                <FaEdit />
              </a>
            </Link>
          </div>
          <BackButton />
        </header>

        <div className={styles.content}>
          <div className={styles.left}>

            <div className={styles.animalData}>
              <label htmlFor="">Nome</label>
              <div className={styles.disabled}>
                <span>{cow?.name}</span>
              </div>

              <label htmlFor="">Peso</label>
              <div className={styles.disabled}>
                <span>{cow.weights?.[0]?.weight} kg</span>
              </div>

              <label htmlFor="">Idade</label>
              <div className={styles.disabled}>
                <span>{cow?.age} meses</span>
              </div>
            </div>

            <div className={styles.animalInformations}>
              {
                //Em gestação
                ((cow.coverages?.[0]?.cria === null) &&
                  new Date().getTime() < new Date(cow.coverages?.[0]?.birthEstimate).getTime()) &&
                <>
                  <h1>{(cow.coverages[0].cria === null)}</h1>
                  <h1>{Date.now().toString() < new Date(cow.coverages?.[0]?.birthEstimate).toString()}</h1>
                  <h1>{((cow.coverages[0].cria === null) &&
                    Date.now().toString() < new Date(cow.coverages?.[0]?.birthEstimate).toString())}</h1>
                  <div className={styles.gestation}>
                    <span>Gestação</span>
                  </div>
                  <label htmlFor="">Nascimento Previsto</label>
                  <div className={styles.disabled}>
                    <span>{moment(cow.coverages?.[0]?.birthEstimate).format('DD/MM/YYYY')}</span>
                  </div>
                </>
              }
              {
                //Cadastrar cria, data maior que a data prevista de nascimento
                ((cow.coverages?.[0]?.cria === null) &&
                  new Date().getTime() > new Date(cow.coverages?.[0]?.birthEstimate).getTime()) &&
                <>
                  <div className={styles.warnings}>
                    <TiWarning />
                    <span>Avisos</span>
                  </div>
                  <div className={styles.warningsMessage}>
                    <span>Cadastrar Cria</span>
                  </div>
                  <label htmlFor="">Nascimento Previsto</label>
                  <div className={styles.disabled}>
                    <span>{moment(cow.coverages?.[0]?.birthEstimate).format('DD/MM/YYYY')}</span>
                  </div>
                </>
              }
              {
                //Aviso de secar a vaca, a partir de 25 dias para secar
                cow.coverages[0]?.cria !== undefined && cow.coverages[0].cria !== null &&
                Math.abs(lactationPeriod - moment(Date.now()).diff(cow.coverages?.[0]?.cria.birthDate, 'days')) <= 25 &&
                <>
                  <div className={styles.warnings}>
                    <TiWarning />
                    <span>Avisos</span>
                  </div>
                  <div className={styles.warningsMessage}>
                    <p>Secar a Vaca</p>
                    <p>{moment(moment(cow.coverages?.[0]?.cria.birthDate).add(lactationPeriodMoreOneDay, 'days')).format('DD/MM/YYYY')}</p>
                  </div>
                </>
              }

              {
                //Vaca Parida
                cow.coverages[0]?.cria !== undefined && cow.coverages[0].cria !== null &&
                Math.abs(lactationPeriod - moment(Date.now()).diff(cow.coverages?.[0]?.cria.birthDate, 'days')) > 25 &&
                <>
                  <div className={styles.gestation}>
                    <span>Parida</span>
                  </div>
                  <label htmlFor="">Pariu</label>
                  <div className={styles.disabled}>
                    <span>{moment(cow.coverages?.[0]?.cria.birthDate).format('DD/MM/YYYY')}</span>
                  </div>
                </>
              }

              {
                cow.coverages[0]?.cria !== undefined && cow.coverages[0].cria !== null &&
                <>
                  <label htmlFor="">Lactação</label>
                  <div className={styles.disabled}>
                    <span>{lactationPeriod - moment(Date.now()).diff(cow.coverages?.[0]?.cria.birthDate, 'days')} dias restantes</span>
                  </div>
                </>
              }


            </div>

          </div>

          {
            cow.image &&
            <div className={styles.right}>
              <Image
                src={`${cow.image}`}
                alt={cow.name}
                layout="fill"
                objectFit="cover"
                priority={true}
              />
            </div>
          }
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.milking}
            onClick={handleOpenTableOrdenha}
            title="Mostrar ordenhas"
          >
            <GiMilkCarton />
            <span>|</span>
            Ordenha
        </button>

          <button
            type="button"
            className={styles.weight}
            onClick={handleOpenTableWeight}
            title="Mostrar pesos"
          >
            <FaWeight />
            <span>|</span>
            Peso
        </button>

          <button
            type="button"
            className={styles.coverage}
            onClick={handleOpenTableCoverage}
            title="Mostrar coberturas"
          >
            <FaGenderless />
            <span>|</span>
            Coberturas
        </button>

          {
            ((cow.coverages.length > 1) || (cow.coverages?.[0]?.cria !== undefined)) &&
            <button
              type="button"
              className={styles.born}
              onClick={handleOpenTableCalf}
              title="Mostrar crias"
            >
              <GiCow />
              <span>|</span>
              Bezerros
          </button>
          }


        </div>

        {
          <div className={
            isOpenTableOrdenha ||
              isOpenTableWeight ||
              isOpenTableCoverage ||
              isOpenTableCalf ?
              `${styles.visible} ${styles.tableContainer}` :
              `${styles.hidden}  ${styles.tableContainer}`}
          >
            {
              isOpenTableOrdenha &&
              <div ref={milkingRef}>
                <TableOrdenha cow={cow} />
              </div>
            }
            {
              isOpenTableWeight &&
              <div ref={weightRef}>
                <TableWeight cow={cow} />
              </div>
            }
            {
              isOpenTableCoverage &&
              <div ref={coverageRef}>
                <TableCoverage cow={cow} />
              </div>
            }
            {
              isOpenTableCalf &&
              <div ref={calfRef}>
                <TableCalf cow={cow} />
              </div>
            }
          </div>
        }
      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ params }) => {
//   const { id } = params

//   const data = await fetcher(`/vacas/${id}`)

//   async function getCoverages(coverages: CowCoveragesProps[]) {
//     const arrayOfPromisses = coverages.map(async (cowCoverage: CowCoveragesProps) => {
//       const response = await api.get(`coberturas/${cowCoverage.id}`)
//       return response.data
//     })
//     return await Promise.all(arrayOfPromisses)
//   }

//   const cow = {
//     id,
//     name: data.name,
//     born: moment(data.born).format('DD/MM/YYYY'),
//     age: moment(Date.now()).diff(data.born, 'months'),
//     image: data?.image?.url === undefined ? '' : data.image.url,
//     weights: data?.weights?.sort((a: CowWeightProps, b: CowWeightProps) => (a.id > b.id) ? -1 : 1),
//     coverages: await getCoverages(data.coverages.sort((a: CowCoveragesProps, b: CowCoveragesProps) => (a.id > b.id) ? -1 : 1)),
//     milkings: data.milkings.map((milking: MilkingProps) => {
//       return {
//         ...milking,
//         total: (milking.firstMilking + milking.secondMilking),
//       }
//     })
//   }

//   return {
//     props: {
//       cow,
//     },
//   }
// }

export const getStaticPaths: GetStaticPaths = async () => {
  const cows = await fetcher(`/vacas`)

  const paths = cows.map((cow: ICow) => ({
    params: { id: cow.id.toString() }
  }))

  return { 
    paths, 
    fallback: 'blocking' 
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params
  
  // const data = await fetcher(`/vacas/${id}`)
  const {data} = await api.get(`/vacas/${id}`)

  async function getCoverages(coverages: CowCoveragesProps[]) {
    const arrayOfPromisses = coverages.map(async (cowCoverage: CowCoveragesProps) => {
      const response = await api.get(`coberturas/${cowCoverage.id}`)
      return response.data
    })
    return await Promise.all(arrayOfPromisses)
  }

  const cow: ICow = {
    id: Number(id),
    name: data.name,
    born: moment(data.born).format('DD/MM/YYYY'),
    age: moment(Date.now()).diff(data.born, 'months'),
    image: data?.image?.url === undefined ? '' : data.image.url,
    weights: data?.weights?.sort((a: CowWeightProps, b: CowWeightProps) => (a.id > b.id) ? -1 : 1),
    coverages: await getCoverages(data.coverages.sort((a: CowCoveragesProps, b: CowCoveragesProps) => (a.id > b.id) ? -1 : 1)),
    milkings: data.milkings.map((milking: MilkingProps) => {
      return {
        ...milking,
        total: (milking.firstMilking + milking.secondMilking),
      }
    })
  }

  return {
    props: {
      cow
    }
  }
}