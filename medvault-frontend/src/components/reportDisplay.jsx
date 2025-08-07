import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/reportDisplay.css';

const ReportDisplay = () => {
  const [reports, setReports] = useState([]);
  const [preview, setPreview] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;
  const token = localStorage.getItem('token');
const handleDelete = async (reportId) => {
  try {
    await axios.delete(`http://localhost:5000/api/reports/${reportId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    setReports((prev) => prev.filter((r) => r.id !== reportId));
  } catch (error) {
    console.error('Error deleting report:', error);
  }
};

 useEffect(() => {
  if (!userId) return;

  axios.get(`http://localhost:5000/api/reports/getReportByUserId/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then((res) => {
      const formattedReports = res.data.map((report) => {
        let cleanedPath = report.filePath;

        // Always extract from 'uploads/...'
        const uploadsIndex = cleanedPath.indexOf('uploads');
        if (uploadsIndex !== -1) {
          cleanedPath = cleanedPath.slice(uploadsIndex).replace(/\\/g, '/');
        } else {
          // fallback
          cleanedPath = cleanedPath.replace(/\\/g, '/');
        }

        return {
          ...report,
          fileUrl: `http://localhost:5000/${cleanedPath}`
        };
      });

      setReports(formattedReports);
    })
    .catch((err) => {
      console.error('Error fetching reports:', err);
    });
}, [userId, token]);


  const handlePreview = (report) => {
    setPreview(report);
  };

  const closePreview = () => {
    setPreview(null);
  };

  return (
    <div className="report-gallery">
      <h2>Your Uploaded Reports</h2>

      {reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        <div className="report-grid">
          {reports.map((report, idx) => (
           <div className="report-card" key={report.id} onClick={() => handlePreview(report)}>
  {report.mimeType === 'application/pdf' ? (
    <div className="pdf-placeholder">📄 PDF</div>
  ) : (
    <img src={report.fileUrl} alt="report" className="thumbnail" />
  )}
  <p className="report-type">{report.reportType}</p>
  <p className="report-date">
    {new Date(report.reportDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })}
  </p>
  <button className="delete-btn" onClick={(e) => {
  e.stopPropagation(); // Prevent opening preview
  handleDelete(report.id);
}}>
  Delete
</button>

</div>

          ))}
        </div>
      )}

      {preview && (
        <div className="preview-modal" onClick={closePreview}>
          <div className="preview-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closePreview}>X</button>
            {preview.mimeType === 'application/pdf' ? (
              <iframe
                src={preview.fileUrl}
                title="PDF Preview"
                width="100%"
                height="600px"
                style={{ border: 'none' }}
              ></iframe>
            ) : (
              <img
                src={preview.fileUrl}
                alt="Full Preview"
                className="full-preview"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDisplay;
