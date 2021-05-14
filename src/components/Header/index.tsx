import React from "react";
import Navbar from "../Nav/Navbar";
import styles from './styles.module.scss';

export function Header() {
  return (
    <header className={styles.headerContainer}>
      {/* <div className={styles.headerContent}>
        <Image 
          src="/images/logo.png" 
          alt="Milk Mum" 
          layout="intrinsic" 
          objectFit="contain"
          width={100}
          height={100}
          priority={true} 
        />
        <nav>
          <Link href="/">
            <a>Início</a>
          </Link>
          <Link href="/cadastrar-animal">
            <a>Cadastrar Animal</a>
          </Link>
          <Link href="/listar-animais">
            <a>Listar Animais</a>
          </Link>
        </nav>
      </div> */}
      <Navbar />
    </header>
  )
}