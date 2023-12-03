// Dashboard.js
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect, useContext } from "react";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import ActiveUsers from "@/components/ActiveUsers";
import Applications from "@/components/Applications";
import axios from "axios";
import Link from "next/link";
import { LoadingBarContext } from "../context/LoadingBarContext";
import JobCard from "@/components/JobCard";
import JobForm from "@/components/JobForm";
import Cookies from "js-cookie";

function Dashboard() {
  const { setProgress } = useContext(LoadingBarContext);
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [userData, setUserData] = useState({
    name: "",
    description: "",
    skills: [],
    imageUrl: "",
  });
  const [selectedOption, setSelectedOption] = useState("recomandations");
  const [jobListings, setJobListings] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [jobrecomandation, setJobrecomandation] = useState([]);
  const [userrecomandation, setUserrecomandation] = useState([]);

  useEffect(() => {
    const accessToken = document.cookie.replace(
      /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    const fetchData = async () => {
      try {
        const response = await axios.get("https://link-me-backend.vercel.app/jobpostings",{
          method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken,
            },
        });
        setJobListings(response.data.job_postings);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    setProgress(100);
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userid = document.cookie.replace(
          /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
        const accessToken = document.cookie.replace(
          /(?:(?:^|.*;\s*)access_token\s*=\s*([^;]*).*$)|^.*$/,
          "$1"
        );
        setProgress(30);

        // Fetch user data
        // console.log(accessToken)
        const userDataResponse = await fetch(
          `https://link-me-backend.vercel.app/users/${userid}`,{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken,
            },
          }
        );
        const userDataJson = await userDataResponse.json();
        // console.log(userDataJson)
        setUserData({
          name: userDataJson.user.fullName,
          description: userDataJson.user.description,
          skills: userDataJson.user.skills,
          imageUrl: userDataJson.user.img,
        });
        Cookies.set("img", userDataJson.user.img);
        setProgress(70);

        let oobj = {
          skill_sets: userDataJson.user.skills,
          experience: "3",
        };
        // Fetch applied jobs data
        const activeResponse = await fetch(
          "https://link-me-backend.vercel.app/get_all_users",{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken,
            },
          }
        );
        const activeJson = await activeResponse.json();
        const activeResponce = activeJson.users.filter(user => user._id['$oid'] !== userid);

        setActiveUsers(activeResponce);

        const appliedJobsResponse = await fetch(
          "https://link-me-backend.vercel.app/get_all_applications",{
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + accessToken,
            },
          }
        );
        const appliedJobsJson = await appliedJobsResponse.json();
        // console.log(appliedJobsJson)
        setAppliedJobs(appliedJobsJson.applications);
        
        // console.log(accessToken)
        const jobrecomandationsResponse = await fetch(
          "https://link-me-backend.vercel.app/recommend_jobs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify(oobj),
          }
        );

        const jobrecomandationsJson = await jobrecomandationsResponse.json();
        const filteredRecommendationsjob = jobrecomandationsJson.recommendations.filter(user => user.user_id !== userid);

        setJobrecomandation(filteredRecommendationsjob);
        // console.log(filteredRecommendationsjob);


        let obj = {
          skills: userDataJson.user.skills
        };
        // console.log(obj)
        const userrecomandationsResponse = await fetch(
          "https://link-me-backend.vercel.app/recommend_users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + accessToken,
            },
            body: JSON.stringify(obj),
          }
        );
          // console.log(userrecomandationsResponse)
        const userrecomandationsJson = await userrecomandationsResponse.json();
        // console.log(userrecomandationsJson)
        const filteredRecommendations = userrecomandationsJson.recommendations_users.filter(user => user._id['$oid'] !== userid);

        setUserrecomandation(filteredRecommendations);
        // console.log(filteredRecommendations);
        setProgress(100);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProgress(100);
      }
    };

    fetchData();
  }, [setProgress]);

  const handleBookmark = (jobId) => {
    const isBookmarked = bookmarkedJobs.includes(jobId);
    if (isBookmarked) {
      setBookmarkedJobs((prevBookmarkedJobs) =>
        prevBookmarkedJobs.filter((id) => id !== jobId)
      );
    } else {
      setBookmarkedJobs((prevBookmarkedJobs) => [...prevBookmarkedJobs, jobId]);
    }

    Cookies.set("bookmarkedJobs", JSON.stringify(bookmarkedJobs));
  };

  const renderOptionButtons = () => {
    const isJobSeeker = Cookies.get("job_seeker") === "job_seeker";

    if (isJobSeeker) {
      return (
        <div className={`${styles.dashboardcontainer}`}>
          <button onClick={() => handleOptionChange("recomandations")}>
            Recomandations
          </button>
          <button onClick={() => handleOptionChange("upcomming")}>
            Upcoming
          </button>
          <button onClick={() => handleOptionChange("findJob")}>
            Find Job
          </button>
        </div>
      );
    } else {
      return (
        <div className={`${styles.dashboardcontainer}`}>
          <button onClick={() => handleOptionChange("recomandations")}>
            Recomandations
          </button>
          <button onClick={() => handleOptionChange("applications")}>
            Applications
          </button>
          <button onClick={() => handleOptionChange("activeuser")}>
            Active Users
          </button>
          <button onClick={() => handleOptionChange("createJob")}>
            Create Job
          </button>
        </div>
      );
    }
  };

  const renderContent = () => {
    const isJobSeeker = Cookies.get("job_seeker") === "job_seeker";

    if (isJobSeeker) {
      if (selectedOption === "recomandations") {
        return (
          <div>
            <div className={`${styles.jobrecomandationcarddiv}`}>
              {/* {console.log(jobrecomandation)} */}
              {jobrecomandation.map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  img={job.img}
                  job_title={job.job_title}
                  company={job.company}
                  creator={job.hiring_manager}
                  submissionEndDate={job.end_date}
                  timeLeft={job.timeLeft}
                  isBookmarked={job.is_bookmarked}
                  status={job.status}
                  startDate={job.start_date}
                  onViewApplication={() =>
                    alert(`View Application for ${job.company}`)
                  }
                  onBookmark={() => handleBookmark(job._id)}
                />
              ))}
            </div>
          </div>
        );
      } else if (selectedOption === "findJob") {
        const currentTime = new Date();
        // console.log(jobListings);
        return (
          <div className={`${styles.jobcarddiv}`}>
            {jobListings
              .filter((job) => new Date(job.start_date) <= currentTime)
              .map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  img={job.img}
                  job_title={job.job_title}
                  company={job.company}
                  creator={job.hiring_manager}
                  submissionEndDate={job.end_date}
                  timeLeft={job.timeLeft}
                  isBookmarked={job.is_bookmarked}
                  status={job.status}
                  startDate={job.start_date}
                  onViewApplication={() =>
                    alert(`View Application for ${job.company}`)
                  }
                  onBookmark={() => handleBookmark(job._id)}
                />
              ))}
          </div>
        );
      } else if (selectedOption === "upcomming") {
        const currentTime = new Date();
        // console.log(jobListings);
        return (
          <div className={`${styles.jobcarddiv}`}>
            {jobListings
              .filter((job) => new Date(job.start_date) > currentTime)
              .map((job) => (
                <JobCard
                  key={job._id}
                  id={job._id}
                  img={job.img}
                  job_title={job.job_title}
                  company={job.company}
                  creator={job.hiring_manager}
                  submissionEndDate={job.end_date}
                  timeLeft={job.timeLeft}
                  isBookmarked={job.is_bookmarked}
                  status="upcoming"
                  startDate={job.start_date}
                  onViewApplication={() =>
                    alert(`View Application for ${job.company}`)
                  }
                  onBookmark={() => handleBookmark(job._id)}
                />
              ))}
          </div>
        );
      }
    } else {
      if (selectedOption === "recomandations") {
        return (
          <div>
          {userrecomandation.map((application) => (
                <Applications
                  key={application.id}
                  id={application.id}
                  appStatus={application.status}
                  img={application.img}
                  name={application.fullName}
                  userStatus={application.status}
                  contact={application.contact}
                  email={application.email}
                  skills={application.skills}
                  cv={application.cv}
                  portfolio={application.portfolio}
                  onViewApplication={() =>
                    alert(`View Application for ${application.company}`)
                  }
                />
              ))}
        </div>
        );
      } else if (selectedOption === "applications") {
        return (
          <div>
            <div className={`${styles.jobcarddiv}`}>
              {/* Display applied job cards here */}
              {appliedJobs.map((application) => (
                <Applications
                  key={application.id}
                  id={application.id}
                  appStatus={application.status}
                  img={application.details.img}
                  name={application.details.fullName}
                  userStatus={application.details.status}
                  contact={application.details.contact}
                  email={application.details.email}
                  skills={application.details.skills}
                  cv={application.details.cv}
                  portfolio={application.details.portfolio}
                  onViewApplication={() =>
                    alert(`View Application for ${application.company}`)
                  }
                />
              ))}
            </div>
          </div>
        );
      } else if (selectedOption === "activeuser") {
        return (
          <div>
            <div className={`${styles.jobcarddiv}`}>
              {/* Display applied job cards here */}
              {activeUsers.map((application) => (
                <ActiveUsers
                  key={application.id}
                  id={application.id}
                  appStatus={application.status}
                  img={application.img}
                  name={application.fullName}
                  userStatus={application.status}
                  contact={application.contact_number}
                  email={application.email}
                  skills={application.skills}
                  onViewApplication={() =>
                    alert(`View Application for ${application.company}`)
                  }
                />
              ))}
            </div>
          </div>
        );
      } else if (selectedOption === "createJob") {
        return (
          <div>
            <JobForm
              onSubmit={handleJobFormSubmit}
              setJobListings={setJobListings}
            />
          </div>
        );
      }
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleJobFormSubmit = (jobData) => {
    // console.log("Submitted Job Data:", jobData);
    setJobListings((prevListings) => [...prevListings, jobData]);
  };

  return (
    <div className={styles.main}>
      <div className={styles.dashboardprofile}>
        <div className={styles.dashboarduserimg}>
          <img src={userData.imageUrl} alt="User" />
        </div>
        <div className={styles.dashboarduserdetails}>
          <div>
            <h3 className={styles.name}>{userData.name}</h3>
            <Link href="/profile" passHref className={styles.editbtn}>
              Edit Profile
            </Link>
          </div>
          <p className={styles.userdesc}>{userData.description}</p>
          <div className={styles.userskills}>
            {userData.skills.map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.recommendations}>
        {renderOptionButtons()}
        <div>{renderContent()}</div>
      </div>
    </div>
  );
}

export default Dashboard;
