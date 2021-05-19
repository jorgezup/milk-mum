import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from "react";
import { useScrollBlock } from '../../../util/useScrollBlock';
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
        <Link href="/">
          <Image 
            src="/images/logo.png" 
            alt="Milk Mum" 
            layout="intrinsic"
            // objectFit="contain"
            width={80}
            height={80}
            priority={true} 
          />
        </Link>
        <RightNav isOpen={isOpen} setIsOpen={setIsOpen}/>
        <Burger isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
    </div>
  )
}

export default Navbar