import { useState } from "react";

function RecruiterRegister() {
    const [formData, setFormData] = useState({
        recruiterName: "",
        companyName: "",
        companyEmail: "",
        companyWebsite: "",
        companyDescription: ""
    });

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("/api/recruiters", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                alert("Recruiter registration submitted for verification!");

                setFormData({
                    recruiterName: "",
                    companyName: "",
                    companyEmail: "",
                    companyWebsite: "",
                    companyDescription: ""
                });
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Recruiter registration error:", error);
        }
    }

    return (
        <main className="auth-page">

        <div className="auth-card">

            <h1>Recruiter / Company Registration</h1>

            <p className="auth-subtitle">
                Register your company to start hiring through RecruitFlow.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>

                <div className="form-group">
                    <label>Recruiter Name</label>

                    <input
                        type="text"
                        value={formData.recruiterName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                recruiterName: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Company Name</label>

                    <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                companyName: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Company Email</label>

                    <input
                        type="email"
                        value={formData.companyEmail}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                companyEmail: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Company Website</label>

                    <input
                        type="url"
                        value={formData.companyWebsite}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                companyWebsite: e.target.value
                            })
                        }
                    />
                </div>

                <div className="form-group">
                    <label>Company Description</label>

                    <textarea
                        value={formData.companyDescription}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                companyDescription: e.target.value
                            })
                        }
                    />
                </div>

                <button type="submit" className="auth-button">
                    Submit for Verification
                </button>

            </form>

        </div>

    </main>
    );
}

export default RecruiterRegister;