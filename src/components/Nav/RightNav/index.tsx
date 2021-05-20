import Link from "next/link"
import { useRouter } from "next/router"
import styles from './styles.module.scss'

const RightNav = ({ isOpen, setIsOpen }) => {
  const router = useRouter()
  return (
    <ul
      className={isOpen ? `${styles.ul} ${styles.active}` : `${styles.hidden} ${styles.ul}`}
      data-isopen={isOpen} 
    >
      <li onClick={() => setIsOpen(false)}>
        <Link href="/" >
          <a className={router.pathname === '/' ? styles.activeMenu : ''}>Início</a>
        </Link>
      </li>
      {/* <li onClick={() => setIsOpen(false)}>
        <Link href="/cadastrar-animal">
          <a>Cadastrar Animal</a>
        </Link>
      </li> */}
      <li onClick={() => setIsOpen(false)}>
        <Link href="/listar-animais">
          <a className={router.pathname === '/listar-animais' ? styles.activeMenu : ''}>Vacas</a>
        </Link>
      </li>
    </ul>
  )
}

export default RightNav