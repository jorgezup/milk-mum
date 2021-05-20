import moment from "moment"
import React, { useState } from "react"
import { FaEdit } from "react-icons/fa"
import ModalCreatePeso from "../ModalCreatePeso"
import ModalEditPeso from "../ModalEditPeso"
import styles from './styles.module.scss'

type CowWeightProps = {
  id: number;
  weight: number;
  date: Date;
}

interface CowProps {
  cow: {
    id: number;
    name: string;
    weights: CowWeightProps[];
  }
}

const TableWeight = ({ cow }: CowProps) => {
  const [weightModalOpen, setWeightModalOpen] = useState(false)
  const [weightEditModalOpen, setWeightEditModalOpen] = useState(false)
  const [creatingWeight, setCreatingWeight] = useState({})
  const [weightEdit, setWeightEdit] = useState({})


  const toggleWeightModal = () => {
    setWeightModalOpen(!weightModalOpen)
  }

  const toggleWeightEditModal = () => {
    setWeightEditModalOpen(!weightEditModalOpen)
  }

  const handleCreateWeight = () => {
    setWeightModalOpen(true)
    setCreatingWeight(cow)
  }

  const handleEditWeight = (weight: CowWeightProps) => {
    setWeightEditModalOpen(true)
    setWeightEdit(weight)
  }  

  return (
    <div className={styles.wrapper}>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Peso</th>
            <th>Data</th>
            <th className={styles.buttonAddContent}>
              <button
                type="button"
                title="Cadastrar Ordenha"
                onClick={handleCreateWeight}
              >
                <div className={styles.add}>
                  <span>+</span>
                  <span>Peso</span>
                </div>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Pega o array de pesos, ordena pela data, coloca a data mais recente primeiro */}
          {(cow.weights.sort((a: CowWeightProps, b: CowWeightProps) => (new Date(a.date).getTime() > new Date(b.date).getTime()) ? -1 : 1)).map((cowWeight: CowWeightProps) => {
            return (
              <tr key={cowWeight.id}>
                <td>{(cowWeight.weight.toLocaleString('pt-BR'))} kg</td>
                <td>{moment(cowWeight?.date).format('DD/MM/YYYY')}</td>
                <td
                  onClick={() => handleEditWeight(cowWeight)} 
                  title="Editar Peso"
                >
                  <FaEdit />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
  
      <ModalCreatePeso
        isOpen={weightModalOpen}
        setIsOpen={toggleWeightModal}
        creatingWeight={creatingWeight}
      />

      <ModalEditPeso
        isOpen={weightEditModalOpen}
        setIsOpen={toggleWeightEditModal}
        weightEdit={{
          ...weightEdit,
          cow: cow.name
        }}
      />

    </div>
  )
}


export default TableWeight