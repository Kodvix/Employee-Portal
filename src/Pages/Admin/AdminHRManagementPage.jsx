import React, { useState, useEffect } from "react";

import { 
  IoFilterOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoDownloadOutline,
  IoSearchOutline,
  IoDocumentTextOutline,
  IoMailOutline,
  IoChatbubbleOutline
} from "react-icons/io5";
import './AdminHRManagementPage.css';
import axios from "axios";
import AdminHolidayPage from "./AdminHolidayPage";
const requestTypes = {
  "Leave Request": {
    icon: "🗓️",
    fields: ["start_date", "end_date", "reason", "attachment"],
    description: "Request time off for personal, medical, or vacation purposes"
  },
  "Salary Slip Request": {
    icon: "💰",
    fields: ["month", "year", "email"],
    description: "Request digital copies of salary statements"
  },
  "Experience/Relieving Letter": {
    icon: "📄",
    fields: ["letter_type", "reason", "email"],
    description: "Request official documentation of employment"
  },
  "Asset Request": {
    icon: "💻",
    fields: ["asset_type", "justification", "date_needed"],
    description: "Request company equipment or resources"
  },
  "ID Card Reissue": {
    icon: "🪪",
    fields: ["reason", "attachment"],
    description: "Request a replacement for damaged or lost ID cards"
  },
  "HR Complaint/Feedback": {
    icon: "📝",
    fields: ["issue_type", "description", "attachment", "anonymous"],
    description: "Submit complaints or provide feedback to HR"
  },
  "Work From Home Request": {
    icon: "🏠",
    fields: ["start_date", "end_date", "reason"],
    description: "Request permission to work remotely"
  },
  "Shift Change Request": {
    icon: "🕒",
    fields: ["current_shift", "requested_shift", "start_date", "reason"],
    description: "Request modification to working hours"
  }
};


const statusColors = {
  "Pending": "#f0ad4e",
  "Approved": "#5cb85c",
  "Rejected": "#d9534f",
  "Draft": "#5bc0de",
  "Completed": "#5cb85c",
  "In Progress": "#5bc0de"
};

