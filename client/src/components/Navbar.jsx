import { Link, useNavigate } from "react-router-dom";

function NavBar() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    function handleLogout() {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <nav className="navbar">

            <Link to="/" className="logo">
                RecruitFlow AI
            </Link>

            <div className="nav-links">

                <Link to="/">
                    Home
                </Link>

                {!user && (
                    <>
                        <Link to="/candidate/dashboard">
                            For Candidates
                        </Link>

                        <Link to="/recruiter/dashboard">
                            For Recruiters
                        </Link>
                    </>
                )}

                {user?.role === "candidate" && (
                    <>
                        <Link to="/candidate/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/applications">
                            My Applications
                        </Link>
                    </>
                )}

                {user?.role === "recruiter" && (
                    <>
                        <Link to="/recruiter/dashboard">
                            Dashboard
                        </Link>

                        <Link to="/recruiter/applications">
                            Applicants
                        </Link>

                        <Link to="/recruiter/create-job">
                            Create Job
                        </Link>
                    </>
                )}

            </div>

            <div className="nav-actions">

                {!user && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {user && (
                    <button onClick={handleLogout}>
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
}

export default NavBar;