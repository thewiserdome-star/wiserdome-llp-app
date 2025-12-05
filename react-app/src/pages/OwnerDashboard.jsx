import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getOwnerProperties } from '../lib/dataService';
import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const { owner, ownerSignOut } = useAuth();
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      if (owner?.id) {
        const data = await getOwnerProperties(owner.id);
        setProperties(data);
      }
      setLoading(false);
    }
    loadProperties();
  }, [owner]);

  const handleLogout = async () => {
    await ownerSignOut();
    navigate('/owner/login');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'badge-success';
      case 'inactive':
        return 'badge-warning';
      case 'under_maintenance':
        return 'badge-info';
      default:
        return 'badge-default';
    }
  };

  const getPlanBadgeClass = (plan) => {
    switch (plan) {
      case 'premium':
        return 'badge-premium';
      case 'standard':
        return 'badge-standard';
      case 'basic':
        return 'badge-basic';
      default:
        return 'badge-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading your properties...</div>;
  }

  return (
    <div className="owner-dashboard">
      {/* Header */}
      <header className="owner-header">
        <div className="header-left">
          <Link to="/" className="owner-logo">Wiserdome</Link>
          <span className="owner-badge">Owner Portal</span>
        </div>
        <div className="header-right">
          <span className="owner-greeting">Welcome, {owner?.full_name || 'Property Owner'}</span>
          <button onClick={handleLogout} className="btn btn-outline btn-sm">
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="owner-main">
        <div className="owner-container">
          <div className="dashboard-header">
            <h1>My Properties</h1>
            <p className="dashboard-subtitle">
              Properties managed by Wiserdome on your behalf
            </p>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏠</div>
              <div className="stat-value">{properties.length}</div>
              <div className="stat-label">Total Properties</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔑</div>
              <div className="stat-value">
                {properties.filter(p => p.is_rented).length}
              </div>
              <div className="stat-label">Rented</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🏗️</div>
              <div className="stat-value">
                {properties.filter(p => !p.is_rented).length}
              </div>
              <div className="stat-label">Vacant</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">
                {formatCurrency(
                  properties
                    .filter(p => p.is_rented)
                    .reduce((sum, p) => sum + (p.monthly_rent || 0), 0)
                )}
              </div>
              <div className="stat-label">Monthly Rental Income</div>
            </div>
          </div>

          {/* Properties List */}
          {properties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏠</div>
              <h2>No Properties Yet</h2>
              <p>Your properties managed by Wiserdome will appear here.</p>
              <p className="empty-note">
                Contact our team to add your properties for management.
              </p>
              <Link to="/contact" className="btn btn-primary">
                Contact Us
              </Link>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map(property => (
                <div key={property.id} className="property-card">
                  <div className="property-header">
                    <h3>{property.property_name}</h3>
                    <span className={`badge ${getStatusBadgeClass(property.status)}`}>
                      {property.status?.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="property-type">
                    {property.property_type?.charAt(0).toUpperCase() + property.property_type?.slice(1)}
                  </div>

                  <div className="property-details">
                    <div className="property-detail">
                      <span className="detail-icon">📍</span>
                      <span>{property.address}, {property.city}</span>
                    </div>

                    {property.bedrooms && (
                      <div className="property-detail">
                        <span className="detail-icon">🛏️</span>
                        <span>{property.bedrooms} BHK</span>
                      </div>
                    )}

                    {property.area_sqft && (
                      <div className="property-detail">
                        <span className="detail-icon">📐</span>
                        <span>{property.area_sqft} sq.ft</span>
                      </div>
                    )}
                  </div>

                  <div className="property-rental">
                    {property.is_rented ? (
                      <>
                        <div className="rental-status rented">
                          <span className="status-dot"></span>
                          Currently Rented
                        </div>
                        {property.monthly_rent && (
                          <div className="rental-amount">
                            {formatCurrency(property.monthly_rent)}/month
                          </div>
                        )}
                        {property.tenant_name && (
                          <div className="tenant-info">
                            <span className="tenant-label">Tenant:</span>
                            <span>{property.tenant_name}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="rental-status vacant">
                        <span className="status-dot"></span>
                        Vacant
                      </div>
                    )}
                  </div>

                  {property.management_plan && (
                    <div className="property-footer">
                      <span className={`badge ${getPlanBadgeClass(property.management_plan)}`}>
                        {property.management_plan?.charAt(0).toUpperCase() + property.management_plan?.slice(1)} Plan
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="owner-footer">
        <p>Need assistance? <Link to="/contact">Contact our support team</Link></p>
      </footer>
    </div>
  );
}
