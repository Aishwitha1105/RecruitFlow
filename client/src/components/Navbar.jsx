import {Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
function NavBar(){
    const navigate = useNavigate();

function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
}
    return(
        <nav className="navbar">
         <div className="logo">RecruitFlow AI</div>
         <div className="nav-links">
            <Link to="/">Home</Link>
            <Link to="/candidate/dashboard">For Candidates</Link>
            <a href="recruiter/dashboard">For Recruiters</a>
        </div>
        <div className="nav-actions">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            </div>   
            <button onClick={handleLogout}>Logout</button>
        </nav>
        
    );
}
export default NavBar;