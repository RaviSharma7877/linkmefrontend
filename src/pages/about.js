import React from 'react'
import styles from "../styles/Home.module.css"
import Image from 'next/image'
import img from '../images/userimg1.jpg'


function about() {
  return (
    <div className={`${styles.aboutcontainer}`}>
      <div>
      <div className={`${styles.aboutimg} `}>
        <Image src={img} className={`border `} alt='img'></Image>
      </div>
      <div className={`${styles.aboutusdata}`}>
        <h1>I`m Ravi</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum amet id, officia in repellendus corporis tempora qui ipsam voluptatibus enim officiis quia? Cum dolor exercitationem quidem voluptates distinctio sunt repellendus?</p>
      </div>
      </div>
    </div>
  )
}

export default about