import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

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
localStorage.setItem("user", JSON.stringify(data.user));

                if (data.user.role === "candidate") {
                    navigate("/candidate/dashboard");
                }

            } else {
                alert(data.message);
            }

        } catch (error) {
            console.log("Login error:", error);
        }
    }

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>

                <div>
                    <label>Email</label>

                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                email: e.target.value
                            })
                        }
                    />
                </div>

                <div>
                    <label>Password</label>

                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value
                            })
                        }
                    />
                </div>

                <button type="submit">
                    Login
                </button>

            </form>
        </main>
    );
}

export default Login;