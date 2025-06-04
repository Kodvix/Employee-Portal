import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminDashboard.module.css";
import {
  MdDashboard, MdPeople, MdAccessTime, MdOutlineRequestPage,
  MdAssignment, MdFolder, MdLogout, MdEdit, MdDelete
} from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers, FaCheckCircle, FaEnvelopeOpenText, FaTasks } from 'react-icons/fa';
import defaultAvatar from '../../assets/images/user1.png';

const API_BASE_URL = 'http://192.168.1.10:8080/api';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [tasks, setTasks] = useState([]);
  const [expandedSections, setExpandedSections] = useState({
    employees: false,
    leaveRequests: false,
    tasks: false
  });
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchLeaveRequests();
    fetchTasks();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/employee`);
      // Format employee data without images
      const formattedEmployees = response.data.map(emp => ({
        id: emp.id,
        firstName: emp.firstName || '',
        lastName: emp.lastName || '',
        email: emp.email || '',
        department: emp.department || '',
        jobTitle: emp.jobTitle || '',
        hireDate: emp.hireDate || '',
        salary: emp.salary || 0,
        status: emp.status || 'Active'
      }));
      setEmployees(formattedEmployees);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/employee/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch employee ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeByEmail = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/employee/email/${email}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch employee with email ${email}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeesByDepartment = async (department) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/employee/department/${department}`);
      setEmployees(response.data);
    } catch (error) {
      console.error(`Failed to fetch employees in department ${department}:`, error);
      setError("Failed to load department employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    if (department) {
      fetchEmployeesByDepartment(department);
    } else {
      fetchEmployees();
    }
  };

  const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.includes('@')) {
      // If search term is an email
      try {
        const employee = await fetchEmployeeByEmail(value);
        setEmployees([employee]);
      } catch (error) {
        setEmployees([]);
      }
    } else {
      // Filter by name
      const filtered = employees.filter(emp =>
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(value.toLowerCase())
      );
      setEmployees(filtered);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      console.log('Fetching leave requests from:', `${API_BASE_URL}/leaves/`);
      const response = await axios.get(`${API_BASE_URL}/leaves/`, config);
      
      if (!response.data) {
        throw new Error('No data received from the server');
      }

      console.log('Raw leave requests response:', response.data);
      
      // Format the leave requests data with optimized employee data
      const formattedRequests = response.data.map(leave => {
        if (!leave) return null;
        
        return {
          id: leave.id || '',
          leaveType: leave.leaveType || 'Not Specified',
          startDate: leave.startDate || new Date().toISOString(),
          endDate: leave.endDate || new Date().toISOString(),
          reason: leave.reason || 'No reason provided',
          status: (leave.status || 'PENDING').toUpperCase(),
          employee: {
            id: leave.employee?.id || '',
            name: `${leave.employee?.firstName || 'Unknown'} ${leave.employee?.lastName || 'Employee'}`,
            email: leave.employee?.email || 'No email'
          }
        };
      }).filter(Boolean);

      console.log('Formatted leave requests:', formattedRequests);
      setLeaveRequests(formattedRequests);
    } catch (error) {
      console.error("Failed to fetch leave requests:", error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        setError('No response received from server. Please check your connection.');
      } else {
        console.error('Error message:', error.message);
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveRequestById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/leaves/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch leave request ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeLeaves = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/leaves/employee/${employeeId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch leaves for employee ${employeeId}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteLeaveRequest = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_BASE_URL}/leaves/${id}`);
      // Refresh leave requests after deletion
      await fetchLeaveRequests();
    } catch (error) {
      console.error(`Failed to delete leave request ${id}:`, error);
      setError("Failed to delete leave request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewLeaveDetails = async (leaveId) => {
    try {
      const leaveDetails = await fetchLeaveRequestById(leaveId);
      // You can implement a modal or navigate to a details page
      console.log('Leave Details:', leaveDetails);
    } catch (error) {
      setError("Failed to load leave details. Please try again.");
    }
  };

  const handleDeleteLeave = async (id) => {
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      await deleteLeaveRequest(id);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(salary);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/tasks`);
      console.log('Tasks response:', response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskById = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch task ${id}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleEditEmployee = async (employeeId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
      setSelectedEmployee(response.data);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Failed to fetch employee details:', error);
      setError('Failed to load employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmployee = async (updatedData) => {
    try {
      setLoading(true);
      
      // Format the data according to the API requirements
      const formattedData = {
        firstName: updatedData.firstName,
        lastName: updatedData.lastName,
        email: updatedData.email,
        phone: updatedData.phone,
        department: updatedData.department,
        jobTitle: updatedData.jobTitle,
        salary: parseFloat(updatedData.salary),
        hireDate: `${updatedData.hireDate}T09:00:00`, // Format date as per API requirement
        status: updatedData.status,
        createdAt: selectedEmployee.createdAt,
        updatedAt: new Date().toISOString(),
        documents: selectedEmployee.documents || [],
        addresses: selectedEmployee.addresses || []
      };

      console.log('Sending update data:', formattedData);

      const response = await axios.put(
        `${API_BASE_URL}/employee/${selectedEmployee.id}`,
        formattedData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        console.log('Employee updated successfully:', response.data);
        await fetchEmployees(); // Refresh the employee list
        setIsEditModalOpen(false);
        setSelectedEmployee(null);
        // Show success message
        setError(null);
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
      setError(error.response?.data?.message || 'Failed to update employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/employee/${employeeId}`);
        console.log('Employee deleted successfully');
        await fetchEmployees(); // Refresh the employee list
      } catch (error) {
        console.error('Failed to delete employee:', error);
        setError('Failed to delete employee. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const updateLeaveStatus = async (leaveId, newStatus) => {
    try {
      setLoading(true);
      setError(null);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };

      console.log(`Updating leave request ${leaveId} to status: ${newStatus}`);
      const response = await axios.post(
        `${API_BASE_URL}/leaves/${leaveId}`,
        { status: newStatus },
        config
      );

      if (!response.data) {
        throw new Error('No response data received');
      }

      console.log('Status update response:', response.data);
      await fetchLeaveRequests(); // Refresh the list after update
    } catch (error) {
      console.error(`Failed to update leave request status:`, error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        setError(`Failed to update status: ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        setError('No response received from server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderLeaveRequests = () => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Leave Requests</h3>
        <div className={styles.actions}>
          <select 
            className={styles.filterSelect}
            onChange={(e) => {
              const status = e.target.value;
              if (status) {
                const filtered = leaveRequests.filter(req => req.status === status);
                setLeaveRequests(filtered);
              } else {
                fetchLeaveRequests();
              }
            }}
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button 
            className={styles.toggleButton}
            onClick={() => toggleSection('leaveRequests')}
          >
            {expandedSections.leaveRequests ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>Loading leave requests...</div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Reason</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.noData}>
                  No leave requests found
                </td>
              </tr>
            ) : (
              leaveRequests
                .slice(0, expandedSections.leaveRequests ? undefined : 3)
                .map((req) => (
                  <tr key={req.id}>
                    <td>
                      <div className={styles.userCell}>
                        <div>
                          <div>{req.employee.name}</div>
                          <span>{req.employee.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>{req.leaveType}</td>
                    <td>
                      {req.startDate === req.endDate 
                        ? formatDate(req.startDate)
                        : `${formatDate(req.startDate)} - ${formatDate(req.endDate)}`
                      }
                    </td>
                    <td className={styles.reasonCell}>{req.reason}</td>
                    <td>
                      <span className={`${styles.status} ${styles[req.status.toLowerCase()]}`}>
                        {req.status}
                      </span>
                    </td>
                    <td className={styles.actionsContainer}>
                      {/* <button 
                        className={styles.viewButton}
                        onClick={() => handleViewLeaveDetails(req.id)}
                      >
                        View Details
                      </button> */}
                      {/* {req.status === 'PENDING' && (
                        <>
                          <button 
                            className={styles.approveButton}
                            onClick={() => updateLeaveStatus(req.id, 'APPROVED')}
                          >
                            Approve
                          </button>
                          <button 
                            className={styles.rejectButton}
                            onClick={() => updateLeaveStatus(req.id, 'REJECTED')}
                          >
                            Reject
                          </button>
                        </>
                      )} */}
                      {/* <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteLeave(req.id)}
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderTasks = () => (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3>Active Tasks</h3>
        <div className={styles.actions}>
          <select 
            className={styles.filterSelect}
            onChange={(e) => {
              const priority = e.target.value;
              if (priority) {
                const filtered = tasks.filter(task => task.priority === priority);
                setTasks(filtered);
              } else {
                fetchTasks();
              }
            }}
          >
            <option value="">All Priorities</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
          <button 
            className={styles.toggleButton}
            onClick={() => toggleSection('tasks')}
          >
            {expandedSections.tasks ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>Loading tasks...</div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Assigned To</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="7" className={styles.noData}>
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks
                .slice(0, expandedSections.tasks ? undefined : 3)
                .map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td className={styles.descriptionCell}>{task.description}</td>
                    <td>{task.assignedTo}</td>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>
                      <span className={`${styles.priority} ${styles[task.priority.toLowerCase()]}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.status} ${task.completed ? styles.completed : styles.pending}`}>
                        {task.completed ? 'Completed' : 'Pending'}
                      </span>
                    </td>
                    {/* <td className={styles.actionsContainer}>
                      <button 
                        className={styles.viewButton}
                        onClick={() => }
                      >
                        View Details
                      </button>
                      {!task.completed && (
                        <button 
                          className={styles.completeButton}
                          onClick={() => }
                        >
                          Mark Complete
                        </button>
                      )}
                    </td> */}
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderEditModal = () => {
    if (!isEditModalOpen || !selectedEmployee) return null;

    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modal}>
          <h2>Edit Employee</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const updatedData = {
              firstName: formData.get('firstName'),
              lastName: formData.get('lastName'),
              email: formData.get('email'),
              phone: formData.get('phone'),
              department: formData.get('department'),
              jobTitle: formData.get('jobTitle'),
              salary: formData.get('salary'),
              hireDate: formData.get('hireDate'),
              status: formData.get('status')
            };
            handleUpdateEmployee(updatedData);
          }}>
            <div className={styles.formGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                defaultValue={selectedEmployee.firstName}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                defaultValue={selectedEmployee.lastName}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                defaultValue={selectedEmployee.email}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                defaultValue={selectedEmployee.phone}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Department</label>
              <select name="department" defaultValue={selectedEmployee.department} required>
                <option value="Engineering">Engineering</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
                <option value="Finance">Finance</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                defaultValue={selectedEmployee.jobTitle}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Salary</label>
              <input
                type="number"
                name="salary"
                defaultValue={selectedEmployee.salary}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Hire Date</label>
              <input
                type="date"
                name="hireDate"
                defaultValue={selectedEmployee.hireDate.split('T')[0]}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label>Status</label>
              <select name="status" defaultValue={selectedEmployee.status} required>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className={styles.modalActions}>
              <button 
                type="submit" 
                className={styles.saveButton}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedEmployee(null);
                  setError(null);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderEmployeeTable = () => (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Job Title</th>
            <th>Hire Date</th>
            <th>Salary</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="7" className={styles.noData}>
                No employees found
              </td>
            </tr>
          ) : (
            employees
              .slice(0, expandedSections.employees ? undefined : 3)
              .map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div className={styles.userCell}>
                      <div>
                        <div>{`${emp.firstName} ${emp.lastName}`}</div>
                        <span>{emp.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>{emp.department}</td>
                  <td>{emp.jobTitle}</td>
                  <td>{formatDate(emp.hireDate)}</td>
                  <td>{formatSalary(emp.salary)}</td>
                  <td>
                    <span className={`${styles.status} ${styles[emp.status?.toLowerCase()]}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className={styles.actionsContainer}>
                    {/* <button 
                      className={styles.editButton}
                      onClick={() => handleEditEmployee(emp.id)}
                    >
                      <MdEdit className={styles.actionIcon} />
                      Edit
                    </button> */}
                    {/* <button 
                      className={styles.viewButton}
                      onClick={() => }
                    >
                      View Details
                    </button> */}
                    {/* <button 
                      className={styles.deleteButton}
                      onClick={() => handleDeleteEmployee(emp.id)}
                    >
                      <MdDelete className={styles.actionIcon} />
                      Delete
                    </button> */}
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );

  const renderOverviewCards = () => (
    <section className={styles.overview}>
      <h2 className={styles.title}>Admin Overview</h2>
      <div className={styles.cardsContainer}>
        {[
          { icon: <FaUsers />, value: employees.length, label: "Total Employees", class: styles.totalIcon },
          { icon: <FaCheckCircle />, value: employees.filter(e => e.status === "Active").length, label: "Active Employees", class: styles.presentIcon },
          { icon: <FaEnvelopeOpenText />, value: leaveRequests.length, label: "Leave Requests", class: styles.leaveIcon },
          { icon: <FaTasks />, value: tasks.filter(t => !t.completed).length, label: "Active Tasks", class: styles.taskIcon },
        ].map((card, i) => (
          <div className={styles.card} key={i}>
            <div className={`${styles.cardIcon} ${card.class}`}>{card.icon}</div>
            <div className={styles.cardValue}>{card.value}</div>
            <div className={styles.cardLabel}>{card.label}</div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
        <div className={styles.container}>

    <main className={styles.content}>
      {renderOverviewCards()}

      {/* Employee Management */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3>Employee Management</h3>
          <div className={styles.actions}>
            <select 
              value={selectedDepartment}
              onChange={(e) => handleDepartmentChange(e.target.value)}
              className={styles.departmentSelect}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            <input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className={styles.searchInput}
            />
            {/* <button className={styles.addButton}>
              <AiOutlinePlus style={{ marginRight: '6px' }} />
              Add Employee
            </button> */}
            <button 
              className={styles.toggleButton}
              onClick={() => toggleSection('employees')}
            >
              {expandedSections.employees ? 'Show Less' : 'Show More'}
            </button>
          </div>
        </div>

        {loading && (
          <div className={styles.loading}>Loading employees...</div>
        )}

        {error && (
          <div className={styles.error}>{error}</div>
        )}

        {renderEmployeeTable()}
      </section>

      {renderLeaveRequests()}
      {renderTasks()}
      {renderEditModal()}
    
    </main>
     <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          Copyright © 2025 Kodvix Technologies. All Rights Reserved.
        </div>
        <div className={styles.footerRight}>
          <a
            href="https://www.kodvix.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kodvix Technologies
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
