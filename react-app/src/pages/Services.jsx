import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../lib/dataService';
import './Services.css';

// Service icons mapping - defined outside component to prevent recreation on render
const SERVICE_ICONS = ['🏠', '🔧', '👥', '📋', '🎨', '💼'];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      const data = await getServices();
      setServices(data);
      setLoading(false);
    }
    loadServices();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <span className="section-label">What We Do</span>
          <h1>Our Services</h1>
          <p>End-to-end property management solutions designed specifically for the needs of Non-Resident Indians and busy professionals.</p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={service.id} className="service-card">
                <div className="service-card-icon">
                  {SERVICE_ICONS[index % SERVICE_ICONS.length]}
                </div>
                <h3>{service.name}</h3>
                <p className="service-description">{service.full_description}</p>
                {service.service_features && service.service_features.length > 0 && (
                  <ul className="service-features">
                    {service.service_features.slice(0, 4).map((feature, i) => (
                      <li key={i}>
                        <span className="feature-check">✓</span>
                        {feature.feature_text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work Section */}
      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Approach</span>
            <h2>How We Deliver Excellence</h2>
          </div>
          
          <div className="approach-grid">
            <div className="approach-card">
              <div className="approach-number">01</div>
              <h3>Local Expertise</h3>
              <p>On-ground teams in major Indian cities who understand local laws, market rates, and vendor networks.</p>
            </div>
            <div className="approach-card">
              <div className="approach-number">02</div>
              <h3>Technology First</h3>
              <p>Digital reports, online payments, and real-time updates—manage your property from anywhere.</p>
            </div>
            <div className="approach-card">
              <div className="approach-number">03</div>
              <h3>Transparent Pricing</h3>
              <p>No hidden fees. Every expense is documented and shared with you for complete transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section services-cta-section">
        <div className="container">
          <div className="services-cta-card">
            <h2>Ready to get started?</h2>
            <p>Book a free consultation to discuss your property needs and get a customized management plan.</p>
            <div className="services-cta-buttons">
              <Link to="/contact" className="btn btn-accent btn-lg">Book Free Audit</Link>
              <Link to="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
