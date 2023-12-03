/* eslint-disable react/jsx-key */
// ApplicationCard.js
import React from 'react';
import Image from 'next/image'
import styles from '../styles/Home.module.css';// Import your styling

const ActiveUsers = ({ id, appStatus, img, name,userStatus, contact, email, skills, cv, portfolio }) => {
  // console.log(skills)
  return (
    <div className={styles.applicationCard}>
      <div className={styles.imgdetails}>
        <div className={styles.img}>
          <Image src={img} alt="img"/>
        </div>
        <div className={styles.userdetails}>
          <h2>{name}</h2>
          <p>{userStatus}</p>
          <p>{contact}</p>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      </div>
      <div className={styles.skills}>
        {skills.map((item)=> (
          <p className={styles.skill}>{item}</p>
        ))}
      </div>
      <div className={`${styles.btns1} ${styles.btn2}`}>
            <a className='live' href={portfolio} target='_blank'>
            <i class='bx bxs-show'></i>
            </a>
            <a className='cv' href={cv} target='_blank' download>
            <i class='bx bxs-download' ></i>
            </a>
          </div>
    </div>
  );
};

export default ActiveUsers;
