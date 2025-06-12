import axios from 'axios';

const API_URL = 'http://192.168.1.32:8080/api/employee-images';

export const fetchAllDocuments = () => axios.get(API_URL);

export const fetchDocumentsByEmpId = empId =>
  axios.get(`${API_URL}/emp/${empId}`);

export const fetchDocumentById = id =>
  axios.get(`${API_URL}/${id}`);

export const uploadDocument = (id, formData) =>
  axios.put(`${API_URL}/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const deleteDocument = id =>
  axios.delete(`${API_URL}/${id}`);
