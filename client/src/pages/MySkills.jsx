import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MySkills() {
    const [skillsText, setSkillsText] = useState("");
    const [message, setMessage] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user?.skills) {
            setSkillsText(user.skills.join(", "));
        }
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();

        const skills = skillsText
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill !== "");

        try {
            const response = await fetch(
                `/api/users/${user.id}/skills`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ skills })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMessage("Skills updated successfully!");

                const updatedUser = {
                    ...user,
                    skills: data.user.skills
                };

                localStorage.setItem(
                    "user",
                    JSON.stringify(updatedUser)
                );
            } else {
                setMessage(data.message || "Failed to update skills");
            }

        } catch (error) {
            console.log("Skills update error:", error);
            setMessage("Something went wrong");
        }
    }

    return (
        <main className="my-skills-page">

            <Link
                to="/candidate/dashboard"
                className="back-link"
            >
                ← Back to Jobs
            </Link>

            <p className="eyebrow">CANDIDATE PROFILE</p>

            <h1>My Skills</h1>

            <p className="skills-description">
                Add your skills to get personalized job matches.
            </p>

            <form
                className="skills-form"
                onSubmit={handleSubmit}
            >
                <label>Your Skills</label>

                <textarea
                    value={skillsText}
                    onChange={(e) =>
                        setSkillsText(e.target.value)
                    }
                    placeholder="React, JavaScript, HTML, CSS"
                    rows="5"
                />

                <p className="skills-hint">
                    Separate each skill using a comma.
                </p>

                <button type="submit">
                    Save Skills
                </button>
            </form>

            {message && (
                <p className="skills-message">
                    {message}
                </p>
            )}

        </main>
    );
}

export default MySkills;