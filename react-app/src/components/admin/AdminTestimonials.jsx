import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getTestimonials } from '../../lib/dataService';

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_location: '',
    customer_designation: '',
    testimonial_text: '',
    rating: 5,
    is_featured: false,
    is_active: true
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  async function loadTestimonials() {
    const data = await getTestimonials();
    setTestimonials(data);
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
    setEditingTestimonial(null);
    setFormData({
      customer_name: '',
      customer_location: '',
      customer_designation: '',
      testimonial_text: '',
      rating: 5,
      is_featured: false,
      is_active: true
    });
    setShowModal(true);
  };

  const openEditModal = (testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customer_name: testimonial.customer_name,
      customer_location: testimonial.customer_location || '',
      customer_designation: testimonial.customer_designation || '',
      testimonial_text: testimonial.testimonial_text,
      rating: testimonial.rating || 5,
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active !== false
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

    const testimonialData = {
      customer_name: formData.customer_name,
      customer_location: formData.customer_location,
      customer_designation: formData.customer_designation,
      testimonial_text: formData.testimonial_text,
      rating: parseInt(formData.rating),
      is_featured: formData.is_featured,
      is_active: formData.is_active
    };

    try {
      if (editingTestimonial) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialData)
          .eq('id', editingTestimonial.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialData]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      loadTestimonials();
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Error saving testimonial: ' + error.message);
    }
  };

  const handleDelete = async (testimonial) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;
    
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonial.id);
      
      if (error) throw error;
      loadTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Error deleting testimonial: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-testimonials">
      <div className="admin-page-header">
        <h1>Testimonials</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Testimonial
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map(testimonial => (
              <tr key={testimonial.id}>
                <td>
                  <strong>{testimonial.customer_name}</strong>
                  <br />
                  <small>{testimonial.customer_designation}</small>
                </td>
                <td>{testimonial.customer_location}</td>
                <td>{'⭐'.repeat(testimonial.rating || 5)}</td>
                <td>{testimonial.is_featured ? '⭐ Yes' : 'No'}</td>
                <td>{testimonial.is_active !== false ? '✅ Active' : '❌ Inactive'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => openEditModal(testimonial)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(testimonial)}
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
              <h2>{editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  name="customer_name"
                  className="form-input"
                  value={formData.customer_name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="customer_location"
                  className="form-input"
                  value={formData.customer_location}
                  onChange={handleChange}
                  placeholder="e.g., USA, UK, Canada"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input
                  type="text"
                  name="customer_designation"
                  className="form-input"
                  value={formData.customer_designation}
                  onChange={handleChange}
                  placeholder="e.g., Software Engineer"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Testimonial</label>
                <textarea
                  name="testimonial_text"
                  className="form-textarea"
                  rows="4"
                  value={formData.testimonial_text}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Rating (1-5)</label>
                <select
                  name="rating"
                  className="form-select"
                  value={formData.rating}
                  onChange={handleChange}
                >
                  <option value={5}>5 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={2}>2 Stars</option>
                  <option value={1}>1 Star</option>
                </select>
              </div>
              
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                  />
                  Featured
                </label>
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
                  {editingTestimonial ? 'Update' : 'Create'}
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
