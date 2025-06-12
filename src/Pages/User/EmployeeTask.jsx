

import React, { useState, useEffect } from 'react';
import styles from './EmployeeTask.module.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import {
//   getTaskById,
  
//   getProjectId,
//   getCompanyId
// } from '../../Services/Services';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

// Configure axios with base URL
axios.defaults.baseURL = 'http://192.168.1.32:8080';

const EmployeeTask = () => {
  const [tasksData, setTasksData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [view, setView] = useState('current');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New state for company and project filtering
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(false);

  // Get user info from AuthContext (optional now)
  const { employeeId, currentUser } = useAuth();

  // Fetch all companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const response = await axios.get('/api/companies');
        setCompanies(response.data);
        
        // Auto-select first company if available
        if (response.data.length > 0) {
          setSelectedCompany(response.data[0].name);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        toast.error('Failed to fetch companies.');
        setError('Failed to fetch companies. Please try again later.');
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, []);

  // Fetch projects when company is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedCompany) {
        setProjects([]);
        setSelectedProject('');
        return;
      }

      try {
        setLoadingProjects(true);
        
        // First try to get projects for the specific company
        const response = await axios.get('/api/companies');
        const company = response.data.find(c => c.name === selectedCompany);
        
        if (company && company.projects) {
          setProjects(company.projects);
          // Auto-select first project if available
          if (company.projects.length > 0) {
            setSelectedProject(company.projects[0].name);
          } else {
            setSelectedProject('');
          }
        } else {
          // Fallback: try to get projects directly
          try {
            const projectsResponse = await axios.get('/api/projects');
            // Filter projects by company if there's a companyId or similar field
            const filteredProjects = projectsResponse.data.filter(project => 
              project.companyId === company?.id || project.companyName === selectedCompany
            );
            setProjects(filteredProjects);
            if (filteredProjects.length > 0) {
              setSelectedProject(filteredProjects[0].name);
            }
          } catch (projectErr) {
            console.log('No direct projects endpoint available');
            setProjects([]);
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        toast.error('Failed to fetch projects.');
        setProjects([]);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [selectedCompany]);

  // Fetch tasks when company/project selection changes
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        console.log('Fetching tasks for employee:', employeeId);
        
        let allTasks = [];
        
        try {
          // Get tasks for specific employee using the correct API endpoint
          const tasksResponse = await axios.get(`/api/tasks/employee/${employeeId}`);
          allTasks = tasksResponse?.data || [];
          console.log('Got tasks for employee:', allTasks.length);
        } catch (err) {
          console.error('Error fetching tasks:', err);
          allTasks = [];
        }

        // Filter tasks by selected company and project
        let filteredTasks = allTasks;
        
        if (selectedCompany) {
          filteredTasks = filteredTasks.filter(task => {
            // If task has companyName, use it; otherwise find company by projectId
            if (task.companyName) {
              return task.companyName === selectedCompany;
            } else {
              // Find which company this project belongs to
              const company = companies.find(c => 
                c.projects && c.projects.some(p => p.id === task.projectId)
              );
              return company && company.name === selectedCompany;
            }
          });
        }
        
        if (selectedProject) {
          filteredTasks = filteredTasks.filter(task => {
            // Check if task belongs to selected project
            const project = projects.find(p => p.name === selectedProject);
            return project && task.projectId === project.id;
          });
        }

        // Format tasks with safe defaults based on the API response format
        const formatted = filteredTasks.map(task => ({
          id: task.id || 0,
          title: task.title || 'Untitled Task',
          description: task.description || '',
          dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
          status: task.completedAt ? 'COMPLETED' : 
                 (task.progress && task.progress.includes('%')) ? 'PENDING' : 'NOT_STARTED',
          progress: task.progress ? parseInt(task.progress) : 0,
          priority: task.priority || 'MEDIUM',
          assignedTo: task.assignedTo || 'Unassigned',
          projectId: task.projectId || 0,
          completedAt: task.completedAt || null,
          employeeName: task.assignedTo || 'Unassigned',
          companyName: task.companyName || selectedCompany || 'Unknown Company',
          projectName: task.projectName || selectedProject || 'Unknown Project',
          empId: task.empId || 0
        }));
        
        setTasksData(formatted);
        setError(null);
        console.log('Final formatted tasks:', formatted.length);
        
      } catch (err) {
        console.error('Error in task processing:', err);
        setError('Failed to process tasks. Please try again later.');
        toast.error('Failed to process tasks.');
        setTasksData([]);
      } finally {
        setLoading(false);
      }
    };

    if (employeeId) {
      fetchTasks();
    }
  }, [employeeId, selectedProject, projects, selectedCompany, companies]);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasksData.find(task => task.id === taskId);
      if (!taskToUpdate) return;

      // Map status to the format your API expects
      let apiProgress;
      let apiCompleted = false;
      let progress;
      let completedAt = null;

      switch (newStatus) {
        case 'COMPLETED':
          apiProgress = '100% done';
          apiCompleted = true;
          progress = 100;
          // Format the date to match the API's expected format
          const now = new Date();
          completedAt = now.toISOString(); // Keep the full ISO string format
          console.log('Setting completedAt to:', completedAt);
          break;
        case 'PENDING':
          apiProgress = '50% done';
          apiCompleted = false;
          progress = 50;
          completedAt = null;
          break;
        default:
          apiProgress = '0% done';
          apiCompleted = false;
          progress = 0;
          completedAt = null;
      }

      // Format the update payload exactly as the API expects
      const updates = {
        id: taskId,
        title: taskToUpdate.title,
        description: taskToUpdate.description,
        priority: taskToUpdate.priority,
        dueDate: taskToUpdate.dueDate.includes('T') 
          ? taskToUpdate.dueDate 
          : `${taskToUpdate.dueDate}T23:59:00`,
        assignedTo: taskToUpdate.assignedTo,
        completed: apiCompleted,
        progress: apiProgress,
        projectId: taskToUpdate.projectId,
        empId: taskToUpdate.empId || employeeId,
        completedAt: completedAt
      };

      console.log('Sending update for Task:', taskId, 'Updates:', updates);

      const response = await axios.put(`/api/tasks/${taskId}`, updates);
      
      if (response.data) {
        console.log('API Response:', response.data);
        
        // Update the tasks data with the response
        setTasksData(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId ? {
              ...task,
              ...response.data,
              status: response.data.progress === '100% done' ? 'COMPLETED' : 
                     response.data.progress === '50% done' ? 'PENDING' : 'NOT_STARTED',
              progress: response.data.progress === '100% done' ? 100 :
                       response.data.progress === '50% done' ? 50 : 0,
              dueDate: response.data.dueDate ? response.data.dueDate.split('T')[0] : task.dueDate,
              completedAt: response.data.completedAt || completedAt,
              completed: response.data.completed || apiCompleted
            } : task
          )
        );

        // Show appropriate success message
        if (newStatus === 'COMPLETED') {
          toast.success('Task marked as completed!');
        } else if (newStatus === 'PENDING') {
          toast.success('Task marked as in progress!');
        } else {
          toast.success('Task updated successfully!');
        }
        
        setSelectedTask(null);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        toast.error(`Failed to update task: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        toast.error('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', err.message);
        toast.error('Error updating task. Please try again.');
      }
    }
  };

  // Filter tasks based on search text
  const filteredTasks = tasksData.filter(task =>
    task.title.toLowerCase().includes(searchText.toLowerCase()) ||
    task.priority.toLowerCase().includes(searchText.toLowerCase())
  );

  // Filter tasks by status
  const getTasksByStatus = (status) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const notStartedTasks = getTasksByStatus('NOT_STARTED');
  const pendingTasks = getTasksByStatus('PENDING');
  const completedTasks = getTasksByStatus('COMPLETED');

  const renderTaskSection = (title, tasks, status) => (
    <div className={styles.taskSection}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.grid}>
        {tasks.length > 0 ? tasks.map(task => (
          <div key={task.id} className={styles.card}>
            <h3 className={styles.cardTitle}>{task.title}</h3>
            <p className={styles.description}>{task.description}</p>
            <p className={styles.dueDate}>Due: {task.dueDate}</p>
            <p className={styles.priority}>
              <strong>Priority:</strong> {task.priority}
            </p>
            {task.companyName && (
              <p className={styles.companyName}>
                <strong>Company:</strong> {task.companyName}
              </p>
            )}
            {task.projectName && (
              <p className={styles.projectName}>
                <strong>Project:</strong> {task.projectName}
              </p>
            )}
            <span className={`${styles.statusBadge} ${styles[task.status.toLowerCase()]}`}>
              {task.status.replace('_', ' ')}
            </span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${task.progress}%`,
                  backgroundColor:
                    task.status === 'COMPLETED' ? 'var(--success-color)' : 
                    task.status === 'PENDING' ? 'var(--warning-color)' : 'var(--gray-color)'
                }}
              />
            </div>
            <div className={styles.cardActions}>
              <button
                className={styles.viewButton}
                onClick={() => setSelectedTask(task)}
              >
                View Details
              </button>
              {status === 'NOT_STARTED' && (
                <>
                  <button
                    className={styles.startButton}
                    onClick={() => handleUpdateTaskStatus(task.id, 'PENDING')}
                  >
                    Start Task
                  </button>
                  <button
                    className={styles.completeButton}
                    onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                  >
                    Completed
                  </button>
                </>
              )}
              {status === 'PENDING' && (
                <button
                  className={styles.completeButton}
                  onClick={() => handleUpdateTaskStatus(task.id, 'COMPLETED')}
                >
                  Mark Complete
                </button>
              )}
            </div>
          </div>
        )) : <p className={styles.noTasks}>No tasks found.</p>}
      </div>
    </div>
  );

  // Show loading or error states
  if (loadingCompanies) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.main}>
          <div className={styles.loading}>Loading companies...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <ToastContainer />
      <div className={styles.main}>
        <header className={styles.header}>
          All Tasks <span className={styles.employeeId}>({currentUser?.name || 'All Employees'})</span>
        </header>

        {/* Company and Project Filters */}
        <div className={styles.filtersSection}>
          <div className={styles.filterGroup}>
            <label htmlFor="companySelect">Company:</label>
            <select
              id="companySelect"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              disabled={loadingCompanies}
              className={styles.filterSelect}
            >
              <option value="">All Companies</option>
              {companies.map(company => (
                <option key={company.id} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label htmlFor="projectSelect">Project:</label>
            <select
              id="projectSelect"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              disabled={loadingProjects || !selectedCompany}
              className={styles.filterSelect}
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.name}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.tabs}>
          <button
            className={view === 'current' ? styles.activeTab : ''}
            onClick={() => setView('current')}
          >
            Current Tasks
          </button>
          <button
            className={view === 'history' ? styles.activeTab : ''}
            onClick={() => setView('history')}
          >
            Task History
          </button>
        </div>

        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search by title or priority..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {/* Task Count Summary */}
        <div className={styles.taskSummary}>
          <span>Total Tasks: {filteredTasks.length}</span>
          <span>Not Started: {notStartedTasks.length}</span>
          <span>In Progress: {pendingTasks.length}</span>
          <span>Completed: {completedTasks.length}</span>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading tasks...</div>
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : view === 'current' ? (
          <div className={styles.currentTasks}>
            {renderTaskSection('🕒 Not Started', notStartedTasks, 'NOT_STARTED')}
            {renderTaskSection('⏳ In Progress', pendingTasks, 'PENDING')}
          </div>
        ) : (
          <div className={styles.taskHistory}>
            <h3 className={styles.sectionTitle}>Completed Tasks</h3>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Priority</th>
                  <th>Company</th>
                  <th>Project</th>
                  <th>Due Date</th>
                  <th>Assigned To</th>
                  <th>Completed At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedTasks.length > 0 ? completedTasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.priority}</td>
                    <td>{task.companyName || '-'}</td>
                    <td>{task.projectName || '-'}</td>
                    <td>{task.dueDate}</td>
                    <td>{task.assignedTo}</td>
                    <td>{task.completedAt ? new Date(task.completedAt).toLocaleString() : '-'}</td>
                    <td>
                      <button
                        className={styles.viewButton}
                        onClick={() => setSelectedTask(task)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="8">No completed tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedTask && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedTask(null)}
              >
                ✕
              </button>
              <h2>{selectedTask.title}</h2>
              <p className={styles.modalDescription}>{selectedTask.description}</p>
              <div className={styles.modalDetails}>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p><strong>Assigned To:</strong> {selectedTask.assignedTo}</p>
                <p><strong>Due Date:</strong> {selectedTask.dueDate}</p>
                <p><strong>Status:</strong> {selectedTask.status.replace('_', ' ')}</p>
                <p><strong>Project ID:</strong> {selectedTask.projectId}</p>
                {selectedTask.companyName && (
                  <p><strong>Company:</strong> {selectedTask.companyName}</p>
                )}
                {selectedTask.projectName && (
                  <p><strong>Project:</strong> {selectedTask.projectName}</p>
                )}
                {selectedTask.completedAt && (
                  <p><strong>Completed At:</strong> {new Date(selectedTask.completedAt).toLocaleString()}</p>
                )}
              </div>

              <div className={styles.progressSection}>
                <label htmlFor="progressSlider">Progress: {selectedTask.progress}%</label>
                <input
                  id="progressSlider"
                  type="range"
                  min="0"
                  max="100"
                  value={selectedTask.progress}
                  className={styles.slider}
                  disabled
                />
              </div>

              <div className={styles.modalActions}>
                {selectedTask.status === 'NOT_STARTED' && (
                  <>
                    <button
                      className={styles.startButton}
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'PENDING')}
                    >
                      Start Task
                    </button>
                    <button
                      className={styles.completeButton}
                      onClick={() => handleUpdateTaskStatus(selectedTask.id, 'COMPLETED')}
                    >
                      Mark as Complete
                    </button>
                  </>
                )}
                {selectedTask.status === 'PENDING' && (
                  <button
                    className={styles.completeButton}
                    onClick={() => handleUpdateTaskStatus(selectedTask.id, 'COMPLETED')}
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
         <footer className="footer">
        <div className="footerLeft">
          Copyright © 2025 Kodvix Technologies. All Rights Reserved.
        </div>
        <div className="footer-right">
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
     
    </div>
  );
};

export default EmployeeTask;