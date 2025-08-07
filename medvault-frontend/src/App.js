// app.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Signup from './components/signup';
import Dashboard from './components/dashboard';
import ReportDisplay from './components/reportDisplay';
import ReferenceValues from './components/ReferenceValues';
import Navbar from './components/navbar';
import ReportTrends from './components/ReportTrends';
import UploadForm from './components/uploadForm';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard/>} />
                 <Route path="/upload-report" element={ <><Navbar />
                    <UploadForm /></>} />
                <Route path='/reports' element={
                    <>
                        <Navbar />
                        <ReportDisplay/>
                    </>
                }/>
                <Route path='/reference-values' element={
                    <>
                        <Navbar />
                        <ReferenceValues/>
                    </>
                }/>
                <Route path='/report-trends' element={
                    <>
                        <Navbar />
                        <ReportTrends/>
                    </>
                }/>
            </Routes>
        </Router>
    );
}

export default App;