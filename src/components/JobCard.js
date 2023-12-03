// JobCard.js

import React, { useState, useEffect } from "react";
import JobDetailsModal from "./JobDetailsModal";
import styles from "../styles/Home.module.css";
import moment from "moment";

const JobCard = ({
  id,
  img,
  job_title,
  company,
  creator,
  submissionEndDate,
  status,
  startDate,
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ... (previous code)

  useEffect(() => {
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const calculateTimeLeft = async () => {
      const now = new Date();

      if (status === "upcoming") {
        const startDateObj = moment(startDate).toDate();
        const timeDiff = startDateObj - now;
        // console.log(startDateObj);
        // console.log("startDate" + startDate);
        if (timeDiff > 0) {
          const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDiff % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

          const objstatus = {
            status: "upcoming",
          };
           fetch(
            `https://link-me-backend.vercel.app/update_job_status/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
              },
              body: JSON.stringify(objstatus),
            }
          )
           .then(response => response.json())
          //  .then(data => console.log(data))
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
        else {
          // Event has started, calculate time left until the end date
          const endDateTimeDiff = new Date(submissionEndDate) - now;
          const days = Math.floor(endDateTimeDiff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((endDateTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((endDateTimeDiff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((endDateTimeDiff % (1000 * 60)) / 1000);
          const objstatus = {
            status: "open",
          };
          fetch(
            `https://link-me-backend.vercel.app/update_job_status/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(objstatus),
            }
          )
           .then(response => response.json())
          //  .then(data => console.log(data))
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }
      } else {
        // Status is not upcoming
        const endDateTimeDiff = new Date(submissionEndDate) - now;
        const days = Math.floor(endDateTimeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (endDateTimeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (endDateTimeDiff % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((endDateTimeDiff % (1000 * 60)) / 1000);

        if (endDateTimeDiff > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
          const objstatus = {
            status: "open",
          };
          fetch(
            `https://link-me-backend.vercel.app/update_job_status/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
              },
              body: JSON.stringify(objstatus),
            }
          )
           .then(response => response.json())
          //  .then(data => console.log(data))
        } else {
          // Submission deadline has passed

          const objstatus = {
            status: "close",
          };
          // console.log(id)
          const fe = await fetch(
            `https://link-me-backend.vercel.app/update_job_status/${id}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + accessToken,
              },
              body: JSON.stringify(objstatus),
            }
          )
           const dj = awaitresponse => response.json()
          //  console.log(dj)



          setTimeLeft("Opening ended");
          
        }
      }
    };

    calculateTimeLeft();

    // Update time left every second if it's upcoming or event started
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [status, submissionEndDate, startDate]);

  // ... (remaining code)

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const userid = document.cookie.replace(
    /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  // console.log(status);
  const statusStyle =
    status === "open"
      ? styles.cardsattusopen
      : status === "close"
      ? styles.cardsattusclose
      : status === "upcoming"
      ? styles.cardsattusupcoming
      : "";

  const rendercontent = () => {
    if (status === "upcoming") {
      return (
        <>
          <strong>Start In :</strong> {timeLeft}{" "}
        </>
      );
    } else {
      return (
        <>
          <strong>End In :</strong> {timeLeft}
        </>
      );
    }
  };
  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px",
        borderRadius: "8px",
        width: "100%",
        
      }}
      className={`${styles.dis}`}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        
      >
        <div style={{ width: "50%", display: "flex", alignItems: "center" }}  className={`${styles.jobimg}`}>
          <div style={{ height: "150px", marginRight: "10px" }}>
            <div style={{ height: "100%", marginRight: "10px" }}>
              <img
                src={img}
                alt="Company Logo"
                style={{
                  height: "100%",
                  marginRight: "10px",
                  paddingRight: "0px",
                }}
              />
            </div>
          </div>
          <div
            style={{ height: "100%", marginLeft: "10px", paddingLeft: "10px" }} className={`${styles.jobdet}`}
          >
            <div>
              <strong>Company :</strong> {company}
            </div>
            <div>
              <strong>Job Title :</strong> {job_title}
            </div>
            <div>
              <strong>Creator :</strong> {creator}
            </div>
            <div>{rendercontent()}</div>
          </div>
        </div>
        <div
          style={{ width: "50%", display: "flex", justifyContent: "flex-end" }} className={`${styles.btns001}`}
        >
          <div className={`${styles.viewbtn}`}>
            <button onClick={openModal} >View Application</button>
            {isModalVisible && (
              <JobDetailsModal
                jobId={id}
                loggedInUserId={userid}
                onClose={closeModal}
              />
            )}
          </div>
          
          <div className={`${styles.jobCard} ${statusStyle}`}>
            <p>{status}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
