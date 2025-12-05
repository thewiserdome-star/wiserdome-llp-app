import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './OwnerLogin.css';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { ownerSignIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error: signInError } = await ownerSignIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      navigate('/owner/dashboard');
    }
  };

  return (
    <div className="owner-login-page">
      <div className="login-container">
        <div className="login-card">
          <h1>Property Owner Login</h1>
          <p className="login-subtitle">Sign in to view your managed properties</p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="signup-link">
            Don&apos;t have an account? <Link to="/owner/signup">Register here</Link>
          </p>

          <div className="login-divider">
            <span>or</span>
          </div>

          <Link to="/admin/login" className="admin-link">
            Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
