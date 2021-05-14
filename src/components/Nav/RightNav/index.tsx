import Link from "next/link"
import styles from './styles.module.scss'

const RightNav = ({ isOpen, setIsOpen }) => {

  return (
    <ul
      className={isOpen ? `${styles.ul} ${styles.active}` : `${styles.hidden} ${styles.ul}`}
      data-isopen={isOpen} 
    >
      <li onClick={() => setIsOpen(false)}>
        <Link href="/" >
          <a>Início</a>
        </Link>
      </li>
      <li onClick={() => setIsOpen(false)}>
        <Link href="/cadastrar-animal">
          <a>Cadastrar Animal</a>
        </Link>
      </li>
      <li onClick={() => setIsOpen(false)}>
        <Link href="/listar-animais">
          <a>Listar Animais</a>
        </Link>
      </li>
    </ul>
  )
}

export default RightNav