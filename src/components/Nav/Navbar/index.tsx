import Link from 'next/link';
import React, { useState } from "react";
import Burger from '../Burger';
import RightNav from '../RightNav';
import styles from './styles.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper}>
        <Link href="/">
          {/* <Image 
            src="/images/logo.png" 
            alt="Milk Mum" 
            layout="intrinsic"
            objectFit="cover"
            width={100}
            height={100}
            priority={true} 
          /> */}
          <img src="/images/logo.png" alt="Milk Mum"/>
        </Link>
        <RightNav isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Burger isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    </div>
  )
}

export default Navbar