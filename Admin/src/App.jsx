import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Start from './Pages/Start';
import AdminLogin from './Pages/AdminLogin';
import AdminSignup from './Pages/AdminSignup';
import AdminDashboard from './Pages/adminDashboard';

function App() {
  return (
    <Router> 
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path='/adminLogin' element={<AdminLogin/>}/>
        <Route path="/admin" element={<AdminSignup />} />
       <Route path='dashboard' element={<AdminDashboard/>}/>
      </Routes>
    </Router>
  );
}

export default App;
