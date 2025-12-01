import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Your Home in India, Our Responsibility</h1>
          <p>Complete peace of mind for NRIs. We manage your property, tenants, and maintenance while you focus on your life abroad.</p>
          <div className="hero-buttons">
            <Link to="/contact" className="btn btn-accent btn-lg">Book Free Property Audit</Link>
            <Link to="/contact" className="btn btn-outline-white">Schedule a Callback</Link>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by NRIs Worldwide</h2>
            <p>We specialize in serving Non-Resident Indians and working professionals who need a reliable partner to care for their residential or commercial assets in India.</p>
          </div>
          
          <div className="grid-3">
            <div className="card text-center">
              <div className="feature-icon">🌏</div>
              <h3>NRIs in USA & UK</h3>
              <p>Manage your Indian property remotely with complete transparency and legal compliance.</p>
            </div>
            <div className="card text-center">
              <div className="feature-icon">🏙️</div>
              <h3>Property Investors</h3>
              <p>Maximize rental yields and maintain asset value without the daily hassle of management.</p>
            </div>
            <div className="card text-center">
              <div className="feature-icon">💼</div>
              <h3>Busy Professionals</h3>
              <p>Focus on your career while we handle tenant calls, repairs, and documentation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section section-bg-light">
        <div className="container">
          <h2 className="text-center section-title">Why Choose Wiserdome?</h2>
          <div className="grid-2">
            <div className="features-list">
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>End-to-End Rental Management</strong>
              </div>
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>Routine Maintenance & Repairs</strong>
              </div>
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>Legal & Documentation Support</strong>
              </div>
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>Photo/Video Checkups</strong>
              </div>
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>Dedicated Relationship Manager</strong>
              </div>
              <div className="feature-item">
                <span className="check">✓</span>
                <strong>Resale & Renovation Assistance</strong>
              </div>
            </div>
            <div className="image-placeholder">
              <span>Image: Property Manager Inspection</span>
            </div>
          </div>
        </div>
      </section>

      {/* How You Stay in Control */}
      <section className="section">
        <div className="container">
          <h2 className="text-center section-title">You're Always in Control</h2>
          <div className="grid-3">
            <div className="text-center">
              <div className="feature-icon">📱</div>
              <h3>Digital Reports</h3>
              <p>Receive detailed monthly home health reports with photos and checklists directly to your inbox.</p>
            </div>
            <div className="text-center">
              <div className="feature-icon">💬</div>
              <h3>Instant Updates</h3>
              <p>Direct communication via WhatsApp or Email with your dedicated property manager.</p>
            </div>
            <div className="text-center">
              <div className="feature-icon">📹</div>
              <h3>Video Walkthroughs</h3>
              <p>Schedule live video calls to inspect your property from anywhere in the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="section section-bg-light">
        <div className="container">
          <h2 className="text-center">Simple, Transparent Pricing</h2>
          <p className="text-center section-subtitle">Choose a plan that fits your needs. No hidden fees.</p>
          
          <div className="grid-3 pricing-grid">
            <div className="pricing-preview">
              <h3>Basic</h3>
              <p>For vacant properties</p>
              <div className="pricing-price">₹ 1,999<span>/mo</span></div>
              <ul>
                <li>✓ Monthly Inspections</li>
                <li>✓ Bill Payments</li>
                <li>✓ Key Management</li>
              </ul>
              <Link to="/pricing" className="btn btn-outline full-width">View Details</Link>
            </div>
            
            <div className="pricing-preview popular">
              <div className="popular-badge">Most Popular</div>
              <h3>Standard</h3>
              <p>For rented properties</p>
              <div className="pricing-price">₹ 3,499<span>/mo</span></div>
              <ul>
                <li>✓ Everything in Basic</li>
                <li>✓ Tenant Management</li>
                <li>✓ Rent Collection</li>
                <li>✓ Minor Repairs</li>
              </ul>
              <Link to="/pricing" className="btn btn-primary full-width">View Details</Link>
            </div>
            
            <div className="pricing-preview">
              <h3>Premium</h3>
              <p>Complete peace of mind</p>
              <div className="pricing-price">₹ 5,999<span>/mo</span></div>
              <ul>
                <li>✓ Everything in Standard</li>
                <li>✓ Legal Support</li>
                <li>✓ Deep Cleaning</li>
                <li>✓ Priority Support</li>
              </ul>
              <Link to="/pricing" className="btn btn-outline full-width">View Details</Link>
            </div>
          </div>
          <p className="text-center pricing-note">* Exact pricing shared after free property audit.</p>
        </div>
      </section>

      {/* Special Offer */}
      <section className="section special-offer">
        <div className="container">
          <div className="offer-content">
            <div className="offer-text">
              <h2>Special Offer for First-Time NRIs</h2>
              <ul>
                <li>🎁 <strong>First Month Free</strong> on annual plans</li>
                <li>📋 <strong>Free Property Audit</strong> & Rental Estimation</li>
                <li>🏷️ <strong>10% Discount</strong> for multiple properties</li>
              </ul>
              <Link to="/contact" className="btn btn-accent">Claim Offer Now</Link>
            </div>
            <div className="offer-icon">🎉</div>
          </div>
        </div>
      </section>

      {/* How It Works Strip */}
      <section className="section">
        <div className="container">
          <h2 className="text-center section-title">How It Works</h2>
          <div className="step-strip">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Enquire</h3>
              <p>Fill our form to schedule a call.</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Audit</h3>
              <p>We visit and inspect your property.</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Manage</h3>
              <p>Relax while we handle everything.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
