import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditJob() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [jobData, setJobData] = useState({
        title: "",
        company: "",
        location: "",
        jobType: "",
        skills: "",
        experience: "",
        description: ""
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================================
    // FETCH EXISTING JOB
    // ==============================================

    useEffect(() => {

        async function fetchJob() {

            try {

                const response = await fetch(
                    `/api/jobs/${id}`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch job"
                    );
                }

                setJobData({
                    title: data.title || "",
                    company: data.company || "",
                    location: data.location || "",
                    jobType: data.jobType || "",
                    skills: data.skills || "",
                    experience: data.experience || "",
                    description: data.description || ""
                });

            } catch (error) {

                console.log(
                    "Fetch job error:",
                    error
                );

                setError(
                    error.message ||
                    "Unable to load job."
                );

            } finally {

                setLoading(false);

            }
        }

        fetchJob();

    }, [id]);


    // ==============================================
    // HANDLE INPUT
    // ==============================================

    function handleChange(e) {

        setJobData({
            ...jobData,
            [e.target.name]: e.target.value
        });

    }


    // ==============================================
    // UPDATE JOB
    // ==============================================

    async function handleSubmit(e) {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                `/api/jobs/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                    },

                    body: JSON.stringify(jobData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update job"
                );
            }

            setMessage(
                "Job updated successfully."
            );

            // Go back to recruiter job details
            setTimeout(() => {
                navigate(`/recruiter/jobs/${id}`);
            }, 800);

        } catch (error) {

            console.log(
                "Update job error:",
                error
            );

            setError(
                error.message ||
                "Failed to update job."
            );
        }
    }


    // ==============================================
    // LOADING
    // ==============================================

    if (loading) {
        return (
            <main className="create-job-page">
                <div className="create-job-container">
                    <p>Loading job...</p>
                </div>
            </main>
        );
    }


    // ==============================================
    // ERROR
    // ==============================================

    if (error && !jobData.title) {
        return (
            <main className="create-job-page">
                <div className="create-job-container">
                    <p className="error-message">
                        {error}
                    </p>
                </div>
            </main>
        );
    }


    // ==============================================
    // FORM
    // ==============================================

    return (

        <main className="create-job-page">

            <div className="create-job-container">

                <div className="create-job-header">

                    <span className="dashboard-label">
                        RECRUITER
                    </span>

                    <h1>
                        Edit Job
                    </h1>

                    <p>
                        Update your job posting details.
                    </p>

                </div>


                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="error-message">
                        {error}
                    </p>
                )}


                <form
                    className="create-job-form"
                    onSubmit={handleSubmit}
                >

                    {/* JOB TITLE */}

                    <div className="form-group">

                        <label>
                            Job Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={jobData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* COMPANY */}

                    <div className="form-group">

                        <label>
                            Company
                        </label>

                        <input
                            type="text"
                            name="company"
                            value={jobData.company}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* LOCATION */}

                    <div className="form-group">

                        <label>
                            Location
                        </label>

                        <input
                            type="text"
                            name="location"
                            value={jobData.location}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* JOB TYPE */}

                    <div className="form-group">

                        <label>
                            Job Type
                        </label>

                        <select
                            name="jobType"
                            value={jobData.jobType}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Job Type
                            </option>

                            <option value="full-time">
                                Full Time
                            </option>

                            <option value="part-time">
                                Part Time
                            </option>

                            <option value="internship">
                                Internship
                            </option>

                        </select>

                    </div>


                    {/* SKILLS */}

                    <div className="form-group">

                        <label>
                            Required Skills
                        </label>

                        <input
                            type="text"
                            name="skills"
                            value={jobData.skills}
                            onChange={handleChange}
                            required
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>

                    </div>


                    {/* EXPERIENCE */}

                    <div className="form-group">

                        <label>
                            Experience
                        </label>

                        <textarea
                            name="experience"
                            value={jobData.experience}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Job Description
                        </label>

                        <textarea
                            name="description"
                            className="description-input"
                            value={jobData.description}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="create-job-submit"
                    >
                        Save Changes
                    </button>

                </form>

            </div>

        </main>
    );
}

export default EditJob;