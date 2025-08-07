import React, { useState, useRef } from 'react';
import '../css/uploadreport.css';
import { FaUpload } from 'react-icons/fa';
function UploadBox() {
  const [file, setFile] = useState(null);
  const [reportType, setReportType] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const reportTypes = ['CBC', 'Liver Function', 'Thyroid', 'Diabetes', 'Other'];

  //Handle Drag Events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // File Input 
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //Calculate Age
  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  //Upload
  const handleUpload = async () => {
    if (!file || !reportType) {
      alert('Please select a file and report type.');
      return;
    }

    const userString = localStorage.getItem('user');
    let user = null;

    try {
      user = JSON.parse(userString);
    } catch (err) {
      console.error('Error parsing user from localStorage:', err);
    }

    if (!user || !user.name || !user.email || !user.gender || !user.dob || !user.id) {
      alert('Missing user info. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientName', user.name);
    formData.append('patientEmail', user.email);
    formData.append('patientAge', calculateAge(user.dob));
    formData.append('patientGender', user.gender);
    formData.append('reportType', reportType);
    formData.append('diagnosis', 'to be added');
    formData.append('userId', user.id);

    try {
      const response = await fetch('http://localhost:5000/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      alert('Report uploaded successfully!');
      console.log(result);
      setFile(null);
      setReportType('');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Try again later.');
    }
  };

  return (
    <div id='upload' className="upload-box">
      <h2>Upload Report</h2>
      <p>Supports JPG, PNG images and PDF files</p>

      <div
        className={`upload-area ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
      >
        <div className="upload-icon"><FaUpload size={40} color="#a678f5" /></div>
        <p>Drag & drop or click to choose a file</p>
        <input
          type="file"
          ref={inputRef}
          hidden
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        {file && <p>Selected file: {file.name}</p>}
      </div>

      <select
        className="report-type-dropdown"
        value={reportType}
        onChange={(e) => setReportType(e.target.value)}
      >
        <option value="">Select Report Type</option>
        {reportTypes.map((type, index) => (
          <option key={index} value={type}>{type}</option>
        ))}
      </select>

      <button className="upload-button" onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}

export default UploadBox;
