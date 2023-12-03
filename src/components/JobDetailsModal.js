import React, { useState, useEffect } from "react";
import styles from "../styles/Home.module.css";

const JobDetailsModal = ({ jobId, loggedInUserId, onClose }) => {
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loadingApply, setLoadingApply] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await fetch(
          `https://link-me-backend.vercel.app/get_job_posting/${jobId}`
        );
        const data = await response.json();

        const sampleJobDetails = {
          job_title: data.job_title || "Software Developer",
          company: data.company || "Tech Co.",
          experience: data.experience || "5+ years",
          description:
            data.job_description || "This is a detailed job description...",
          creator_id: data.user_id,
          status: data.status || "open",
        };

        setJobDetails(sampleJobDetails);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching job details:", error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = document.cookie.replace(
        /(?:(?:^|.*;\s*)userId\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      try {
        const response = await fetch(
          `https://link-me-backend.vercel.app/users/${userId}`
        );
        const data = await response.json();
        setUserDetails(data.user);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (showApplyForm && !userDetails) {
      fetchUserDetails();
    }
  }, [loggedInUserId, showApplyForm, userDetails]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `https://link-me-backend.vercel.app/get_all_applications`
        );
        const data = await response.json();
        const applications = data.applications || [];

        const hasUserApplied = applications.some(
          (application) => application.job_seeker_id === loggedInUserId
        );

        setHasApplied(hasUserApplied);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    if (showApplyForm && !hasApplied) {
      fetchApplications();
    }
  }, [jobId, loggedInUserId, showApplyForm]);

  const isUserJobCreator =
    jobDetails && loggedInUserId === jobDetails.creator_id;

  const handleApply = async () => {
    if (jobDetails.status === "close") {
      console.log("This job posting is no longer accepting applications.");
      return;
    }

    if (hasApplied) {
      console.log("You have already applied for this job.");
      return;
    }

    setLoadingApply(true);

    try {
      const responseJobDetails = await fetch(
        `https://link-me-backend.vercel.app/get_job_posting/${jobId}`
      );
      const dataJobDetails = await responseJobDetails.json();

      const sampleJobDetails = {
        job_title: dataJobDetails.job_title || "Software Developer",
        company: dataJobDetails.company || "Tech Co.",
        experience: dataJobDetails.experience || "5+ years",
        description:
          dataJobDetails.job_description ||
          "This is a detailed job description...",
        creator_id: dataJobDetails.user_id,
      };

      setJobDetails(sampleJobDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setLoadingApply(false);
      setShowApplyForm(true);
    }
  };

  const handleSubmitApplication = async (formData) => {
    const excludedKeys = ["username", "password", "is_active", "is_admin"];
    const filteredFormData = Object.fromEntries(
      Object.entries(formData).filter(
        ([key]) => !excludedKeys.includes(key)
      )
    );

    let applicationData = {
      job_seeker_id: loggedInUserId,
      job_posting_id: jobId,
      status: "Pending",
      details: filteredFormData,
    };

    try {
      const response = await fetch(
        `https://link-me-backend.vercel.app/apply/${jobId}/${loggedInUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        }
      );

      if (response.ok) {
        console.log("Application submitted successfully.");
        // Additional logic or state updates after successful submission
      } else {
        console.error("Failed to submit application.");
        // Handle the error or show an error message
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setShowApplyForm(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.job_details_modal}`}>
      <div className={`${styles.modal_content}`}>
        <h2 className={`${styles.h2}`}>
          <strong>Job Title:</strong>
          {jobDetails.job_title}
        </h2>
        <p>
          <strong>Company:</strong> {jobDetails.company}
        </p>
        <p>
          <strong>Experience Needed:</strong> {jobDetails.experience}+ years
        </p>
        <p>
          <strong>Description:</strong> {jobDetails.description}
        </p>

        {(!showApplyForm && !hasApplied && jobDetails.status === "open") && (
          <button
            className={`${styles.button} ${styles.apply}`}
            onClick={handleApply}
            disabled={isUserJobCreator || loadingApply}
          >
            {loadingApply
              ? "Loading..."
              : isUserJobCreator
              ? "You cannot apply to your own job"
              : hasApplied
              ? "You have already applied"
              : "Apply"}
          </button>
        )}

        {jobDetails.status === "close" && (
          <div>
            <p>This job posting is no longer accepting applications.</p>
          </div>
        )}

        {hasApplied && (
          <div>
            <p>You have already applied for this job.</p>
          </div>
        )}

        <button
          className={`${styles.button} ${styles.close}`}
          onClick={onClose}
        >
          Close
        </button>

        {showApplyForm && userDetails && !hasApplied && (
          <div className={`${styles.apply_form}`}>
            <h3>Application Form</h3>
            <form
              className={`${styles.hiddenform}`}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const formDataObject = {};
                formData.forEach((value, key) => {
                  formDataObject[key] = value;
                });

                const applicationData = {
                  ...userDetails,
                  ...formDataObject,
                };

                handleSubmitApplication(applicationData);
              }}
            >
              <label>
                Name:
                <input
                  type="text"
                  name="fullName"
                  defaultValue={userDetails.fullName}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  defaultValue={userDetails.email}
                  required
                />
              </label>
              <label>
                Contact:
                <input
                  type="number"
                  name="contact"
                  required
                  defaultValue={userDetails.contact_number}
                />
              </label>
              <label>
                Resume:-
                <input type="text" name="resume" required />
              </label>
              <label>
                Portfolio:-
                <input type="url" name="portfolio" />
              </label>
              <button type="submit">Submit Application</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsModal;
