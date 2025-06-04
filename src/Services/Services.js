import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.10:8080/api';

// Employee APIs
export const getEmployeeDashboard = () => axios.get(`${API_BASE_URL}/employee/dashboard/employee`);
export const getEmployeeById = (id) => axios.get(`${API_BASE_URL}/employee/${id}`);
export const getEmployeeByEmail = (email) => axios.get(`${API_BASE_URL}/employee/email/${email}`);
export const getEmployeeByDepartment = (department) => axios.get(`${API_BASE_URL}/employee/department/${department}`);

// Leave APIs
export const getLeaveRequestsByEmployeeId = (employeeId) => axios.get(`${API_BASE_URL}/leaves/employee/${employeeId}`);
export const createLeaveRequest = (employeeId, leaveData) => {
  const formData = new FormData();
  formData.append('leaveDto', JSON.stringify(leaveData));
  return axios.post(`${API_BASE_URL}/leaves/${employeeId}`, formData);
};



export const  getCompanyId  = (id , companyData) =>axios.get(`http://192.168.1.10:8080/api/companies/${id}` ,companyData);

export const getProjectId = (id, projectData) => axios.get(`http://192.168.1.10:8080/api/projects/${id}`, projectData);
// Task APIs
export const getAllTasks = () => axios.get(`${API_BASE_URL}/tasks//employee/`);
export const getTaskById = (id) => axios.get(`${API_BASE_URL}/tasks/${id}`);
export const createTask = (taskData) => axios.post(`${API_BASE_URL}/tasks`, taskData);
export const updateTask = (id, taskData) => axios.put(`${API_BASE_URL}/tasks/${id}`, taskData);
export const deleteTask = (id) => axios.delete(`${API_BASE_URL}/tasks/${id}`);
export const markTaskAsCompleted = (id) => axios.patch(`${API_BASE_URL}/tasks/${id}/complete`);

// Project APIs
export const getAllProjects = () => axios.get(`${API_BASE_URL}/projects`);
export const getProjectById = (id) => axios.get(`${API_BASE_URL}/projects/${id}`);
export const createProject = (projectData) => axios.post(`${API_BASE_URL}/projects`, projectData);
export const updateProject = (id, projectData) => axios.put(`${API_BASE_URL}/projects/${id}`, projectData);
export const deleteProject = (id) => axios.delete(`${API_BASE_URL}/projects/${id}`);

// Document APIs
export const uploadDocument = (employeeId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_BASE_URL}/documents/upload/${employeeId}`, formData);
};
export const getDocumentsByEmployeeId = (employeeId) => axios.get(`${API_BASE_URL}/documents/employee/${employeeId}`);
export const getDocumentById = (id) => axios.get(`${API_BASE_URL}/documents/${id}`);

// Address APIs
export const addAddress = (employeeId, addressData) => axios.post(`${API_BASE_URL}/addresses/${employeeId}`, addressData);
export const getAddressesByEmployeeId = (employeeId) => axios.get(`${API_BASE_URL}/addresses/employee/${employeeId}`);
export const getAddressById = (id) => axios.get(`${API_BASE_URL}/addresses/${id}`); 