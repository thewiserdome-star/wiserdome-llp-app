import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getServices } from '../../lib/dataService';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    full_description: '',
    icon: '',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    const data = await getServices();
    setServices(data);
    setLoading(false);
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const openCreateModal = () => {
    setEditingService(null);
    setFormData({
      name: '',
      short_description: '',
      full_description: '',
      icon: '🏠',
      is_active: true,
      display_order: services.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      short_description: service.short_description || '',
      full_description: service.full_description || '',
      icon: service.icon || '',
      is_active: service.is_active !== false,
      display_order: service.display_order || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      setShowModal(false);
      return;
    }

    const serviceData = {
      name: formData.name,
      short_description: formData.short_description,
      full_description: formData.full_description,
      icon: formData.icon,
      is_active: formData.is_active,
      display_order: parseInt(formData.display_order)
    };

    try {
      if (editingService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      loadServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error saving service: ' + error.message);
    }
  };

  const handleDelete = async (service) => {
    if (!confirm(`Are you sure you want to delete "${service.name}"?`)) return;
    
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id);
      
      if (error) throw error;
      loadServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error deleting service: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-services">
      <div className="admin-page-header">
        <h1>Services</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Service
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Icon</th>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.icon}</td>
                <td>{service.name}</td>
                <td>{service.short_description}</td>
                <td>{service.is_active !== false ? '✅ Active' : '❌ Inactive'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => openEditModal(service)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(service)}
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

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingService ? 'Edit Service' : 'Add Service'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Icon (Emoji)</label>
                <input
                  type="text"
                  name="icon"
                  className="form-input"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="🏠"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Service Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  className="form-input"
                  value={formData.short_description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Full Description</label>
                <textarea
                  name="full_description"
                  className="form-textarea"
                  rows="4"
                  value={formData.full_description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Display Order</label>
                <input
                  type="number"
                  name="display_order"
                  className="form-input"
                  value={formData.display_order}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                  />
                  Active
                </label>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .checkbox-label {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          cursor: pointer;
        }
        .checkbox-label input {
          width: auto;
        }
      `}</style>
    </div>
  );
}
