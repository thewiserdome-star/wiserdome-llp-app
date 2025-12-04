import './About.css';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <span className="section-label">About Us</span>
          <h1>About Wiserdome</h1>
          <p>Protecting your legacy, preserving your peace of mind.</p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-content">
              <span className="section-label">Our Mission</span>
              <h2>Bridging the Gap Between NRIs and Their Homes</h2>
              <p className="mb-md">Wiserdome was founded with a single purpose: to bridge the gap between NRIs and their homes in India. We understand the anxiety of managing a valuable asset from thousands of miles away—the sleepless nights worrying about tenants, maintenance issues, or legal complications.</p>
              <p>Our mission is to bring professional, corporate-grade property management to the Indian residential sector, ensuring transparency, legal safety, and asset appreciation for our global clients.</p>
            </div>
            <div className="about-image-container">
              <img
                src="https://saraekadant.blob.core.windows.net/mediawiserdome/wiserdome_about_page_team_image.png"
                alt="Wiserdome Team Meeting"
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎯</div>
              <h3>Transparency</h3>
              <p>Every transaction, repair, and decision is documented and shared with you. No hidden costs, no surprises.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">⚡</div>
              <h3>Responsiveness</h3>
              <p>We respond within 24 hours. Your concerns are our priority, regardless of time zones.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🛡️</div>
              <h3>Asset Protection</h3>
              <p>We treat your property like our own, ensuring it remains safe and appreciates in value over time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Trust</span>
            <h2>Why NRIs Trust Us</h2>
          </div>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">🛡️</div>
              <h3>Asset Protection</h3>
              <p>We treat your property like our own, ensuring it remains safe from encroachment and damage. Regular inspections and proactive maintenance keep your investment secure.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">👁️</div>
              <h3>Total Transparency</h3>
              <p>No hidden costs. Every repair, bill, and transaction is documented and shared with detailed reports. You always know exactly where your money goes.</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">🤝</div>
              <h3>Local Expertise</h3>
              <p>Our ground teams know the local laws, vendors, and market rates inside out. We leverage our network to get you the best services at fair prices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section section-bg-primary">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Properties Managed</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10+</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Client Satisfaction</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section about-cta-section">
        <div className="container text-center">
          <h2>Ready to Experience the Wiserdome Difference?</h2>
          <p>Join hundreds of NRIs who trust us with their most valuable asset.</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Get Started Today</Link>
        </div>
      </section>
    </div>
  );
}
