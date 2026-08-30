import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditJob from "./pages/EditJob";
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateProfile from "./pages/CandidateProfile";
import MyApplications from "./pages/MyApplications";
import MySkills from "./pages/MySkills";
import ResumeUpload from "./pages/ResumeUpload";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import RecruiterRegister from "./pages/RecruiterRegister";
import RecruiterApplications from "./pages/RecruiterApplications";
import RecruiterJobDetails from "./pages/RecruiterJobDetails";
import CreateJob from "./pages/CreateJob";

import JobDetails from "./pages/JobDetails";

import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function App() {
    return (
        <BrowserRouter>

            <NavBar />

            <Routes>

                {/* =========================================
                    PUBLIC ROUTES
                ========================================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/recruiter/register"
                    element={<RecruiterRegister />}
                />

                {/* Public job details */}
                <Route
                    path="/jobs/:id"
                    element={<JobDetails />}
                />


                {/* =========================================
                    CANDIDATE ROUTES
                ========================================= */}

                <Route
                    path="/candidate/dashboard"
                    element={
                        <ProtectedRoute allowedRole="candidate">
                            <CandidateDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute allowedRole="candidate">
                            <MyApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/candidate/skills"
                    element={
                        <ProtectedRoute allowedRole="candidate">
                            <MySkills />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/candidate/resume"
                    element={
                        <ProtectedRoute allowedRole="candidate">
                            <ResumeUpload />
                        </ProtectedRoute>
                    }
                />


                {/* =========================================
                    RECRUITER ROUTES
                ========================================= */}

                <Route
                    path="/recruiter/dashboard"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/create-job"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <CreateJob />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/applications"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <RecruiterApplications />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/jobs/:id"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <RecruiterJobDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/recruiter/candidates/:candidateId"
                    element={
                        <ProtectedRoute allowedRole="recruiter">
                            <CandidateProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
    path="/recruiter/jobs/:id/edit"
    element={
        <ProtectedRoute allowedRole="recruiter">
            <EditJob />
        </ProtectedRoute>
    }
/>

            </Routes>

        </BrowserRouter>
    );
}

export default App;