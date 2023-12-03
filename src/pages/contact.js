import Image from 'next/image'
import React from 'react'
import styles from "../styles/Home.module.css"
import img from '../images/userimg1.jpg'
import { useTheme } from "../components/hooks/ThemeContext";
import Link from 'next/link';
import linkedin from '../images/linkedin.png'
import email from '../images/email.png'

function contact() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useTheme();
  return (
    <section id={`${styles.contact}`}>
      <p className={`${styles.section__text__p1}`}>Get in Touch</p>
      <h1 className={`${styles.title}`}>Contact Me</h1>
      <div className={`${styles.contact_info_upper_container}`}>
        <div className={`${styles.contact_info_container}`}>
          <Image
            src={email}
            alt="Email icon"
            className={`${styles.icon} ${styles.contact_icon} ${styles.email_icon}`}
          />
          <p><a href="mailto:sraa7877@gmail.com">sraa7877@gmail.com</a></p>
        </div>
        <div className={`${styles.contact_info_container}`}>
          <Image
            src={linkedin}
            alt="LinkedIn icon"
            className={`${styles.icon} ${styles.contact_icon}`}
          />
          <p><a href="https://www.linkedin.com/in/sharma-ravi7877/">LinkedIn</a></p>
        </div>
      </div>
    </section>
  )
}

export default contact