import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Home.css';

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  
  return (
    <div className="home-page">
      {/* Hero Section - Two Column Layout */}
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column - Content */}
            <div className="hero-content">
              <h1>Your Home in India,<br /><span className="text-accent">Professionally Managed</span></h1>
              <p className="hero-subtitle">
                Complete peace of mind for NRIs and busy professionals. We manage your property, tenants, and maintenance while you focus on your life abroad.
              </p>
              
              <div className="hero-buttons">
                <Link to="/contact" className="btn btn-accent btn-lg">
                  Book Free Property Audit
                </Link>
                <Link to="/contact" className="btn btn-outline-white btn-lg">
                  Schedule a Callback
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="hero-trust-badges">
                <div className="trust-badge">
                  <span className="trust-badge-icon">🌍</span>
                  <span>For NRIs in USA/UK</span>
                </div>
                <div className="trust-badge">
                  <span className="trust-badge-icon">🏠</span>
                  <span>End-to-end Rental & Maintenance</span>
                </div>
                <div className="trust-badge">
                  <span className="trust-badge-icon">📍</span>
                  <span>On-ground Team in Major Cities</span>
                </div>
              </div>
            </div>
            
            {/* Right Column - Hero Image Placeholder */}
            <div className="hero-image">
              <div className="hero-image-placeholder">
                <div className="placeholder-content">
                  <span className="placeholder-icon">🏡</span>
                  <span className="placeholder-text">Hero Image</span>
                  <span className="placeholder-subtext">NRI Property Care Illustration</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Section - 3 Card Grid */}
      <section className="section section-audience">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Who We Serve</span>
            <h2>Trusted by NRIs Worldwide</h2>
            <p>We specialize in serving Non-Resident Indians and working professionals who need a reliable partner to care for their residential or commercial assets in India.</p>
          </div>
          
          <div className="audience-grid">
            <div className="audience-card">
              <div className="audience-icon">
                <span>🌏</span>
              </div>
              <h3>NRIs in USA & UK</h3>
              <p>Manage your Indian property remotely with complete transparency, legal compliance, and 24/7 support across time zones.</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">
                <span>📈</span>
              </div>
              <h3>Property Investors</h3>
              <p>Maximize rental yields and maintain asset value without the daily hassle of tenant management and repairs.</p>
            </div>
            <div className="audience-card">
              <div className="audience-icon">
                <span>💼</span>
              </div>
              <h3>Busy Professionals</h3>
              <p>Focus on your career while we handle tenant calls, repairs, documentation, and everything in between.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Feature Grid */}
      <section className="section section-bg-alt section-features">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Expertise</span>
            <h2>Why Choose Wiserdome?</h2>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-card-icon">🏠</div>
              <h3>End-to-End Rental Management</h3>
              <p>From tenant sourcing to rent collection, we handle the complete rental lifecycle for you.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🔧</div>
              <h3>Routine Maintenance & Repairs</h3>
              <p>Regular inspections and prompt repairs to keep your property in top condition.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📋</div>
              <h3>Legal & Documentation Support</h3>
              <p>Rental agreements, police verification, and compliance handled professionally.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">📸</div>
              <h3>Photo/Video Property Checkups</h3>
              <p>Regular visual documentation so you can see your property from anywhere.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">👤</div>
              <h3>Dedicated Relationship Manager</h3>
              <p>One point of contact for all your queries and concerns.</p>
            </div>
            <div className="feature-card">
              <div className="feature-card-icon">🏗️</div>
              <h3>Resale & Renovation Assistance</h3>
              <p>Planning to sell or renovate? We guide you through the entire process.</p>
            </div>
          </div>
          
          {/* Feature image placeholder */}
          <div className="feature-image-section">
            <div className="feature-image-placeholder">
              <span>Image: Property Manager Inspection</span>
            </div>
          </div>
        </div>
      </section>

      {/* Control Section - 3 Column Cards */}
      <section className="section section-control">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Transparency</span>
            <h2>You're Always in Control</h2>
            <p>Stay informed about your property with real-time updates and comprehensive reports.</p>
          </div>
          
          <div className="control-grid">
            <div className="control-card">
              <div className="control-icon">📱</div>
              <h3>Digital Reports</h3>
              <p>Receive detailed monthly home health reports with photos and checklists directly to your inbox.</p>
              <span className="control-badge">Monthly Updates</span>
            </div>
            <div className="control-card">
              <div className="control-icon">💬</div>
              <h3>Instant Updates</h3>
              <p>Direct communication via WhatsApp or Email with your dedicated property manager anytime.</p>
              <span className="control-badge">24/7 Access</span>
            </div>
            <div className="control-card">
              <div className="control-icon">📹</div>
              <h3>Video Walkthroughs</h3>
              <p>Schedule live video calls to inspect your property from anywhere in the world.</p>
              <span className="control-badge">On Demand</span>
            </div>
          </div>
          
          <p className="control-privacy-note">
            🔒 Your data is secure. We follow strict data privacy protocols and never share your information with third parties.
          </p>
        </div>
      </section>

      {/* Pricing Section - 3 Column with Toggle */}
      <section className="section section-bg-light section-pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Pricing</span>
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose a plan that fits your needs. No hidden fees.</p>
          </div>
          
          {/* Billing Toggle */}
          <div className="pricing-toggle">
            <span className={billingPeriod === 'monthly' ? 'active' : ''}>Monthly</span>
            <button 
              className={`toggle-switch ${billingPeriod === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
              aria-label="Toggle billing period"
            >
              <span className="toggle-knob"></span>
            </button>
            <span className={billingPeriod === 'annual' ? 'active' : ''}>
              Annual <span className="save-badge">Save 15%</span>
            </span>
          </div>
          
          <div className="pricing-grid">
            {/* Basic Plan */}
            <div className="pricing-card">
              <div className="pricing-card-header">
                <h3>Basic</h3>
                <p className="pricing-target">For vacant properties</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">
                  ₹{billingPeriod === 'monthly' ? '1,999' : '1,699'}
                </span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Monthly Inspections</li>
                <li><span className="check">✓</span> Bill Payments</li>
                <li><span className="check">✓</span> Key Management</li>
                <li><span className="check">✓</span> Basic Security Checks</li>
              </ul>
              <Link to="/pricing" className="btn btn-outline full-width">View Details</Link>
            </div>
            
            {/* Standard Plan - Popular */}
            <div className="pricing-card pricing-card-popular">
              <div className="popular-badge">Most Popular</div>
              <div className="pricing-card-header">
                <h3>Standard</h3>
                <p className="pricing-target">For rented properties</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">
                  ₹{billingPeriod === 'monthly' ? '3,499' : '2,999'}
                </span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Everything in Basic</li>
                <li><span className="check">✓</span> Tenant Management</li>
                <li><span className="check">✓</span> Rent Collection</li>
                <li><span className="check">✓</span> Minor Repairs Included</li>
                <li><span className="check">✓</span> Legal Documentation</li>
              </ul>
              <Link to="/pricing" className="btn btn-primary full-width">View Details</Link>
            </div>
            
            {/* Premium Plan */}
            <div className="pricing-card">
              <div className="pricing-card-header">
                <h3>Premium</h3>
                <p className="pricing-target">Complete peace of mind</p>
              </div>
              <div className="pricing-price">
                <span className="price-amount">
                  ₹{billingPeriod === 'monthly' ? '5,999' : '5,099'}
                </span>
                <span className="price-period">/month</span>
              </div>
              <ul className="pricing-features">
                <li><span className="check">✓</span> Everything in Standard</li>
                <li><span className="check">✓</span> Legal Support</li>
                <li><span className="check">✓</span> Deep Cleaning (Quarterly)</li>
                <li><span className="check">✓</span> Priority Support</li>
                <li><span className="check">✓</span> Video Walkthroughs</li>
              </ul>
              <Link to="/pricing" className="btn btn-outline full-width">View Details</Link>
            </div>
          </div>
          
          <p className="pricing-note">
            * Pricing subject to property audit. Final quote shared after assessment.
          </p>
        </div>
      </section>

      {/* Special Offer */}
      <section className="section section-offer">
        <div className="container">
          <div className="offer-card">
            <div className="offer-content">
              <div className="offer-badge">🎉 Limited Time Offer</div>
              <h2>Special Offer for First-Time NRIs</h2>
              <ul className="offer-list">
                <li>
                  <span className="offer-icon">🎁</span>
                  <strong>First Month Free</strong> on annual plans
                </li>
                <li>
                  <span className="offer-icon">📋</span>
                  <strong>Free Property Audit</strong> & Rental Estimation
                </li>
                <li>
                  <span className="offer-icon">🏷️</span>
                  <strong>10% Discount</strong> for multiple properties
                </li>
              </ul>
              <Link to="/contact" className="btn btn-accent btn-lg">Claim Offer Now</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="section section-bg-alt section-how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Process</span>
            <h2>How It Works</h2>
            <p>Get started in 3 simple steps</p>
          </div>
          
          <div className="steps-timeline">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <div className="step-icon">📝</div>
                <h3>Enquire</h3>
                <p>Fill out our simple form to schedule a consultation call with our property experts.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <div className="step-icon">🔍</div>
                <h3>Audit</h3>
                <p>Our team visits and inspects your property, providing a detailed home health report.</p>
              </div>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <div className="step-icon">✨</div>
                <h3>Relax</h3>
                <p>Sit back while we handle everything. Receive monthly reports and updates.</p>
              </div>
            </div>
          </div>
          
          <div className="steps-cta">
            <Link to="/contact" className="btn btn-accent btn-lg">Get Started Today</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
