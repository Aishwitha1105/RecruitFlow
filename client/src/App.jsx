import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/candidate/dashboard" element={<CandidateDashboard/>}/>
      <Route path="/recruiter/dashboard" element={<RecruiterDashboard/>}/>
      <Route path="/recruiter/create-job" element={<CreateJob />} />
      <Route path="/jobdetails" element={<JobDetails/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App
