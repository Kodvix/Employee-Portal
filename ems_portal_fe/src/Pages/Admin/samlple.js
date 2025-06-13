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
    },
    priority: "all"
  });
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [actionInProgress, setActionInProgress] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [bulkSelection, setBulkSelection] = useState([]);
  const [error, setError] = useState(null);
  
  // useEffect(() => {
  //  const fetchRequests = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8080/api/complaints');
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch complaints');
  //     }
  //     const data = await response.json();
  //     setRequests(data);
  //   } catch (error) {
  //     console.error('Error fetching complaints:', error);
  //   }
  // };

  // fetchRequests();
    
  // }, []);

  const filteredRequests = () => {
    return requests.filter(req => {
        if (filters.status !== "all" && req.status !== filters.status) {
        return false;
      }
  
      if (filters.type !== "all" && req.type !== filters.type) {
        return false;
      }
      if (filters.employee &&
          !req.employee.name.toLowerCase().includes(filters.employee.toLowerCase()) &&
          !req.employee.id.toLowerCase().includes(filters.employee.toLowerCase())) {
        return false;
      }
      if (filters.priority !== "all" && req.priority !== filters.priority) {
        return false;
      }
      if (filters.dateRange.start && new Date(req.submitted_date) < new Date(filters.dateRange.start)) {
        return false;
      }
      
      if (filters.dateRange.end && new Date(req.submitted_date) > new Date(filters.dateRange.end)) {
        return false;
      }
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          req.id.toLowerCase().includes(query) ||
          req.type.toLowerCase().includes(query) ||
          req.status.toLowerCase().includes(query) ||
          req.employee.name.toLowerCase().includes(query) ||
          req.employee.department.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  };

  const viewRequestDetails = (request) => {
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

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/leaves");
      console.log("Leave requests data:", response.data);
      
      // Transform the data to match the table structure
      const transformedData = Array.isArray(response.data) ? response.data : [response.data];
      const formattedRequests = transformedData.map(leave => ({
        id: leave.id,
        type: "Leave Request",
        employee: {
          id: leave.employee.id,
          name: `${leave.employee.firstName} ${leave.employee.lastName}`,
          email: leave.employee.email,
          phone: leave.employee.phone,
          department: leave.employee.department,
          position: leave.employee.jobTitle
        },
        submitted_date: leave.startDate,
        status: leave.status,
        priority: "Medium", // Default priority
        details: {
          leaveType: leave.leaveType,
          startDate: leave.startDate,
          endDate: leave.endDate,
          reason: leave.reason
        },
        last_updated: leave.endDate
      }));

      setRequests(formattedRequests);
    } catch (err) {
      console.error("Error fetching leave requests:", err);
      setError("Failed to fetch leave requests");
    }
  };

  // Process leave request
  const processLeaveRequest = async (leaveId, action, remarks) => {
    try {
      setActionInProgress(true);
      
      // Get current leave request
      const response = await axios.get(`http://localhost:8080/api/leaves/${leaveId}`);
      const currentLeave = response.data;
      // Update leave request status
      const updatedLeave = {
        ...currentLeave,
        status: action === "approve" ? "Approved" : 
               action === "reject" ? "Rejected" : 
               action === "inProgress" ? "In Progress" : currentLeave.status,
        hr_remarks: remarks
      };

      // Update the request in the backend
      await axios.put(`http://localhost:8080/api/leaves/${leaveId}`, updatedLeave);

      // Update local state
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

  // Delete leave request
  const deleteLeaveRequest = async (leaveId) => {
    try {
      await axios.delete(`http://localhost:8080/api/leaves/${leaveId}`);
      
      // Update local state
      setRequests(prev => prev.filter(req => req.id !== leaveId));
      closeDetailsModal();
    } catch (error) {
      console.error('Error deleting leave request:', error);
      alert('Error deleting request. Please try again.');
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  // Update processRequest function
  const processRequest = (action) => {
    if (selectedRequest.type === "Leave Request") {
      processLeaveRequest(selectedRequest.id, action, responseText);
    } else {
      // Handle other request types
      setActionInProgress(true);
      setTimeout(() => {
        const updatedRequests = requests.map(req => {
          if (req.id === selectedRequest.id) {
            let newStatus;
            
            switch(action) {
              case "approve":
                newStatus = "Approved";
                break;
              case "reject":
                newStatus = "Rejected";
                break;
              case "inProgress":
                newStatus = "In Progress";
                break;
              case "complete":
                newStatus = "Completed";
                break;
              default:
                newStatus = req.status;
            }
            
            return {
              ...req,
              status: newStatus,
              hr_remarks: responseText,
              last_updated: new Date().toISOString().split('T')[0],
              assigned_to: "admin@company.com"
            };
          }
          return req;
        });
        
        setRequests(updatedRequests);
        setActionInProgress(false);
        closeDetailsModal();
      }, 1000);
    }
  };

  const handleBulkAction = (action) => {
    const updatedRequests = requests.map(req => {
      if (bulkSelection.includes(req.id)) {
        let newStatus;
        
        switch(action) {
          case "approve":
            newStatus = "Approved";
            break;
          case "reject":
            newStatus = "Rejected";
            break;
          case "inProgress":
            newStatus = "In Progress";
            break;
          default:
            newStatus = req.status;
        }
        
        return {
          ...req,
          status: newStatus,
          last_updated: new Date().toISOString().split('T')[0],
          assigned_to: "admin@company.com"
        };
      }
      return req;
    });
    
    setRequests(updatedRequests);
    setBulkSelection([]);
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
        
        // Get the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setError("Authentication required. Please log in.");
          return;
        }

        // Fetch leave requests
        console.log("Fetching leave requests...");
        const leaveRes = await axios.get("http://localhost:8080/api/leave", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Leave requests response:", leaveRes.data);
        
        const leaves = Array.isArray(leaveRes.data) ? leaveRes.data : [leaveRes.data];
        console.log("Processed leaves:", leaves);
        
        const formattedLeaves = leaves.map(leave => ({
  id: leave.id,
  type: "Leave Request",
  employee: {
    id: leave.employee?.id || leave.employeeId || 'N/A',
    name: leave.employee 
      ? `${leave.employee.firstName} ${leave.employee.lastName}` 
      : 'Employee ID: ' + (leave.employeeId || 'Unknown'),
    email: leave.employee?.email || 'N/A',
    phone: leave.employee?.phone || 'N/A',
    department: leave.employee?.department || 'N/A',
    position: leave.employee?.jobTitle || 'N/A'
  },
  submitted_date: leave.startDate || new Date().toISOString(),
  status: leave.status || 'Pending',
  priority: "Medium",
  details: {
    leaveType: leave.leaveType || 'N/A',
    startDate: leave.startDate || 'N/A',
    endDate: leave.endDate || 'N/A',
    reason: leave.reason || 'N/A',
    leaveDoc: leave.leaveDoc || null
  },
  last_updated: leave.endDate || new Date().toISOString()
}));

        console.log("Formatted leaves:", formattedLeaves);

        // Fetch complaints
        console.log("Fetching complaints...");
        const complaintsRes = await axios.get("http://localhost:8080/api/complaint", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        console.log("Complaints response:", complaintsRes.data);
        
        const complaintsData = Array.isArray(complaintsRes.data) ? complaintsRes.data : [complaintsRes.data];
        console.log("Processed complaints:", complaintsData);
        
        const formattedComplaints = complaintsData.map(complaint => ({
          id: complaint.id,
          type: "HR Complaint/Feedback",
          employee: {
            id: complaint.employee?.id || 'N/A',
            name: complaint.employee ? `${complaint.employee.firstName} ${complaint.employee.lastName}` : 'Unknown',
            email: complaint.employee?.email || 'N/A',
            phone: complaint.employee?.phone || 'N/A',
            department: complaint.employee?.department || 'N/A',
            position: complaint.employee?.jobTitle || 'N/A'
          },
          submitted_date: complaint.submittedDate || new Date().toISOString(),
          status: complaint.status || 'Pending',
          priority: complaint.priority || "Medium",
          details: {
            issueType: complaint.issueType || 'N/A',
            description: complaint.description || 'N/A'
          },
          last_updated: complaint.lastUpdated || new Date().toISOString()
        }));
        console.log("Formatted complaints:", formattedComplaints);

        const allRequests = [...formattedLeaves, ...formattedComplaints];
        console.log("All requests to be set:", allRequests);
        
        setRequests(allRequests);
        console.log("Requests state updated with:", allRequests.length, "items");
      } catch (err) {
        console.error("Error in fetchAllRequests:", err);
        console.error("Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          url: err.config?.url
        });
        
        // Set a more descriptive error message
        let errorMessage = "Failed to fetch requests: ";
        if (err.response?.status === 403) {
          errorMessage = "Access denied. Please check your authentication.";
        } else if (err.response) {
          errorMessage += `Server responded with ${err.response.status}: ${err.response.data?.message || err.message}`;
        } else if (err.request) {
          errorMessage += "No response received from server. Please check if the server is running.";
        } else {
          errorMessage += err.message;
        }
        
        setError(errorMessage);
        
        // Set empty arrays for requests to avoid undefined errors
        setRequests([]);
      }
    };

    fetchAllRequests();
  }, []);

  return (
    <div className="admin-hr-page">
      {/* <AdminSidebar /> */}
      <div className="main-content">
        <div className="content-wrapper">
        {/* <TopBar /> */}
          <div className="page-header">
            <h1>HR Request Management</h1>
          </div>
          
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
                
                <div className="filter-group">
                  <label>Priority:</label>
                  <select 
                    value={filters.priority}
                    onChange={(e) => setFilters({...filters, priority: e.target.value})}
                  >
                    <option value="all">All Priorities</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
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
                      dateRange: { start: "", end: "" },
                      priority: "all"
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
                  <button 
                    className="btn-outline"
                    onClick={() => handleBulkAction("inProgress")}
                  >
                    <IoTimeOutline /> Mark In Progress
                  </button>
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
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests().map(req => (
                    <tr 
                      key={req.id}
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
                          style={{ backgroundColor: statusColors[req.status], color: "#fff" }}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td>
                        <span className={`priority-badge priority-${req.priority.toLowerCase()}`}>
                          {req.priority}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button 
                            className="btn-icon"
                            onClick={() => viewRequestDetails(req)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          {req.status === "Pending" && (
                            <>
                              <button 
                                className="btn-icon btn-approve"
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setResponseText("Approved as requested.");
                                  processRequest("approve");
                                }}
                                title="Approve"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button 
                                className="btn-icon btn-reject"
                                onClick={() => {
                                  setSelectedRequest(req);
                                  setResponseText("We are unable to approve this request.");
                                  processRequest("reject");
                                }}
                                title="Reject"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredRequests().length === 0 && (
                    <tr>
                      <td colSpan="9" className="no-results">
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
              <h2>Request Details</h2>
              <button 
                className="modal-close"
                onClick={closeDetailsModal}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-body">
              <div className="request-header">
                <div className="request-id">
                  {selectedRequest.id}
                  <span 
                    className="status-badge"
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
                <div className="meta-item">
                  <label>Priority:</label>
                  <span className={`priority-badge priority-${selectedRequest.priority.toLowerCase()}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div className="meta-item">
                  <label>Assigned To:</label>
                  <span>{selectedRequest.assigned_to || "Unassigned"}</span>
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
                    {Object.entries(selectedRequest.details || {}).map(([key, value]) => (
                      <div className="field-item" key={key}>
                        <label>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</label>
                        <span>{value.toString()}</span>
                      </div>
                    ))}
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
                        {/* Calendar would be implemented with real date logic in production */}
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
              {selectedRequest.status === "Pending" && (
                <>
                  <button 
                    className="btn-outline btn-reject"
                    onClick={() => processRequest("reject")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Reject"}
                  </button>
                  <button 
                    className="btn-outline"
                    onClick={() => processRequest("inProgress")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Mark In Progress"}
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => processRequest("approve")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Approve"}
                  </button>
                  {selectedRequest.type === "Leave Request" && (
                    <button 
                      className="btn-danger"
                      onClick={() => deleteLeaveRequest(selectedRequest.id)}
                      disabled={actionInProgress}
                    >
                      Delete Request
                    </button>
                  )}
                </>
              )}
              
              {selectedRequest.status === "In Progress" && (
                <>
                  <button 
                    className="btn-outline btn-reject"
                    onClick={() => processRequest("reject")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Reject"}
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => processRequest("complete")}
                    disabled={actionInProgress}
                  >
                    {actionInProgress ? "Processing..." : "Mark Complete"}
                  </button>
                </>
              )}
              
              {(selectedRequest.type === "Salary Slip Request" || 
                selectedRequest.type === "Experience/Relieving Letter") && 
               (selectedRequest.status === "Approved" || selectedRequest.status === "In Progress") && (
                <button 
                  className="btn-primary"
                  onClick={generateDocument}
                  disabled={actionInProgress}
                >
                  <IoDownloadOutline /> Generate Document
                </button>
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
    </div>
  );
};
  
export default AdminHRManagementPage;