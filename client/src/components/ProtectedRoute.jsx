import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
        return <Navigate to="/login" replace />;
    }

    const user = JSON.parse(storedUser);

    if (allowedRole && user.role !== allowedRole) {
        if (user.role === "candidate") {
            return <Navigate to="/candidate/dashboard" replace />;
        }

        if (user.role === "recruiter") {
            return <Navigate to="/recruiter/dashboard" replace />;
        }

        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;