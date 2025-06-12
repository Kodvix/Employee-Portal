import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import './EmployeeProfile.css';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaBuilding,
  FaBriefcase,
  FaMoneyBillWave,
  FaClock,
  FaUserTie,
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://192.168.1.32:8080/api';

const EmployeeProfile = () => {
  const { employeeId, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !employeeId) {
      console.error('User not authenticated or employee ID missing');
      navigate('/');
      return;
    }
  }, [isAuthenticated, employeeId, navigate]);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!employeeId) {
        console.error('Employee ID not available');
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
        setEmployee(response.data);
      } catch (err) {
        console.error('Failed to fetch employee data:', err);
        if (err.response && err.response.status === 401) {
          logout();
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [employeeId, logout, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    axios
      .put(`${API_BASE_URL}/employee/${employee.id}`, employee)
      .then((res) => {
        alert('Profile updated successfully');
        setEmployee(res.data);
        setEditMode(false);
      })
      .catch((err) => console.error('Update error:', err));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Processing your request...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="profile-container">
        <div className="error">Failed to load profile information</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>Employee Profile</h2>
        <p>Manage your professional information and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3 className="section-title">
            <FaUser /> Personal Information
          </h3>
          <div className="form-group">
            <label>First Name</label>
            <input
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter first name"
            />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Enter last name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={employee.email} disabled placeholder="Email address" />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              name="phone"
              value={employee.phone}
              onChange={handleChange}
              disabled={!editMode}
              placeholder="Phone number"
            />
          </div>
        </div>

        <div className="profile-section">
          <h3 className="section-title">
            <FaBuilding /> Professional Information
          </h3>
          <div className="form-group">
            <label>Department</label>
            <input
              name="department"
              value={employee.department}
              disabled
              placeholder="Department name"
            />
          </div>
          <div className="form-group">
            <label>Job Title</label>
            <input
              name="jobTitle"
              value={employee.jobTitle}
              disabled
              placeholder="Job position"
            />
          </div>
          <div className="form-group">
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={employee.salary}
              disabled
              placeholder="Annual salary"
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={employee.status} disabled>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <div className="profile-actions">
        {editMode ? (
          <>
            <button className="btn btn-primary" onClick={handleUpdate}>
              <FaUser /> Save Changes
            </button>
            <button className="btn btn-secondary" onClick={() => setEditMode(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button className="btn btn-primary" onClick={() => setEditMode(true)}>
            <FaUser /> Edit Profile
          </button>
        )}
      </div>

      <footer className="footer">
        <div className="footerLeft">Copyright © 2025 Kodvix Technologies. All Rights Reserved.</div>
        <div className="footer-right">
          <a href="https://www.kodvix.com/" target="_blank" rel="noopener noreferrer">
            Kodvix Technologies
          </a>
        </div>
      </footer>
    </div>
  );
};

export default EmployeeProfile;
