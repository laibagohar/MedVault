import React from 'react';
import { FaCloudUploadAlt, FaChartLine, FaLightbulb } from 'react-icons/fa';
import '../css/featureBox.css';

function FeatureBoxes() {
  const features = [
    {
      title: 'Easy Upload',
      icon: <FaCloudUploadAlt size={40} />,
      desc: 'Upload reports in JPG, PNG, or PDF formats with a simple drag-and-drop interface.',
    },
    {
      title: 'Analysis',
      icon: <FaChartLine size={40} />,
      desc: 'Get AI-powered insights and extract key data from your health reports instantly.',
    },
    {
      title: 'Recommendation',
      icon: <FaLightbulb size={40} />,
      desc: 'Receive preliminary recommendations based on analysis to guide your next steps.',
    },
  ];

  return (
    <div className="features-container">
      {features.map((f, i) => (
        <div key={i} className="feature-box">
          <div className="feature-icon">{f.icon}</div>
          <h3>{f.title}</h3>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  );
}

export default FeatureBoxes;
