import React, { useState, useEffect } from 'react';
import { getVolunteers, updateVolunteerStatus, deleteVolunteer } from '../api';
import ChartPanel from './ChartPanel';
import { 
  Search, Check, X, Trash2, Eye, Download, Users, 
  Hourglass, CheckCircle2, XCircle, FileSpreadsheet, FileJson
} from 'lucide-react';

const AdminDashboard = ({ token, onError, onSuccess }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  
  // Selected volunteer for detail modal
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // Fetch volunteers
  const fetchVolunteersList = async () => {
    setLoading(true);
    try {
      const data = await getVolunteers(token, {
        search,
        status: statusFilter,
        skill: skillFilter
      });
      setVolunteers(data);
    } catch (err) {
      onError(err.message || 'Failed to fetch volunteers list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteersList();
  }, [search, statusFilter, skillFilter]);

  // Handle status update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateVolunteerStatus(token, id, newStatus);
      onSuccess(`Status updated to ${newStatus}`);
      fetchVolunteersList();
      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer(prev => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      onError(err.message || 'Failed to update status');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer registration?')) return;
    try {
      await deleteVolunteer(token, id);
      onSuccess('Volunteer registration deleted successfully');
      fetchVolunteersList();
      if (selectedVolunteer && selectedVolunteer._id === id) {
        setSelectedVolunteer(null);
      }
    } catch (err) {
      onError(err.message || 'Failed to delete volunteer');
    }
  };

  // Get dynamic unique list of skills for filter dropdown
  const allSkills = Array.from(
    new Set(volunteers.flatMap(v => v.skills || []))
  );

  // Stats calculation
  const stats = {
    total: volunteers.length,
    pending: volunteers.filter(v => v.status === 'Pending').length,
    approved: volunteers.filter(v => v.status === 'Approved').length,
    rejected: volunteers.filter(v => v.status === 'Rejected').length,
  };

  // CSV Exporter
  const exportToCSV = () => {
    if (volunteers.length === 0) return alert('No volunteer data to export');
    
    const headers = ['Full Name', 'Email', 'Phone', 'Age', 'Skills', 'Occupation', 'Availability', 'Hours/Week', 'Motivation', 'Status', 'Registration Date'];
    const rows = volunteers.map(v => [
      v.fullName,
      v.email,
      v.phone,
      v.age,
      (v.skills || []).join('; '),
      v.occupation,
      v.availability,
      v.hoursPerWeek,
      v.motivation.replace(/"/g, '""'), // escape quotes
      v.status,
      new Date(v.createdAt).toLocaleDateString(),
    ]);

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `volunteers_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Exporter
  const exportToJSON = () => {
    if (volunteers.length === 0) return alert('No volunteer data to export');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(volunteers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `volunteers_report_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div className="admin-container">
      {/* Page Header */}
      <div className="admin-header">
        <div className="admin-header-left">
          <h1 style={{ fontFamily: 'var(--font-display)' }}>Volunteer Management</h1>
          <p>Review, approve, and filter volunteer applications.</p>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="stats-grid" style={{ padding: '0 0 2rem 0' }}>
        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}>
            <Users size={24} />
          </div>
          <div>
            <div className="stat-num">{stats.total}</div>
            <div className="stat-label">Total Applications</div>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', padding: '1rem', borderRadius: '12px' }}>
            <Hourglass size={24} />
          </div>
          <div>
            <div className="stat-num" style={{ color: 'var(--accent-amber)' }}>{stats.pending}</div>
            <div className="stat-label">Pending Review</div>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', padding: '1rem', borderRadius: '12px' }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="stat-num" style={{ color: 'var(--accent-emerald)' }}>{stats.approved}</div>
            <div className="stat-label">Approved</div>
          </div>
        </div>

        <div className="stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textAlign: 'left' }}>
          <div style={{ background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', padding: '1rem', borderRadius: '12px' }}>
            <XCircle size={24} />
          </div>
          <div>
            <div className="stat-num" style={{ color: 'var(--accent-rose)' }}>{stats.rejected}</div>
            <div className="stat-label">Rejected</div>
          </div>
        </div>
      </div>

      {/* SVG Charts Panel */}
      <ChartPanel volunteers={volunteers} />

      {/* Controls: Search and Filters */}
      <div className="admin-controls">
        <div className="search-bar">
          <Search size={18} className="search-bar-icon" />
          <input
            type="text"
            className="form-input"
            placeholder="Search by name, email or occupation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters-row">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            className="form-select"
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Skills</option>
            {allSkills.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Volunteer Grid Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            Loading volunteers data...
          </div>
        ) : volunteers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
            No volunteer applications found.
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Volunteer</th>
                <th>Age</th>
                <th>Skills</th>
                <th>Availability</th>
                <th>Commitment</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v) => (
                <tr key={v._id}>
                  <td>
                    <div className="volunteer-info">
                      <span className="volunteer-name">{v.fullName}</span>
                      <span className="volunteer-email">{v.email}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{v.phone}</span>
                    </div>
                  </td>
                  <td>{v.age}</td>
                  <td>
                    <div className="skills-tags">
                      {v.skills && v.skills.map((skill, index) => (
                        <span key={index} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </td>
                  <td>{v.availability}</td>
                  <td>{v.hoursPerWeek} hrs/wk</td>
                  <td>
                    <span className={`badge badge-${v.status.toLowerCase()}`}>
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="btn-icon" 
                        title="View Details"
                        onClick={() => setSelectedVolunteer(v)}
                      >
                        <Eye size={16} />
                      </button>
                      {v.status !== 'Approved' && (
                        <button 
                          className="btn-icon btn-approve" 
                          title="Approve"
                          onClick={() => handleStatusUpdate(v._id, 'Approved')}
                        >
                          <Check size={16} />
                        </button>
                      )}
                      {v.status !== 'Rejected' && (
                        <button 
                          className="btn-icon btn-reject" 
                          title="Reject"
                          onClick={() => handleStatusUpdate(v._id, 'Rejected')}
                        >
                          <X size={16} />
                        </button>
                      )}
                      <button 
                        className="btn-icon" 
                        title="Delete"
                        style={{ color: 'var(--accent-rose)' }}
                        onClick={() => handleDelete(v._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Reports Generation Panel */}
      <div className="reports-card">
        <div className="reports-left">
          <h3>Generate Reports</h3>
          <p>Export currently filtered volunteer profiles to CSV or JSON format for your NGO logs.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-secondary" onClick={exportToCSV}>
            <FileSpreadsheet size={16} />
            Export CSV
          </button>
          <button className="btn-primary" onClick={exportToJSON}>
            <FileJson size={16} />
            Export JSON
          </button>
        </div>
      </div>

      {/* Details Dialog Modal */}
      {selectedVolunteer && (
        <div className="modal-overlay" onClick={() => setSelectedVolunteer(null)}>
          <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={() => setSelectedVolunteer(null)}>
              <X size={20} />
            </button>
            <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              Volunteer Profile Details
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Full Name</p>
                <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{selectedVolunteer.fullName}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email Address</p>
                <p>{selectedVolunteer.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Phone Number</p>
                <p>{selectedVolunteer.phone}</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</p>
                <span className={`badge badge-${selectedVolunteer.status.toLowerCase()}`}>
                  {selectedVolunteer.status}
                </span>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age & Occupation</p>
                <p>{selectedVolunteer.age} years old ({selectedVolunteer.occupation})</p>
              </div>
              <div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Availability & Weekly Commitment</p>
                <p>{selectedVolunteer.availability} ({selectedVolunteer.hoursPerWeek} hours/week)</p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Skills</p>
              <div className="skills-tags">
                {selectedVolunteer.skills && selectedVolunteer.skills.map((skill, idx) => (
                  <span key={idx} className="skill-tag" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>{skill}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Motivation Statement</p>
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                "{selectedVolunteer.motivation}"
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              {selectedVolunteer.status !== 'Approved' && (
                <button 
                  className="btn-primary" 
                  style={{ background: 'var(--accent-emerald)', boxShadow: 'none' }}
                  onClick={() => handleStatusUpdate(selectedVolunteer._id, 'Approved')}
                >
                  Approve Application
                </button>
              )}
              {selectedVolunteer.status !== 'Rejected' && (
                <button 
                  className="btn-secondary" 
                  style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244,63,94,0.3)' }}
                  onClick={() => handleStatusUpdate(selectedVolunteer._id, 'Rejected')}
                >
                  Reject Application
                </button>
              )}
              <button className="btn-secondary" onClick={() => setSelectedVolunteer(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
