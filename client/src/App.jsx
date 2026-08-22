import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterRegister from "./pages/RecruiterRegister";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import MyApplications from "./pages/MyApplications";
import RecruiterApplications from "./pages/RecruiterApplications";
import MySkills from "./pages/MySkills";
import RecruiterJobDetails from "./pages/RecruiterJobDetails";
import ResumeUpload from "./pages/ResumeUpload";
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route
    path="/candidate/dashboard"
    element={
        <ProtectedRoute allowedRole="candidate">
            <CandidateDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute allowedRole="recruiter">
            <RecruiterDashboard />
        </ProtectedRoute>
    }
/>
<Route
    path="/jobs/:id"
    element={<JobDetails />}
/>
<Route
    path="/recruiter/jobs/:id"
    element={<RecruiterJobDetails />}
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
    path="/recruiter/applications"
    element={
        <ProtectedRoute allowedRole="recruiter">
            <RecruiterApplications />
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
    path="/candidate/skills"
    element={<MySkills />}
/>
      <Route path="/recruiter/register" element={<RecruiterRegister />}/>
      <Route
    path="/candidate/resume"
    element={<ResumeUpload />}
/>
    </Routes>
    </BrowserRouter>

  );
}

export default App
