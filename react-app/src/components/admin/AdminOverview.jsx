import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPricingPlans, getServices, getFAQs, getTestimonials, getPropertyOwners, getAllOwnerProperties } from '../../lib/dataService';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    plans: 0,
    services: 0,
    faqs: 0,
    testimonials: 0,
    pendingOwners: 0,
    approvedOwners: 0,
    ownerProperties: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const [plans, services, faqs, testimonials, pendingOwners, approvedOwners, ownerProperties] = await Promise.all([
        getPricingPlans(),
        getServices(),
        getFAQs(),
        getTestimonials(),
        getPropertyOwners('pending'),
        getPropertyOwners('approved'),
        getAllOwnerProperties()
      ]);
      
      setStats({
        plans: plans.length,
        services: services.length,
        faqs: faqs.length,
        testimonials: testimonials.length,
        pendingOwners: pendingOwners.length,
        approvedOwners: approvedOwners.length,
        ownerProperties: ownerProperties.length
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

      {/* Property Owner Stats */}
      {stats.pendingOwners > 0 && (
        <div className="alert-banner">
          <span>⚠️ You have {stats.pendingOwners} pending owner signup{stats.pendingOwners > 1 ? 's' : ''} to review</span>
          <Link to="/admin/property-owners" className="btn btn-sm btn-primary">Review Now</Link>
        </div>
      )}

      <div className="stats-grid">
        <Link to="/admin/property-owners" className="stat-card stat-card-highlight">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.pendingOwners}</div>
          <div className="stat-label">Pending Owners</div>
        </Link>

        <Link to="/admin/property-owners" className="stat-card">
          <div className="stat-icon">✓</div>
          <div className="stat-value">{stats.approvedOwners}</div>
          <div className="stat-label">Approved Owners</div>
        </Link>

        <Link to="/admin/owner-properties" className="stat-card">
          <div className="stat-icon">🏘️</div>
          <div className="stat-value">{stats.ownerProperties}</div>
          <div className="stat-label">Managed Properties</div>
        </Link>
        
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
          <Link to="/admin/property-owners" className="btn btn-outline">Manage Owners</Link>
          <Link to="/admin/owner-properties" className="btn btn-outline">Manage Properties</Link>
          <Link to="/admin/pricing" className="btn btn-outline">Manage Pricing</Link>
          <Link to="/admin/services" className="btn btn-outline">Manage Services</Link>
          <Link to="/admin/faqs" className="btn btn-outline">Manage FAQs</Link>
          <Link to="/admin/testimonials" className="btn btn-outline">Manage Testimonials</Link>
        </div>
      </div>

      <style>{`
        .alert-banner {
          background: #fff3cd;
          border: 1px solid #ffc107;
          border-radius: var(--border-radius-md);
          padding: var(--spacing-md) var(--spacing-lg);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-xl);
        }
        .alert-banner span {
          font-weight: var(--font-weight-medium);
          color: #856404;
        }
        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: var(--font-size-sm);
        }
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
        .stat-card-highlight {
          border: 2px solid var(--color-accent);
        }
      `}</style>
    </div>
  );
}
