import { useState } from "react";

function CreateJob() {
    const [jobData, setJobData] = useState({
        title: "",
        company: "",
        location: "",
        jobType: "",
        skills: "",
        experience: "",
        description: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("/api/jobs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();

            console.log("Created job:", data);

            if (response.ok) {
                alert("Job created successfully!");

                setJobData({
                    title: "",
                    company: "",
                    location: "",
                    jobType: "",
                    skills: "",
                    experience: "",
                    description: ""
                });
            }
        } catch (error) {
            console.log("Error creating job:", error);
        }
    }

    return (
        <main className="create-job-page">

            <div className="create-job-container">

                <div className="create-job-header">
                    <span className="dashboard-label">
                        RECRUITER
                    </span>

                    <h1>Create Job</h1>

                    <p>
                        Create a new opportunity and find the right candidates.
                    </p>
                </div>

                <form
                    className="create-job-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label>Job Title</label>

                        <input
                            type="text"
                            placeholder="e.g. Frontend Developer"
                            value={jobData.title}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    title: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Company</label>

                        <input
                            type="text"
                            placeholder="e.g. TechNova"
                            value={jobData.company}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    company: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Location</label>

                        <input
                            type="text"
                            placeholder="e.g. Hyderabad"
                            value={jobData.location}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    location: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Type</label>

                        <select
                            value={jobData.jobType}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    jobType: e.target.value
                                })
                            }
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

                    <div className="form-group">
                        <label>Required Skills</label>

                        <input
                            type="text"
                            placeholder="e.g. React, JavaScript, SQL"
                            value={jobData.skills}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    skills: e.target.value
                                })
                            }
                            required
                        />

                        <small>
                            Separate multiple skills with commas.
                        </small>
                    </div>

                    <div className="form-group">
                        <label>Experience</label>

                        <textarea
                            placeholder="e.g. 1-2 years"
                            value={jobData.experience}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    experience: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Description</label>

                        <textarea
                            className="description-input"
                            placeholder="Describe the role, responsibilities and requirements..."
                            value={jobData.description}
                            onChange={(e) =>
                                setJobData({
                                    ...jobData,
                                    description: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="create-job-submit"
                    >
                        Create Job
                    </button>

                </form>

            </div>

        </main>
    );
}

export default CreateJob;