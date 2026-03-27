import React, { useState, useEffect } from 'react';
import api from '../../common/utils/api';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 500); 
    return () => clearTimeout(debounceTimer);
  }, [search, page]); 

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/users?page=${page}&limit=5&search=${search}`);
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalRecords(res.data.total);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
    setLoading(false);
  };

  return (
    <div className="card card-wide">
      <h2 className="page-title">Admin Hub</h2>
      <p className="page-subtitle">Search, view, and paginate through verified identities globally.</p>
      
      <div className="form-group">
        <input 
          type="text" 
          placeholder="🔍 Search users by legal name or email address..." 
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="form-input"
          style={{ padding: '1rem 1.5rem', borderRadius: '2rem' }}
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Legal Individual Name</th>
              <th>Registered Email Address</th>
              <th>Security Clearance Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="3" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Securely querying network data...</td></tr>
            ) : users.length > 0 ? users.map((u) => (
              <tr key={u._id}>
                <td style={{ fontWeight: '500', color: 'var(--primary)' }}>{u.name}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short'})}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No user records match your query string.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-container">
        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <b>{users.length}</b> records out of <b>{totalRecords}</b>
        </span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))} 
            disabled={page === 1}
            className={`btn ${page === 1 ? 'btn-disabled' : 'btn-primary'}`}
            style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', minWidth: '5rem', textAlign: 'center' }}>
            Page {page} / {Math.max(1, totalPages)}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
            disabled={page >= totalPages || totalPages === 0}
            className={`btn ${(page >= totalPages || totalPages === 0) ? 'btn-disabled' : 'btn-primary'}`}
            style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
