import moment from "moment";
import { GetServerSideProps } from "next";
import Image from 'next/image';
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaGenderless, FaRegEdit, FaWeight } from 'react-icons/fa';
import { GiCow, GiMilkCarton } from 'react-icons/gi';
import { toast } from "react-toastify";
import { BackButton } from "../../components/BackButton";
import ModalCreateCobertura from "../../components/ModalCreateCobertura";
import ModalCreateCria from "../../components/ModalCreateCria";
import ModalCreateOrdenha from "../../components/ModalCreateOrdenha";
import ModalCreatePeso from "../../components/ModalCreatePeso";
import ModalEditOrdenha from "../../components/ModalEditOrdenha";
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

type CoberturaProps = {
  id: number;
  cria: string;
}

interface CowProps {
  cow: {
    id: number;
    name: string;
    weight: number;
    born: string;
    image: string;
    age: number;
    milkings: MilkingProps[];
    coberturas: CoberturaProps[];
  }
}

interface CalfProps {
  id: number;
  name: string;
  birthDate: Date;
  cobertura: number;
  numberOfLactationDays: number;
  numberOfDaysToStopLactation: number;
  dayToStopLactation: number;
}

export default function AnimalRegister({ cow }: CowProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [weightModalOpen, setWeightModalOpen] = useState(false)
  const [coverageModalOpen, setCoverageModalOpen] = useState(false)
  const [calfModalOpen, setCalfModalOpen] = useState(false)

  const [calf, setCalf] = useState<CalfProps>()
  // const [lactation, setLactation] = useState<LactationProps>({} as any)

  const [editingMilking, setEditingMilking] = useState({})
  const [creatingMilking, setCreatingMilking] = useState({})
  const [creatingWeight, setCreatingWeight] = useState({})
  const [creatingCoverage, setCreatingCoverage] = useState({})
  const [creatingCalf, setCreatingCalf] = useState({})


  useEffect(() => {
    async function getCalf() {
      if (cow.coberturas?.[0]?.cria !== undefined) {
        const response = await api.get(`coberturas/${cow.coberturas[0].id}`)

        const lactationPeriod = 305 //dias
        const lactationPeriodMoreOneDay = lactationPeriod + 1  //dias
        
        //dayToStop => dia do nascimento mais 306 dias => convertido para timestamp
        const dayToStopLactation = moment(response.data.cria.birthDate).add(lactationPeriodMoreOneDay, 'days').valueOf()
        
        //verifica se a data atual é menor que a data de parada de retirada de leite
        if (moment().valueOf() < dayToStopLactation) {
          const calfData = {
            ...response.data.cria,
            numberOfLactationDays: moment(Date.now()).diff(response.data.cria.birthDate, 'days'),
            numberOfDaysToStopLactation: lactationPeriod -  moment(Date.now()).diff(response.data.cria.birthDate, 'days'),
            dayToStopLactation: moment(moment(response.data.cria.birthDate).add(lactationPeriodMoreOneDay, 'days')).format('DD/MM/YYYY'),
          }
          setCalf(calfData)
        }
        else {
          setCalf(response.data.cria)
        }
      }
    }
    
    getCalf()
  }, [])

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }

  const toggleWeightModal = () => {
    setWeightModalOpen(!weightModalOpen)
  }

  const toggleCoverageModal = () => {
    setCoverageModalOpen(!coverageModalOpen)
  }

  const toggleCalfModal = () => {
    setCalfModalOpen(!calfModalOpen)
  }

  const handleEditMilking = (milking: MilkingProps) => {
    setEditModalOpen(true)
    console.log(milking.firstMilking.toLocaleString('pt-BR'))
    setEditingMilking({
      ...milking,
      cow: cow.name
    })
  }

  const handleCreateMilking = () => {
    setModalOpen(true)
    setCreatingMilking(cow)
  }

  const handleCreateWeight = () => {
    setWeightModalOpen(true)
    setCreatingWeight(cow)
  }

  const handleCreateCoverage = () => {
    setCoverageModalOpen(true)
    setCreatingCoverage(cow)
  }

  const handleCreateCalf = () => {
    // Verfica se há coberturas cadastradas no array de coberturas
    // Verfica se a cobertura[0] possui uma cria cadastrada
    if (!cow.coberturas?.[0]?.id || cow.coberturas?.[0]?.cria !== null) {
      console.log(cow.coberturas[0])
      toast.error('É necessário ter um cobertura para cadastrar uma cria.')
      return
    }
    setCalfModalOpen(true)
    setCreatingCalf(cow)
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>{cow.name}</h2>
        {/* <h2>Visualizar Animal</h2> */}
        <BackButton />
      </header>

      <div className={styles.content}>
        <div className={styles.left}>
          <label htmlFor="">Nome</label>
          <div className={styles.disabled}>
            <span>{cow.name}</span>
          </div>

          <label htmlFor="">Peso</label>
          <div className={styles.disabled}>
            <span>{cow.weight}</span>
          </div>

          <label htmlFor="">Idade</label>
          <div className={styles.disabled}>
            <span>{cow.age} meses</span>
          </div>

          {
            calf &&
            <>
              <label htmlFor="">Pariu</label>
              <div className={styles.disabled}>
                <span>{moment(calf.birthDate).format('DD/MM/YYYY')}</span>
              </div>
            </>
          }

          {
            calf?.numberOfDaysToStopLactation > 0 &&
            <>
              <label htmlFor="">Lactação</label>
              <div className={styles.disabled}>
                <span>{calf.numberOfDaysToStopLactation} dias restantes</span>
              </div>
            </>
          }

          {
            Math.abs(calf?.numberOfDaysToStopLactation) <= 25 &&
            <>
              <label htmlFor="">Secar</label>
              <div className={styles.disabled}>
                <span>{calf.dayToStopLactation}</span>
              </div>
            </>
          }

        </div>

        <div className={styles.right}>
          {
            cow.image &&
            <Image 
              src={`http://localhost:1337${cow.image}`} 
              alt={cow.name}
              layout="responsive"
              width={220}
              height={140}
              priority={true} 
            />
          }      
        </div>
      </div>
        <div className={styles.buttons}>
          <Link href={`/editar-animal/${cow.id}`}>
            <a 
              className={styles.edit}
              title="Editar animal"
              >
              <FaRegEdit />
              <span>|</span>
              Editar
            </a>
          </Link>
          <button 
            type="button"
            className={styles.milking}
            onClick={handleCreateMilking}
            title="Registrar ordenha"
          >
            <GiMilkCarton />
            <span>|</span>
            Ordenha
          </button>
          <button 
            type="button"
            className={styles.weight}
            onClick={handleCreateWeight}
            title="Registrar peso"
          >
            <FaWeight />
            <span>|</span>
            Peso
          </button>

          <button 
            type="button"
            className={styles.coverage}
            onClick={handleCreateCoverage}
            title="Registrar cobertura"
          >
            <FaGenderless />
            <span>|</span>
            Cobertura
          </button>


          {
            cow.coberturas?.[0]?.cria === null &&
            <button 
              type="button"
              className={styles.born}
              onClick={handleCreateCalf}
              title="Registrar cria"
            >
              <GiCow />
              <span>|</span>
              Cria
            </button>
          }

          {/* <button 
            type="button"
            className={styles.delete}
            onClick={handleDelete}
            title="Deletar animal"
          >
            <FaTrash />
            <span>|</span>
            Deletar
          </button> */}
      </div>

      
      <ModalEditOrdenha 
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        milkingEdit={editingMilking}
      />

      <ModalCreateOrdenha
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        creatingMilking={creatingMilking}
      />

      <ModalCreatePeso
        isOpen={weightModalOpen}
        setIsOpen={toggleWeightModal}
        creatingWeight={creatingWeight}
      />

      <ModalCreateCobertura
        isOpen={coverageModalOpen}
        setIsOpen={toggleCoverageModal}
        creatingCoverage={creatingCoverage}
      />

      <ModalCreateCria
        isOpen={calfModalOpen}
        setIsOpen={toggleCalfModal}
        creatingCalf={creatingCalf}
      />
            
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>1a Ordenha</th>
              <th>2a Ordenha</th>
              <th>Total</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {cow.milkings.map((milking: MilkingProps) => {
              return (
              <tr 
                key={milking.id} 
                onClick={() => handleEditMilking(milking)} 
                title="Editar ordenha"
              >
                <td>{(milking.firstMilking.toLocaleString('pt-BR'))} kg</td>
                <td>{(milking.secondMilking).toLocaleString('pt-BR')} kg</td>
                <td>{(milking.total).toLocaleString('pt-BR')} kg</td>
                <td>{milking.date}</td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { id } = params

  const response = await api.get(`vacas/${id}`)

  const cow = {
    id,
    name: response.data.name,
    born: moment(response.data.born).format('DD/MM/YYYY'),
    age: moment(Date.now()).diff(response.data.born, 'months'),
    image: response.data.image ? response.data.image?.url : '',
    weight: response.data.pesos.sort((a, b) => (a.id > b.id) ? -1 : 1)[0]?.weight,
    coberturas: response.data.coberturas.sort((a, b) => (a.id > b.id) ? -1 : 1),
    milkings: response.data.ordenhas.map((milking: MilkingProps) => {
      return {
        ...milking,
        firstMilking: milking.firstMilking,
        secondMilking: milking.secondMilking,
        total: (milking.firstMilking + milking.secondMilking),
        formattedDate: moment(milking.date).format('YYYY-MM-DD'),
        date: new Intl.DateTimeFormat('pt-BR').format(new Date(milking.date)),
      }
    })
  }

  // const list = [
  //   { id: 1, qty: 10, size: 'XXL' },
  //   { id: 2, qty: 2, size: 'XL' },
  //   { id: 3, qty: 8, size: 'M' }
  // ]
  
  // list.sort((a, b) => (a.id > b.id) ? -1 : 1)
  
  // console.log(list)

  // console.log(response.data.pesos.sort((a, b) => (a.id > b.id) ? -1 : 1)[0].weight)

  return {
    props: {
      cow,
    },
  }
}