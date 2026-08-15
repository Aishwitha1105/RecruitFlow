import { useState } from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CandidateDashboard from './pages/CandidateDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CreateJob from "./pages/CreateJob";
import './App.css'

function App() {
  //const [count, setCount] = useState(0)

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
    </Routes>
    </BrowserRouter>
  );
}

export default App
