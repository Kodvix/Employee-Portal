import React, { useState, useEffect } from 'react';
import styles from './AdminDocumentsPage.module.css';
import axios from 'axios';
import { FaFilePdf, FaFileWord, FaFileImage } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';

const API_BASE_URL = 'http://192.168.1.19:8080/api';

// Helper to get file extension from potential MIME type or filename
const getFileExtension = (mimeTypeOrFileName) => {
  if (!mimeTypeOrFileName) return '';
  const parts = mimeTypeOrFileName.split('/');
  if (parts.length > 1) {
    // Likely a MIME type like application/pdf
    const subtype = parts[1].toLowerCase();
    if (subtype.includes('pdf')) return '.pdf';
    if (subtype.includes('word')) return '.docx';
    if (subtype.includes('jpeg') || subtype.includes('jpg')) return '.jpg';
    if (subtype.includes('png')) return '.png';
  } else {
    // Likely a filename, get extension
    const filenameParts = mimeTypeOrFileName.split('.');
    if (filenameParts.length > 1) {
      return '.' + filenameParts.pop().toLowerCase();
    }
  }
  return '';
};

const AdminDocumentsPage = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [companyDocs, setCompanyDocs] = useState([]);
  const [personalDocs, setPersonalDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploadFiles, setUploadFiles] = useState({});
  const { isAuthenticated } = useAuth();

  // Fetch all employees on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access this page');
      return;
    }
    fetchEmployees();
  }, [isAuthenticated]);

  // Fetch documents when employee is selected
  useEffect(() => {
    if (selectedEmployee) {
      fetchEmployeeDocuments(selectedEmployee);
    }
  }, [selectedEmployee]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/employee`);
      setEmployees(response.data);
      if (response.data.length > 0) {
        setSelectedEmployee(response.data[0].id);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDocuments = async (employeeId) => {
    if (!employeeId) {
      console.warn('fetchEmployeeDocuments: Employee ID not available.');
      return;
    }
    try {
      setLoading(true);
      
      // Fetch company documents
      const companyResponse = await axios.get(`${API_BASE_URL}/employee-images/emp/${employeeId}`);
      console.log('Admin - Company documents response:', companyResponse.data);
      
      // Process company documents
      const processedCompanyDocs = [];
      
      if (companyResponse.data) {
        const doc = companyResponse.data;
        
        // Process each document type if it exists
        const documentTypes = {
          offerLetterDoc: { name: 'Offer Letter', type: 'PDF' },
          latestPaySlipDoc: { name: 'Latest Payslip', type: 'PDF' },
          doc: { name: 'Additional Document', type: 'PDF' }
        };

        Object.entries(documentTypes).forEach(([key, value]) => {
          // Check if the document array exists and has items
          if (doc[key] && Array.isArray(doc[key]) && doc[key].length > 0) {
            // Process each document in the array
            doc[key].forEach((base64Doc, index) => {
              if (base64Doc && base64Doc.trim() !== '') {
                processedCompanyDocs.push({
                  id: `${doc.id}_${key}_${index}`,
                  name: `${value.name} ${index + 1}`,
                  mimeType: 'application/pdf',
                  base64Doc: base64Doc,
                  uploadDate: doc.uploadDate || new Date().toISOString(),
                  type: value.type,
                  docType: key
                });
              }
            });
          }
        });
      }

      console.log('Processed company documents:', processedCompanyDocs);
      setCompanyDocs(processedCompanyDocs);

      // Fetch personal documents
      const personalResponse = await axios.get(`${API_BASE_URL}/documents/employee/${employeeId}`);
      console.log('Admin - Personal documents response:', personalResponse.data);
      
      // Process personal documents
      const processedPersonalDocs = Array.isArray(personalResponse.data) ? personalResponse.data.map(doc => ({
        id: doc.id,
        name: doc.name || 'Untitled Document',
        mimeType: doc.type || 'application/pdf',
        base64Doc: doc.data,
        uploadDate: doc.uploadDate || new Date().toISOString(),
        type: doc.type ? (doc.type.includes('pdf') ? 'PDF' : doc.type.includes('word') ? 'Word' : 'Other') : 'PDF'
      })).filter(doc => doc.base64Doc) : [];

      setPersonalDocs(processedPersonalDocs);

    } catch (err) {
      console.error('Error fetching documents:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        toast.error(`Failed to fetch documents: ${err.response.data?.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        console.error('Error:', err.message);
        toast.error(`Failed to fetch documents: ${err.message}`);
      }
      setCompanyDocs([]);
      setPersonalDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, JPEG, or PNG files only');
      return;
    }

    setUploadFiles(prev => ({ ...prev, [docType]: file }));
  };

  const handleCompanyDocUpload = async (docType) => {
    const file = uploadFiles[docType];
    if (!file || !selectedEmployee) {
      toast.error('Please select a file and employee');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('empId', selectedEmployee);
      formData.append('docType', docType);

      // Log the request details
      console.log('Uploading company document:');
      console.log('Employee ID:', selectedEmployee);
      console.log('Document Type:', docType);
      console.log('File:', file.name);

      // Use the correct endpoint structure
      const endpoint = `${API_BASE_URL}/employee-images/${selectedEmployee}`;
      console.log('Using endpoint:', endpoint);

      const response = await axios.put(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        toast.success(`${docType} uploaded successfully!`);
        setUploadFiles(prev => ({ ...prev, [docType]: null }));
        // Refresh the documents list
        await fetchEmployeeDocuments(selectedEmployee);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        console.error('Error status:', err.response.status);
        toast.error(`Failed to upload ${docType}: ${err.response.data?.message || 'Server error'}`);
      } else if (err.request) {
        console.error('No response received:', err.request);
        toast.error('No response from server. Please check your connection.');
      } else {
        console.error('Error:', err.message);
        toast.error(`Failed to upload ${docType}: ${err.message}`);
      }
    }
  };

  const handlePersonalDocUpload = async (file) => {
    if (!file || !selectedEmployee) {
      toast.error('Please select a file and employee');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('employeeId', selectedEmployee);
      formData.append('docType', 'PERSONAL');

      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data) {
        toast.success('Personal document uploaded successfully!');
        setUploadFiles(prev => ({ ...prev, personalDoc: null }));
        await fetchEmployeeDocuments(selectedEmployee);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      toast.error(`Failed to upload personal document: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteCompanyDoc = async (docId) => {
    try {
      await axios.delete(`${API_BASE_URL}/employee-images/${docId}`);
      toast.success('Company document deleted successfully!');
      fetchEmployeeDocuments(selectedEmployee);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete company document');
    }
  };

  const handleDeletePersonalDoc = async (docId) => {
    try {
      await axios.delete(`${API_BASE_URL}/documents/employee/${selectedEmployee}/document/${docId}`);
      toast.success('Personal document deleted successfully!');
      fetchEmployeeDocuments(selectedEmployee);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete personal document');
    }
  };

  const getEmployeeName = (empId) => {
    if (!empId) return 'Unknown Employee';
    const employee = employees.find(emp => emp.id === parseInt(empId));
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
  };

  const handleViewDocument = async (doc) => {
    const { base64Doc, mimeType, name } = doc;
    
    if (!base64Doc) {
      console.error('No base64 data available to view document:', name);
      toast.error('Document content is empty.');
      return;
    }

    console.log(`Attempting to view document: ${name}, MIME Type: ${mimeType}, Base64 length: ${base64Doc.length}`);

    try {
      // Use the provided mimeType, fallback to PDF if generic or not provided
      const effectiveMimeType = mimeType && mimeType !== 'application/octet-stream' ? mimeType : 'application/pdf';
      const byteCharacters = atob(base64Doc.replace(/=+$/, '')); // Handle padding
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: effectiveMimeType });
      
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        toast.error('Please allow pop-ups to view documents');
      } else {
          // Clean up the object URL after the window is closed or the component is unmounted (basic approach)
           // A more robust solution might involve tracking opened windows and revoking on close
          newWindow.addEventListener('unload', () => URL.revokeObjectURL(url));
      }

    } catch (error) {
      console.error('Error viewing document:', error);
      toast.error('Failed to open document. Please check console for details.');
    }
  };

   const handleDownloadDocument = (doc) => {
    const { base64Doc, mimeType, name } = doc;

    if (!base64Doc) {
      console.error('No base64 data available to download document:', name);
      toast.error('Document content is empty. Cannot download.');
      return;
    }
     console.log(`Attempting to download document: ${name}, MIME Type: ${mimeType}, Base64 length: ${base64Doc.length}`);

    try {
        // Use the provided mimeType, fallback to generic
        const effectiveMimeType = mimeType && mimeType !== 'application/octet-stream' ? mimeType : 'application/octet-stream';
         // Determine a filename, try to use the document name and add an extension based on MIME type if needed
        const fileName = name + getFileExtension(mimeType || name);

        const byteCharacters = atob(base64Doc.replace(/=+$/, '')); // Handle padding
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: effectiveMimeType });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Set the desired filename
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); // Clean up the object URL
        toast.success(`Downloaded ${fileName}`);

    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Could not download document.');
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.main}>
          <header className={styles.header}>
            <h2>📁 Admin Document Center</h2>
          </header>

        <div className={styles.employeeSelector}>
          <label>Select Employee:</label>
            <select
            value={selectedEmployee || ''} 
            onChange={(e) => setSelectedEmployee(e.target.value)}
            >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.firstName} {emp.lastName} (ID: {emp.id})
              </option>
            ))}
            </select>
        </div>

        {selectedEmployee && (
          <>
            {/* Company Documents Section */}
            <section className={styles.section}>
              <h3>Company Documents</h3>
<div className={styles.uploadSection}>
  <div className={styles.uploadControls}>
    <label>📄 Upload Offer Letter:</label>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'offerLetterDoc')} 
                  />
                  {uploadFiles.offerLetterDoc && (
                    <span className={styles.fileName}>Selected: {uploadFiles.offerLetterDoc.name}</span>
                  )}
                  <button 
                    onClick={() => handleCompanyDocUpload('offerLetterDoc')}
                    disabled={!uploadFiles.offerLetterDoc}
                  >
                    Upload
                  </button>
  </div>

  <div className={styles.uploadControls}>
    <label>📄 Upload Latest Payslip:</label>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'latestPaySlipDoc')} 
                  />
                  {uploadFiles.latestPaySlipDoc && (
                    <span className={styles.fileName}>Selected: {uploadFiles.latestPaySlipDoc.name}</span>
                  )}
                  <button 
                    onClick={() => handleCompanyDocUpload('latestPaySlipDoc')}
                    disabled={!uploadFiles.latestPaySlipDoc}
                  >
                    Upload
                  </button>
  </div>

  <div className={styles.uploadControls}>
    <label>📄 Upload Additional Document:</label>
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'doc')} 
                  />
                  {uploadFiles.doc && (
                    <span className={styles.fileName}>Selected: {uploadFiles.doc.name}</span>
                  )}
                  <button 
                    onClick={() => handleCompanyDocUpload('doc')}
                    disabled={!uploadFiles.doc}
                  >
                    Upload
                  </button>
  </div>
</div>

              <div className={styles.documentsGrid}>
                {companyDocs.map((doc, index) => (
                  <div key={`company-${doc.id}-${index}`} className={styles.documentCard}>
                    <div className={styles.documentIcon}>
                      {/* Assuming all company docs shown here are PDF based on file accept in upload */}
                      <FaFilePdf /> 
                    </div>
                    <div className={styles.documentInfo}>
                      <h4>{doc.name}</h4>{/* Using processed name */}
                      <p>Type: {doc.mimeType.includes('pdf') ? 'PDF' : doc.mimeType} {/* Display mime type or simple type */}</p>
                      <p>Employee: {getEmployeeName(selectedEmployee)}</p>
                      {/* Assuming uploadDate is not in company docs, or need to check API response */}
                      <p>Uploaded: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className={styles.documentActions}>
                      <button onClick={() => handleViewDocument(doc)}>
                        👁 View
                      </button>
                       {/* Download button for company docs - using existing handleDeleteCompanyDoc for now, needs new handler */}
                       <button onClick={() => handleDownloadDocument(doc)}>
                        ⬇ Download
                      </button>
                      <button onClick={() => handleDeleteCompanyDoc(doc.docId || doc.id)}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                ))}
            </div>
            </section>

            {/* Personal Documents Section */}
            <section className={styles.section}>
              <h3>Personal Documents</h3>
              <div className={styles.uploadSection}>
                <div className={styles.uploadControls}>
                  <label>📄 Upload Personal Document:</label>
                  <input 
                    type="file" 
                    onChange={(e) => setUploadFiles(prev => ({ ...prev, personalDoc: e.target.files[0] }))} // Direct file setting
                  />
                  {uploadFiles.personalDoc && (
                       <span className={styles.fileName}>Selected: {uploadFiles.personalDoc.name}</span>
                  )}
                  <button onClick={() => handlePersonalDocUpload(uploadFiles.personalDoc)}>
                    Upload
                  </button>
          </div>
          </div>

              <div className={styles.documentsGrid}>
                {personalDocs.map((doc, index) => (
                  <div key={`personal-${doc.id}-${index}`} className={styles.documentCard}>
                    <div className={styles.documentIcon}>
                      {/* Use getFileIcon based on simple type if available, fallback to PDF icon */}
                       {doc.type ? <FaFilePdf /> : <FaFilePdf />}
                    </div>
                    <div className={styles.documentInfo}>
                      <h4>{doc.name}</h4>
                      {/* Display simple type or mime type */}
                      <p>Type: {doc.type || (doc.mimeType ? doc.mimeType.split('/').pop() : 'N/A')}</p>
                      <p>Employee: {getEmployeeName(selectedEmployee)}</p>
                      <p>Uploaded: {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className={styles.documentActions}>
                      <button onClick={() => handleViewDocument(doc)}>
                        👁 View
                      </button>
                       {/* Download button for personal docs */}
                       <button onClick={() => handleDownloadDocument(doc)}>
                        ⬇ Download
                      </button>
                      <button onClick={() => handleDeletePersonalDoc(doc.id)}>
                        🗑 Delete
                        </button>
                    </div>
                  </div>
                  ))}
          </div>
            </section>
        </>
      )}
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
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
     
    </div>
  );
};

export default AdminDocumentsPage;

