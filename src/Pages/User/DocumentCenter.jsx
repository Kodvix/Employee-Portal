import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./DocumentCenter.module.css";
import { FaFilePdf, FaFileWord, FaFileImage } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirects

const API_BASE_URL = 'http://192.168.1.10:8080/api';

// Helper to map simple type to MIME type - keeping for potential future use or fallback
const getMimeTypeFromSimpleType = (fileType) => {
  switch (fileType?.toLowerCase()) {
    case 'pdf': return 'application/pdf';
    case 'word': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // Or application/msword
    case 'image': return 'image/jpeg'; // Assuming JPEG for simplicity, could be png etc.
    default: return 'application/octet-stream'; // Generic binary stream
  }
};

const DocumentCenter = () => {
  const { employeeId, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    
  const [personalDocs, setPersonalDocs] = useState([]);
  const [companyDocs, setCompanyDocs] = useState([]);
  const [search, setSearch] = useState("");
  const [uploadingFile, setUploadingFile] = useState(null);
  const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
 useEffect(() => {
    if (!isAuthenticated || !employeeId) {
      console.error('User not authenticated or employee ID missing');
      // Optionally redirect to login
      // navigate('/'); 
      return;
    }
     fetchEmployeeDocuments();
    fetchCompanyDocuments();
  }, [isAuthenticated, employeeId, navigate]); // Added dependencies

   // Re-fetch documents periodically
  useEffect(() => {
    if (!employeeId) return;
    const interval = setInterval(() => {
      console.log('Refreshing documents...');
      fetchEmployeeDocuments();
      fetchCompanyDocuments();
    }, 60000); // Refresh every 60 seconds
    
    return () => clearInterval(interval);
  }, [employeeId]); // Added employeeId dependency

  const fetchEmployeeData = async () => {
    if (!employeeId) {
      console.log('Employee ID not available');
      return;
    }

    try {
      setLoading(true);
      // Removed unused employee data fetch
      // const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
      
    
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
     
      
      // Handle 401 errors specifically
      if (err.response && err.response.status === 401) {
        setError('Authentication failed. Please login again.');
        logout();
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };
  // Initial fetch is now in the first useEffect
  // useEffect(() => {
  //   fetchEmployeeDocuments();
  //   fetchCompanyDocuments();
    
  //   // Refresh every 30 seconds
  //   const interval = setInterval(() => {
  //     fetchEmployeeDocuments();
  //     fetchCompanyDocuments();
  //   }, 30000);
    
  //   return () => clearInterval(interval);
  // }, []);

  const fetchEmployeeDocuments = async () => {
    if (!employeeId) {
         console.warn('fetchEmployeeDocuments: Employee ID not available.');
         return;
    }
    try {
      console.log('Fetching personal documents for employee:', employeeId);
      const res = await axios.get(`${API_BASE_URL}/documents/employee/${employeeId}`);
      console.log('Personal documents response:', res.data);

      if (!Array.isArray(res.data)) {
        console.error('Invalid response format for personal documents:', res.data);
        toast.error('Invalid response format for personal documents');
        return;
      }

      const docs = res.data.map(doc => {
        try {
          // Backend seems to provide MIME type in doc.type
          const mime = doc.type || 'application/octet-stream'; 
          const simpleType = getFileType(mime);
          console.log(`Processing personal document: ${doc.name || 'Untitled'}, MIME Type: ${mime}, Base64 length: ${doc.data?.length || 0}`);
          if (!doc.data) {
              console.warn(`No base64 data for personal document: ${doc.name || 'Untitled'}`);
          }
          return {
            name: doc.name || 'Untitled Document',
            file: mime, // Store original MIME type
            date: doc.uploadDate ? new Date(doc.uploadDate).toISOString().slice(0, 10) : 'N/A',
            type: simpleType, // Simple type for display
            status: "Approved", // Assuming status is always Approved based on current data/requirements
            docId: doc.id,
            base64Doc: doc.data,
            mimeType: mime // Store MIME type for viewing/downloading
          };
        } catch (err) {
          console.error('Error processing personal document:', doc, err);
          return null;
        }
      }).filter(doc => doc !== null);

      console.log('Processed personal documents:', docs);
      setPersonalDocs(docs);
    } catch (err) {
      console.error("Failed to fetch personal documents:", err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        toast.error(`Failed to fetch personal documents: ${err.response.data?.message || 'Server error'}`);
         if (err.response.status === 401) { // Handle 401 specifically here too
             logout();
             navigate('/');
         }
      } else if (err.request) {
        console.error('No response received for personal documents:', err.request);
        toast.error('No response from server for personal documents. Please check your connection.');
      } else {
        console.error('Error setting up personal documents request:', err.message);
        toast.error('Failed to fetch personal documents: ' + err.message);
      }
      setPersonalDocs([]); // Clear documents on error
    }
  };

  const fetchCompanyDocuments = async () => {
     if (!employeeId) {
         console.warn('fetchCompanyDocuments: Employee ID not available.');
         return;
     }
    try {
      const res = await axios.get(`${API_BASE_URL}/employee-images/emp/${employeeId}`);
      console.log('Company documents response:', res.data);

       // Ensure the response data is treated as an array
      const companyData = Array.isArray(res.data) ? res.data : (res.data ? [res.data] : []);

      const docs = [];
      
      companyData.forEach(doc => {
          console.log(`Processing company document for docId: ${doc.id}`);
           // Determine MIME type and simple type based on which field is present
          let base64 = null;
          let fileName = 'Company Document';
          let mimeType = 'application/octet-stream';
          let simpleType = 'Other';

        if (doc.offerLetterDoc) {
             console.log(`Offer Letter Base64 length: ${doc.offerLetterDoc?.length || 0}`);
              if (!doc.offerLetterDoc) {
                  console.warn('No base64 data for Offer Letter');
              }
            base64 = doc.offerLetterDoc;
            fileName = 'Offer_Letter.pdf'; // Assuming PDF based on name
            mimeType = 'application/pdf';
            simpleType = 'PDF';
            
             docs.push({
              name: "Offer Letter",
              type: simpleType, // Simple type for display
              file: mimeType, // Store MIME type
              date: doc.uploadDate ? new Date(doc.uploadDate).toISOString().slice(0, 10) : 'N/A',
              status: "Approved",
              docId: doc.id,
              base64Doc: base64,
              mimeType: mimeType
            });

        }
        if (doc.latestPaySlipDoc) {
             console.log(`Latest Payslip Base64 length: ${doc.latestPaySlipDoc?.length || 0}`);
               if (!doc.latestPaySlipDoc) {
                  console.warn('No base64 data for Latest Payslip');
              }
            base64 = doc.latestPaySlipDoc;
            fileName = 'Latest_Payslip.pdf'; // Assuming PDF
            mimeType = 'application/pdf';
            simpleType = 'PDF';

             docs.push({
              name: "Latest Payslip",
              type: simpleType, // Simple type for display
              file: mimeType, // Store MIME type
              date: doc.uploadDate ? new Date(doc.uploadDate).toISOString().slice(0, 10) : 'N/A',
              status: "Approved",
              docId: doc.id,
              base64Doc: base64,
              mimeType: mimeType
            });
        }
        // The 'doc' field might contain different types, assuming PDF based on common use cases or adjust if API specifies type
        if (doc.doc) {
             console.log(`Additional Document Base64 length: ${doc.doc?.length || 0}`);
               if (!doc.doc) {
                  console.warn('No base64 data for Additional Document');
              }
            base64 = doc.doc;
            fileName = 'Additional_Document.pdf'; // Defaulting to PDF, may need adjustment
            mimeType = 'application/pdf'; // Defaulting to PDF, may need adjustment based on API
             simpleType = 'PDF'; // Assuming PDF for icon/display

             docs.push({
              name: "Additional Document",
              type: simpleType, // Simple type
               file: mimeType, // MIME type
              date: doc.uploadDate ? new Date(doc.uploadDate).toISOString().slice(0, 10) : 'N/A',
              status: "Approved",
              docId: doc.id,
              base64Doc: base64,
              mimeType: mimeType
            });
        }
      });
      
      setCompanyDocs(docs);
    } catch (err) {
      console.error("Failed to fetch company documents:", err);
       if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        toast.error(`Failed to fetch company documents: ${err.response.data?.message || 'Server error'}`);
         if (err.response.status === 401) { // Handle 401 specifically here too
             logout();
             navigate('/');
         }
      } else if (err.request) {
        console.error('No response received for company documents:', err.request);
        toast.error('No response from server for company documents. Please check your connection.');
      } else {
        console.error('Error setting up company documents request:', err.message);
        toast.error('Failed to fetch company documents: ' + err.message);
      }
      setCompanyDocs([]); // Clear documents on error
    }
  };

  const getFileType = (mimeType) => {
    if (!mimeType) return 'Other';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('image')) return 'Image';
    return 'Other';
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'PDF':
        return <FaFilePdf />;
      case 'Word':
        return <FaFileWord />;
      case 'Image':
        return <FaFileImage />;
      default:
        return <FaFilePdf />; // Default icon
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please upload PDF, JPEG, PNG, or Word documents only.');
      return;
    }

    setUploadingFile(file);
  };

  const handleUpload = async () => {
    if (!uploadingFile) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!employeeId) {
      toast.error('Employee ID not found. Please login again.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadingFile);
      formData.append("employeeId", employeeId);

      console.log('Uploading personal document:');
      console.log('employeeId:', employeeId);
      console.log('file name:', uploadingFile.name);
       console.log('file type:', uploadingFile.type);

      const response = await axios.post(
        `http://192.168.1.10:8080/api/documents/upload/${employeeId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );

      console.log('Upload response:', response.data);
      toast.success("📁 Personal document uploaded successfully!");
      fetchEmployeeDocuments(); // Refresh list after upload
      setUploadingFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error status:', err.response.status);
        console.error('Error headers:', err.response.headers);
        
        const errorMessage = err.response.data?.message || err.response.data || 'Failed to upload document';
        toast.error(`Upload failed: ${errorMessage}`);
         if (err.response.status === 401) { // Handle 401 specifically here too
             logout();
             navigate('/');
         }
      } else if (err.request) {
        console.error('No response received from upload endpoint:', err.request);
        toast.error('No response from server during upload. Please check your connection.');
      } else {
        console.error('Error setting up upload request:', err.message);
        toast.error('Failed to upload document: ' + err.message);
      }
    }
  };

  const handleView = (base64String, mimeType, fileName = 'document') => {
    if (!base64String) {
        console.error('No base64 string provided for viewing');
        toast.error('Document content is empty.');
        return;
    }
     console.log(`Attempting to view document: ${fileName} with MIME type: ${mimeType}, Base64 length: ${base64String.length}`);
    try {
        // Ensure MIME type is valid, default to pdf or generic if not specific
        const effectiveMimeType = mimeType && mimeType !== 'application/octet-stream' ? mimeType : (fileName.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'application/octet-stream');
        const blob = base64toBlob(base64String, effectiveMimeType);
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, "_blank");
    } catch (error) {
        console.error('Error viewing document:', error);
        toast.error('Could not display document.');
    }
  };

  const handleDownload = (base64String, mimeType, fileName = 'document') => {
    if (!base64String) {
        console.error('No base64 string provided for downloading');
        toast.error('Document content is empty. Cannot download.');
        return;
    }
     console.log(`Attempting to download document: ${fileName} with MIME type: ${mimeType}, Base64 length: ${base64String.length}`);
    try {
         // Ensure MIME type is valid, default to generic if not specific
        const effectiveMimeType = mimeType && mimeType !== 'application/octet-stream' ? mimeType : 'application/octet-stream';
        const blob = base64toBlob(base64String, effectiveMimeType);
        const blobUrl = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = fileName; // Set the desired filename for download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl); // Clean up the object URL
         toast.success(`Downloaded ${fileName}`);
    } catch (error) {
        console.error('Error downloading document:', error);
        toast.error('Could not download document.');
    }
  };

  const base64toBlob = (base64, contentType) => {
     // Decode base64 string
    // Handle potential issues with base64 padding
    const base64WithoutPadding = base64.replace(/=+$/, '');
    const byteCharacters = atob(base64WithoutPadding);
    
    const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };

  const filteredPersonalDocs = personalDocs.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.type.toLowerCase().includes(search.toLowerCase()) || // Filter by simple type
     (doc.mimeType && doc.mimeType.toLowerCase().includes(search.toLowerCase())) // Also filter by MIME type
  );

  const filteredCompanyDocs = companyDocs.filter(doc =>
    doc.name.toLowerCase().includes(search.toLowerCase()) ||
    doc.type.toLowerCase().includes(search.toLowerCase()) || // Filter by simple type
     (doc.mimeType && doc.mimeType.toLowerCase().includes(search.toLowerCase())) // Also filter by MIME type
  );

   // Show loading or error state if no employee ID
  if (!isAuthenticated) {
    return <div>Please login to access documents.</div>; // Or redirect to login
  }

  if (!employeeId) {
     // This might happen briefly during initial load, but useEffect should handle redirect if needed
    return <div>Loading employee information...</div>;
  }

   if (loading) {
    return <div className={styles.loading}>Loading documents...</div>;
  }

   if (error) {
       return <div className={styles.error}>Error: {error}</div>;
   }

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
        <header className={styles.header}>Document Center</header>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        <section className={styles.section}>
          <h3>1. Personal Documents</h3>
          <input
            type="text"
            placeholder="🔍 Search by name or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchBar}
          />

          <table className={styles.table}>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                <th>File</th>{/* Display icon and simple type */}
                <th>Uploaded On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPersonalDocs.map((doc, idx) => (
                <tr key={idx}>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                   <td>{getFileIcon(doc.type)} {doc.type}</td>
                  <td>{doc.date}</td>
                  <td>
                    <span className={`${styles.status} ${styles.approved}`}>Approved</span>
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                      onClick={() => handleView(doc.base64Doc, doc.mimeType, doc.name)}
                    >
                      👁 View
                    </button>
                     <button
                      className={`${styles.viewBtn} ${styles.downloadBtn}`} 
                      onClick={() => handleDownload(doc.base64Doc, doc.mimeType, doc.name)}
                    >
                      ⬇ Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.uploadSection}>
            <div className={styles.uploadControls}>
              <input type="file" onChange={handleFileChange} />
              {uploadingFile && <span className={styles.previewText}>Selected: {uploadingFile.name}</span>}
              <button onClick={handleUpload}>⬆ Upload Personal Document</button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3>2. Company Documents</h3>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Document</th>
                <th>Type</th>
                 <th>File</th>{/* Display icon and simple type */}
                <th>Uploaded On</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanyDocs.map((doc, idx) => (
                <tr key={idx}>
                  <td>{doc.name}</td>
                  <td>{doc.type}</td>
                   <td>{getFileIcon(doc.type)} {doc.type}</td>
                  <td>{doc.date}</td>
                  <td>
                    <span className={`${styles.status} ${styles.approved}`}>Approved</span>
                  </td>
                  <td>
                    <button
                      className={styles.viewBtn}
                       onClick={() => handleView(doc.base64Doc, doc.mimeType, doc.name)}
                    >
                      👁 View
                    </button>
                     <button
                      className={`${styles.viewBtn} ${styles.downloadBtn}`}
                      onClick={() => handleDownload(doc.base64Doc, doc.mimeType, doc.name)}
                    >
                      ⬇ Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
        
    </div>
  );
};

// Keeping footer outside the main component return but within the file
// to match original file structure, assuming it's appended elsewhere in the app layout.
// If this footer is intended to be part of DocumentCenter component, it should be inside the main return.
/*
{
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
}
*/

export default DocumentCenter;
