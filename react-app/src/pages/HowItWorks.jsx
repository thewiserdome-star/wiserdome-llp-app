import { Link } from 'react-router-dom';
import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      icon: '📝',
      title: 'Share Your Details',
      description: "Fill out our simple online form with your property details and upload basic documents. We'll schedule an initial consultation call within 24 hours."
    },
    {
      step: 2,
      icon: '🔍',
      title: 'On-Ground Property Audit',
      description: "Our expert team visits your property for a comprehensive inspection. We generate a digital 'Home Health Report' highlighting any immediate needs and recommendations."
    },
    {
      step: 3,
      icon: '📋',
      title: 'Easy Onboarding',
      description: 'Sign the management agreement digitally from anywhere in the world. If you need a tenant, we start the search immediately using our verified network.'
    },
    {
      step: 4,
      icon: '✨',
      title: 'Relax & Monitor',
      description: 'Sit back while we handle everything. Receive monthly reports, rent credits, and schedule video walkthroughs anytime you want to check on your property.'
    }
  ];

  return (
    <div className="how-it-works-page">
      {/* Hero Section */}
      <section className="hiw-hero">
        <div className="container">
          <span className="section-label">Process</span>
          <h1>How It Works</h1>
          <p>A simple 4-step process to complete peace of mind. Get started in minutes, not days.</p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section timeline-section">
        <div className="container">
          <div className="timeline-grid">
            {steps.map((item) => (
              <div key={item.step} className="timeline-card">
                <div className="timeline-step-number">{item.step}</div>
                <div className="timeline-card-content">
                  <div className="timeline-icon">{item.icon}</div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Visual Timeline Connector - Desktop Only */}
          <div className="timeline-connector-wrapper">
            <div className="timeline-connector-line"></div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>What Makes Us Different</h2>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Quick Onboarding</h3>
              <p>Get started within 48 hours of your first inquiry. No lengthy paperwork or delays.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">👁️</div>
              <h3>Full Transparency</h3>
              <p>Real-time updates, documented transactions, and monthly reports you can trust.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Dedicated Support</h3>
              <p>Your personal relationship manager is just a WhatsApp message away, 24/7.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section hiw-cta-section">
        <div className="container">
          <div className="hiw-cta-card">
            <div className="hiw-cta-content">
              <h2>Ready to Get Started?</h2>
              <p>Book your free property audit today and take the first step towards hassle-free property management.</p>
              <div className="hiw-cta-buttons">
                <Link to="/contact" className="btn btn-accent btn-lg">
                  Book Free Audit
                </Link>
                <Link to="/pricing" className="btn btn-outline btn-lg">
                  View Pricing
                </Link>
              </div>
            </div>
            <div className="hiw-cta-features">
              <div className="cta-feature">
                <span className="cta-feature-icon">✓</span>
                <span>No commitment required</span>
              </div>
              <div className="cta-feature">
                <span className="cta-feature-icon">✓</span>
                <span>Free property assessment</span>
              </div>
              <div className="cta-feature">
                <span className="cta-feature-icon">✓</span>
                <span>Response within 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
