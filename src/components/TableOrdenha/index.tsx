import moment from "moment"
import React, { useState } from "react"
import { FaEdit } from "react-icons/fa"
import ModalCreateOrdenha from "../ModalCreateOrdenha"
import ModalEditOrdenha from "../ModalEditOrdenha"
import styles from './styles.module.scss'


type MilkingProps = {
  id: number,
  firstMilking: number,
  secondMilking: number,
  total: number,
  date: Date,
  formattedDate: string
}

interface CowProps {
  cow: {
    id: number;
    name: string;
    milkings: MilkingProps[];
  }
}



const TableOrdenha = ({ cow }: CowProps) => {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const [editingMilking, setEditingMilking] = useState({})
  const [creatingMilking, setCreatingMilking] = useState({})

  const toggleCreateModal = () => {
    setCreateModalOpen(!createModalOpen)
  }

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen)
  }


  const handleCreateMilking = () => {
    setCreateModalOpen(true)
    setCreatingMilking(cow)
  }

  const handleEditMilking = (milking: MilkingProps) => {
    setEditModalOpen(true)
    setEditingMilking({
      ...milking,
      cow: cow.name
    })
  }

  return (
    <div className={styles.wrapper} >
      <div className={styles.buttonAddContent}>
        <button
          type="button"
          title="Cadastrar Ordenha"
          onClick={handleCreateMilking}
        >
          <div className={styles.add}>
            <span>+</span>
            <span>Ordenha</span>
          </div>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>1a Ordenha</th>
            <th>2a Ordenha</th>
            <th>Total Ordenha</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {/* Pega o array de ordenha, ordena pela data, coloca a data mais recente primeiro */}
          {(cow.milkings.sort((a: MilkingProps, b: MilkingProps) => (new Date(a.date).getTime() > new Date(b.date).getTime()) ? -1 : 1)).map((milking: MilkingProps) => {
            return (
              <tr key={milking.id}>
                <td>{(milking.firstMilking.toLocaleString('pt-BR'))} kg</td>
                <td>{(milking.secondMilking).toLocaleString('pt-BR')} kg</td>
                <td>{(milking.total).toLocaleString('pt-BR')} kg</td>
                <td>{moment(milking.date).format('DD/MM/YYYY')}</td>
                <td
                  onClick={() => handleEditMilking(milking)} 
                  title="Editar ordenha">
                  <FaEdit />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ModalCreateOrdenha
        isOpen={createModalOpen}
        setIsOpen={toggleCreateModal}
        creatingMilking={creatingMilking}
      />
      
      <ModalEditOrdenha 
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        milkingEdit={editingMilking}
      />

    </div>
  )
}


export default TableOrdenha