const AdminHRManagementPage = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    employee: "",
    dateRange: {
      start: "",
      end: ""
    }
  });
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [actionInProgress, setActionInProgress] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkSelection, setBulkSelection] = useState([]);
  const [error, setError] = useState(null);
  

  const filteredRequests = () => {
    if (!Array.isArray(requests)) {
      return [];
    }

    return requests.filter(req => {
      if (!req) return false;

      if (filters.status !== "all" && req.status !== filters.status) {
        return false;
      }

      if (filters.type !== "all" && req.type !== filters.type) {
        return false;
      }

      if (filters.employee && filters.employee.trim()) {
        const query = filters.employee.toLowerCase().trim();
        
        // Handle different employee name formats
        let employeeName = '';
        if (req.employee?.name) {
          employeeName = req.employee.name.toLowerCase().trim();
        } else if (req.employee?.firstName && req.employee?.lastName) {
          employeeName = `${req.employee.firstName} ${req.employee.lastName}`.toLowerCase().trim();
        }
        
        const employeeId = req.employee?.id ? req.employee.id.toString().toLowerCase() : '';
        const employeeEmail = req.employee?.email ? req.employee.email.toLowerCase() : '';
        const employeeDepartment = req.employee?.department ? req.employee.department.toLowerCase() : '';
        
        const matchesEmployee = employeeName.includes(query) || 
                               employeeId.includes(query) || 
                               employeeEmail.includes(query) || 
                               employeeDepartment.includes(query);
        
        if (!matchesEmployee) {
          return false;
        }
      }
        
      if (filters.dateRange.start && new Date(req.submitted_date) < new Date(filters.dateRange.start)) {
        return false;
      }
      
      if (filters.dateRange.end && new Date(req.submitted_date) > new Date(filters.dateRange.end)) {
        return false;
      }
      
      if (searchQuery && searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        
        // Get employee name safely
        let employeeName = '';
        if (req.employee?.name) {
          employeeName = req.employee.name;
        } else if (req.employee?.firstName && req.employee?.lastName) {
          employeeName = `${req.employee.firstName} ${req.employee.lastName}`;
        }
        
        const matchesGlobalSearch = (
          (req.id?.toString() || '').toLowerCase().includes(query) ||
          (req.type || '').toLowerCase().includes(query) ||
          (req.status || '').toLowerCase().includes(query) ||
          employeeName.toLowerCase().includes(query) ||
          (req.employee?.department || '').toLowerCase().includes(query)
        );
        
        if (!matchesGlobalSearch) {
          return false;
        }
      }
      
      return true;
    });
  };
  const viewRequestDetails = (request) => {
    if (!request) {
      console.error('No request selected');
      return;
    }
    setSelectedRequest(request);
    setShowDetailsModal(true);
    setResponseText(request.hr_remarks || "");
  };
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
    setResponseText("");
    setActionInProgress(false);
  };

  const fetchLeaveRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await axios.get("http://192.168.1.32:8080/api/leaves", {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log("Leave requests data:", response.data);
      
      const transformedData = Array.isArray(response.data) ? response.data : [response.data];
      const formattedRequests = transformedData.map(leave => {
        // Log the employee data for debugging
        console.log("Employee data for leave:", leave.employee);
        
        // Safely extract employee name
        let employeeName = 'Unknown Employee';
        if (leave.employee) {
          if (leave.employee.firstName && leave.employee.lastName) {
            employeeName = `${leave.employee.firstName} ${leave.employee.lastName}`;
          } else if (leave.employee.name) {
            employeeName = leave.employee.name;
          }
        }

        return {
          id: leave.id,
          type: "Leave Request",
          employee: {
            id: leave.employee?.id || leave.employeeId,
            name: employeeName,
            email: leave.employee?.email || 'N/A',
            phone: leave.employee?.phone || 'N/A',
            department: leave.employee?.department || 'N/A',
            position: leave.employee?.jobTitle || leave.employee?.position || 'N/A'
          },
          submitted_date: leave.startDate || new Date().toISOString(),
          status: leave.status || 'Pending',
          details: {
            leaveType: leave.leaveType || 'N/A',
            startDate: leave.startDate || 'N/A',
            endDate: leave.endDate || 'N/A',
            reason: leave.reason || 'N/A',
            leaveDoc: leave.leaveDoc || []
          },
          last_updated: leave.endDate || new Date().toISOString()
        };
      });

      console.log("Formatted leave requests:", formattedRequests);
      setRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url
      });
      
      let errorMessage = "Failed to fetch leave requests: ";
      if (err.response?.status === 403) {
        errorMessage = "Access denied. Please check your authentication.";
      } else if (err.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err.response) {
        errorMessage += `Server responded with ${err.response.status}: ${err.response.data?.message || err.message}`;
      } else if (err.request) {
        errorMessage += "No response received from server. Please check if the server is running.";
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
      setRequests([]);
    }
  };

  const processLeaveRequest = async (leaveId, action, remarks) => {
    try {
      setActionInProgress(true);

      const response = await axios.get(`http://192.168.1.32:8080/api/leaves/${leaveId}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      const currentLeave = response.data;

      const updatedLeave = {
        ...currentLeave,
        status: action === "approve" ? "APPROVED" : 
               action === "reject" ? "REJECTED" : 
               action === "inProgress" ? "IN_PROGRESS" : currentLeave.status,
        hr_remarks: remarks
      };

      const formData = new FormData();
      const leaveDto = {
        leaveType: updatedLeave.leaveType,
        startDate: updatedLeave.startDate,
        endDate: updatedLeave.endDate,
        reason: updatedLeave.reason,
        status: updatedLeave.status
      };
      formData.append('leaveDto', JSON.stringify(leaveDto));

      if (updatedLeave.leaveDoc && updatedLeave.leaveDoc.length > 0) {
        formData.append('leaveDoc', updatedLeave.leaveDoc[0]);
      }

      await axios.put(`http://192.168.1.32:8080/api/leaves/${leaveId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const updatedRequests = requests.map(req => {
        if (req.id === leaveId) {
          return {
            ...req,
            status: updatedLeave.status,
            hr_remarks: remarks,
            last_updated: new Date().toISOString().split('T')[0]
          };
        }
        return req;
      });
      
      setRequests(updatedRequests);
      setActionInProgress(false);
      closeDetailsModal();
    } catch (error) {
      console.error('Error processing leave request:', error);
      setActionInProgress(false);
      alert('Error processing request. Please try again.');
    }
  };

  const deleteLeaveRequest = async (leaveId) => {
    try {
      console.log(`Deleting leave request with ID: ${leaveId}`);
      await axios.delete(`http://192.168.1.32:8080/api/leaves/${leaveId}`);
      
      setRequests(prev => prev.filter(req => req.id !== leaveId));
      closeDetailsModal();
    } catch (error) {
      console.error('Error deleting leave request:', error);
      setError('Error deleting leave request. Please try again.');
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      console.log(`Deleting complaint with ID: ${complaintId}`);
      await axios.delete(`http://192.168.1.32:8080/api/complaints/${complaintId}`);
      
      setRequests(prev => prev.filter(req => req.id !== complaintId));
      closeDetailsModal();
    } catch (error) {
      console.error('Error deleting complaint:', error);
      setError('Error deleting complaint. Please try again.');
    }
  };

  const handleDeleteRequest = async (request) => {
    if (!request || !request.id) {
      setError('Invalid request ID');
      return;
    }

    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        if (request.type === "Leave Request") {
          await deleteLeaveRequest(request.id);
        } else if (request.type === "HR Complaint/Feedback") {
          await deleteComplaint(request.id);
        }
      } catch (error) {
        console.error('Error deleting request:', error);
        setError('Error deleting request. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const handleAction = async (request, action) => {
    if (!request || !request.id) {
      console.error('Invalid request or request ID');
      return;
    }
    
    try {
      setSelectedRequest(request);
      setResponseText(action === "approve" ? "Approved as requested." : 
                     action === "reject" ? "Request rejected." : 
                     "Request is being processed.");
      await processRequest(action);
    } catch (error) {
      console.error('Error handling action:', error);
      setError('Failed to process request. Please try again.');
      setActionInProgress(false);
    }
  };

  const processRequest = async (action) => {
    if (!selectedRequest || !selectedRequest.id) {
      console.error('No request selected or invalid request ID');
      return;
    }

    try {
      setActionInProgress(true);
      
      if (selectedRequest.type === "HR Complaint/Feedback") {
        // Get current complaint data
        const response = await axios.get(`http://192.168.1.32:8080/api/complaints/${selectedRequest.id}`);
        const currentComplaint = response.data;
        
        if (!currentComplaint) {
          throw new Error('Complaint data not found');
        }

        // Map action to status
        let newStatus;
        switch(action) {
          case "approve":
            newStatus = "APPROVED";
            break;
          case "reject":
            newStatus = "REJECTED";
            break;
          case "inProgress":
            newStatus = "IN_PROGRESS";
            break;
          default:
            newStatus = currentComplaint.status;
        }

        // Create FormData for the request
        const formData = new FormData();
        formData.append('file', new Blob([''], { type: 'text/plain' })); // Empty file as required by API

        // Get the complaint data
        const type = currentComplaint.type || selectedRequest.details?.issueType || '';
        const description = currentComplaint.description || selectedRequest.details?.description || '';

        // Update the complaint using query parameters
        const updateResponse = await axios.put(
          `http://192.168.1.32:8080/api/complaints/${selectedRequest.id}?type=${encodeURIComponent(type)}&description=${encodeURIComponent(description)}&status=${encodeURIComponent(newStatus)}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Accept': '*/*'
            }
          }
        );

        if (!updateResponse.data) {
          throw new Error('Failed to update complaint');
        }

        // Update the local state
        setRequests(prevRequests => prevRequests.map(req => {
          if (req.id === selectedRequest.id) {
            return {
              ...req,
              status: newStatus,
              hr_remarks: responseText || currentComplaint.hrRemarks || "",
              last_updated: new Date().toISOString().split('T')[0],
              details: {
                ...req.details,
                issueType: type,
                description: description
              }
            };
          }
          return req;
        }));
      } else if (selectedRequest.type === "Leave Request") {
        const response = await axios.get(`http://192.168.1.32:8080/api/leaves/${selectedRequest.id}`);
        const currentLeave = response.data;
        
        if (!currentLeave) {
          throw new Error('Leave request data not found');
        }

        const updatedLeave = {
          ...currentLeave,
          status: action === "approve" ? "APPROVED" : 
                 action === "reject" ? "REJECTED" : 
                 action === "inProgress" ? "IN_PROGRESS" : currentLeave.status,
          hr_remarks: responseText
        };

        // Create FormData for the update
        const formData = new FormData();
        const leaveDto = {
          leaveType: updatedLeave.leaveType,
          startDate: updatedLeave.startDate,
          endDate: updatedLeave.endDate,
          reason: updatedLeave.reason,
          status: updatedLeave.status
        };
        formData.append('leaveDto', JSON.stringify(leaveDto));

        if (updatedLeave.leaveDoc && updatedLeave.leaveDoc.length > 0) {
          formData.append('leaveDoc', updatedLeave.leaveDoc[0]);
        }

        const updateResponse = await axios.put(
          `http://192.168.1.32:8080/api/leaves/${selectedRequest.id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        if (!updateResponse.data) {
          throw new Error('Failed to update leave request');
        }

        // Update the local state
        setRequests(prevRequests => prevRequests.map(req => {
          if (req.id === selectedRequest.id) {
            return {
              ...req,
              status: updatedLeave.status,
              hr_remarks: responseText,
              last_updated: new Date().toISOString().split('T')[0]
            };
          }
          return req;
        }));
      }
      
      setActionInProgress(false);
      closeDetailsModal();
    } catch (error) {
      console.error('Error processing request:', error);
      setError(error.message || 'Failed to process request. Please try again.');
      setActionInProgress(false);
    }
  };

  const handleBulkAction = async (action) => {
    if (!Array.isArray(bulkSelection) || bulkSelection.length === 0) {
      setError('No requests selected for bulk action');
      return;
    }

    try {
      setActionInProgress(true);
      
      const newStatus = action === "approve" ? "Approved" :
                       action === "reject" ? "Rejected" :
                       action === "inProgress" ? "In Progress" : null;

      if (!newStatus) {
        throw new Error('Invalid action specified');
      }

      // Update the local state
      setRequests(prevRequests => prevRequests.map(req => {
        if (bulkSelection.includes(req.id)) {
          return {
            ...req,
            status: newStatus,
            last_updated: new Date().toISOString().split('T')[0],
            assigned_to: "admin@company.com"
          };
        }
        return req;
      }));
      
      setBulkSelection([]);
      setActionInProgress(false);
    } catch (error) {
      console.error('Error performing bulk action:', error);
      setError('Failed to perform bulk action. Please try again.');
      setActionInProgress(false);
    }
  };
  const toggleSelection = (requestId) => {
    if (bulkSelection.includes(requestId)) {
      setBulkSelection(bulkSelection.filter(id => id !== requestId));
    } else {
      setBulkSelection([...bulkSelection, requestId]);
    }
  };
  const toggleSelectAll = () => {
    const visibleRequestIds = filteredRequests().map(req => req.id);
    
    if (visibleRequestIds.every(id => bulkSelection.includes(id))) {
      setBulkSelection(bulkSelection.filter(id => !visibleRequestIds.includes(id)));
    } else {
      const newSelection = [...bulkSelection];
      visibleRequestIds.forEach(id => {
        if (!newSelection.includes(id)) {
          newSelection.push(id);
        }
      });
      setBulkSelection(newSelection);
    }
  };
  const generateDocument = () => {
    const updatedRequests = requests.map(req => {
      if (req.id === selectedRequest.id) {
        return {
          ...req,
          status: "Completed",
          hr_remarks: responseText || "Document generated and sent to employee's email.",
          last_updated: new Date().toISOString().split('T')[0],
          downloadLink: "#generated-document"
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setActionInProgress(false);
    closeDetailsModal();
  };

  useEffect(() => {
    const fetchAllRequests = async () => {
      try {
        console.log("Starting to fetch all requests...");

        console.log("Fetching leave requests...");
        const leaveRes = await axios.get("http://192.168.1.32:8080/api/leaves/", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).catch(error => {
          console.error("Leave request error:", error.response?.data || error.message);
          return { data: [] };
        });
        
        console.log("Raw leave requests response:", leaveRes.data);
        
        const formattedLeaves = Array.isArray(leaveRes.data) ? leaveRes.data.map(leave => ({
          id: leave.id,
          type: "Leave Request",
          employee: {
             id: leave.employee?.id || leave.employeeId,
            name: leave.employee && leave.employee.firstName && leave.employee.lastName ? 
    `${leave.employee.firstName} ${leave.employee.lastName}`.trim() : 
    `Employee ID: ${leave.employeeId}`,
            email: leave.employee?.email || 'N/A',
            phone: 'N/A',
            department: leave.employee?.department || 'N/A',
            position: leave.employee?.jobTitle || 'N/A'
          },
          submitted_date: leave.startDate,
          status: leave.status,
          details: {
            leaveType: leave.leaveType,
            startDate: leave.startDate,
            endDate: leave.endDate,
            reason: leave.reason,
            leaveDoc: leave.leaveDoc
          },
          last_updated: leave.endDate
        })) : [];

        console.log("Formatted leaves:", formattedLeaves);

        console.log("Fetching complaints...");
        const complaintsRes = await axios.get("http://192.168.1.32:8080/api/complaints", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).catch(error => {
          console.error("Complaints request error:", error.response?.data || error.message);
          return { data: [] };
        });
        
        console.log("Raw complaints response:", complaintsRes.data);
        
        const formattedComplaints = Array.isArray(complaintsRes.data) ? complaintsRes.data.map(complaint => ({
          id: complaint.id,
          type: "HR Complaint/Feedback",
       employee: {
  id: complaint.employeeId,
  name: complaint.firstName && complaint.lastName ? 
    `${complaint.firstName} ${complaint.lastName}` : 
    `Employee ID: ${complaint.employeeId}`,
  email: complaint.employee?.email || 'N/A',
  phone: complaint.employee?.phone || 'N/A',
  department: complaint.department || 'N/A',
  position: complaint.employee?.position || 'N/A'
},
          submitted_date: complaint.submittedDate,
          status: complaint.status,
          details: {
            issueType: complaint.type,
            description: complaint.description,
            hrdoc: complaint.hrdoc
          },
          last_updated: complaint.lastUpdated,
          hr_remarks: complaint.hrRemarks
        })) : [];

        const allRequests = [...formattedLeaves, ...formattedComplaints];
        console.log("All requests:", allRequests);
        
        if (allRequests.length === 0) {
          setError("No requests found. The server might be having issues.");
        } else {
          setRequests(allRequests);
          setError(null);
        }
      } catch (err) {
        console.error("Error in fetchAllRequests:", err);
        let errorMessage = "Failed to fetch requests: ";
        
        if (err.response) {
          if (err.response.status === 403) {
            errorMessage = "Access forbidden. Please check server configuration.";
          } else if (err.response.status === 500) {
            errorMessage = "Server error. Please try again later or contact support.";
          } else {
            errorMessage += `Server responded with ${err.response.status}: ${JSON.stringify(err.response.data)}`;
          }
        } else if (err.request) {
          errorMessage = "No response received from server. Please check if the server is running.";
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
        setRequests([]);
      }
    };

    fetchAllRequests();
  }, []);

  const createComplaint = async (complaintData) => {
    try {
      const complaint = {
        type: complaintData.type,
        description: complaintData.description,
        hrdoc: complaintData.file ? [complaintData.file] : [],
        employeeId: 101, 
        submittdeDate: new Date().toISOString(),
        status: "Pending",
        firstName: "Khushi", 
        lastName: "Kala",
        department: "IT"
      };

      console.log('Sending complaint data:', complaint);

      const response = await axios.post("http://192.168.1.32:8080/api/complaints", complaint, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Complaint created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating complaint:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  const updateComplaint = async (id, complaintData) => {
    try {
      const currentComplaint = await axios.get(`http://192.168.1.32:8080/api/complaints/${id}`);
      
      const updatedComplaint = {
        id: id,
        type: complaintData.type,
        description: complaintData.description,
        hrdoc: currentComplaint.data.hrdoc || [],
        employeeId: currentComplaint.data.employeeId,
        submittedDate: currentComplaint.data.submittedDate,
        status: complaintData.status || "Pending",
        firstName: currentComplaint.data.firstName,
        lastName: currentComplaint.data.lastName,
        department: currentComplaint.data.department
      };

      console.log('Sending complaint update:', updatedComplaint);

      const response = await axios.put(`http://192.168.1.32:8080/api/complaints/${id}`, updatedComplaint, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Complaint updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating complaint:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  };

  return (
    <div className="admin-hr-page">
      {/* <AdminSidebar /> */}
      <div className="main-content">
        <div className="content-wrapper">
        {/* <TopBar /> */}
          <div className="page-header">
            <h1>HR Request Management</h1>
          </div>
          <AdminHolidayPage/>
          <div className="requests-container">
            <div className="requests-header">
              <div className="search-container">
                <IoSearchOutline className="search-icon" />
                <input 
                  type="text" 
                  placeholder="Search requests, employees, departments..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              
              <div className="header-actions">
                <button 
                  className="btn-filter"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <IoFilterOutline /> Filter
                </button>
              </div>
            </div>

            {isFilterOpen && (
              <div className="filter-panel">
                <div className="filter-group">
                  <label>Status:</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Request Type:</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                  >
                    <option value="all">All Types</option>
                    {Object.keys(requestTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Employee:</label>
                  <input 
                    type="text" 
                    placeholder="Name or ID"
                    value={filters.employee}
                    onChange={(e) => setFilters({...filters, employee: e.target.value})}
                  />
                </div>
                
                <div className="filter-group date-filter">
                  <label>Date Range:</label>
                  <div className="date-inputs">
                    <input 
                      type="date" 
                      value={filters.dateRange.start}
                      onChange={(e) => setFilters({
                        ...filters, 
                        dateRange: {...filters.dateRange, start: e.target.value}
                      })}
                      placeholder="From"
                    />
                    <span>to</span>
                    <input 
                      type="date" 
                      value={filters.dateRange.end}
                      onChange={(e) => setFilters({
                        ...filters, 
                        dateRange: {...filters.dateRange, end: e.target.value}
                      })}
                      placeholder="To"
                    />
                  </div>
                </div>
                
                <div className="filter-actions">
                  <button 
                    className="btn-outline"
                    onClick={() => setFilters({
                      status: "all",
                      type: "all",
                      employee: "",
                      dateRange: { start: "", end: "" }
                    })}
                  >
                    Clear Filters
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}

            {bulkSelection.length > 0 && (
              <div className="bulk-action-bar">
                <div className="bulk-selection-info">
                  <span>{bulkSelection.length} request{bulkSelection.length !== 1 ? 's' : ''} selected</span>
                  <button 
                    className="btn-text"
                    onClick={() => setBulkSelection([])}
                  >
                    Clear Selection
                  </button>
                </div>
                
                <div className="bulk-actions">
                  <button 
                    className="btn-outline btn-approve"
                        onClick={() => handleBulkAction("approve")}
                  >
                    <IoCheckmarkCircleOutline /> Approve All
                  </button>
                  <button 
                    className="btn-outline btn-reject"
                    onClick={() => handleBulkAction("reject")}
                  >
                    <IoCloseCircleOutline /> Reject All
                  </button>
                  {/* <button 
                    className="btn-outline"
                    onClick={() => handleBulkAction("inProgress")}
                  >
                    <IoTimeOutline /> Mark In Progress
                  </button> */}
                </div>
              </div>
            )}

            <div className="table-container">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox" 
                        checked={
                          filteredRequests().length > 0 && 
                          filteredRequests().every(req => bulkSelection.includes(req.id))
                        }
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Submitted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests().map((req, index) => (
                    <tr 
                      key={`${req.id}-${index}-${Date.now()}`}
                      className={bulkSelection.includes(req.id) ? "selected-row" : ""}
                    >
                      <td>
                        <input 
                          type="checkbox" 
                          checked={bulkSelection.includes(req.id)}
                          onChange={() => toggleSelection(req.id)}
                        />
                      </td>
                      <td>{req.id}</td>
                      <td>
                        <span className="request-type-label">
                          {requestTypes[req.type]?.icon} {req.type}
                        </span>
                      </td>
                      <td>{req.employee.name}</td>
                      <td>{req.employee.department}</td>
                      <td>{req.submitted_date}</td>
                      <td>
                        <span 
                          className="status-badge"
                          data-status={req.status}
                          style={{ backgroundColor: statusColors[req.status], color: "#fff" }}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-action view-btn"
                            onClick={() => viewRequestDetails(req)}
                          >
                            View
                          </button>
                          {req.status === "Pending" && (
                            <>
                              <button 
                                className="btn-action approve-btn"
                                onClick={() => handleAction(req, "approve")}
                              >
                                Approve
                              </button>
                              <button 
                                className="btn-action reject-btn"
                                onClick={() => handleAction(req, "reject")}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          <button 
                            className="btn-action delete-btn"
                            onClick={() => handleDeleteRequest(req)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests().length === 0 && (
                    <tr>
                      <td colSpan="8" className="no-results">
                        <div className="no-results-message">
                          <i className="fas fa-search"></i>
                          <p>No requests match your filters. Try adjusting your search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedRequest && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <button 
                className="back-btn"
                onClick={closeDetailsModal}
              >
                ← Back
              </button>
              <h2>Request Details</h2>
              <button 
                className="modal-close"
                onClick={closeDetailsModal}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-header">
                <div className="request-id">
                  {selectedRequest.id}
                  <span 
                    className="status-badge"
                    data-status={selectedRequest.status}
                    style={{ backgroundColor: statusColors[selectedRequest.status], color: "#fff" }}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div className="request-type">
                  <span className="request-type-label">
                    {requestTypes[selectedRequest.type]?.icon} {selectedRequest.type}
                  </span>
                </div>
              </div>
              
              <div className="request-meta">
                <div className="meta-item">
                  <label>Submitted:</label>
                  <span>{selectedRequest.submitted_date}</span>
                </div>
                <div className="meta-item">
                  <label>Last Updated:</label>
                  <span>{selectedRequest.last_updated || "N/A"}</span>
                </div>
              </div>
              
              <div className="detail-sections">
                <div className="detail-section">
                  <h3>Employee Information</h3>
                  <div className="employee-info">
                    <div className="employee-avatar">
                      {selectedRequest.employee.name.charAt(0)}
                    </div>
                    <div className="employee-details">
                      <div className="employee-name">{selectedRequest.employee.name}</div>
                      <div className="employee-position">{selectedRequest.employee.position}</div>
                      <div className="employee-department">{selectedRequest.employee.department}</div>
                      <div className="employee-contact">
                        <div>
                          <IoMailOutline /> {selectedRequest.employee.email}
                        </div>
                        <div>
                          <IoChatbubbleOutline /> {selectedRequest.employee.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Request Details</h3>
                  <div className="request-fields">
                    {Object.entries(selectedRequest?.details || {}).map(([key, value], index) => {
                      if (!value) return null;
                      const uniqueKey = `${selectedRequest.id}-${key}-${index}-${Date.now()}`;
                      return (
                      <div className="field-item" key={uniqueKey}>
                        <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                          <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                      </div>
                      );
                    })}
                  </div>
                </div>
                
                {selectedRequest.type === "Leave Request" && (
                  <div className="detail-section">
                    <h3>Leave Information</h3>
                    <div className="leave-calendar">
                      <div className="calendar-header">
                        <span>May 2025</span>
                      </div>
                      <div className="calendar-grid">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                          const date = new Date(2025, 4, day);
                          const isLeaveDay = selectedRequest.details && 
                            new Date(selectedRequest.details.start_date) <= date && 
                            new Date(selectedRequest.details.end_date) >= date;
                          
                          return (
                            <div 
                              key={day} 
                              className={`calendar-day ${isLeaveDay ? 'leave-day' : ''} ${
                                date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : ''
                              }`}
                            >
                              {day}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedRequest.downloadLink && (
                  <div className="detail-section">
                    <h3>Documents</h3>
                    <div className="document-links">
                      <a href={selectedRequest.downloadLink} className="document-link">
                        <IoDocumentTextOutline />
                        <span>Download {selectedRequest.type.split(' ')[0]} Document</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="hr-response">
                <h3>HR Response</h3>
                <textarea 
                  placeholder="Enter your response or internal notes..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                ></textarea>
              </div>
            </div>
            
            <div className="modal-footer">
              {selectedRequest && selectedRequest.status === "Pending" && (
                <>
                  <button 
                    className="btn-outline btn-reject"
                    onClick={() => handleAction(selectedRequest, "reject")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Reject"}
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => handleAction(selectedRequest, "inProgress")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Mark In Progress"}
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => handleAction(selectedRequest, "approve")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Approve"}
                  </button>
                </>
              )}
              
              {(selectedRequest.status === "Approved" || 
                selectedRequest.status === "Rejected" || 
                selectedRequest.status === "Completed") && (
                <button 
                  className="btn-outline"
                  onClick={closeDetailsModal}
                >
                  Close
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
  );
};

export default AdminHRManagementPage;