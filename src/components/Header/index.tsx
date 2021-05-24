import React from "react";
import Navbar from "../Nav/Navbar";
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <Navbar />
    </header>
  )
}