import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPricingPlans, getFAQs } from '../lib/dataService';
import './Pricing.css';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  useEffect(() => {
    async function loadData() {
      const [plansData, faqsData] = await Promise.all([
        getPricingPlans(),
        getFAQs()
      ]);
      setPlans(plansData);
      setFaqs(faqsData);
      setLoading(false);
    }
    loadData();
  }, []);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Get all unique feature names for the table
  const allFeatures = [...new Set(
    plans.flatMap(plan => 
      plan.plan_features?.map(f => f.feature_name) || []
    )
  )];

  return (
    <div className="pricing-page">
      {/* Hero Section */}
      <section className="pricing-hero">
        <div className="container">
          <span className="section-label">Pricing</span>
          <h1>Plans & Pricing</h1>
          <p>Transparent pricing tailored to your property needs. No hidden fees, ever.</p>
        </div>
      </section>
      
      {/* Billing Toggle */}
      <section className="section pricing-toggle-section">
        <div className="container">
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
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section pricing-cards-section">
        <div className="container">
          <div className="pricing-cards-grid">
            {plans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.is_popular ? 'pricing-card-popular' : ''}`}
              >
                {plan.is_popular && <div className="popular-badge">Most Popular</div>}
                <div className="pricing-card-header">
                  <h3>{plan.name}</h3>
                  <p className="pricing-target">{plan.target_audience}</p>
                </div>
                <div className="pricing-price">
                  <span className="price-amount">
                    ₹{billingPeriod === 'monthly' 
                      ? plan.price_monthly?.toLocaleString() 
                      : Math.round(plan.price_monthly * 0.85)?.toLocaleString()}
                  </span>
                  <span className="price-period">/month</span>
                </div>
                <ul className="pricing-features">
                  {plan.plan_features?.map((feature, i) => (
                    <li key={i}>
                      <span className={feature.is_included ? 'check' : 'cross'}>
                        {feature.is_included ? '✓' : '✗'}
                      </span>
                      {feature.feature_name}
                    </li>
                  ))}
                </ul>
                <Link 
                  to="/contact" 
                  className={`btn ${plan.is_popular ? 'btn-primary' : 'btn-outline'} full-width`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
          
          <p className="pricing-note">
            * Pricing subject to property audit. Final quote shared after assessment.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section section-bg-alt">
        <div className="container">
          <div className="section-header">
            <h2>Compare Plans</h2>
            <p>See what's included in each plan</p>
          </div>
          
          <div className="pricing-table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th className="feature-header">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id} className={plan.is_popular ? 'popular-column' : ''}>
                      {plan.name}
                      <br />
                      <span className="plan-price">₹{plan.price_monthly?.toLocaleString()}/mo</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="feature-row">Who it's for</td>
                  {plans.map(plan => (
                    <td key={plan.id} className={plan.is_popular ? 'popular-column' : ''}>
                      {plan.target_audience}
                    </td>
                  ))}
                </tr>
                {allFeatures.map(featureName => (
                  <tr key={featureName}>
                    <td className="feature-row">{featureName}</td>
                    {plans.map(plan => {
                      const feature = plan.plan_features?.find(f => f.feature_name === featureName);
                      return (
                        <td key={plan.id} className={plan.is_popular ? 'popular-column' : ''}>
                          {feature?.is_included ? (
                            <span className="check">✓</span>
                          ) : (
                            <span className="cross">✗</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <td className="feature-row"></td>
                  {plans.map(plan => (
                    <td key={plan.id} className={plan.is_popular ? 'popular-column' : ''}>
                      <Link 
                        to="/contact" 
                        className={`btn ${plan.is_popular ? 'btn-primary' : 'btn-outline'} btn-sm`}
                      >
                        Select Plan
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          
          <div className="faq-section">
            {faqs.map(faq => (
              <div 
                key={faq.id} 
                className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}
              >
                <button 
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={activeFaq === faq.id}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">{activeFaq === faq.id ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="section section-cta">
        <div className="container text-center">
          <h2>Still have questions?</h2>
          <p>Our team is here to help you choose the right plan for your property.</p>
          <Link to="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
