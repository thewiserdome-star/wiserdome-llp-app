import { useState, useEffect } from 'react';
import { getPropertyOwners, updateOwnerStatus } from '../../lib/dataService';

export default function AdminPropertyOwners() {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectModal, setRejectModal] = useState({ show: false, ownerId: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      setLoading(true);
      const status = filter === 'all' ? null : filter;
      const data = await getPropertyOwners(status);
      if (isMounted) {
        setOwners(data);
        setLoading(false);
      }
    }
    
    fetchData();
    
    return () => { isMounted = false; };
  }, [filter, refreshKey]);

  const refreshData = () => setRefreshKey(prev => prev + 1);

  const handleApprove = async (ownerId) => {
    setActionLoading(ownerId);
    const result = await updateOwnerStatus(ownerId, 'approved');
    if (result.success) {
      refreshData();
    } else {
      alert('Error approving owner: ' + result.message);
    }
    setActionLoading(null);
  };

  const handleReject = async () => {
    if (!rejectModal.ownerId) return;

    setActionLoading(rejectModal.ownerId);
    const result = await updateOwnerStatus(rejectModal.ownerId, 'rejected', rejectionReason);
    if (result.success) {
      setRejectModal({ show: false, ownerId: null });
      setRejectionReason('');
      refreshData();
    } else {
      alert('Error rejecting owner: ' + result.message);
    }
    setActionLoading(null);
  };

  const openRejectModal = (ownerId) => {
    setRejectModal({ show: true, ownerId });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'Pending' },
      approved: { class: 'badge-success', text: 'Approved' },
      rejected: { class: 'badge-danger', text: 'Rejected' }
    };
    return badges[status] || { class: 'badge-default', text: status };
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading property owners...</div>;
  }

  return (
    <div className="admin-property-owners">
      <div className="admin-page-header">
        <h1>Property Owners</h1>
        <div className="filter-tabs">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({owners.length})
          </button>
          <button
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      {owners.length === 0 ? (
        <div className="admin-card">
          <div className="empty-state">
            <p>No property owners found.</p>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {owners.map(owner => {
                const badge = getStatusBadge(owner.status);
                return (
                  <tr key={owner.id}>
                    <td>
                      <strong>{owner.full_name}</strong>
                      {owner.address && (
                        <div className="small-text">{owner.address}</div>
                      )}
                    </td>
                    <td>{owner.email}</td>
                    <td>{owner.phone}</td>
                    <td>{owner.city}</td>
                    <td>
                      <span className={`badge ${badge.class}`}>
                        {badge.text}
                      </span>
                      {owner.status === 'rejected' && owner.rejection_reason && (
                        <div className="rejection-reason">
                          Reason: {owner.rejection_reason}
                        </div>
                      )}
                    </td>
                    <td>{formatDate(owner.created_at)}</td>
                    <td>
                      {owner.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-success"
                            onClick={() => handleApprove(owner.id)}
                            disabled={actionLoading === owner.id}
                          >
                            {actionLoading === owner.id ? '...' : '✓ Approve'}
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => openRejectModal(owner.id)}
                            disabled={actionLoading === owner.id}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      )}
                      {owner.status === 'approved' && owner.approved_at && (
                        <div className="small-text">
                          Approved: {formatDate(owner.approved_at)}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div className="modal-overlay" onClick={() => setRejectModal({ show: false, ownerId: null })}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reject Owner</h2>
              <button 
                className="modal-close" 
                onClick={() => setRejectModal({ show: false, ownerId: null })}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Rejection Reason (optional)</label>
                <textarea
                  className="form-textarea"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection..."
                  rows={4}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setRejectModal({ show: false, ownerId: null })}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={actionLoading}
              >
                {actionLoading ? 'Rejecting...' : 'Reject Owner'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .filter-tabs {
          display: flex;
          gap: var(--spacing-sm);
        }
        .filter-tab {
          background: transparent;
          border: 1px solid var(--color-border);
          padding: var(--spacing-sm) var(--spacing-md);
          border-radius: var(--border-radius-md);
          cursor: pointer;
          font-size: var(--font-size-sm);
          transition: var(--transition-base);
        }
        .filter-tab:hover {
          background: var(--color-bg-light);
        }
        .filter-tab.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: var(--border-radius-full);
          font-size: var(--font-size-xs);
          font-weight: var(--font-weight-medium);
        }
        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }
        .badge-success {
          background: #d4edda;
          color: #155724;
        }
        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }
        .btn-sm {
          padding: 4px 10px;
          font-size: var(--font-size-xs);
        }
        .btn-success {
          background: var(--color-success);
          color: white;
          border: none;
        }
        .btn-success:hover {
          background: #0a9e6d;
        }
        .btn-danger {
          background: #dc3545;
          color: white;
          border: none;
        }
        .btn-danger:hover {
          background: #c82333;
        }
        .small-text {
          font-size: var(--font-size-xs);
          color: var(--color-text-light);
          margin-top: 2px;
        }
        .rejection-reason {
          font-size: var(--font-size-xs);
          color: var(--color-error);
          margin-top: 4px;
        }
        .modal-body {
          padding: var(--spacing-md) 0;
        }
        .empty-state {
          text-align: center;
          padding: var(--spacing-2xl);
          color: var(--color-text-light);
        }
      `}</style>
    </div>
  );
}
