import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getPricingPlans } from '../../lib/dataService';

export default function AdminPricing() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price_monthly: '',
    target_audience: '',
    is_popular: false,
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadPlans();
  }, []);

  async function loadPlans() {
    const data = await getPricingPlans();
    setPlans(data);
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
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price_monthly: '',
      target_audience: '',
      is_popular: false,
      is_active: true,
      display_order: plans.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description || '',
      price_monthly: plan.price_monthly,
      target_audience: plan.target_audience || '',
      is_popular: plan.is_popular,
      is_active: plan.is_active !== false,
      display_order: plan.display_order || 0
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

    const planData = {
      name: formData.name,
      description: formData.description,
      price_monthly: parseFloat(formData.price_monthly),
      target_audience: formData.target_audience,
      is_popular: formData.is_popular,
      is_active: formData.is_active,
      display_order: parseInt(formData.display_order)
    };

    try {
      if (editingPlan) {
        const { error } = await supabase
          .from('pricing_plans')
          .update(planData)
          .eq('id', editingPlan.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pricing_plans')
          .insert([planData]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      loadPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan: ' + error.message);
    }
  };

  const handleDelete = async (plan) => {
    if (!confirm(`Are you sure you want to delete "${plan.name}"?`)) return;
    
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('pricing_plans')
        .delete()
        .eq('id', plan.id);
      
      if (error) throw error;
      loadPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Error deleting plan: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-pricing">
      <div className="admin-page-header">
        <h1>Pricing Plans</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add Plan
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (Monthly)</th>
              <th>Target Audience</th>
              <th>Popular</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map(plan => (
              <tr key={plan.id}>
                <td>{plan.name}</td>
                <td>₹{plan.price_monthly?.toLocaleString()}</td>
                <td>{plan.target_audience}</td>
                <td>{plan.is_popular ? '⭐ Yes' : 'No'}</td>
                <td>{plan.is_active !== false ? '✅ Active' : '❌ Inactive'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => openEditModal(plan)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(plan)}
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
              <h2>{editingPlan ? 'Edit Plan' : 'Add Plan'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Plan Name</label>
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
                <label className="form-label">Description</label>
                <input
                  type="text"
                  name="description"
                  className="form-input"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Monthly Price (₹)</label>
                <input
                  type="number"
                  name="price_monthly"
                  className="form-input"
                  value={formData.price_monthly}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Target Audience</label>
                <input
                  type="text"
                  name="target_audience"
                  className="form-input"
                  value={formData.target_audience}
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
                    name="is_popular"
                    checked={formData.is_popular}
                    onChange={handleChange}
                  />
                  Mark as Popular
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
                  {editingPlan ? 'Update' : 'Create'}
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
