import Image from 'next/image';
import React, { useEffect, useState } from "react";
import { useScrollBlock } from '../../../hooks/useScrollBlock';
import Burger from '../Burger';
import RightNav from '../RightNav';
import styles from './styles.module.scss';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [blockScroll, allowScroll] = useScrollBlock()

  useEffect(() => {
    if(isOpen) blockScroll()
    else allowScroll()
  }, [isOpen])

  return (
    <div className={styles.navbar}>
      <div className={styles.wrapper}>
        <Image 
          src="/images/logo.png" 
          alt="Milk Mum" 
          layout="intrinsic"
          width={80}
          height={80}
          priority={true} 
        />
        <RightNav isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Burger isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    </div>
  )
}

export default Navbar