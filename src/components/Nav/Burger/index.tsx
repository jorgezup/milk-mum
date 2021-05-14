import styles from './styles.module.scss'

interface BurgerProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Burger = ({ isOpen, setIsOpen }: BurgerProps) => {
  return (
    <div 
      className={styles.menu} 
      data-isopen={isOpen}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div />
      <div />
      <div />
    </div>
  )
}

export default Burger