import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPricingPlans, getServices, getFAQs, getTestimonials } from '../../lib/dataService';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    plans: 0,
    services: 0,
    faqs: 0,
    testimonials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [plans, services, faqs, testimonials] = await Promise.all([
        getPricingPlans(),
        getServices(),
        getFAQs(),
        getTestimonials()
      ]);
      
      setStats({
        plans: plans.length,
        services: services.length,
        faqs: faqs.length,
        testimonials: testimonials.length
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-overview">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <Link to="/admin/pricing" className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{stats.plans}</div>
          <div className="stat-label">Pricing Plans</div>
        </Link>
        
        <Link to="/admin/services" className="stat-card">
          <div className="stat-icon">🛠️</div>
          <div className="stat-value">{stats.services}</div>
          <div className="stat-label">Services</div>
        </Link>
        
        <Link to="/admin/faqs" className="stat-card">
          <div className="stat-icon">❓</div>
          <div className="stat-value">{stats.faqs}</div>
          <div className="stat-label">FAQs</div>
        </Link>
        
        <Link to="/admin/testimonials" className="stat-card">
          <div className="stat-icon">💬</div>
          <div className="stat-value">{stats.testimonials}</div>
          <div className="stat-label">Testimonials</div>
        </Link>
      </div>

      <div className="admin-card">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/admin/pricing" className="btn btn-outline">Manage Pricing</Link>
          <Link to="/admin/services" className="btn btn-outline">Manage Services</Link>
          <Link to="/admin/faqs" className="btn btn-outline">Manage FAQs</Link>
          <Link to="/admin/testimonials" className="btn btn-outline">Manage Testimonials</Link>
        </div>
      </div>

      <style>{`
        .quick-actions {
          display: flex;
          gap: var(--spacing-md);
          flex-wrap: wrap;
          margin-top: var(--spacing-md);
        }
        .stat-card {
          text-decoration: none;
          color: inherit;
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
