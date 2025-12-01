import { Link } from 'react-router-dom';
import './HowItWorks.css';

export default function HowItWorks() {
  const steps = [
    {
      step: 1,
      title: 'Share Details',
      description: "Fill out our simple online form with your property details and upload basic documents. We'll schedule an initial consultation call."
    },
    {
      step: 2,
      title: 'On-Ground Audit',
      description: "Our team visits your property for a comprehensive inspection. We generate a digital 'Home Health Report' highlighting any immediate needs."
    },
    {
      step: 3,
      title: 'Onboarding',
      description: 'Sign the management agreement digitally. If you need a tenant, we start the search immediately using our verified network.'
    },
    {
      step: 4,
      title: 'Relax & Monitor',
      description: 'Sit back while we handle everything. You get monthly reports, rent credits, and can schedule video walkthroughs anytime.'
    }
  ];

  return (
    <div className="how-it-works-page">
      <section className="section section-bg-light text-center">
        <div className="container">
          <h1>How It Works</h1>
          <p>A simple 4-step process to complete peace of mind.</p>
        </div>
      </section>

      <section className="section timeline-section">
        <div className="container">
          <div className="timeline">
            {steps.map((item, index) => (
              <div 
                key={item.step} 
                className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}
              >
                <div className="timeline-content">
                  <h3 className="text-primary">Step {item.step}: {item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section text-center">
        <div className="container">
          <h2>Ready to start?</h2>
          <Link to="/contact" className="btn btn-accent btn-lg cta-button">
            Get Your Free Audit
          </Link>
        </div>
      </section>
    </div>
  );
}
