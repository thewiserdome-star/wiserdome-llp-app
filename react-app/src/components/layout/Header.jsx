import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  
  // Handle scroll effect for header shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest('.header')) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close menu when clicking a nav link
  const handleNavClick = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  
  return (
    <header className={`header ${isScrolled ? 'header-scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo" onClick={handleNavClick}>
            <img 
              src="https://saraekadant.blob.core.windows.net/mediawiserdome/Wiserdome%20Logo.jpg" 
              alt="Wiserdome Logo" 
              className="logo-image"
            />
          </Link>
          
          {/* Mobile menu button */}
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
          
          {/* Navigation */}
          <nav className={`nav-menu ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={handleNavClick}>Home</Link>
            <Link to="/services" className={`nav-link ${isActive('/services') ? 'active' : ''}`} onClick={handleNavClick}>Services</Link>
            <Link to="/developer-websites" className={`nav-link ${isActive('/developer-websites') ? 'active' : ''}`} onClick={handleNavClick}>Website Development</Link>
            <Link to="/pricing" className={`nav-link ${isActive('/pricing') ? 'active' : ''}`} onClick={handleNavClick}>Pricing</Link>
            <Link to="/how-it-works" className={`nav-link ${isActive('/how-it-works') ? 'active' : ''}`} onClick={handleNavClick}>How It Works</Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={handleNavClick}>About</Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={handleNavClick}>Contact</Link>
            
            {/* Mobile CTA button inside menu */}
            <Link to="/contact" className="btn btn-accent nav-cta-mobile" onClick={handleNavClick}>Book Free Audit</Link>
          </nav>
          
          {/* Desktop CTA */}
          <div className="header-cta">
            <Link to="/contact" className="btn btn-accent">Book Free Audit</Link>
          </div>
        </div>
      </div>
    </header>
  );
}
