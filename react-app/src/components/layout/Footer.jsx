import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img 
                src="https://saraekadant.blob.core.windows.net/mediawiserdome/Wiserdome%20Logo.jpg" 
                alt="Wiserdome Logo" 
                className="footer-logo-image"
              />
              <span className="footer-logo-text"></span>
            </div>
            <p className="footer-tagline">
              Your trusted partner for property management in India. We ensure your assets are safe, profitable, and well-maintained—so you can focus on what matters most.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="17.5" cy="6.5" r="1.5"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/pricing">Pricing</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          
          {/* Services */}
          <div className="footer-links">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">Rental Management</Link></li>
              <li><Link to="/services">Property Maintenance</Link></li>
              <li><Link to="/services">Tenant Finding</Link></li>
              <li><Link to="/services">Legal Support</Link></li>
              <li><Link to="/services">Renovation</Link></li>
              <li><Link to="/developer-websites">Website Development</Link></li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="footer-contact">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <span className="contact-icon">📧</span>
                <a href="mailto:hello@wiserdome.com">hello@wiserdome.com</a>
              </li>
              <li>
                <span className="contact-icon">📞</span>
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
              <li>
                <span className="contact-icon">💬</span>
                <a href="https://wa.me/919876543210">WhatsApp Support</a>
              </li>
            </ul>
            <div className="footer-cities">
              <span className="contact-icon">📍</span>
              <span>Mumbai • Bangalore • Delhi • Pune</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; 2025 Wiserdome Property Management LLP. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="#">Privacy Policy</Link>
            <span className="divider">|</span>
            <Link to="#">Terms of Service</Link>
            <span className="divider">|</span>
            <Link to="#">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
