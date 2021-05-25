import Head from 'next/head';
import Image from 'next/image';
import React from 'react';
import startBackend from '../utils/startBackend';
import styles from './home.module.scss';

export default function Home() {
  startBackend() 

  return (
    <>
      <Head>
        <title>Início | MilkMum</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <p>Bem vindo ao <span>Milk Mum</span> </p>
          <h1>Gerenciamento do Gado leiteiro</h1>
        </section>
        <Image 
          src="/images/cow.svg" 
          alt="Vaca ordenhada"
          layout="intrinsic"
          objectFit="cover"
          width={900}
          height={900}
          priority={true} 
        />
        {/* <img src="/images/cow.svg" alt="Vaca ordenhada"/> */}
      </main>
    </>
  )
}
