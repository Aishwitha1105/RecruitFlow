import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import RecruiterRegister from "./pages/RecruiterRegister";
import CreateJob from "./pages/CreateJob";
import JobDetails from "./pages/JobDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import './App.css'

function App() {
  return (
    <BrowserRouter>
    <NavBar/>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/candidate/dashboard" element={ <ProtectedRoute> <CandidateDashboard /> </ProtectedRoute>  }
/>
<Route
    path="/recruiter/dashboard"
    element={
        <ProtectedRoute>
            <RecruiterDashboard />
        </ProtectedRoute>
    }
/>
      <Route path="/recruiter/create-job" element={<CreateJob />} />
      <Route path="/jobdetails" element={<JobDetails/>}/>
      <Route path="/recruiter/register" element={<RecruiterRegister />}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App
