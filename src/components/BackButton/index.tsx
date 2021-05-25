import Link from 'next/link';
import React from 'react';
import styles from './styles.module.scss';
export function BackButton() {
  return (
    <Link href="/listar-animais">
      <a className={styles.backButton}>Voltar</a>
    </Link>
  )
}