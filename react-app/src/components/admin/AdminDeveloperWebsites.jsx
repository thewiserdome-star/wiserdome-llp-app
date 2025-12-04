import { useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { saveDeveloperPackage, deleteDeveloperPackage } from '../../lib/dataService';

export default function AdminDeveloperWebsites() {
  const [inquiries, setInquiries] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [activeTab, setActiveTab] = useState('inquiries');
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    name: '',
    tagline: '',
    price_label: '',
    price: '',
    price_note: '',
    ideal_for: '',
    features: '',
    is_popular: false,
    is_active: true,
    display_order: 0
  });

  const loadInquiries = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setInquiries([
        {
          id: '1',
          company_name: 'ABC Developers',
          contact_name: 'Rahul Sharma',
          email: 'rahul@abcdevelopers.com',
          phone: '+91 98765 43210',
          city: 'Mumbai',
          projects_per_year: '3-5',
          current_website: 'https://abcdevelopers.com',
          message: 'Looking for a complete portfolio website with 5 project pages.',
          status: 'new',
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          company_name: 'XYZ Builders',
          contact_name: 'Priya Patel',
          email: 'priya@xyzbuilders.in',
          phone: '+91 87654 32109',
          city: 'Bangalore',
          projects_per_year: '6-10',
          current_website: '',
          message: 'Need a new website for upcoming luxury project launch.',
          status: 'contacted',
          created_at: new Date(Date.now() - 86400000).toISOString()
        }
      ]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('developer_website_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error loading developer website inquiries:', error);
    }
  }, []);

  const loadPackages = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setPackages([
        {
          id: '1',
          name: 'Starter Project Site',
          tagline: 'Perfect for single project launches',
          price_label: 'One-time from',
          price: '₹49,999',
          price_note: '+ ₹2,999/mo hosting',
          ideal_for: 'New property launches, individual project microsites',
          features: 'Single project landing page\nProject overview & highlights\nInteractive location map\nImage gallery\nLead capture form\nBasic analytics',
          is_popular: false,
          is_active: true,
          display_order: 1
        },
        {
          id: '2',
          name: 'Growth Multi-Project Site',
          tagline: 'Scale your digital presence',
          price_label: 'One-time from',
          price: '₹1,49,999',
          price_note: '+ ₹5,999/mo hosting',
          ideal_for: 'Growing developers with multiple ongoing projects',
          features: 'Multi-project pages (up to 10)\nProperty listing grid with filters\nBlog/news section\nAdvanced SEO setup\nCRM integration hooks\nPriority email support',
          is_popular: true,
          is_active: true,
          display_order: 2
        },
        {
          id: '3',
          name: 'Enterprise Developer Suite',
          tagline: 'Complete digital transformation',
          price_label: 'Custom pricing from',
          price: '₹3,99,999',
          price_note: '+ custom hosting SLA',
          ideal_for: 'Large developers with multi-city portfolios',
          features: 'Custom design system\nUnlimited project pages\nMulti-city portfolio\nCRM & marketing integrations\nDedicated account manager\nSLA-backed hosting',
          is_popular: false,
          is_active: true,
          display_order: 3
        }
      ]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('developer_website_packages')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      await Promise.all([loadInquiries(), loadPackages()]);
      setLoading(false);
    }
    loadData();
  }, [loadInquiries, loadPackages]);

  const updateStatus = async (inquiry, newStatus) => {
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('developer_website_inquiries')
        .update({ status: newStatus })
        .eq('id', inquiry.id);

      if (error) throw error;
      loadInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      new: '#28a745',
      contacted: '#17a2b8',
      proposal_sent: '#ffc107',
      negotiation: '#fd7e14',
      won: '#20c997',
      lost: '#dc3545'
    };
    return (
      <span style={{
        background: statusColors[status] || '#6c757d',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        {status?.replace('_', ' ')}
      </span>
    );
  };

  // Package management functions
  const openCreatePackageModal = () => {
    setEditingPackage(null);
    setPackageFormData({
      name: '',
      tagline: '',
      price_label: 'One-time from',
      price: '',
      price_note: '',
      ideal_for: '',
      features: '',
      is_popular: false,
      is_active: true,
      display_order: packages.length + 1
    });
    setShowPackageModal(true);
  };

  const openEditPackageModal = (pkg) => {
    setEditingPackage(pkg);
    setPackageFormData({
      name: pkg.name,
      tagline: pkg.tagline || '',
      price_label: pkg.price_label || '',
      price: pkg.price || '',
      price_note: pkg.price_note || '',
      ideal_for: pkg.ideal_for || '',
      features: pkg.features || '',
      is_popular: pkg.is_popular || false,
      is_active: pkg.is_active !== false,
      display_order: pkg.display_order || 0
    });
    setShowPackageModal(true);
  };

  const handlePackageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPackageFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      setShowPackageModal(false);
      return;
    }

    const packageData = {
      id: editingPackage ? editingPackage.id : null,
      name: packageFormData.name,
      tagline: packageFormData.tagline,
      price_label: packageFormData.price_label,
      price: packageFormData.price,
      price_note: packageFormData.price_note,
      ideal_for: packageFormData.ideal_for,
      features: packageFormData.features,
      is_popular: packageFormData.is_popular,
      is_active: packageFormData.is_active,
      display_order: parseInt(packageFormData.display_order)
    };

    try {
      const result = await saveDeveloperPackage(packageData);

      if (!result.success) {
        throw new Error(result.message);
      }

      setShowPackageModal(false);
      loadPackages();
    } catch (error) {
      console.error('Error saving package:', error);
      alert('Error saving package: ' + error.message);
    }
  };

  const handleDeletePackage = async (pkg) => {
    if (!confirm(`Are you sure you want to delete "${pkg.name}"?`)) return;

    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const result = await deleteDeveloperPackage(pkg.id);

      if (!result.success) {
        throw new Error(result.message);
      }

      loadPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('Error deleting package: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-developer-websites">
      <div className="admin-page-header">
        <h1>Developer Websites</h1>
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'inquiries' ? 'active' : ''}`}
            onClick={() => setActiveTab('inquiries')}
          >
            📧 Inquiries ({inquiries.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
          >
            📦 Packages ({packages.length})
          </button>
        </div>
      </div>

      {/* Inquiries Tab */}
      {activeTab === 'inquiries' && (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Company</th>
                <th>Contact</th>
                <th>City</th>
                <th>Projects/Year</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(inquiry => (
                <tr key={inquiry.id}>
                  <td>{formatDate(inquiry.created_at)}</td>
                  <td>
                    <strong>{inquiry.company_name}</strong>
                    <br />
                    <small>{inquiry.contact_name}</small>
                  </td>
                  <td>
                    <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                    <br />
                    <small>{inquiry.phone}</small>
                  </td>
                  <td>{inquiry.city}</td>
                  <td>{inquiry.projects_per_year}</td>
                  <td>{getStatusBadge(inquiry.status)}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => setSelectedInquiry(inquiry)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateStatus(inquiry, e.target.value)}
                        style={{ padding: '4px', fontSize: '0.8rem' }}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="proposal_sent">Proposal Sent</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Packages Tab */}
      {activeTab === 'packages' && (
        <>
          <div className="admin-actions">
            <button className="btn btn-primary" onClick={openCreatePackageModal}>
              + Add Package
            </button>
          </div>
          <div className="admin-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Popular</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map(pkg => (
                  <tr key={pkg.id}>
                    <td>{pkg.display_order}</td>
                    <td>
                      <strong>{pkg.name}</strong>
                      <br />
                      <small>{pkg.tagline}</small>
                    </td>
                    <td>
                      {pkg.price}
                      <br />
                      <small>{pkg.price_note}</small>
                    </td>
                    <td>{pkg.is_popular ? '⭐ Yes' : 'No'}</td>
                    <td>{pkg.is_active ? '✅ Active' : '❌ Inactive'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => openEditPackageModal(pkg)}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon btn-delete"
                          onClick={() => handleDeletePackage(pkg)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Inquiry Details Modal */}
      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button className="modal-close" onClick={() => setSelectedInquiry(null)}>×</button>
            </div>

            <div className="inquiry-details">
              <div className="detail-row">
                <strong>Company:</strong>
                <span>{selectedInquiry.company_name}</span>
              </div>
              <div className="detail-row">
                <strong>Contact Person:</strong>
                <span>{selectedInquiry.contact_name}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <a href={`mailto:${selectedInquiry.email}`}>{selectedInquiry.email}</a>
              </div>
              <div className="detail-row">
                <strong>Phone:</strong>
                <a href={`tel:${selectedInquiry.phone}`}>{selectedInquiry.phone}</a>
              </div>
              <div className="detail-row">
                <strong>City:</strong>
                <span>{selectedInquiry.city}</span>
              </div>
              <div className="detail-row">
                <strong>Projects per Year:</strong>
                <span>{selectedInquiry.projects_per_year}</span>
              </div>
              <div className="detail-row">
                <strong>Current Website:</strong>
                {selectedInquiry.current_website ? (
                  <a href={selectedInquiry.current_website} target="_blank" rel="noopener noreferrer">
                    {selectedInquiry.current_website}
                  </a>
                ) : (
                  <span>Not provided</span>
                )}
              </div>
              <div className="detail-row">
                <strong>Message:</strong>
                <p>{selectedInquiry.message || 'No message provided'}</p>
              </div>
              <div className="detail-row">
                <strong>Submitted:</strong>
                <span>{formatDate(selectedInquiry.created_at)}</span>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setSelectedInquiry(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Package Edit Modal */}
      {showPackageModal && (
        <div className="modal-overlay" onClick={() => setShowPackageModal(false)}>
          <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPackage ? 'Edit Package' : 'Add Package'}</h2>
              <button className="modal-close" onClick={() => setShowPackageModal(false)}>×</button>
            </div>

            <form onSubmit={handlePackageSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Package Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={packageFormData.name}
                    onChange={handlePackageChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    className="form-input"
                    value={packageFormData.tagline}
                    onChange={handlePackageChange}
                    placeholder="e.g., Perfect for single project launches"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Price Label</label>
                  <input
                    type="text"
                    name="price_label"
                    className="form-input"
                    value={packageFormData.price_label}
                    onChange={handlePackageChange}
                    placeholder="e.g., One-time from"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price</label>
                  <input
                    type="text"
                    name="price"
                    className="form-input"
                    value={packageFormData.price}
                    onChange={handlePackageChange}
                    placeholder="e.g., ₹49,999"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Price Note</label>
                <input
                  type="text"
                  name="price_note"
                  className="form-input"
                  value={packageFormData.price_note}
                  onChange={handlePackageChange}
                  placeholder="e.g., + ₹2,999/mo hosting"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ideal For</label>
                <input
                  type="text"
                  name="ideal_for"
                  className="form-input"
                  value={packageFormData.ideal_for}
                  onChange={handlePackageChange}
                  placeholder="Description of target customer"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Features (one per line)</label>
                <textarea
                  name="features"
                  className="form-textarea"
                  rows="6"
                  value={packageFormData.features}
                  onChange={handlePackageChange}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    className="form-input"
                    value={packageFormData.display_order}
                    onChange={handlePackageChange}
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_popular"
                      checked={packageFormData.is_popular}
                      onChange={handlePackageChange}
                    />
                    Mark as Popular
                  </label>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={packageFormData.is_active}
                      onChange={handlePackageChange}
                    />
                    Active
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPackageModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPackage ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .tab-buttons {
          display: flex;
          gap: var(--spacing-md);
        }
        .tab-btn {
          padding: var(--spacing-sm) var(--spacing-lg);
          border: 1px solid var(--color-border);
          background: var(--color-bg-white);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: var(--transition-fast);
        }
        .tab-btn.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .tab-btn:hover:not(.active) {
          border-color: var(--color-primary);
        }
        .admin-actions {
          margin-bottom: var(--spacing-lg);
        }
        .inquiry-details {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .detail-row strong {
          color: var(--color-text-light);
          font-size: var(--font-size-sm);
        }
        .detail-row a {
          color: var(--color-primary);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }
        .checkbox-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          justify-content: center;
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        .checkbox-label input {
          width: auto;
        }
        .modal-large {
          max-width: 700px;
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .tab-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
