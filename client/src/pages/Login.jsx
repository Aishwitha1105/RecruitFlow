import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            console.log(data);

            if (response.ok) {
                alert("Login successful!");

                localStorage.setItem("token", data.token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                if (data.user.role === "candidate") {
                    navigate("/candidate/dashboard");
                } else if (data.user.role === "recruiter") {
                    navigate("/recruiter/dashboard");
                }

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Login error:", error);
        }
    }

    return (
        <main className="auth-page">

            <div className="auth-card login-card">

                <div className="login-header">

                    <span className="dashboard-label">
                        RECRUITFLOW
                    </span>

                    <h1>
                        Welcome Back
                    </h1>

                    <p className="auth-subtitle">
                        Sign in to continue to your RecruitFlow account.
                    </p>

                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="abc@gmail.com"
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

                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
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
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>

                        </div>

                    </div>

                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Login
                    </button>

                </form>

            </div>

        </main>
    );
}

export default Login;