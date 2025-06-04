import React, { useState, useEffect } from 'react';
import { 
  IoBusinessOutline, 
  IoFolderOutline, 
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoArrowBackOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoAddOutline
} from "react-icons/io5";
import axios from 'axios';
import styles from "./AdminTask.module.css";
const API_BASE_URL = 'http://192.168.1.10:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      console.error('Network Error: Please check your connection and try again');
      return Promise.reject(new Error('Network Error: Please check your connection and try again'));
    }
    
    if (error.response?.status === 500) {
      console.error('Server Error:', error.response.data);
      return Promise.reject(new Error('Server Error: Please try again later'));
    }

    return Promise.reject(error);
  }
);




const formatDateForAPI = (dateString) => {
  if (!dateString) return null;
  return `${dateString}T10:00:00`;
};

const AdminTask = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [view, setView] = useState('companies');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: '',
    dueDate: '',
    priority: ''
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignStep, setAssignStep] = useState(1);
  const [assignData, setAssignData] = useState({
    companyId: null,
    projectId: '',
    taskId: null,
    developerId: null,
    deadline: '',
    priority: 'Medium'
  });
  const [isNewCompanyModalOpen, setIsNewCompanyModalOpen] = useState(false);
  const [newCompanyData, setNewCompanyData] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    email: '',
    websiteUrl: ''
  });
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'NOT_STARTED',
    companyId: null
  });
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    status: 'NOT_STARTED',
    dueDate: '',
    priority: 'MEDIUM',
    projectId: '' ,
    team: 'frontend'
  });

  useEffect(() => {
    let isMounted = true;

    const initializeData = async () => {
      try {
        setLoading(true);
        
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          setAdminEmail(userData.email);
        }

        await Promise.all([fetchCompanies(), fetchEmployees()]);
        
        if (isMounted) {
          setError(null);
        }
      } catch (err) {
        console.error('Error initializing data:', err);
        if (err.message.includes('Network')) {
          setError('Network Error: Please check your connection and try again');
        } else {
          setError('Failed to load data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeData();

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching companies:', err);
      throw err;
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employee');
      setEmployees(response.data);
      return response.data;
    } catch (err) {
      console.error('Error fetching employees:', err);
      throw err;
    }
  };

  const createCompany = async (companyData) => {
    try {
      const response = await api.post('/companies', companyData);
      setCompanies(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to create company');
      throw err;
    }
  };

  const updateCompany = async (id, companyData) => {
    try {
      const response = await api.put(`/companies/${id}`, companyData);
      setCompanies(prev => prev.map(company => 
        company.id === id ? response.data : company
      ));
      return response.data;
    } catch (err) {
      setError('Failed to update company');
      throw err;
    }
  };

  const deleteCompany = async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      setCompanies(prev => prev.filter(company => company.id !== id));
    } catch (err) {
      setError('Failed to delete company');
      throw err;
    }
  };

  const createProject = async (projectData) => {
    try {
      const response = await api.post('/projects', {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        companyId: projectData.companyId
      });

      if (selectedCompany) {
        setSelectedCompany(prev => ({
          ...prev,
          projects: [...prev.projects, response.data]
        }));
      }
      return response.data;
    } catch (err) {
      setError('Failed to create project');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      const response = await api.put(`/projects/${id}`, {
        name: projectData.name,
        description: projectData.description,
        status: projectData.status,
        startDate: projectData.startDate,
        endDate: projectData.endDate,
        companyId: projectData.companyId
      });

      if (selectedCompany) {
        setSelectedCompany(prev => ({
          ...prev,
          projects: prev.projects.map(project =>
            project.id === id ? response.data : project
          )
        }));
      }
      return response.data;
    } catch (err) {
      setError('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      if (selectedCompany) {
        setSelectedCompany(prev => ({
          ...prev,
          projects: prev.projects.filter(project => project.id !== id)
        }));
      }
    } catch (err) {
      setError('Failed to delete project');
      throw err;
    }
  };

  const getAllProjects = async () => {
    try {
      const response = await api.get('/projects');
      return response.data;
    } catch (err) {
      setError('Failed to fetch projects');
      throw err;
    }
  };

  const getProjectById = async (id) => {
    try {
      const response = await api.get(`/projects/${id}`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch project details');
      throw err;
    }
  };

  const createTask = async (taskData) => {
    try {
      const formattedTaskData = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority.toUpperCase(),
        completed: false,
        dueDate: formatDateForAPI(taskData.dueDate),
        assignedTo: taskData.assignedTo,
        progress: taskData.status.toUpperCase(),
        projectId: taskData.projectId,
        empId: taskData.assignedTo
      };

      const response = await api.post('/tasks', formattedTaskData);

      if (selectedProject) {
        setSelectedProject(prev => ({
          ...prev,
          tasks: [...(prev.tasks || []), response.data]
        }));
      }

      return response.data;
    } catch (err) {
      console.error('Error creating task:', err);
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const formattedTaskData = {
        title: taskData.title.trim(),
        description: taskData.description.trim(),
        priority: taskData.priority.toUpperCase(),
        completed: taskData.status === 'COMPLETED',
        dueDate: formatDateForAPI(taskData.dueDate),
        assignedTo: taskData.assignedTo,
        progress: taskData.status.toUpperCase(),
        projectId: taskData.projectId
      };

      const response = await api.put(`/tasks/${id}`, formattedTaskData);

      if (selectedProject) {
        setSelectedProject(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === id ? response.data : task
          )
        }));
      }

      return response.data;
    } catch (err) {
      console.error('Error updating task:', err);
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      if (selectedProject) {
        setSelectedProject(prev => ({
          ...prev,
          tasks: prev.tasks.filter(task => task.id !== id)
        }));
      }
    } catch (err) {
      setError('Failed to delete task');
      throw err;
    }
  };

  const markTaskAsCompleted = async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}/complete`);
      if (selectedProject) {
        setSelectedProject(prev => ({
          ...prev,
          tasks: prev.tasks.map(task =>
            task.id === id ? response.data : task
          )
        }));
      }
      return response.data;
    } catch (err) {
      setError('Failed to mark task as completed');
      throw err;
    }
  };

  const handleCompanyClick = async (company) => {
    try {
      setLoading(true);
      const response = await api.get(`/companies/${company.id}`);
      setSelectedCompany(response.data);
      setSelectedProject(null);
      setView('projects');
    } catch (err) {
      console.error('Error fetching company:', err);
      if (err.message.includes('Network')) {
        setError('Network Error: Please check your connection and try again');
      } else {
        setError('Failed to fetch company details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = async (project) => {
    try {
      setLoading(true);
      const response = await api.get(`/projects/${project.id}`);
      if (response.data) {
        setSelectedProject(response.data);
        setView('tasks');
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      if (err.message.includes('Network')) {
        setError('Network Error: Please check your connection and try again');
      } else {
        setError('Failed to fetch project details. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (view === 'tasks') {
      setView('projects');
      setSelectedProject(null);
    } else if (view === 'projects') {
      setView('companies');
      setSelectedCompany(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return <IoCheckmarkCircleOutline className={`${styles.statusIcon} ${styles.completed}`} />;
      case 'IN_PROGRESS':
        return <IoTimeOutline className={`${styles.statusIcon} ${styles.inProgress}`} />;
      default:
        return <IoTimeOutline className={`${styles.statusIcon} ${styles.notStarted}`} />;
    }
  };

  const handleEditTask = async (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo,
      status: task.progress || task.status,
      dueDate: task.dueDate.split('T')[0],
      priority: task.priority,
      projectId: task.projectId,
      team: task.team
    });
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(taskId);
      } catch (err) {
        setError('Failed to delete task');
        console.error('Error deleting task:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (editingTask) {
        if (!formData.title.trim()) {
          setError('Task title is required');
          return;
        }

        if (!formData.description.trim()) {
          setError('Task description is required');
          return;
        }

        if (!formData.assignedTo) {
          setError('Please assign the task to a team member');
          return;
        }

        if (!formData.dueDate) {
          setError('Due date is required');
          return;
        }

        console.log('Submitting updated task data:', formData);
        await updateTask(editingTask.id, formData);
      }

      setIsModalOpen(false);
      setEditingTask(null);
      setFormData({
        title: '',
        description: '',
        assignedTo: '',
        status: '',
        dueDate: '',
        priority: ''
      });

      if (selectedProject) {
        await handleProjectClick(selectedProject);
      }
    } catch (err) {
      console.error('Error updating task:', err);
      if (err.response?.status === 500) {
        const errorMessage = err.response?.data?.message || 'Server error occurred';
        setError(`Server error: ${errorMessage}`);
      } else {
        setError(err.response?.data?.message || 'Failed to update task. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAssignTask = () => {
    setIsAssignModalOpen(true);
    setAssignStep(1);
    setAssignData({
      companyId: null,
      projectId: null,
      taskId: null,
      developerId: null,
      deadline: '',
      priority: 'Medium'
    });
  };

  const handleAssignStepChange = (step) => {
    setAssignStep(step);
  };

  const handleAssignDataChange = (field, value) => {
    setAssignData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    console.log('Assigning task:', assignData);
    setIsAssignModalOpen(false);
    setAssignStep(1);
  };

  const handleNewCompanySubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const companyData = {
        name: newCompanyData.name,
        address: newCompanyData.address,
        phoneNumber: newCompanyData.phoneNumber,
        email: newCompanyData.email,
        websiteUrl: newCompanyData.websiteUrl
      };

      const response = await createCompany(companyData);

      setNewCompanyData({
        name: '',
        address: '',
        phoneNumber: '',
        email: '',
        websiteUrl: ''
      });
      setIsNewCompanyModalOpen(false);
    } catch (err) {
      console.error('Error creating company:', err);
      setError(err.response?.data?.message || 'Failed to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setNewCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewProjectSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const projectData = {
        name: newProjectData.name.trim(),
        description: newProjectData.description.trim(),
        startDate: newProjectData.startDate,
        endDate: newProjectData.endDate,
        status: newProjectData.status,
        companyId: selectedCompany.id
      };

      const response = await createProject(projectData);

      if (response) {
        setNewProjectData({
          name: '',
          description: '',
          startDate: '',
          endDate: '',
          status: 'NOT_STARTED',
          companyId: null
        });
        setIsNewProjectModalOpen(false);
      }
    } catch (err) {
      console.error('Error creating project:', err);
      setError(err.response?.data?.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewProjectInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNewTaskSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (!selectedProject?.id) {
        setError('No project selected');
        return;
      }

      const taskData = {
        ...newTaskData,
        projectId: selectedProject.id,
        status: newTaskData.status.toUpperCase(),
        priority: newTaskData.priority.toUpperCase()
      };

      const response = await createTask(taskData);

      if (response) {
        setNewTaskData({
          title: '',
          description: '',
          assignedTo: '',
          status: 'NOT_STARTED',
          dueDate: '',
          priority: 'MEDIUM',
          projectId: null,
          team: 'frontend'
        });
        setIsNewTaskModalOpen(false);
        await handleProjectClick(selectedProject);
      }
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewTaskInputChange = (e) => {
    const { name, value } = e.target;
    setNewTaskData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatStatus = (status) => {
    if (!status) return 'Not Started';
    return status
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  const renderCompanies = () => (
    <div className={styles.companiesContainer}>
      <div className={styles.companiesHeader}>
        <h2>Companies</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsNewCompanyModalOpen(true)}
        >
          <IoAddOutline /> Add New Company
        </button>
      </div>
      
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading companies...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setError(null);
              fetchCompanies();
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
      <div className={styles.companiesGrid}>
          {companies.length === 0 ? (
            <div className={styles.noCompanies}>
              <p>No companies found. Add your first company!</p>
            </div>
          ) : (
            companies.map(company => (
          <div 
            key={company.id} 
            className={styles.companyCard}
            onClick={() => handleCompanyClick(company)}
          >
            <div className={styles.companyInfo}>
              <h3>{company.name}</h3>
                  <div className={styles.companyDetails}>
                    <span><IoBusinessOutline /> {company.address}</span>
                    <span><IoPersonOutline /> {company.email}</span>
                    <span><IoTimeOutline /> {company.phoneNumber}</span>
                    <span><IoFolderOutline /> {company.websiteUrl}</span>
                    <span><IoFolderOutline /> {company.projects?.length || 0} Projects</span>
              </div>
            </div>
          </div>
            ))
          )}
      </div>
      )}
      
      {isNewCompanyModalOpen && renderNewCompanyModal()}
    </div>
  );

  const renderProjects = () => {
    if (!selectedCompany) {
      return null;
    }

    return (
      <div className={styles.projectsContainer}>
        <div className={styles.projectsHeader}>
          <h2>Projects</h2>
          <button
            className={styles.addButton}
            onClick={() => setIsNewProjectModalOpen(true)}
          >
            <IoAddOutline /> Add New Project
          </button>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading projects...</p>
          </div>
        )}

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>{error}</p>
            <button 
              className={styles.retryButton}
              onClick={() => {
                setError(null);
                handleCompanyClick(selectedCompany);
              }}
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && (
        <div className={styles.projectsGrid}>
            {selectedCompany.projects?.length === 0 ? (
              <div className={styles.noProjects}>
                <p>No projects found. Add your first project!</p>
              </div>
            ) : (
              selectedCompany.projects?.map(project => {
                const status = project.status || 'NOT_STARTED';
                const statusLower = status.toLowerCase().replace('_', ' ');
            
            return (
              <div 
                key={project.id} 
                className={styles.projectCard}
                onClick={() => handleProjectClick(project)}
              >
                <div className={styles.projectInfo}>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className={styles.projectStats}>
                    <span>{project.tasks?.length || 0} Tasks</span>
                    <span>
                          {project.tasks?.filter(task => task.status === 'COMPLETED').length || 0} Completed
                    </span>
                    <span 
                      className={styles.projectStatus} 
                      data-status={statusLower}
                    >
                          {statusLower}
                    </span>
                  </div>
                  <div className={styles.projectDates}>
                    <span>Start: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</span>
                    <span>End: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</span>
                  </div>
                </div>
              </div>
            );
              })
            )}
        </div>
        )}
        
        {isNewProjectModalOpen && renderNewProjectModal()}
      </div>
    );
  };

  const renderTasks = () => (
    <div className={styles.tasksContainer}>
      <div className={styles.tasksHeader}>
        <h2>Tasks</h2>
        <div className={styles.taskActions}>
          <button
            className={styles.addButton}
            onClick={() => setIsNewTaskModalOpen(true)}
          >
            <IoAddOutline /> Add New Task
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading tasks...</p>
        </div>
      )}

      {error && (
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => {
              setError(null);
              handleProjectClick(selectedProject);
            }}
          >
            Retry
          </button>
        </div>
      )}
      {!loading && !error && (
        <div className={styles.tasksContent}>
          {!selectedProject?.tasks || selectedProject.tasks.length === 0 ? (
            <div className={styles.noTasks}>
              <p>No tasks found. Add your first task!</p>
            </div>
          ) : (
      <table className={styles.tasksTable}>
        <thead className={styles.tableHeader}>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Team</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
                {selectedProject.tasks.map(task => (
            <tr key={task.id} className={styles.tableRow}>
              <td className={styles.tableCell}>{task.title}</td>
              <td className={styles.tableCell}>{task.description}</td>
              <td className={styles.tableCell}>
                <span className={styles.teamBadge} data-team={task.team}>
                  {task.team === 'frontend' ? 'Frontend' : 'Backend'}
                </span>
              </td>
              <td className={styles.tableCell}>
                {employees.find(emp => emp.id === task.empId)?.name || 'Unassigned'}
              </td>
                <td className={styles.tableCell}>
                <span className={`${styles.statusBadge} ${styles[task.progress?.toLowerCase() || 'not_started']}`}>
                  {formatStatus(task.progress || task.status)}
                </span>
              </td>
              <td className={styles.tableCell}>{new Date(task.dueDate).toLocaleDateString()}</td>
              <td className={styles.tableCell}>
                <span className={`${styles.priorityBadge} ${styles[task.priority?.toLowerCase()]}`}>
                  {task.priority}
                </span>
              </td>
              <td className={styles.tableCell}>
                <div className={styles.taskActions}>
                  <button 
                    className={styles.editButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTask(task);
                    }}
                    title="Edit Task"
                  >
                    <IoPencilOutline />
                  </button>
                  <button 
                    className={styles.deleteButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task.id);
                    }}
                    title="Delete Task"
                  >
                    <IoTrashOutline />
                  </button>
                  {task.progress !== 'COMPLETED' && (
                    <button 
                      className={styles.completeButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        markTaskAsCompleted(task.id);
                      }}
                      title="Mark as Completed"
                    >
                      <IoCheckmarkCircleOutline />
                    </button>
                  )}
                </div>
              </td>
            </tr>
                ))}
        </tbody>
      </table>
          )}
        </div>
      )}
      
      {isNewTaskModalOpen && renderNewTaskModal()}
      {isModalOpen && renderEditTaskModal()}
    </div>
  );

  const renderNewCompanyModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add New Company</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsNewCompanyModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form onSubmit={handleNewCompanySubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="companyName">Company Name *</label>
            <input
              type="text"
              id="companyName"
              name="name"
              value={newCompanyData.name}
              onChange={handleNewCompanyInputChange}
              required
              placeholder="Enter company name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyAddress">Address</label>
            <input
              type="text"
              id="companyAddress"
              name="address"
              value={newCompanyData.address}
              onChange={handleNewCompanyInputChange}
              placeholder="Enter company address"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyPhone">Phone Number</label>
            <input
              type="tel"
              id="companyPhone"
              name="phoneNumber"
              value={newCompanyData.phoneNumber}
              onChange={handleNewCompanyInputChange}
              placeholder="Enter phone number"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyEmail">Email</label>
            <input
              type="email"
              id="companyEmail"
              name="email"
              value={newCompanyData.email}
              onChange={handleNewCompanyInputChange}
              placeholder="Enter company email"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="companyWebsite">Website URL</label>
            <input
              type="url"
              id="companyWebsite"
              name="websiteUrl"
              value={newCompanyData.websiteUrl}
              onChange={handleNewCompanyInputChange}
              placeholder="Enter website URL"
            />
          </div>
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => setIsNewCompanyModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNewProjectModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add New Project</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsNewProjectModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form onSubmit={handleNewProjectSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="projectName">Project Name *</label>
            <input
              type="text"
              id="projectName"
              name="name"
              value={newProjectData.name}
              onChange={handleNewProjectInputChange}
              required
              placeholder="Enter project name"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectDescription">Description</label>
            <textarea
              id="projectDescription"
              name="description"
              value={newProjectData.description}
              onChange={handleNewProjectInputChange}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectStartDate">Start Date</label>
            <input
              type="date"
              id="projectStartDate"
              name="startDate"
              value={newProjectData.startDate}
              onChange={handleNewProjectInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectEndDate">End Date</label>
            <input
              type="date"
              id="projectEndDate"
              name="endDate"
              value={newProjectData.endDate}
              onChange={handleNewProjectInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="projectStatus">Status</label>
            <select
              id="projectStatus"
              name="status"
              value={newProjectData.status}
              onChange={handleNewProjectInputChange}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => setIsNewProjectModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderNewTaskModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Add New Task</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsNewTaskModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form onSubmit={handleNewTaskSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="taskTitle">Title *</label>
            <input
              type="text"
              id="taskTitle"
              name="title"
              value={newTaskData.title}
              onChange={handleNewTaskInputChange}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskDescription">Description</label>
            <textarea
              id="taskDescription"
              name="description"
              value={newTaskData.description}
              onChange={handleNewTaskInputChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskAssignedTo">Assigned To</label>
            <select
              id="taskAssignedTo"
              name="assignedTo"
              value={newTaskData.assignedTo}
              onChange={handleNewTaskInputChange}
            >
              <option value="">Select team member</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskTeam">Team</label>
            <select
              id="taskTeam"
              name="team"
              value={newTaskData.team}
              onChange={handleNewTaskInputChange}
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskStatus">Status</label>
            <select
              id="taskStatus"
              name="status"
              value={newTaskData.status}
              onChange={handleNewTaskInputChange}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskDueDate">Due Date</label>
            <input
              type="date"
              id="taskDueDate"
              name="dueDate"
              value={newTaskData.dueDate}
              onChange={handleNewTaskInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="taskPriority">Priority</label>
            <select
              id="taskPriority"
              name="priority"
              value={newTaskData.priority}
              onChange={handleNewTaskInputChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => setIsNewTaskModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderEditTaskModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Edit Task</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskTitle">Title *</label>
            <input
              type="text"
              id="editTaskTitle"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskDescription">Description</label>
            <textarea
              id="editTaskDescription"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskAssignedTo">Assigned To</label>
            <select
              id="editTaskAssignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
            >
              <option value="">Select team member</option>
              {employees.map(employee => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.email}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskStatus">Status</label>
            <select
              id="editTaskStatus"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskDueDate">Due Date</label>
            <input
              type="date"
              id="editTaskDueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="editTaskPriority">Priority</label>
            <select
              id="editTaskPriority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>
          <div className={styles.modalActions}>
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  
  const renderAssignTaskModal = () => (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Assign Task</h3>
          <button 
            className={styles.closeButton}
            onClick={() => setIsAssignModalOpen(false)}
          >
            <IoCloseOutline />
          </button>
        </div>
        <form onSubmit={handleAssignSubmit} className={styles.modalForm}>
          {assignStep === 1 && (
            <>
              <h4>Step 1: Select Company</h4>
              <div className={styles.formGroup}>
                <label>Company</label>
                <select
                  value={assignData.companyId || ''}
                  onChange={(e) => handleAssignDataChange('companyId', e.target.value)}
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setIsAssignModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className={styles.submitButton}
                  onClick={() => handleAssignStepChange(2)}
                  disabled={!assignData.companyId}
                >
                  Next
                </button>
              </div>
            </>
          )}
          
          {assignStep === 2 && (
            <>
              <h4>Step 2: Select Project</h4>
              <div className={styles.formGroup}>
                <label>Project</label>
                <select
                  value={assignData.projectId || ''}
                  onChange={(e) => handleAssignDataChange('projectId', e.target.value)}
                  required
                >
                  <option value="">Select a project</option>
                  {companies
                    .find(c => c.id == assignData.companyId)
                    ?.projects?.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => handleAssignStepChange(1)}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className={styles.submitButton}
                  onClick={() => handleAssignStepChange(3)}
                  disabled={!assignData.projectId}
                >
                  Next
                </button>
              </div>
            </>
          )}
          
          {assignStep === 3 && (
            <>
              <h4>Step 3: Select Task</h4>
              <div className={styles.formGroup}>
                <label>Task</label>
                <select
                  value={assignData.taskId || ''}
                  onChange={(e) => handleAssignDataChange('taskId', e.target.value)}
                  required
                >
                  <select
  value={newTaskData.assignedTo}
  onChange={(e) =>
    setNewTaskData({ ...newTaskData, assignedTo: e.target.value })
  }
>
  <option value="">Select Employee</option>
  {employees.map((emp) => (
    <option key={emp.id} value={emp.id}>
      {emp.name} ({emp.email})
    </option>
  ))}
</select>

                  <option value="">Select a task</option>
                  {companies
                    .find(c => c.id == assignData.companyId)
                    ?.projects?.find(p => p.id == assignData.projectId)
                    ?.tasks?.map(task => (
                      <option key={task.id} value={task.id}>
                        {task.title}
                      </option>
                    ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => handleAssignStepChange(2)}
                >
                  Back
                </button>
                <button 
                  type="button" 
                  className={styles.submitButton}
                  onClick={() => handleAssignStepChange(4)}
                  disabled={!assignData.taskId}
                >
                  Next
                </button>
              </div>
            </>
          )}
          
          {assignStep === 4 && (
            <>
              <h4>Step 4: Assign Developer</h4>
              <div className={styles.formGroup}>
                <label>Developer</label>
                <select
                  value={assignData.developerId || ''}
                  onChange={(e) => handleAssignDataChange('developerId', e.target.value)}
                  required
                >
                  <option value="">Select a developer</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Deadline</label>
                <input
                  type="date"
                  value={assignData.deadline}
                  onChange={(e) => handleAssignDataChange('deadline', e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Priority</label>
                <select
                  value={assignData.priority}
                  onChange={(e) => handleAssignDataChange('priority', e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className={styles.modalActions}>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => handleAssignStepChange(3)}
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  className={styles.submitButton}
                  disabled={!assignData.developerId || !assignData.deadline}
                >
                  Assign Task
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );

  if (loading && companies.length === 0) {
    return (
      <div className={styles.adminTaskContainer}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.adminTaskContainer}>
      <div className={styles.adminHeader}>
        <div className={styles.breadcrumb}>
          {view !== 'companies' && (
            <button className={styles.backButton} onClick={handleBack}>
              <IoArrowBackOutline /> Back
            </button>
          )}
          <div className={styles.breadcrumbText}>
            <span 
              className={view === 'companies' ? styles.active : ''}
              onClick={() => {
                setView('companies');
                setSelectedCompany(null);
                setSelectedProject(null);
              }}
            >
              Companies
            </span>
            {selectedCompany && (
              <>
                <span className={styles.separator}>/</span>
                <span 
                  className={view === 'projects' ? styles.active : ''}
                  onClick={() => {
                    setView('projects');
                    setSelectedProject(null);
                  }}
                >
                  {selectedCompany.name}
                </span>
              </>
            )}
            {selectedProject && (
              <>
                <span className={styles.separator}>/</span>
                <span className={styles.active}>
                  {selectedProject.name}
                </span>
              </>
            )}
          </div>
        </div>
        <div className={styles.adminInfo}>
          {/* <span>Admin: {adminEmail}</span> */}
        <span>Admin </span> 
        </div>
      </div>

      <div className={styles.adminContent}>
        {view === 'companies' && renderCompanies()}
        {view === 'projects' && renderProjects()}
        {view === 'tasks' && renderTasks()}
      </div>

      {isAssignModalOpen && renderAssignTaskModal()}
    </div>
  );
};

export default AdminTask;