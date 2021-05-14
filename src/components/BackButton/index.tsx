import Router from 'next/router';
import styles from './styles.module.scss';
export function BackButton() {
  return (
    <button 
      type="button" 
      onClick={() => Router.back()}
      className={styles.backButton}
      >Voltar
    </button>
  )
}