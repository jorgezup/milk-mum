import moment from "moment"
import React, { useState } from "react"
import { FaEdit } from "react-icons/fa"
import ModalEditCalf from "../ModalEditCalf"
import styles from './styles.module.scss'

type Coverage = {
  cria: CalfProps
}

type CalfProps = {
  id: number;
  name: string;
  birthDate: Date;
}

const TableCalf = ({ cow }) => {
  const [calfEditModalOpen, setCalfEditModalOpen] = useState(false)
  const [calfEdit, setCalfEdit] = useState({})


  const toggleCalfEditModal = () => {
    setCalfEditModalOpen(!calfEditModalOpen)
  }

  const handleEditCalf = (calf) => {
    setCalfEditModalOpen(true)
    setCalfEdit(calf)
  } 

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Bezerro</th>
            <th>Nascimento</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cow.coverages.map((coverage: Coverage) => {
            if (coverage.cria) {
              return (
                <tr key={coverage.cria.id}>
                  <td>{coverage.cria.name}</td>
                  <td>{moment(coverage.cria?.birthDate).format('DD/MM/YYYY')}l</td>
                  <td
                    onClick={() => handleEditCalf(coverage.cria)} 
                    title="Editar Cria"
                  >
                    <FaEdit />
                  </td>
                </tr>
              )
            }
          })}
        </tbody>
      </table>

      <ModalEditCalf
        isOpen={calfEditModalOpen}
        setIsOpen={toggleCalfEditModal}
        calfEdit={{
          ...calfEdit,
          cowId: cow.id,
          // coverageId: cow.coverage.id
        }}
      />      
  
    </div>
  )
}


export default TableCalf