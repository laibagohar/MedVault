// dashboard page
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './footer';
import Carousel from './carousel';
import UploadForm from './uploadForm';
import FeatureBoxes from './featureBox';
function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <div>
            <Navbar />
            <Carousel/>
            <UploadForm />
            <FeatureBoxes/>
            <Footer />
           
        </div>
    )
}

export default Dashboard;   