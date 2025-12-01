import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../lib/dataService';
import './Services.css';

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
      <section className="section section-bg-light">
        <div className="container text-center">
          <h1>Our Services</h1>
          <p className="section-subtitle">We offer end-to-end property management solutions designed specifically for the needs of Non-Resident Indians.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {services.map((service, index) => (
            <div key={service.id} className={`service-block ${index % 2 === 1 ? 'reverse' : ''}`}>
              <div className="service-content">
                <h2 className="text-primary">{service.name}</h2>
                <p className="service-description">{service.full_description}</p>
                <ul className="service-features">
                  {service.service_features?.map((feature, i) => (
                    <li key={i}>{feature.feature_text}</li>
                  ))}
                </ul>
              </div>
              <div className="image-placeholder">
                <span>Image: {service.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section section-bg-light text-center">
        <div className="container">
          <h2>Ready to get started?</h2>
          <p className="cta-text">Book a free consultation to discuss your property needs.</p>
          <Link to="/contact" className="btn btn-primary">Contact Us Today</Link>
        </div>
      </section>
    </div>
  );
}
