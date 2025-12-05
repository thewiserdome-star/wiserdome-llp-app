import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedOwnerRoute({ children }) {
  const { isOwner, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isOwner) {
    return <Navigate to="/owner/login" replace />;
  }

  return children;
}
