import {Link} from "react-router-dom";
function NavBar(){
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
        </nav>
        
    );
}
export default NavBar;