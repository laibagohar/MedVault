import React from 'react';
import { FaPhone, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../css/footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">
        <div className="footer-column">
          <h2 className="footer-title">MedVault</h2>
          <p>We help patients easily upload and track diagnostic reports in one place.</p>
          <div className="footer-icons">
            <div><FaPhone /> +92 123 4567890</div>
            <div><FaMapMarkerAlt /> Lahore, Pakistan</div>
            <div><FaEnvelope /> support@medvault.com</div>
          </div>
        </div>

        <div className="footer-column">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/dashboard#upload">Upload File</a></li>
            <li><Link to="/reports">Report Data</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Contact Us</h3>
          <p>Got questions or suggestions?<br />Reach out any time.</p>
          <div className="footer-icons">
            <div><FaPhone /> +92 987 6543210</div>
            <div><FaEnvelope /> contact@medvault.com</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MedVault. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
