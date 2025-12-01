import { useEffect, useState } from 'react';
import { getCities, submitContactInquiry, cityNameToSlug } from '../lib/dataService';
import './Contact.css';

export default function Contact() {
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    type: 'apartment',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    async function loadCities() {
      const data = await getCities();
      setCities(data);
    }
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    const result = await submitContactInquiry(formData);
    
    setSubmitResult(result);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: '',
        type: 'apartment',
        message: ''
      });
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Book your free property audit today.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <div className="contact-form-card">
              <h2>Send us a message</h2>
              <p className="form-intro">Fill out the form below and we'll get back to you within 24 hours.</p>
              
              {submitResult && (
                <div className={`alert ${submitResult.success ? 'alert-success' : 'alert-error'}`}>
                  {submitResult.message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    className="form-input" 
                    required 
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email"
                      className="form-input" 
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">WhatsApp Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      className="form-input" 
                      required 
                      placeholder="+1 123 456 7890"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">Property City</label>
                    <select 
                      id="city" 
                      name="city"
                      className="form-select"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city.id} value={cityNameToSlug(city.name)}>
                          {city.name}
                        </option>
                      ))}
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="type" className="form-label">Property Type</label>
                    <select 
                      id="type" 
                      name="type"
                      className="form-select"
                      value={formData.type}
                      onChange={handleChange}
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="commercial">Commercial</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message (Optional)</label>
                  <textarea 
                    id="message" 
                    name="message"
                    className="form-textarea" 
                    rows="4"
                    placeholder="Tell us about your requirements..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary full-width"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
                <p className="form-note">
                  Your data is safe with us. We usually respond within 24 hours.
                </p>
              </form>
            </div>

            {/* Contact Info */}
            <div className="contact-info">
              <div className="contact-section">
                <h3 className="text-primary">Quick Contact</h3>
                <p>Prefer to talk directly?</p>
                <div className="contact-buttons">
                  <a href="https://wa.me/919876543210" className="btn btn-whatsapp">
                    💬 Chat on WhatsApp
                  </a>
                  <a href="tel:+919876543210" className="btn btn-outline">
                    📞 Call Us: +91 98765 43210
                  </a>
                </div>
              </div>

              <div className="contact-section">
                <h3 className="text-primary">Our Offices</h3>
                <p><strong>Mumbai (HQ):</strong><br />123, Business Bay, Lower Parel, Mumbai - 400013</p>
                <br />
                <p><strong>Bangalore:</strong><br />45, Tech Park Road, Indiranagar, Bangalore - 560038</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
