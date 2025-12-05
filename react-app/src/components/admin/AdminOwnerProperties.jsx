import { useState, useEffect } from 'react';
import {
  getAllOwnerProperties,
  getPropertyOwners,
  addOwnerProperty,
  updateOwnerProperty,
  deleteOwnerProperty,
  getCities
} from '../../lib/dataService';

export default function AdminOwnerProperties() {
  const [properties, setProperties] = useState([]);
  const [owners, setOwners] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState(getEmptyForm());
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  function getEmptyForm() {
    return {
      ownerId: '',
      propertyName: '',
      propertyType: 'apartment',
      address: '',
      city: '',
      state: '',
      pincode: '',
      bedrooms: '',
      bathrooms: '',
      areaSqft: '',
      isRented: false,
      monthlyRent: '',
      tenantName: '',
      tenantPhone: '',
      managementPlan: 'standard',
      managementStartDate: '',
      notes: '',
      status: 'active'
    };
  }

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      const [propertiesData, ownersData, citiesData] = await Promise.all([
        getAllOwnerProperties(),
        getPropertyOwners('approved'),
        getCities()
      ]);
      if (isMounted) {
        setProperties(propertiesData);
        setOwners(ownersData);
        setCities(citiesData);
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [refreshKey]);

  const refreshData = () => setRefreshKey(prev => prev + 1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddNew = () => {
    setEditingProperty(null);
    setFormData(getEmptyForm());
    setShowModal(true);
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      ownerId: property.owner_id,
      propertyName: property.property_name,
      propertyType: property.property_type,
      address: property.address,
      city: property.city,
      state: property.state || '',
      pincode: property.pincode || '',
      bedrooms: property.bedrooms || '',
      bathrooms: property.bathrooms || '',
      areaSqft: property.area_sqft || '',
      isRented: property.is_rented || false,
      monthlyRent: property.monthly_rent || '',
      tenantName: property.tenant_name || '',
      tenantPhone: property.tenant_phone || '',
      managementPlan: property.management_plan || 'standard',
      managementStartDate: property.management_start_date || '',
      notes: property.notes || '',
      status: property.status || 'active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    let result;
    if (editingProperty) {
      result = await updateOwnerProperty(editingProperty.id, formData);
    } else {
      result = await addOwnerProperty(formData);
    }

    if (result.success) {
      setShowModal(false);
      refreshData();
    } else {
      alert('Error saving property: ' + result.message);
    }
    setSaving(false);
  };

  const handleDelete = async (propertyId) => {
    const result = await deleteOwnerProperty(propertyId);
    if (result.success) {
      setDeleteConfirm(null);
      refreshData();
    } else {
      alert('Error deleting property: ' + result.message);
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading properties...</div>;
  }

  return (
    <div className="admin-owner-properties">
      <div className="admin-page-header">
        <h1>Owner Properties</h1>
        <button className="btn btn-primary" onClick={handleAddNew}>
          + Add Property
        </button>
      </div>

      {properties.length === 0 ? (
        <div className="admin-card">
          <div className="empty-state">
            <p>No properties have been added yet.</p>
            <button className="btn btn-primary" onClick={handleAddNew}>
              Add First Property
            </button>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Owner</th>
                <th>Type</th>
                <th>Location</th>
                <th>Rental Status</th>
                <th>Plan</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(property => (
                <tr key={property.id}>
                  <td>
                    <strong>{property.property_name}</strong>
                    {property.bedrooms && (
                      <div className="small-text">{property.bedrooms} BHK, {property.area_sqft} sq.ft</div>
                    )}
                  </td>
                  <td>
                    {property.owner?.full_name || 'N/A'}
                    <div className="small-text">{property.owner?.email}</div>
                  </td>
                  <td className="capitalize">{property.property_type}</td>
                  <td>
                    {property.city}
                    {property.state && <span>, {property.state}</span>}
                  </td>
                  <td>
                    {property.is_rented ? (
                      <>
                        <span className="badge badge-success">Rented</span>
                        <div className="small-text">{formatCurrency(property.monthly_rent)}/mo</div>
                      </>
                    ) : (
                      <span className="badge badge-warning">Vacant</span>
                    )}
                  </td>
                  <td>
                    <span className={`badge badge-${property.management_plan || 'standard'}`}>
                      {property.management_plan || 'Standard'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(property)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => setDeleteConfirm(property.id)}
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
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProperty ? 'Edit Property' : 'Add New Property'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Owner *</label>
                    <select
                      name="ownerId"
                      className="form-select"
                      value={formData.ownerId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Owner</option>
                      {owners.map(owner => (
                        <option key={owner.id} value={owner.id}>
                          {owner.full_name} ({owner.email})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Property Name *</label>
                    <input
                      type="text"
                      name="propertyName"
                      className="form-input"
                      value={formData.propertyName}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., Sea View Apartment"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Property Type *</label>
                    <select
                      name="propertyType"
                      className="form-select"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="plot">Plot</option>
                      <option value="commercial">Commercial</option>
                      <option value="independent_house">Independent House</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={formData.status}
                      onChange={handleInputChange}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="under_maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address *</label>
                  <textarea
                    name="address"
                    className="form-textarea"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    placeholder="Full property address"
                  />
                </div>

                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <select
                      name="city"
                      className="form-select"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      name="state"
                      className="form-input"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      className="form-input"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label className="form-label">Bedrooms</label>
                    <input
                      type="number"
                      name="bedrooms"
                      className="form-input"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bathrooms</label>
                    <input
                      type="number"
                      name="bathrooms"
                      className="form-input"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area (sq.ft)</label>
                    <input
                      type="number"
                      name="areaSqft"
                      className="form-input"
                      value={formData.areaSqft}
                      onChange={handleInputChange}
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-divider">
                  <h3>Rental Information</h3>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isRented"
                      checked={formData.isRented}
                      onChange={handleInputChange}
                    />
                    <span>Property is currently rented</span>
                  </label>
                </div>

                {formData.isRented && (
                  <>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Monthly Rent (₹)</label>
                        <input
                          type="number"
                          name="monthlyRent"
                          className="form-input"
                          value={formData.monthlyRent}
                          onChange={handleInputChange}
                          min="0"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Tenant Name</label>
                        <input
                          type="text"
                          name="tenantName"
                          className="form-input"
                          value={formData.tenantName}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Tenant Phone</label>
                      <input
                        type="text"
                        name="tenantPhone"
                        className="form-input"
                        value={formData.tenantPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </>
                )}

                <div className="form-divider">
                  <h3>Management Details</h3>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Management Plan</label>
                    <select
                      name="managementPlan"
                      className="form-select"
                      value={formData.managementPlan}
                      onChange={handleInputChange}
                    >
                      <option value="basic">Basic</option>
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Management Start Date</label>
                    <input
                      type="date"
                      name="managementStartDate"
                      className="form-input"
                      value={formData.managementStartDate}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Notes</label>
                  <textarea
                    name="notes"
                    className="form-textarea"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Any additional notes about the property..."
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : (editingProperty ? 'Update Property' : 'Add Property')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete Property</h2>
              <button className="modal-close" onClick={() => setDeleteConfirm(null)}>×</button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this property? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteConfirm)}>
                Delete Property
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
        }
        .form-row-3 {
          grid-template-columns: 1fr 1fr 1fr;
        }
        .modal-lg {
          max-width: 700px;
        }
        .modal-body {
          max-height: 60vh;
          overflow-y: auto;
          padding: var(--spacing-md) 0;
        }
        .form-divider {
          border-top: 1px solid var(--color-border);
          padding-top: var(--spacing-md);
          margin-top: var(--spacing-md);
          margin-bottom: var(--spacing-md);
        }
        .form-divider h3 {
          font-size: var(--font-size-base);
          color: var(--color-text-heading);
          margin: 0;
        }
        .checkbox-group {
          margin-bottom: var(--spacing-md);
        }
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        .checkbox-label input {
          width: 18px;
          height: 18px;
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
          text-transform: capitalize;
        }
        .badge-success {
          background: #d4edda;
          color: #155724;
        }
        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }
        .badge-basic {
          background: #f5f5f5;
          color: #616161;
        }
        .badge-standard {
          background: #e3f2fd;
          color: #1565c0;
        }
        .badge-premium {
          background: #f3e5f5;
          color: #7b1fa2;
        }
        .small-text {
          font-size: var(--font-size-xs);
          color: var(--color-text-light);
          margin-top: 2px;
        }
        .capitalize {
          text-transform: capitalize;
        }
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--color-text-light);
        }
        .empty-state .btn {
          margin-top: var(--spacing-md);
        }
        .btn-danger {
          background: #dc3545;
          color: white;
          border: none;
        }
        .btn-danger:hover {
          background: #c82333;
        }
        @media (max-width: 768px) {
          .form-row,
          .form-row-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
