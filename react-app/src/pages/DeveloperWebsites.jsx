import { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitDeveloperWebsiteInquiry } from '../lib/dataService';
import './DeveloperWebsites.css';

// Static data for developer website packages
const PACKAGES = [
  {
    id: 'starter',
    name: 'Starter Project Site',
    tagline: 'Perfect for single project launches',
    priceLabel: 'One-time from',
    price: '₹49,999',
    priceNote: '+ ₹2,999/mo hosting',
    idealFor: 'New property launches, individual project microsites, and builders testing digital marketing.',
    features: [
      'Single project landing page',
      'Project overview & highlights',
      'Interactive location map',
      'Image gallery with lightbox',
      'Lead capture form with email alerts',
      'Basic analytics dashboard',
      'Mobile-responsive design',
      'SSL security certificate'
    ],
    isPopular: false
  },
  {
    id: 'growth',
    name: 'Growth Multi-Project Site',
    tagline: 'Scale your digital presence',
    priceLabel: 'One-time from',
    price: '₹1,49,999',
    priceNote: '+ ₹5,999/mo hosting',
    idealFor: 'Growing developers with multiple ongoing projects who need a centralized digital hub.',
    features: [
      'Multi-project pages (up to 10)',
      'Property listing grid with filters',
      'Blog/news section for updates',
      'Advanced SEO setup & optimization',
      'CRM/lead integration hooks',
      'Virtual tour embedding',
      'Social media integration',
      'Priority email support'
    ],
    isPopular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise Developer Suite',
    tagline: 'Complete digital transformation',
    priceLabel: 'Custom pricing from',
    price: '₹3,99,999',
    priceNote: '+ custom hosting SLA',
    idealFor: 'Large developers and builders with multi-city portfolios requiring enterprise-grade solutions.',
    features: [
      'Custom design system & branding',
      'Unlimited project pages',
      'Multi-city portfolio management',
      'CRM & marketing tool integrations',
      'Dedicated account manager',
      'SLA-backed hosting (99.9% uptime)',
      '24/7 priority support',
      'Advanced analytics & reporting'
    ],
    isPopular: false
  }
];

const PROCESS_STEPS = [
  {
    number: 1,
    icon: '📞',
    title: 'Discovery Call & Requirements',
    description: 'We understand your projects, brand vision, and marketing goals to create a tailored solution.'
  },
  {
    number: 2,
    icon: '🎨',
    title: 'Design & Content Setup',
    description: 'Our team designs your website and helps organize your project content for maximum impact.'
  },
  {
    number: 3,
    icon: '🚀',
    title: 'Development, Testing & Launch',
    description: 'We build, rigorously test, and launch your website with full SEO optimization.'
  },
  {
    number: 4,
    icon: '📊',
    title: 'Ongoing Hosting & Optimization',
    description: 'Continuous monitoring, updates, and performance optimization to maximize lead generation.'
  }
];

const BENEFITS = [
  {
    icon: '⚡',
    title: 'Faster Project Launches',
    description: 'Get your project website live in days, not weeks. Quick turnaround for time-sensitive launches.'
  },
  {
    icon: '📱',
    title: 'Mobile-First Experience',
    description: 'Over 70% of property searches happen on mobile. Our sites are optimized for every device.'
  },
  {
    icon: '🎯',
    title: 'Better Lead Capture',
    description: 'Strategically placed forms and CTAs designed to convert visitors into qualified leads.'
  },
  {
    icon: '🔍',
    title: 'SEO-Ready Structure',
    description: 'Built with search engines in mind to help your projects rank higher in local searches.'
  }
];

const FAQS = [
  {
    id: 1,
    question: 'How long does it take to build a project website?',
    answer: 'For Starter sites, we typically deliver within 7-10 business days after receiving all content. Growth sites take 2-3 weeks, and Enterprise solutions are scoped based on requirements, usually 4-8 weeks.'
  },
  {
    id: 2,
    question: 'What technology stack do you use?',
    answer: 'We use modern, fast-loading technologies including React, Next.js, and optimized CMS solutions. All sites are built with performance, security, and SEO best practices in mind.'
  },
  {
    id: 3,
    question: 'Do I own the website content and design?',
    answer: 'Yes, absolutely. You retain full ownership of all content, images, and custom designs created for your website. We provide full handover documentation upon request.'
  },
  {
    id: 4,
    question: 'Can I update content myself?',
    answer: 'Growth and Enterprise plans include an easy-to-use content management system (CMS) that lets you update project details, images, and blog posts without technical knowledge.'
  },
  {
    id: 5,
    question: 'Where are the websites hosted?',
    answer: 'We use enterprise-grade cloud hosting with servers in India for fast loading times. All hosting includes SSL certificates, daily backups, and CDN for optimal performance.'
  },
  {
    id: 6,
    question: 'What support do you provide after launch?',
    answer: 'All plans include technical support during business hours. Growth plans get priority email support, and Enterprise clients have a dedicated account manager with 24/7 access.'
  },
  {
    id: 7,
    question: 'What happens when a project is completed/sold out?',
    answer: 'We can archive the project page, redirect it to your main portfolio, or keep it live as a case study. We help you transition smoothly based on your marketing strategy.'
  }
];

