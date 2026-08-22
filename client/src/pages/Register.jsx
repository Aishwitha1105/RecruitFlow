import { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                alert("Registration Successful");
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Registration error:", error);
        }
    }

    return (
        <main className="register-page">

            <div className="register-container">

                <div className="register-header">

                    <span className="dashboard-label">
                        RECRUITFLOW
                    </span>

                    <h1>
                        Create Your RecruitFlow Account
                    </h1>

                    <p>
                        Register as a candidate or recruiter.
                    </p>

                </div>

                <form
                    className="register-form"
                    onSubmit={handleSubmit}
                >

                    <div className="register-form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    email: e.target.value
                                })
                            }
                            required
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })
                                }
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>
                    </div>

                    <div className="register-form-group">
                        <label>Role</label>

                        <select
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value
                                })
                            }
                            required
                        >
                            <option value="">
                                Select Role
                            </option>

                            <option value="candidate">
                                Candidate
                            </option>

                            <option value="recruiter">
                                Recruiter
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="register-submit"
                    >
                        Create Account
                    </button>

                </form>

            </div>

        </main>
    );
}

export default Register;