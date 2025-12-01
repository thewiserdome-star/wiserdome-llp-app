import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPricingPlans, getFAQs } from '../lib/dataService';
import './Pricing.css';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <section className="section section-bg-light">
        <div className="container text-center">
          <h1>Plans & Pricing</h1>
          <p>Transparent pricing tailored to your property needs.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="pricing-table-wrapper">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th className="feature-header">Feature</th>
                  {plans.map(plan => (
                    <th key={plan.id}>
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
                    <td key={plan.id}>{plan.target_audience}</td>
                  ))}
                </tr>
                {allFeatures.map(featureName => (
                  <tr key={featureName}>
                    <td className="feature-row">{featureName}</td>
                    {plans.map(plan => {
                      const feature = plan.plan_features?.find(f => f.feature_name === featureName);
                      return (
                        <td key={plan.id}>
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
                    <td key={plan.id}>
                      <Link 
                        to="/contact" 
                        className={`btn ${plan.is_popular ? 'btn-primary' : 'btn-outline'} btn-sm`}
                      >
                        Select
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="faq-section">
            <h2 className="text-center section-title">Frequently Asked Questions</h2>
            
            {faqs.map(faq => (
              <div 
                key={faq.id} 
                className={`faq-item ${activeFaq === faq.id ? 'active' : ''}`}
              >
                <div 
                  className="faq-question"
                  onClick={() => toggleFaq(faq.id)}
                >
                  {faq.question}
                  <span className="faq-toggle">{activeFaq === faq.id ? '-' : '+'}</span>
                </div>
                <div className="faq-answer">{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
