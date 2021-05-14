import moment from 'moment'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { api } from '../../services/api'
import styles from './styles.module.scss'

interface Weight {
  id: number;
  weight: number;
}

interface CowProps {
  id: number;
  name: string;
  weight: number;
  born: string;
  childBirth: string;
  age: number;
  pesos: Array<Weight>;
  lactation: number;
  stopLactation: number;
  dry: number;
}

type CowPropsId = Pick<CowProps, "id">

export default function AnimalList() {
  const [cows, setCows] = useState<CowProps[]>([])

  useEffect(() => {
    async function getCows() {
      const response = await api.get('vacas')

      const data = response.data.map((item: CowProps) => {
        const lactationPeriod = 305 //dias
        const lactationPeriodMoreOneDay = lactationPeriod + 1  //dias

        return {
          ...item,
          weight: item.pesos.sort((a, b) => (a.id > b.id) ? -1 : 1)[0]?.weight,
          age: moment(Date.now()).diff(item.born, 'months'),
          // lactation: moment(Date.now()).diff(item.childBirth, 'days'),
          // stopLactation: lactationPeriod -  moment(Date.now()).diff(item.childBirth, 'days'),
          // dry: moment(moment(item.childBirth).add(lactationPeriodMoreOneDay, 'days')).format('DD/MM/YYYY'),
        }
      })
      setCows(data)
    }
    getCows()
  }, [])

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Peso</th>
            <th>Lactação restante</th>
            <th>Secar</th>
          </tr>
        </thead>
        <tbody>
          {cows.map(cow => (
            <Link 
             key={cow.id} 
              href={`visualizar-animal/${cow.id}`}
            >
            <tr 
              key={cow.id} 
              // onClick={() => handleViewCow(cow)}
              title="Visualizar animal"
            >
              <td>{cow.name}</td>
              {
                cow.weight 
                ? <td>{cow.weight}kg</td>
                : <td></td>
              }
              <td className={cow.stopLactation < 10 ? styles.alert : ''}>
              { cow.stopLactation >= 0 
                ? `${cow.stopLactation} dias` 
                : ''
              } 
              </td>
              <td>
                {
                  cow.stopLactation <= 10 && cow.stopLactation >= -1
                  ? cow.dry
                  : ''
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