import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Wiserdome
          </Link>
          
          <nav className="nav-menu">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
            <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`}>Services</Link>
            <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`}>Pricing</Link>
            <Link to="/how-it-works" className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`}>How It Works</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About Us</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </nav>
          
          <div className="header-cta">
            <Link to="/contact" className="btn btn-accent">Book Free Audit</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
