import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { getFAQs } from '../../lib/dataService';

export default function AdminFAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    category: 'general',
    is_active: true,
    display_order: 0
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  async function loadFAQs() {
    const data = await getFAQs();
    setFaqs(data);
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
    setEditingFaq(null);
    setFormData({
      question: '',
      answer: '',
      category: 'general',
      is_active: true,
      display_order: faqs.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (faq) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'general',
      is_active: faq.is_active !== false,
      display_order: faq.display_order || 0
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

    const faqData = {
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      is_active: formData.is_active,
      display_order: parseInt(formData.display_order)
    };

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(faqData)
          .eq('id', editingFaq.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([faqData]);
        
        if (error) throw error;
      }
      
      setShowModal(false);
      loadFAQs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Error saving FAQ: ' + error.message);
    }
  };

  const handleDelete = async (faq) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', faq.id);
      
      if (error) throw error;
      loadFAQs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      alert('Error deleting FAQ: ' + error.message);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-faqs">
      <div className="admin-page-header">
        <h1>FAQs</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Add FAQ
        </button>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Question</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map(faq => (
              <tr key={faq.id}>
                <td>{faq.question}</td>
                <td>{faq.category}</td>
                <td>{faq.is_active !== false ? '✅ Active' : '❌ Inactive'}</td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon btn-edit" 
                      onClick={() => openEditModal(faq)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => handleDelete(faq)}
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
              <h2>{editingFaq ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Question</label>
                <input
                  type="text"
                  name="question"
                  className="form-input"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Answer</label>
                <textarea
                  name="answer"
                  className="form-textarea"
                  rows="4"
                  value={formData.answer}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="billing">Billing</option>
                  <option value="legal">Legal</option>
                  <option value="services">Services</option>
                </select>
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
                  {editingFaq ? 'Update' : 'Create'}
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
