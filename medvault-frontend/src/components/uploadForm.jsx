import React, { useState } from 'react';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import '../css/UploadForm.css';

function UploadForm() {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select or drag a file");

    const formData = new FormData();
    formData.append('medicalReport', file);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/reports', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
      });

      setMessage(res.data.message || 'Report uploaded successfully!');
      setSummary(res.data.data.summary);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage('Upload failed. Please try again.');
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">Upload Medical Report</h2>

      <form onSubmit={handleSubmit} className="upload-form">
        <div
          className={`drop-zone ${dragActive ? 'active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <FiUpload size={40} className="upload-icon" />
          <p>Drag & Drop your report here or click to select</p>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="file-input-overlay"
          />
          {file && <p className="file-name">Selected: {file.name}</p>}
        </div>

        <button type="submit" className="upload-btn" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {message && (
        <div className={`message ${summary ? 'success' : 'error'}`}>
          <strong>{message}</strong>
        </div>
      )}

      {summary && (
        <div className="summary-box">
          <h3>Report Summary</h3>
          <p><strong>Patient:</strong> {summary.patientName}</p>
          <p><strong>Report Type:</strong> {summary.reportType}</p>
          <p><strong>Overall Status:</strong> {summary.overallStatus}</p>
          <p><strong>Severity:</strong> {summary.severity}</p>
          <p><strong>Total Tests:</strong> {summary.totalTests}</p>
          <p><strong>Abnormal Findings:</strong> {summary.abnormalCount}</p>
          <div>
            <strong>Key Findings:</strong>
            <ul>
              {summary.keyFindings.map((finding, idx) => (
                <li key={idx}>{finding}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadForm;
