import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { submitOwnerSignup, getCities } from '../lib/dataService';
import './OwnerSignup.css';

export default function OwnerSignup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'India'
  });
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadCities() {
      const citiesData = await getCities();
      setCities(citiesData);
    }
    loadCities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await submitOwnerSignup(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="owner-signup-page">
        <div className="signup-container">
          <div className="signup-card success-card">
            <div className="success-icon">✓</div>
            <h1>Registration Successful!</h1>
            <p>Thank you for registering with Wiserdome.</p>
            <p>Your signup request has been submitted and is pending approval by our admin team.</p>
            <p><strong>What happens next?</strong></p>
            <p>Once approved, you will receive an email with a link to set your password and activate your account.</p>
            <div className="success-actions">
              <Link to="/" className="btn btn-primary">Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="owner-signup-page">
      <div className="signup-container">
        <div className="signup-card">
          <h1>Property Owner Signup</h1>
          <p className="signup-subtitle">
            Register to manage your properties with Wiserdome
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="form-input"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+91 9876543210"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Address</label>
              <textarea
                id="address"
                name="address"
                className="form-textarea"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your current address"
                rows={3}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city" className="form-label">City *</label>
                <select
                  id="city"
                  name="city"
                  className="form-select"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a city</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="country" className="form-label">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  className="form-input"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="India"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          <p className="login-link">
            Already registered? <Link to="/owner/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
