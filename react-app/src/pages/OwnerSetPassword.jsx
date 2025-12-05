import { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { validateSetPasswordToken, setOwnerPassword } from '../lib/dataService';
import './OwnerSetPassword.css';

export default function OwnerSetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setValidating(false);
        setTokenValid(false);
        return;
      }

      const result = await validateSetPasswordToken(token);
      setValidating(false);
      
      if (result.valid) {
        setTokenValid(true);
        setOwnerEmail(result.email || '');
        setOwnerName(result.fullName || '');
      } else {
        setTokenValid(false);
        setError(result.message || 'Invalid or expired token');
      }
    }

    checkToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await setOwnerPassword(token, password);

    if (result.success) {
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/owner/login');
      }, 3000);
    } else {
      setError(result.message || 'Failed to set password. Please try again.');
    }

    setLoading(false);
  };

  // Still validating token
  if (validating) {
    return (
      <div className="owner-set-password-page">
        <div className="set-password-container">
          <div className="set-password-card">
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Validating your link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No token provided
  if (!token) {
    return (
      <div className="owner-set-password-page">
        <div className="set-password-container">
          <div className="set-password-card error-card">
            <div className="error-icon">⚠️</div>
            <h1>Invalid Link</h1>
            <p>No password setup token was provided.</p>
            <p>Please use the link from your approval email.</p>
            <div className="error-actions">
              <Link to="/" className="btn btn-primary">Return to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Token invalid or expired
  if (!tokenValid) {
    return (
      <div className="owner-set-password-page">
        <div className="set-password-container">
          <div className="set-password-card error-card">
            <div className="error-icon">⚠️</div>
            <h1>Link Expired or Invalid</h1>
            <p>{error || 'This password setup link is no longer valid.'}</p>
            <p>Please contact support if you need assistance.</p>
            <div className="error-actions">
              <Link to="/" className="btn btn-primary">Return to Home</Link>
              <Link to="/contact" className="btn btn-outline">Contact Support</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="owner-set-password-page">
        <div className="set-password-container">
          <div className="set-password-card success-card">
            <div className="success-icon">✓</div>
            <h1>Password Set Successfully!</h1>
            <p>Your account is now active.</p>
            <p>Redirecting you to login...</p>
            <div className="success-actions">
              <Link to="/owner/login" className="btn btn-primary">Go to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Password setup form
  return (
    <div className="owner-set-password-page">
      <div className="set-password-container">
        <div className="set-password-card">
          <h1>Set Your Password</h1>
          <p className="set-password-subtitle">
            Welcome{ownerName ? `, ${ownerName}` : ''}! Your account has been approved.
            <br />Please set a password to activate your account.
          </p>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={ownerEmail}
                disabled
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password *</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Enter your password (min 8 characters)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password *</label>
              <input
                type="password"
                id="confirmPassword"
                className="form-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary full-width"
              disabled={loading}
            >
              {loading ? 'Setting Password...' : 'Set Password & Activate Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
