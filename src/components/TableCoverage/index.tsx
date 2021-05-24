import moment from "moment"
import React, { useState } from "react"
import { FaEdit } from "react-icons/fa"
import { toast } from "react-toastify"
import ModalCreateCobertura from "../ModalCreateCobertura"
import ModalCreateCria from "../ModalCreateCria"
import ModalEditCobertura from "../ModalEditCobertura"
import styles from './styles.module.scss'

type CowCoveragesProps = {
  id: number;
  coverageDate: Date;
  birthEstimate: Date;
  semen: boolean;
  bull: boolean;
  cria: {
    name: string;
  }
}

interface CowProps {
  cow: {
    id: number;
    name: string;
    coverages: CowCoveragesProps[];
  }
}

const TableCoverage = ({ cow }: CowProps) => {
  const [coverageModalOpen, setCoverageModalOpen] = useState(false)
  const [creatingCoverage, setCreatingCoverage] = useState({})

  const [coverageModalEditOpen, setCoverageModalEditOpen] = useState(false)
  const [coverageEdit, setCoverageEdit] = useState({})

  const [calfModalOpen, setCalfModalOpen] = useState(false)
  const [creatingCalf, setCreatingCalf] = useState({})



  const toggleCoverageModalEdit = () => {
    setCoverageModalEditOpen(!coverageModalEditOpen)
  }

  const toggleCoverageModal = () => {
    setCoverageModalOpen(!coverageModalOpen)
  }

  const handleCreateCoverage = () => {
    if (cow.coverages[0]?.cria !== undefined && cow.coverages[0].cria === null) {
      toast.error('Não é possível cadastrar uma nova cobertura, pois há uma cobertura em aberto, cadastre o bezerro da cria anterior.')
      return
    }
    setCoverageModalOpen(true)
    setCreatingCoverage(cow)
  }

  const handleEditCoverage = (cowCoverage: CowCoveragesProps) => {
    setCoverageModalEditOpen(true)
    setCoverageEdit({
      ...cowCoverage,
      cow: cow.name
    })
  }

  const toggleCalfModal = () => {
    setCalfModalOpen(!calfModalOpen)
  }

  const handleCreateCalf = () => {
    // Verfica se há coberturas cadastradas no array de coberturas
    // Verfica se a cobertura[0] possui uma cria cadastrada
    if (!cow.coverages?.[0]?.id || cow.coverages?.[0]?.cria !== null) {
      toast.error('É necessário ter um cobertura para cadastrar uma cria.')
      return
    }
    setCalfModalOpen(true)
    setCreatingCalf(cow)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.buttonAddContent}>
        <button
          type="button"
          title="Cadastrar cobertura"
          onClick={handleCreateCoverage}
        >
          <div className={styles.add}>
            <span>+</span>
            <span>Cobertura</span>
          </div>
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Data da Cobertura</th>
            <th>Nascimento Previsto</th>
            <th>Bezerro</th>
          </tr>
        </thead>
        <tbody>
          {cow.coverages.map((cowCoverage: CowCoveragesProps) => {
            return (
              <tr key={cowCoverage.id}>
                {
                  cowCoverage.semen ? <td>Inseminação</td> : <td>Touro</td>
                }
                <td>{moment(cowCoverage.coverageDate).format('DD/MM/YYYY')}</td>
                <td>{moment(cowCoverage.birthEstimate).format('DD/MM/YYYY')}</td>
                {
                  cowCoverage.cria ?
                    <td>{cowCoverage.cria.name}</td> :
                    <td>
                      <button
                        type="button"
                        onClick={handleCreateCalf}
                        title="Registrar cria"
                        className={styles.addCalf}
                      >
                        <span>
                          Cadastrar Cria
                    </span>
                      </button>
                    </td>
                }
                <td
                  onClick={() => handleEditCoverage(cowCoverage)}
                  title="Editar Cobertura"
                >
                  <FaEdit />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <ModalCreateCobertura
        isOpen={coverageModalOpen}
        setIsOpen={toggleCoverageModal}
        creatingCoverage={creatingCoverage}
      />

      <ModalEditCobertura
        isOpen={coverageModalEditOpen}
        setIsOpen={toggleCoverageModalEdit}
        coverageEdit={coverageEdit}
      />

      <ModalCreateCria
        isOpen={calfModalOpen}
        setIsOpen={toggleCalfModal}
        creatingCalf={creatingCalf}
      />

    </div>
  )
}


export default TableCoverage