export default function DeveloperWebsites() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    city: '',
    projectsPerYear: '',
    currentWebsite: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    const result = await submitDeveloperWebsiteInquiry(formData);
    
    setSubmitResult(result);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        city: '',
        projectsPerYear: '',
        currentWebsite: '',
        message: ''
      });
    }
  };

  return (
    <div className="developer-websites-page">
      {/* Hero Section */}
      <section className="devweb-hero">
        <div className="container">
          <span className="section-label">Website Development for Real Estate</span>
          <h1>High-Converting Websites for<br /><span className="text-accent">Your Real Estate Projects</span></h1>
          <p className="devweb-hero-subtitle">
            We design, develop, host, and maintain stunning websites for property developers—from project microsites to comprehensive corporate portfolios. Tailored for Indian real estate.
          </p>
          <div className="devweb-hero-buttons">
            <Link to="/contact" className="btn btn-accent btn-lg">Book a Demo</Link>
            <a href="#packages" className="btn btn-outline-white btn-lg">View Sample Layouts</a>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="devweb-audience section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Who This Is For</span>
            <h2>Built for Property Developers & Builders</h2>
            <p>Our website solutions are specifically designed for the Indian real estate market.</p>
          </div>
          
          <div className="audience-bullets">
            <div className="audience-bullet">
              <span className="audience-bullet-icon">🏗️</span>
              <div className="audience-bullet-content">
                <h4>Real Estate Developers</h4>
                <p>Launch project microsites quickly and showcase your portfolio professionally to attract buyers and investors.</p>
              </div>
            </div>
            <div className="audience-bullet">
              <span className="audience-bullet-icon">🏢</span>
              <div className="audience-bullet-content">
                <h4>Builders & Constructors</h4>
                <p>Establish credibility with modern websites that highlight your completed projects and ongoing developments.</p>
              </div>
            </div>
            <div className="audience-bullet">
              <span className="audience-bullet-icon">📈</span>
              <div className="audience-bullet-content">
                <h4>Property Marketers</h4>
                <p>Need fast launch times, SEO-friendly pages, and easy content updates for campaigns? We've got you covered.</p>
              </div>
            </div>
            <div className="audience-bullet">
              <span className="audience-bullet-icon">🏙️</span>
              <div className="audience-bullet-content">
                <h4>Multi-City Developers</h4>
                <p>Manage portfolios across cities with centralized websites, consistent branding, and regional customization.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Packages */}
      <section id="packages" className="devweb-packages">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Packages</span>
            <h2>Choose Your Website Solution</h2>
            <p>From single project sites to enterprise portfolios—we have a plan for every stage of growth.</p>
          </div>
          
          <div className="packages-grid">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`package-card ${pkg.isPopular ? 'package-card-popular' : ''}`}
              >
                {pkg.isPopular && <div className="package-badge">Most Popular</div>}
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <p className="package-tagline">{pkg.tagline}</p>
                </div>
                <div className="package-price">
                  <span className="price-label">{pkg.priceLabel}</span>
                  <span className="price-amount">{pkg.price}</span>
                  <span className="price-note">{pkg.priceNote}</span>
                </div>
                <div className="package-ideal">
                  <strong>Ideal for:</strong>
                  <p>{pkg.idealFor}</p>
                </div>
                <div className="package-features">
                  <h4>Key Features</h4>
                  <ul>
                    {pkg.features.map((feature, i) => (
                      <li key={i}>
                        <span className="check">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="package-cta">
                  <Link 
                    to="/contact" 
                    className={`btn ${pkg.isPopular ? 'btn-primary' : 'btn-outline'} full-width`}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hosting & Maintenance */}
      <section className="devweb-hosting section">
        <div className="container">
          <div className="hosting-grid">
            <div className="hosting-content">
              <span className="section-label">Managed Hosting</span>
              <h2>Reliable Hosting & Ongoing Maintenance</h2>
              <p>Focus on selling properties while we handle the technical side. Our managed hosting ensures your websites perform flawlessly during critical launch periods.</p>
              
              <div className="hosting-features">
                <div className="hosting-feature">
                  <span className="hosting-feature-icon">🔒</span>
                  <div className="hosting-feature-content">
                    <h4>Security & SSL</h4>
                    <p>Free SSL certificates, regular security updates, and DDoS protection for all sites.</p>
                  </div>
                </div>
                <div className="hosting-feature">
                  <span className="hosting-feature-icon">💾</span>
                  <div className="hosting-feature-content">
                    <h4>Daily Backups</h4>
                    <p>Automated daily backups with 30-day retention. Restore any version in minutes.</p>
                  </div>
                </div>
                <div className="hosting-feature">
                  <span className="hosting-feature-icon">⚡</span>
                  <div className="hosting-feature-content">
                    <h4>CDN & Performance</h4>
                    <p>Global CDN, image optimization, and caching for lightning-fast load times.</p>
                  </div>
                </div>
                <div className="hosting-feature">
                  <span className="hosting-feature-icon">🛠️</span>
                  <div className="hosting-feature-content">
                    <h4>Content Updates</h4>
                    <p>Quick turnaround on content changes, bug fixes, and adding new project pages.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="hosting-image">
              <div className="hosting-placeholder">
                <span className="hosting-placeholder-icon">🖥️</span>
                <span>Hosting Dashboard Preview</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="devweb-process section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Process</span>
            <h2>How It Works</h2>
            <p>A streamlined process from initial call to launch and beyond.</p>
          </div>
          
          <div className="process-timeline">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="process-step">
                <div className="process-step-number">{step.number}</div>
                <div className="process-step-icon">{step.icon}</div>
                <h4>{step.title}</h4>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="devweb-benefits section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Choose Us</span>
            <h2>Results That Matter</h2>
            <p>We build websites that drive real business outcomes for property developers.</p>
          </div>
          
          <div className="benefits-grid">
            {BENEFITS.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h4>{benefit.title}</h4>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="devweb-faq section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
          
          <div className="faq-grid">
            {FAQS.map(faq => (
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

      {/* CTA Strip with Contact Form */}
      <section className="devweb-cta">
        <div className="container">
          <div className="devweb-cta-content">
            <div className="devweb-cta-info">
              <h2>Ready to Launch Your Project Website?</h2>
              <p>Schedule a call with our team to discuss your requirements and get a customized proposal.</p>
              
              <div className="cta-contact-options">
                <div className="cta-contact-item">
                  <span className="cta-contact-icon">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="cta-contact-item">
                  <span className="cta-contact-icon">📧</span>
                  <span>websites@wiserdome.com</span>
                </div>
                <div className="cta-contact-item">
                  <span className="cta-contact-icon">💬</span>
                  <span>WhatsApp for quick queries</span>
                </div>
              </div>
            </div>
            
            <div className="devweb-cta-form">
              <h3>Request a Proposal</h3>
              
              {submitResult && (
                <div className={`alert ${submitResult.success ? 'alert-success' : 'alert-error'}`}>
                  {submitResult.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="companyName" className="form-label">Company Name</label>
                    <input 
                      type="text" 
                      id="companyName" 
                      name="companyName"
                      className="form-input" 
                      required 
                      placeholder="Your Company"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="contactName" className="form-label">Contact Person</label>
                    <input 
                      type="text" 
                      id="contactName" 
                      name="contactName"
                      className="form-input" 
                      required 
                      placeholder="Your Name"
                      value={formData.contactName}
                      onChange={handleChange}
                    />
                  </div>
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
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone"
                      className="form-input" 
                      required 
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">Primary City</label>
                    <select 
                      id="city" 
                      name="city"
                      className="form-select"
                      value={formData.city}
                      onChange={handleChange}
                    >
                      <option value="">Select City</option>
                      <option value="mumbai">Mumbai</option>
                      <option value="bangalore">Bangalore</option>
                      <option value="delhi-ncr">Delhi NCR</option>
                      <option value="pune">Pune</option>
                      <option value="hyderabad">Hyderabad</option>
                      <option value="chennai">Chennai</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="projectsPerYear" className="form-label">Projects per Year</label>
                    <select 
                      id="projectsPerYear" 
                      name="projectsPerYear"
                      className="form-select"
                      value={formData.projectsPerYear}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="1-2">1-2 projects</option>
                      <option value="3-5">3-5 projects</option>
                      <option value="6-10">6-10 projects</option>
                      <option value="10+">10+ projects</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="currentWebsite" className="form-label">Current Website (if any)</label>
                  <input 
                    type="url" 
                    id="currentWebsite" 
                    name="currentWebsite"
                    className="form-input" 
                    placeholder="https://yourcompany.com"
                    value={formData.currentWebsite}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Tell us about your requirements</label>
                  <textarea 
                    id="message" 
                    name="message"
                    className="form-textarea" 
                    rows="3"
                    placeholder="Brief description of your website needs..."
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-accent full-width"
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Request Proposal'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
