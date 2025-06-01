import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import './AdminHolidayPage.css';

const AdminHolidayPage = () => {
  const { employeeId, currentUser } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [formData, setFormData] = useState({
    nameOfHoliday: '',
    description: '',
    date: '',
  });

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/holiday/');
      setHolidays(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching holidays:', error);
      setError('Failed to load holidays. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHoliday = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/holiday/save', formData);
      setHolidays([...holidays, response.data]);
      setShowAddModal(false);
      setFormData({ nameOfHoliday: '', description: '', date: '' });
    } catch (error) {
      console.error('Error adding holiday:', error);
      setError('Failed to add holiday. Please try again.');
    }
  };

  const handleEditHoliday = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8080/api/holiday/save`, {
        ...formData,
        holidayId: selectedHoliday.holidayId
      });
      setHolidays(holidays.map(holiday => 
        holiday.holidayId === selectedHoliday.holidayId ? response.data : holiday
      ));
      setShowEditModal(false);
      setSelectedHoliday(null);
      setFormData({ nameOfHoliday: '', description: '', date: '' });
    } catch (error) {
      console.error('Error updating holiday:', error);
      setError('Failed to update holiday. Please try again.');
    }
  };

  const handleDeleteHoliday = async (holidayId) => {
    if (window.confirm('Are you sure you want to delete this holiday?')) {
      try {
        await axios.delete(`http://localhost:8080/api/holiday?holidayId=${holidayId}`);
        setHolidays(holidays.filter(holiday => holiday.holidayId !== holidayId));
      } catch (error) {
        console.error('Error deleting holiday:', error);
        setError('Failed to delete holiday. Please try again.');
      }
    }
  };

  const openEditModal = (holiday) => {
    setSelectedHoliday(holiday);
    setFormData({
      nameOfHoliday: holiday.nameOfHoliday,
      description: holiday.description,
      date: new Date(holiday.date).toISOString().split('T')[0],
    });
    setShowEditModal(true);
  };

  const filteredHolidays = holidays.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    const matchesSearch = holiday.nameOfHoliday.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         holiday.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = holidayDate.getFullYear() === yearFilter;
    return matchesSearch && matchesYear;
  });

  if (loading) {
    return (
      <div className="admin-holiday-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading holidays...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-holiday-page">
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-holiday-page">
      <header className="page-header">
        <h1>Holiday Management</h1>
        <p>Manage company holidays and events</p>
      </header>

      <div className="filters-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search holidays..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="year-filter">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(Number(e.target.value))}
            className="year-select"
          >
            {[2023, 2024, 2025, 2026].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <button 
          className="add-holiday-btn"
          onClick={() => setShowAddModal(true)}
        >
          Add Holiday
        </button>
      </div>

      <div className="holidays-grid">
        {filteredHolidays.length === 0 ? (
          <div className="empty-state">
            <p>No holidays found for the selected criteria.</p>
          </div>
        ) : (
          filteredHolidays.map(holiday => (
            <div key={holiday.holidayId} className="holiday-card">
              <div className="holiday-date">
                <span className="month">{new Date(holiday.date).toLocaleString('default', { month: 'short' })}</span>
                <span className="day">{new Date(holiday.date).getDate()}</span>
              </div>
              <div className="holiday-info">
                <h3>{holiday.nameOfHoliday}</h3>
                <p>{holiday.description}</p>
                <span className="holiday-id">ID: {holiday.holidayId}</span>
              </div>
              <div className="holiday-actions">
                <button 
                  className="edit-btn"
                  onClick={() => openEditModal(holiday)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteHoliday(holiday.holidayId)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Holiday Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Holiday</h2>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddHoliday}>
              <div className="form-group">
                <label>Holiday Name</label>
                <input
                  type="text"
                  value={formData.nameOfHoliday}
                  onChange={(e) => setFormData({...formData, nameOfHoliday: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Holiday Modal */}
      {showEditModal && selectedHoliday && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Holiday</h2>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditHoliday}>
              <div className="form-group">
                <label>Holiday Name</label>
                <input
                  type="text"
                  value={formData.nameOfHoliday}
                  onChange={(e) => setFormData({...formData, nameOfHoliday: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHolidayPage; 