import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>Wiserdome</h3>
            <p>Your trusted partner for property management in India. We ensure your assets are safe, profitable, and well-maintained.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="LinkedIn">IN</a>
              <a href="#" aria-label="Twitter">TW</a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>📧 hello@wiserdome.com</li>
              <li>📞 +91 98765 43210</li>
              <li>📍 Mumbai • Bangalore • Delhi • Pune</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Wiserdome Property Management. All rights reserved. | <Link to="#">Privacy Policy</Link> | <Link to="#">Terms of Service</Link></p>
        </div>
      </div>
    </footer>
  );
}
