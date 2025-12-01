import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, []);

  async function loadInquiries() {
    if (!isSupabaseConfigured()) {
      setInquiries([
        {
          id: '1',
          full_name: 'Demo User',
          email: 'demo@example.com',
          phone: '+1234567890',
          property_city: 'Mumbai',
          property_type: 'apartment',
          message: 'This is a demo inquiry.',
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contact_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    }
    setLoading(false);
  }

  const updateStatus = async (inquiry, newStatus) => {
    if (!isSupabaseConfigured()) {
      alert('Supabase is not configured. Changes will not be saved.');
      return;
    }

    try {
      const { error } = await supabase
        .from('contact_inquiries')
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
      qualified: '#ffc107',
      closed: '#6c757d'
    };
    return (
      <span style={{
        background: statusColors[status] || '#6c757d',
        color: 'white',
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '0.8rem'
      }}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="admin-inquiries">
      <div className="admin-page-header">
        <h1>Contact Inquiries</h1>
        <span className="inquiry-count">{inquiries.length} inquiries</span>
      </div>

      <div className="admin-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Property</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map(inquiry => (
              <tr key={inquiry.id}>
                <td>{formatDate(inquiry.created_at)}</td>
                <td>{inquiry.full_name}</td>
                <td>
                  <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
                  <br />
                  <small>{inquiry.phone}</small>
                </td>
                <td>
                  {inquiry.property_city} - {inquiry.property_type}
                </td>
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
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedInquiry && (
        <div className="modal-overlay" onClick={() => setSelectedInquiry(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Inquiry Details</h2>
              <button className="modal-close" onClick={() => setSelectedInquiry(null)}>×</button>
            </div>
            
            <div className="inquiry-details">
              <div className="detail-row">
                <strong>Name:</strong>
                <span>{selectedInquiry.full_name}</span>
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
                <span>{selectedInquiry.property_city}</span>
              </div>
              <div className="detail-row">
                <strong>Property Type:</strong>
                <span>{selectedInquiry.property_type}</span>
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

      <style>{`
        .inquiry-count {
          background: var(--color-bg-light);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: var(--font-size-sm);
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
      `}</style>
    </div>
  );
}
