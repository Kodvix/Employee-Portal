import React, { useState, useEffect } from 'react';
import './AdminAttendance.css'; 
// import AdminSidebar from '../../components/Sidebar/AdminSidebar'; 
// import AdminTopBar from '../../components/Sidebar/AdminTopBar'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminEmployeeManagement = () => {
  // --- Static Data ---
  const departments = [
    'Marketing', 'HR', 'Finance', 'IT', 'Operations', 'Sales', 'Customer Support', 'R&D'
  ];

  const positionsByDepartment = {
    'Marketing': ['Marketing Specialist', 'Marketing Manager', 'Digital Marketing Specialist', 'Content Creator', 'Brand Manager'],
    'HR': ['HR Coordinator', 'HR Manager', 'Recruitment Specialist', 'Training Coordinator', 'Payroll Specialist'],
    'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'Payroll Administrator', 'Budget Analyst'],
    'IT': ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'IT Support Specialist', 'System Administrator', 'DevOps Engineer'],
    'Operations': ['Operations Manager', 'Operations Analyst', 'Logistics Coordinator', 'Supply Chain Manager', 'Project Manager'],
    'Sales': ['Sales Representative', 'Sales Manager', 'Account Executive', 'Business Development Manager', 'Sales Analyst'],
    'Customer Support': ['Customer Support Specialist', 'Customer Success Manager', 'Technical Support Specialist', 'Support Team Lead'],
    'R&D': ['Research Scientist', 'Product Developer', 'R&D Manager', 'Quality Assurance Specialist']
  };

  // --- State Management ---
  const [employees, setEmployees] = useState([
    // Your initial employee data goes here
    {
      id: 1,
      employeeNumber: 'EMP001',
      name: 'John Doe',
      department: 'Marketing',
      position: 'Marketing Specialist',
      email: 'john.doe@company.com',
      phone: '555-123-4567',
      joinDate: '2023-01-15',
      status: 'Active',
      username: 'john.doe',
      password: 'password123',
      avatar: '/assets/avatars/avatar1.jpg'
    },
    {
      id: 2,
      employeeNumber: 'EMP002',
      name: 'Jane Smith',
      department: 'HR',
      position: 'HR Coordinator',
      email: 'jane.smith@company.com',
      phone: '555-234-5678',
      joinDate: '2023-02-20',
      status: 'Active',
      username: 'jane.smith',
      password: 'password456',
      avatar: '/assets/avatars/avatar2.jpg'
    },
    {
      id: 3,
      employeeNumber: 'EMP003',
      name: 'Alex Johnson',
      department: 'Finance',
      position: 'Financial Analyst',
      email: 'alex.johnson@company.com',
      phone: '555-345-6789',
      joinDate: '2023-03-10',
      status: 'Active',
      username: 'alex.johnson',
      password: 'password789',
      avatar: '/assets/avatars/avatar3.jpg'
    },
    {
      id: 4,
      employeeNumber: 'EMP004',
      name: 'Sarah Williams',
      department: 'IT',
      position: 'Frontend Developer',
      email: 'sarah.williams@company.com',
      phone: '555-456-7890',
      joinDate: '2023-04-05',
      status: 'Active',
      username: 'sarah.williams',
      password: 'passwordabc',
      avatar: '/assets/avatars/avatar4.jpg'
    },
    {
      id: 5,
      employeeNumber: 'EMP005',
      name: 'Michael Brown',
      department: 'Operations',
      position: 'Operations Manager',
      email: 'michael.brown@company.com',
      phone: '555-567-8901',
      joinDate: '2023-05-12',
      status: 'Inactive',
      username: 'michael.brown',
      password: 'passworddef',
      avatar: '/assets/avatars/avatar5.jpg'
    },
  ]);

  const [view, setView] = useState('employees'); // 'employees', 'departments', 'analytics'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState(null); // 'add', 'view', 'edit'
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    joinDate: '',
    status: 'Active',
    username: '',
    password: '',
    avatar: ''
  });

  const [availablePositions, setAvailablePositions] = useState([]);

  // --- Effects ---

  // Update available positions when department changes in form
  useEffect(() => {
    if (formData.department) {
      setAvailablePositions(positionsByDepartment[formData.department] || []);
      // Reset position if the current one isn't valid for the selected department
      if (!positionsByDepartment[formData.department]?.includes(formData.position)) {
        setFormData(prev => ({
          ...prev,
          position: ''
        }));
      }
    } else {
      setAvailablePositions([]);
      setFormData(prev => ({
        ...prev,
        position: ''
      }));
    }
  }, [formData.department]);


  // Initial welcome notification
  useEffect(() => {
    toast.info('Welcome to Employee Management Portal', {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }, []);

  // --- Helper Functions ---

  const generateEmployeeNumber = () => {
    const lastEmployeeId = employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) : 0;
    const newId = lastEmployeeId + 1;
    return `EMP${String(newId).padStart(3, '0')}`;
  };

  const generateUsername = (name) => {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '.').replace(/[^a-z0-9.]/g, ''); // Simple sanitization
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      joinDate: '',
      status: 'Active',
      username: '',
      password: '',
      avatar: ''
    });
  };

  // --- Event Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddClick = () => {
    resetFormData();
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleViewClick = (employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ ...employee, password: '' }); // Don't pre-fill password for security
    setModalMode('edit');
    setIsModalOpen(true);
    // Set available positions for the pre-filled department
    if (employee.department) {
        setAvailablePositions(positionsByDepartment[employee.department] || []);
      } else {
        setAvailablePositions([]);
      }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMode(null);
    setSelectedEmployee(null);
    resetFormData(); // Always reset form data when closing
  };

  const handleCreateEmployee = () => {
    if (!formData.name || !formData.department || !formData.position || !formData.email) {
      toast.error('Please fill all required fields!');
      return;
    }

    const newEmployee = {
      id: employees.length > 0 ? Math.max(...employees.map(emp => emp.id)) + 1 : 1, // Ensure unique ID
      employeeNumber: generateEmployeeNumber(),
      name: formData.name,
      department: formData.department,
      position: formData.position,
      email: formData.email,
      phone: formData.phone || '',
      joinDate: formData.joinDate || '',
      status: formData.status,
      username: formData.username || generateUsername(formData.name),
      password: formData.password || 'welcome123', // Default password
      avatar: formData.avatar || ''
    };

    setEmployees([...employees, newEmployee]);
    toast.success('Employee created successfully!');
    handleCloseModal();
  };

  const handleUpdateEmployee = () => {
     if (!formData.name || !formData.department || !formData.position || !formData.email) {
      toast.error('Please fill all required fields!');
      return;
    }

    const updatedEmployees = employees.map(emp => {
        if (emp.id === selectedEmployee.id) {
            return {
                ...emp,
                name: formData.name,
                department: formData.department,
                position: formData.position,
                email: formData.email,
                phone: formData.phone,
                joinDate: formData.joinDate,
                status: formData.status,
                username: formData.username || generateUsername(formData.name), // Allow updating username or auto-generate
                // password is NOT updated here, only via specific reset function
                avatar: formData.avatar
            };
        }
        return emp;
    });

    setEmployees(updatedEmployees);
    toast.success('Employee updated successfully!');
    handleCloseModal();
  };

   const handleDeleteEmployee = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(updatedEmployees);
      toast.success('Employee deleted successfully!');
      if (selectedEmployee?.id === employeeId) {
          handleCloseModal();
      }
    }
  };

    const handleToggleStatus = (employeeId) => {
        const updatedEmployees = employees.map(emp => {
            if (emp.id === employeeId) {
                const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
                 toast.info(`Employee status changed to ${newStatus}`);
                return {
                    ...emp,
                    status: newStatus
                };
            }
            return emp;
        });

        setEmployees(updatedEmployees);
    };

    const handleResetPassword = (employeeId) => {
        if (window.confirm('Are you sure you want to reset this employee\'s password to "welcome123"?')) {
            const updatedEmployees = employees.map(emp => {
                if (emp.id === employeeId) {
                    return {
                        ...emp,
                        password: 'welcome123' // Default reset password
                    };
                }
                return emp;
            });

            setEmployees(updatedEmployees);
            toast.success('Password reset successfully!');
             // If viewing the employee, update the selectedEmployee state to reflect the change (password isn't shown anyway, but good practice)
            if (selectedEmployee?.id === employeeId) {
                 setSelectedEmployee(prev => prev ? {...prev, password: 'welcome123'} : null);
            }
        }
    };


  // --- Filtered Data ---
  const filteredEmployees = employees.filter(employee => {
    const searchMatch =
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchText.toLowerCase());

    const departmentMatch = filterDepartment ? employee.department === filterDepartment : true;
    const statusMatch = filterStatus ? employee.status === filterStatus : true;

    return searchMatch && departmentMatch && statusMatch;
  });

  // --- Render Logic ---

  const renderEmployeeTable = () => (
    <div className="employee-list-container">
      <div className="employee-table-header">
        <span className="header-id">ID</span>
        <span className="header-name">Name</span>
        <span className="header-department">Department</span>
        <span className="header-position">Position</span>
        <span className="header-email">Email</span>
        <span className="header-status">Status</span>
        <span className="header-actions">Actions</span>
      </div>
      {filteredEmployees.length > 0 ? (
        <div className="employee-table-body">
          {filteredEmployees.map(employee => (
            <div key={employee.id} className="employee-table-row">
              <span className="row-id">{employee.employeeNumber}</span>
              <span className="row-name">
                <div className="employee-avatar">
                  {employee.avatar ? (
                    <img src={employee.avatar} alt={employee.name} onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/40"; // Fallback image
                    }} />
                  ) : (
                    <div className="avatar-placeholder">
                      {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </div>
                  )}
                </div>
                {employee.name}
              </span>
              <span className="row-department">{employee.department}</span>
              <span className="row-position">{employee.position}</span>
              <span className="row-email">{employee.email}</span>
              <span className={`row-status status-${employee.status.toLowerCase()}`}>
                {employee.status}
              </span>
              <span className="row-actions">
                <button className="action-button view-button" onClick={() => handleViewClick(employee)}>View</button>
                <button className="action-button edit-button" onClick={() => handleEditClick(employee)}>Edit</button>
                <button className="action-button delete-button" onClick={() => handleDeleteEmployee(employee.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-employees">No employees found matching your criteria.</div>
      )}
    </div>
  );

  const renderDepartmentView = () => (
    <div className="department-list-container">
      {departments.map((department, index) => {
        const deptEmployees = employees.filter(emp => emp.department === department);

        return (
          <div key={index} className="department-section">
            <div className="department-header">
              <h3>{department}</h3>
              <span className="employee-count">{deptEmployees.length} employees</span>
            </div>

            {deptEmployees.length > 0 ? (
              <div className="department-employee-cards">
                {deptEmployees.map(employee => (
                  <div key={employee.id} className="employee-card">
                    <div className="card-header">
                      <div className="employee-avatar large">
                        {employee.avatar ? (
                          <img src={employee.avatar} alt={employee.name} onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/60"; // Fallback
                          }} />
                        ) : (
                          <div className="avatar-placeholder large">
                            {employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="card-info">
                        <h4>{employee.name}</h4>
                        <p>{employee.position}</p>
                         <span className={`status-indicator status-${employee.status.toLowerCase()}`}>
                           {employee.status}
                         </span>
                      </div>
                    </div>
                    <div className="card-details">
                      <div className="detail-item">
                         <span className="detail-label">ID:</span>
                         <span className="detail-value">{employee.employeeNumber}</span>
                      </div>
                       <div className="detail-item">
                         <span className="detail-label">Email:</span>
                         <span className="detail-value">{employee.email}</span>
                      </div>
                       <div className="detail-item">
                         <span className="detail-label">Join Date:</span>
                         <span className="detail-value">{employee.joinDate || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="card-actions">
                       <button
                         className="action-button card-action-button view-button"
                         onClick={() => handleViewClick(employee)}
                       >
                         View
                       </button>
                       <button
                         className="action-button card-action-button edit-button"
                         onClick={() => handleEditClick(employee)}
                       >
                         Edit
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-department-employees">No employees in this department</p>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderAnalyticsView = () => {
      const departmentCounts = departments.map(dept => ({
          name: dept,
          count: employees.filter(emp => emp.department === dept).length
      }));
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'Active').length;
      const inactiveEmployees = totalEmployees - activeEmployees;


      return (
        <div className="analytics-container">
          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>Department Distribution</h3>
              <div className="department-chart">
                  {departmentCounts.map((dept, index) => {
                    const percentage = totalEmployees > 0 ? (dept.count / totalEmployees) * 100 : 0;
                    return (
                        <div key={index} className="chart-item">
                            <div className="chart-label">{dept.name}</div>
                            <div className="chart-bar-container">
                                <div className="chart-bar" style={{ width: `${percentage}%` }}></div>
                                <span className="chart-value">{dept.count}</span>
                            </div>
                        </div>
                    );
                  })}
                  {totalEmployees === 0 && <p className="no-data">No employee data for charts.</p>}
              </div>
            </div>

             <div className="analytics-card">
              <h3>Employee Status</h3>
              <div className="status-chart">
                 {/* Basic Pie Chart - This requires more complex CSS or an actual chart library */}
                 {/* For this basic rewrite, let's represent it simply */}
                 <div className="status-summary">
                     <div className="legend-item">
                         <span className="legend-color-box status-active"></span>
                         <span>Active ({activeEmployees})</span>
                     </div>
                      <div className="legend-item">
                         <span className="legend-color-box status-inactive"></span>
                         <span>Inactive ({inactiveEmployees})</span>
                     </div>
                     {totalEmployees === 0 && <p className="no-data">No employee data.</p>}
                 </div>
              </div>
            </div>
          </div>

          <div className="analytics-table-container">
            <h3>Department Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total Employees</th>
                  <th>Active Employees</th>
                  <th>Inactive Employees</th>
                  <th>Positions</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => {
                  const deptEmployees = employees.filter(emp => emp.department === dept);
                  const activeCount = deptEmployees.filter(emp => emp.status === 'Active').length;
                  const inactiveCount = deptEmployees.filter(emp => emp.status === 'Inactive').length;
                  const positions = [...new Set(deptEmployees.map(emp => emp.position))];

                  return (
                    <tr key={index}>
                      <td>{dept}</td>
                      <td>{deptEmployees.length}</td>
                      <td>{activeCount}</td>
                      <td>{inactiveCount}</td>
                      <td>{positions.join(', ') || 'None'}</td>
                    </tr>
                  );
                })}
                 {departments.length === 0 && (
                     <tr>
                         <td colSpan="5" className="no-data">No departments defined.</td>
                     </tr>
                 )}
              </tbody>
            </table>
          </div>
        </div>
      );
  };


  const renderModal = () => {
    if (!isModalOpen) return null;

    const isView = modalMode === 'view';
    const isEdit = modalMode === 'edit';
    const isAdd = modalMode === 'add';

    const currentEmployee = isView || isEdit ? selectedEmployee : formData;

    return (
      <div className="modal-overlay">
        <div className="modal">
          <button className="modal-close-button" onClick={handleCloseModal}>
            ✕
          </button>

          <div className="modal-header">
            {isAdd && <h2>Add New Employee</h2>}
            {isView && <h2>Employee Details</h2>}
            {isEdit && <h2>Edit Employee</h2>}
          </div>

          <div className="modal-content">
            {isView && selectedEmployee && (
              <>
                 <div className="employee-modal-header">
                    <div className="employee-avatar large">
                        {selectedEmployee.avatar ? (
                          <img src={selectedEmployee.avatar} alt={selectedEmployee.name} onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100"; // Fallback
                          }} />
                        ) : (
                          <div className="avatar-placeholder large">
                            {selectedEmployee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                    </div>
                    <div className="employee-modal-info">
                        <h3>{selectedEmployee.name}</h3>
                        <p>{selectedEmployee.position} • {selectedEmployee.department}</p>
                        <span className={`status-indicator status-${selectedEmployee.status.toLowerCase()}`}>
                            {selectedEmployee.status}
                        </span>
                    </div>
                 </div>

                <div className="details-section">
                    <h4>Personal Information</h4>
                    <div className="details-grid">
                         <div className="detail-item">
                             <span className="detail-label">Employee ID:</span>
                             <span className="detail-value">{selectedEmployee.employeeNumber}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Full Name:</span>
                             <span className="detail-value">{selectedEmployee.name}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Email:</span>
                             <span className="detail-value">{selectedEmployee.email}</span>
                         </div>
                          <div className="detail-item">
                             <span className="detail-label">Phone:</span>
                             <span className="detail-value">{selectedEmployee.phone || 'N/A'}</span>
                         </div>
                    </div>
                </div>

                 <div className="details-section">
                    <h4>Employment Details</h4>
                    <div className="details-grid">
                         <div className="detail-item">
                             <span className="detail-label">Department:</span>
                             <span className="detail-value">{selectedEmployee.department}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Position:</span>
                             <span className="detail-value">{selectedEmployee.position}</span>
                         </div>
                          <div className="detail-item">
                             <span className="detail-label">Join Date:</span>
                             <span className="detail-value">{selectedEmployee.joinDate || 'N/A'}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Status:</span>
                             <span className={`detail-value status-${selectedEmployee.status.toLowerCase()}`}>
                                 {selectedEmployee.status}
                             </span>
                         </div>
                    </div>
                </div>

                <div className="details-section">
                    <h4>Account Credentials</h4>
                     <div className="details-grid">
                         <div className="detail-item">
                             <span className="detail-label">Username:</span>
                             <span className="detail-value">{selectedEmployee.username}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Password:</span>
                             <span className="detail-value password-mask">•••••••••••</span> {/* Don't display password */}
                         </div>
                    </div>
                    <div className="credential-actions">
                        <button
                            className="action-button reset-password-button"
                            onClick={() => handleResetPassword(selectedEmployee.id)}
                        >
                            Reset Password
                        </button>
                    </div>
                </div>

              </>
            )}

            {(isAdd || isEdit) && (
              <form onSubmit={(e) => {
                  e.preventDefault(); // Prevent default form submission
                  if (isAdd) handleCreateEmployee();
                  if (isEdit) handleUpdateEmployee();
              }}>
                <div className="form-group">
                  <label htmlFor="name">Full Name*</label>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="department">Department*</label>
                    <select
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="position">Position*</label>
                    <select
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      required
                      disabled={!formData.department}
                    >
                      <option value="">Select Position</option>
                      {availablePositions.map((pos, index) => (
                        <option key={index} value={pos}>{pos}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email*</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                 <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="joinDate">Join Date</label>
                        <input
                            id="joinDate"
                            type="date"
                            name="joinDate"
                            value={formData.joinDate}
                            onChange={handleInputChange}
                        />
                    </div>
                     <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <select
                           id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </div>


                {(isAdd || (isEdit && selectedEmployee && selectedEmployee.username !== '')) && ( // Only show username/password fields if adding or if employee has a username
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                id="username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder={isAdd ? "Auto-generated from name if empty" : "Enter username"}
                                disabled={isEdit && selectedEmployee && selectedEmployee.username === ''} // Disable if username was initially empty for editing (optional)
                            />
                             {isAdd && <small>Leave empty to auto-generate from name</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">{isAdd ? 'Password' : 'Reset Password'}</label>
                             {isAdd ? (
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Default: welcome123"
                                />
                            ) : (
                                 <button
                                    type="button" // Prevent form submission
                                    className="action-button reset-password-button"
                                    onClick={() => selectedEmployee && handleResetPassword(selectedEmployee.id)}
                                >
                                    Reset to welcome123
                                </button>
                            )}
                            {isAdd && <small>Leave empty for default password</small>}
                             {isEdit && !isAdd && <small>Use button to reset password</small>}
                        </div>
                    </div>
                )}

                 <div className="form-group">
                    <label htmlFor="avatar">Avatar URL</label>
                    <input
                      id="avatar"
                      type="text"
                      name="avatar"
                      value={formData.avatar}
                      onChange={handleInputChange}
                      placeholder="Enter avatar URL"
                    />
                  </div>

                <div className="modal-actions">
                  <button type="button" className="action-button cancel-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="action-button primary-button">
                    {isAdd ? 'Create Employee' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>

           {isView && selectedEmployee && (
              <div className="modal-actions view-actions">
                 <button
                    className="action-button edit-button"
                    onClick={() => handleEditClick(selectedEmployee)}
                 >
                    Edit Employee
                 </button>
                 <button
                    className={`action-button toggle-status-button status-${selectedEmployee.status === 'Active' ? 'inactive' : 'active'}`}
                    onClick={() => handleToggleStatus(selectedEmployee.id)}
                 >
                    {selectedEmployee.status === 'Active' ? 'Deactivate' : 'Activate'} Employee
                 </button>
                 <button
                    className="action-button delete-button"
                     onClick={() => handleDeleteEmployee(selectedEmployee.id)}
                 >
                    Delete Employee
                 </button>
              </div>
           )}


        </div>
      </div>
    );
  };


  return (
    <div className="page-wrapper">
      <ToastContainer />
      <div className="sidebar-wrapper">
        {/* <AdminSidebar /> */}
      </div>
      <div className="main-content">
        {/* <AdminTopBar /> */}

        <div className="content-header">
          <h1 className="page-title-1">Employee Management</h1>
          <button className="action-button primary-button" onClick={handleAddClick}>
            + New Employee
          </button>
        </div>

        <div className="view-tabs">
          <button
            className={`tab-button ${view === 'employees' ? 'active' : ''}`}
            onClick={() => setView('employees')}
          >
            All Employees
          </button>
          <button
            className={`tab-button ${view === 'departments' ? 'active' : ''}`}
            onClick={() => setView('departments')}
          >
            By Department
          </button>
          <button
            className={`tab-button ${view === 'analytics' ? 'active' : ''}`}
            onClick={() => setView('analytics')}
          >
            Analytics
          </button>
        </div>

        <div className="filter-controls">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search employees by name, email, ID..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filter-selects">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filter-select"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="content-area">
            {view === 'employees' && renderEmployeeTable()}
            {view === 'departments' && renderDepartmentView()}
            {view === 'analytics' && renderAnalyticsView()}
        </div>

        {/* Render Modals */}
        {renderModal()}

      </div>
    </div>
  );
};
{
     <footer className={styles.footer}>
        <div className={styles.footerLeft}>
        Copyright © 2025 Kodvix Technologies. All Rights Reserved.
      </div>
    <div className={styles.footerright}>
        <a
          href="https://www.kodvix.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kodvix Technologies
        </a>
      </div>
    </footer>
}
export default AdminEmployeeManagement;