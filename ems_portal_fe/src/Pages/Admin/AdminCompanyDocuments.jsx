import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoDocumentTextOutline, IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import './AdminCompanyDocuments.css';

const AdminCompanyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');

  const documentTypes = [
    'Policy',
    'Procedure',
    'Form',
    'Guideline',
    'Template',
    'Other'
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://192.168.1.19:8080/api/company-documents', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setDocuments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch documents. Please try again.');
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setError('Please select a file and document type');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('type', documentType);
      formData.append('description', description);

      const response = await axios.post('http://192.168.1.19:8080/api/company-documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      setDocuments([...documents, response.data]);
      setSelectedFile(null);
      setDocumentType('');
      setDescription('');
      setUploadProgress(0);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`http://192.168.1.19:8080/api/company-documents/${documentId}`);
      setDocuments(documents.filter(doc => doc.id !== documentId));
      setError(null);
    } catch (err) {
      setError('Failed to delete document. Please try again.');
      console.error('Error deleting document:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await axios.get(`http://192.168.1.19:8080/api/company-documents/${documentId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download document. Please try again.');
      console.error('Error downloading document:', err);
    }
  };

  return (
    <div className="company-documents-container">
      <div className="documents-header">
        <h2>Company Documents</h2>
        <div className="upload-section">
          <div className="upload-form">
            <div className="form-group">
              <label>Document Type:</label>
              <select 
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                required
              >
                <option value="">Select Type</option>
                {documentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter document description"
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>File:</label>
              <input
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
            </div>

            {selectedFile && (
              <div className="selected-file">
                <IoDocumentTextOutline />
                <span>{selectedFile.name}</span>
              </div>
            )}

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div 
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                />
                <span>{uploadProgress}%</span>
              </div>
            )}

            <button
              className="upload-button"
              onClick={handleUpload}
              disabled={loading || !selectedFile || !documentType}
            >
              <IoCloudUploadOutline />
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="documents-list">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Description</th>
              <th>Upload Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map(doc => (
              <tr key={doc.id}>
                <td>{doc.type}</td>
                <td>{doc.fileName}</td>
                <td>{doc.description}</td>
                <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                <td>
                  <div className="document-actions">
                    <button
                      className="download-button"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                    >
                      <IoDocumentTextOutline />
                      Download
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <IoTrashOutline />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="no-documents">
                  No documents found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCompanyDocuments; 