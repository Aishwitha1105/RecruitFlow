import { useState } from "react";
import { Link } from "react-router-dom";

function ResumeUpload() {
    const [resume, setResume] = useState(null);
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    async function handleSubmit(e) {
        e.preventDefault();

        if (!resume) {
            setMessage("Please select a resume first.");
            return;
        }

        const formData = new FormData();

        formData.append("resume", resume);

        try {
            const response = await fetch(
                `/api/users/${user.id}/resume`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Resume uploaded successfully!");
                console.log(data);
            } else {
                setMessage(data.message || "Failed to upload resume");
            }

        } catch (error) {
            console.log("Resume upload error:", error);
            setMessage("Something went wrong while uploading.");
        }
    }

    return (
        <main className="resume-upload-page">

            <Link
                to="/candidate/dashboard"
                className="back-link"
            >
                ← Back to Jobs
            </Link>

            <p className="eyebrow">CANDIDATE PROFILE</p>

            <h1>Upload Resume</h1>

            <p>
                Upload your resume to help us understand your skills
                and improve your job matches.
            </p>

            <form
                className="resume-upload-form"
                onSubmit={handleSubmit}
            >

                <label>Select Resume</label>

                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) =>
                        setResume(e.target.files[0])
                    }
                />

                <button type="submit">
                    Upload Resume
                </button>

            </form>

            {message && (
                <p className="resume-message">
                    {message}
                </p>
            )}

        </main>
    );
}

export default ResumeUpload;