import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [newRecord, setNewRecord] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Get JWT token from localStorage
  const getAuthToken = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      return parsed.token;
    }
    return null;
  };

  // Create headers with JWT token
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  };

  useEffect(() => {
    // Get user from localStorage (deliberately vulnerable)
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed.user || parsed); // Handle both new JWT format and old format
    }
    
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        const records = await response.json();
        setMedicalRecords(records);
      } else if (response.status === 401 || response.status === 403) {
        setError('Authentication failed. Please log in again.');
        // Redirect to login on auth failure
        setTimeout(() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Failed to fetch medical records');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async (e) => {
    e.preventDefault();
    
    if (!newRecord.title || !newRecord.content) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/medical-records', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: newRecord.title,
          content: newRecord.content
        })
      });

      if (response.ok) {
        const record = await response.json();
        setMedicalRecords([record, ...medicalRecords]);
        setNewRecord({ title: '', content: '' });
        setShowAddForm(false);
        setError('');
      } else if (response.status === 401 || response.status === 403) {
        setError('Authentication failed. Please log in again.');
        // Redirect to login on auth failure
        setTimeout(() => {
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Failed to add medical record');
      }
    } catch (err) {
      setError('Network error occurred');
    }
  };

  const handleLogout = () => {
    // Deliberately vulnerable: No proper logout endpoint call
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const handleInputChange = (e) => {
    // Deliberately vulnerable: No input sanitization
    setNewRecord({
      ...newRecord,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <h2>Loading your insecure medical data...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Zero Health Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user?.email || 'Anonymous User'}</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">{medicalRecords.length}</div>
            <div className="stat-label">Medical Records</div>
            <div className="stat-sublabel">Totally Unprotected</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Security Measures</div>
            <div className="stat-sublabel">As Promised</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">∞</div>
            <div className="stat-label">Vulnerabilities</div>
            <div className="stat-sublabel">And Counting</div>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="records-section">
          <div className="section-header">
            <h2>Your Medical Records</h2>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn btn-primary"
            >
              {showAddForm ? 'Cancel' : 'Add New Record'}
            </button>
          </div>

          {showAddForm && (
            <div className="add-record-form">
              <h3>Add New Medical Record</h3>
              <form onSubmit={handleAddRecord}>
                <div className="form-group">
                  <label htmlFor="title">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newRecord.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Annual Checkup, Blood Test Results..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="content">Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newRecord.content}
                    onChange={handleInputChange}
                    placeholder="Enter medical record details... (No XSS protection, go wild!)"
                    rows="5"
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    Add Record
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="records-grid">
            {medicalRecords.length === 0 ? (
              <div className="no-records">
                <h3>No medical records found</h3>
                <p>Add your first record to get started with data exposure!</p>
              </div>
            ) : (
              medicalRecords.map((record) => (
                <div key={record.id} className="record-card">
                  <div className="record-header">
                    <h4>{record.title}</h4>
                    <span className="record-id">ID: {record.id}</span>
                  </div>
                  <div className="record-content">
                    {/* Deliberately vulnerable: No XSS protection */}
                    <div dangerouslySetInnerHTML={{ __html: record.content }} />
                  </div>
                  <div className="record-footer">
                    <span className="record-date">
                      Created: {new Date(record.created_at).toLocaleDateString()}
                    </span>
                    <span className="vulnerability-warning">
                      ⚠️ XSS Vulnerable
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="vulnerability-showcase">
          <h2>Active Vulnerabilities Demo</h2>
          <div className="vulnerability-grid">
            <div className="vulnerability-card">
              <h4>🔓 JWT in localStorage</h4>
              <p>Token stored in localStorage - check DevTools Application tab!</p>
            </div>
            <div className="vulnerability-card">
              <h4>⚠️ XSS Ready</h4>
              <p>Add &lt;script&gt;alert('XSS')&lt;/script&gt; to any record!</p>
            </div>
            <div className="vulnerability-card">
              <h4>🔑 Weak JWT Secret</h4>
              <p>JWT uses weak secret key - easy to crack!</p>
            </div>
            <div className="vulnerability-card">
              <h4>🔍 Predictable IDs</h4>
              <p>Record IDs are sequential. Guess other users' data!</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .dashboard-loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #f8fafc;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info span {
          color: #6b7280;
          font-weight: 500;
        }

        .dashboard-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          text-align: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #2563eb;
        }

        .stat-label {
          font-size: 1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 0.5rem;
        }

        .stat-sublabel {
          font-size: 0.875rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .error-message {
          background: #fee2e2;
          color: #ef4444;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .records-section {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .add-record-form {
          background: #f8fafc;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
          border: 1px solid #e5e7eb;
        }

        .add-record-form h3 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-weight: 500;
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .form-group input,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #2563eb;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-1px);
        }

        .records-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .no-records {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .record-card {
          background: #fafafa;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .record-card:hover {
          border-color: #2563eb;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .record-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .record-header h4 {
          margin: 0;
          color: #1a1a1a;
          font-weight: 600;
        }

        .record-id {
          font-size: 0.75rem;
          color: #6b7280;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .record-content {
          margin-bottom: 1rem;
          color: #4b5563;
          line-height: 1.6;
          word-wrap: break-word;
        }

        .record-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .record-date {
          color: #6b7280;
        }

        .vulnerability-warning {
          color: #ef4444;
          font-weight: 500;
        }

        .vulnerability-showcase {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .vulnerability-showcase h2 {
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .vulnerability-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .vulnerability-card {
          background: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 0.5rem;
          padding: 1rem;
        }

        .vulnerability-card h4 {
          margin-top: 0;
          margin-bottom: 0.5rem;
          color: #92400e;
        }

        .vulnerability-card p {
          margin: 0;
          color: #78350f;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            padding: 1rem;
          }

          .header-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .section-header {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .records-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard; 