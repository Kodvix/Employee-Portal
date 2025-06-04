import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { 
  IoDocumentTextOutline, 
  IoCloudUploadOutline, 
  IoSaveOutline, 
  IoFilterOutline,
  IoCreateOutline,
  IoDownloadOutline,
  IoCalendarOutline 
} from "react-icons/io5";
import "./HRRequestPage.css";

const BASE_URL = 'http://192.168.1.10:8080/api/complaints';

const requestTypes = {
  "Leave Request": {
    icon: "🗓️",
    fields: ["start_date", "end_date", "reason", "attachment"],
    description: "Request time off for personal, medical, or vacation purposes"
  },
  "Salary Slip Request": {
    icon: "💰",
    fields: ["month", "year", "email"],
    description: "Request digital copies of your salary statements"
  },
  "Experience/Relieving Letter": {
    icon: "📄",
    fields: ["letter_type", "reason", "email"],
    description: "Request official documentation of your employment"
  },
  "Asset Request": {
    icon: "💻",
    fields: ["asset_type", "justification", "date_needed"],
    description: "Request company equipment or resources"
  },
  "HR Complaint/Feedback": {
    icon: "📝",
    fields: ["issue_type", "description", "attachment", "anonymous"],
    description: "Submit complaints or provide feedback to HR"
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

const createComplaint = async (complaintData) => {
  try {
    const formData = new FormData();
    formData.append('type', complaintData.type);
    formData.append('description', complaintData.description);
    formData.append('employeeId', complaintData.employeeId);
    
    if (!complaintData.file) {
      formData.append('file', new Blob([''], { type: 'text/plain' }), 'empty.txt');
    } else {
      formData.append('file', complaintData.file);
    }

    console.log('Sending complaint data:', {
      type: complaintData.type,
      description: complaintData.description,
      employeeId: complaintData.employeeId
    });

    const response = await axios.post("http://192.168.1.10:8080/api/complaints", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': '*/*'
      }
    });

    if (response.data && response.data.error) {
      throw new Error(response.data.error);
    }

    console.log('Complaint created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating complaint:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message || 
      'Failed to create complaint'
    );
  }
};

const updateComplaint = async (id, complaintData) => {
  try {
    const formData = new FormData();
    formData.append('type', complaintData.type);
    formData.append('description', complaintData.description);
    if (complaintData.file) {
      formData.append('file', complaintData.file);
    }

    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating complaint:', error);
    throw error;
  }
};

const getAllComplaints = async () => {
  try {
    const response = await axios.get(BASE_URL);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

const getComplaintById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching complaint:', error);
    throw error;
  }
};

const deleteComplaint = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting complaint:', error);
    throw error;
  }
};

const createLeaveRequest = async (leaveData, employeeId) => {
  try {
    const formData = new FormData();
    
    const leaveDto = {
      leaveType: leaveData.type || "Sick",
      startDate: leaveData.start_date,
      endDate: leaveData.end_date,
      reason: leaveData.reason,
      status: "Pending"
    };

    console.log('Sending leave request data:', leaveDto);
    
    formData.append('leaveDto', JSON.stringify(leaveDto));
    
    if (!leaveData.attachment) {
      const defaultFile = new File([""], "default.txt", { type: "text/plain" });
      formData.append('leaveDoc', defaultFile);
    } else {
      formData.append('leaveDoc', leaveData.attachment);
    }

    const response = await axios.post(`http://192.168.1.10:8080/api/leaves/${employeeId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (!response.data) {
      throw new Error('No response data received from server');
    }

    console.log('Leave request response:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
      throw new Error(error.response.data.message || 'Error creating leave request');
    } else if (error.request) {
      console.error('Error request:', error.request);
      throw new Error('No response received from server. Please check if the server is running.');
    } else {
      console.error('Error message:', error.message);
      throw new Error('Error creating leave request: ' + error.message);
    }
  }
};

const getLeaveRequestById = async (id) => {
  try {
    const response = await axios.get(`http://192.168.1.10:8080/api/leaves/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching leave request:', error);
    throw error;
  }
};

const getLeaveRequestsByEmployeeId = async (employeeId) => {
  try {
    const response = await axios.get(`http://192.168.1.10:8080/api/leaves/employee/${employeeId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching employee leave requests:', error);
    throw error;
  }
};

const deleteLeaveRequest = async (id) => {
  try {
    const response = await axios.delete(`http://192.168.1.10:8080/api/leaves/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting leave request:', error);
    throw error;
  }
};

const getHolidays = async () => {
  try {
    const response = await axios.get('http://192.168.1.10:8080/api/holiday/', {
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
    console.log('Holidays data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    throw error;
  }
};

const HRRequestPage = () => {
  const { employeeId, currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("newRequest");
  const [requestType, setRequestType] = useState("");
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    file: null,
  });
  const [actionInProgress, setActionInProgress] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    type: "all",
    dateRange: {
      start: "",
      end: ""
    }
  });
  const [isDraft, setIsDraft] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allRequests, setAllRequests] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const loadHolidays = async () => {
      try {
        const holidaysData = await getHolidays();
        setHolidays(holidaysData);
      } catch (error) {
        console.error('Error loading holidays:', error);
      }
    };

    loadHolidays();
  }, []);

  useEffect(() => {
    const loadPersistedData = () => {
      const savedRequests = localStorage.getItem('hrRequests');
      if (savedRequests) {
        setRequests(JSON.parse(savedRequests));
      }
    };
    loadPersistedData();
  }, []);

  useEffect(() => {
    localStorage.setItem('hrRequests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    const loadLeaveRequests = async () => {
      if (!employeeId) return;
      
      try {
        const leaveData = await getLeaveRequestsByEmployeeId(employeeId);
        const formattedLeaveRequests = Array.isArray(leaveData) ? leaveData : [leaveData];
        
        const formattedRequests = formattedLeaveRequests.map(leave => ({
          id: leave.id,
          type: "Leave Request",
          submitted_date: new Date(leave.startDate).toISOString().split('T')[0],
          status: leave.status || "Pending",
          details: {
            leaveType: leave.leaveType,
            start_date: leave.startDate,
            end_date: leave.endDate,
            reason: leave.reason,
            employee: leave.employee
          },
          last_updated: new Date().toISOString().split('T')[0]
        }));

        setRequests(prevRequests => {
          const nonLeaveRequests = prevRequests.filter(req => req.type !== "Leave Request");
          return [...formattedRequests, ...nonLeaveRequests];
        });
      } catch (error) {
        console.error('Error loading leave requests:', error);
      }
    };

    loadLeaveRequests();
  }, [employeeId]);

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const complaintsData = await getAllComplaints();
        const formattedComplaints = Array.isArray(complaintsData) ? complaintsData : [complaintsData];
        
        const formattedRequests = formattedComplaints.map(complaint => ({
          id: complaint.id,
          type: "HR Complaint/Feedback",
          submitted_date: new Date().toISOString().split('T')[0],
          status: complaint.status || "Pending",
          details: {
            issue_type: complaint.type,
            description: complaint.description,
            attachment: complaint.file
          },
          last_updated: new Date().toISOString().split('T')[0]
        }));

        setRequests(prevRequests => {
          const nonComplaintRequests = prevRequests.filter(req => req.type !== "HR Complaint/Feedback");
          return [...formattedRequests, ...nonComplaintRequests];
        });
      } catch (error) {
        console.error('Error loading complaints:', error);
      }
    };

    loadComplaints();
  }, []);

  useEffect(() => {
    if (requestType) {
      const initialData = {};
      requestTypes[requestType].fields.forEach(field => {
        initialData[field] = "";
      });
      setFormData(initialData);
      setValidationErrors({});
      setStep(1);
    }
  }, [requestType]);

  const loadDraftForEditing = (draft) => {
    setRequestType(draft.type);
    setFormData(draft.details || {});
    setActiveTab("newRequest");
    setIsDraft(true);
    setFormData(prev => ({
      ...prev,
      draftId: draft.id
    }));
  };

  useEffect(() => {
    if (employeeId) {
      setIsLoading(false);
    }
  }, [employeeId]);

  const viewRequestDetails = async (request) => {
    if (request.type === "Leave Request") {
      try {
        const leaveDetails = await getLeaveRequestById(request.id);
        setSelectedRequest({
          ...request,
          details: {
            ...request.details,
            employee: leaveDetails.employee,
            leaveType: leaveDetails.leaveType,
            startDate: leaveDetails.startDate,
            endDate: leaveDetails.endDate,
            reason: leaveDetails.reason,
            status: leaveDetails.status
          }
        });
      } catch (error) {
        console.error('Error fetching leave details:', error);
      }
    } else {
      setSelectedRequest(request);
    }
    setShowDetailsModal(true);
  };

  const handleDownload = (request) => {
    alert(`Downloading document for request ${request.id}`);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedRequest(null);
  };

  const renderFormFields = () => {
    if (!requestType) return null;
    
    const fields = requestTypes[requestType].fields;
    
    return (
      <div className="form-fields">
        {fields.includes("start_date") && (
          <div className="form-group">
            <label>Start Date <span className="required">*</span></label>
            <input 
              type="date" 
              value={formData.start_date || ""}
              onChange={(e) => handleInputChange("start_date", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={validationErrors.start_date ? "input-error" : ""}
            />
            {validationErrors.start_date && (
              <p className="error-text">{validationErrors.start_date}</p>
            )}
          </div>
        )}
        
        {fields.includes("end_date") && (
          <div className="form-group">
            <label>End Date <span className="required">*</span></label>
            <input 
              type="date" 
              value={formData.end_date || ""}
              onChange={(e) => handleInputChange("end_date", e.target.value)}
              min={formData.start_date || new Date().toISOString().split('T')[0]}
              className={validationErrors.end_date ? "input-error" : ""}
            />
            {validationErrors.end_date && (
              <p className="error-text">{validationErrors.end_date}</p>
            )}
          </div>
        )}
        
        {fields.includes("reason") && (
          <div className="form-group">
            <label>Reason <span className="required">*</span></label>
            <textarea 
              rows="3"
              value={formData.reason || ""}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              placeholder="Please provide details..."
              className={validationErrors.reason ? "input-error" : ""}
            />
            {validationErrors.reason && (
              <p className="error-text">{validationErrors.reason}</p>
            )}
          </div>
        )}
        
        {fields.includes("month") && (
          <div className="form-group">
            <label>Month <span className="required">*</span></label>
            <select 
              value={formData.month || ""}
              onChange={(e) => handleInputChange("month", e.target.value)}
              className={validationErrors.month ? "input-error" : ""}
            >
              <option value="">Select Month</option>
              {["January", "February", "March", "April", "May", "June", 
                "July", "August", "September", "October", "November", "December"].map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            {validationErrors.month && (
              <p className="error-text">{validationErrors.month}</p>
            )}
          </div>
        )}
        
        {fields.includes("year") && (
          <div className="form-group">
            <label>Year <span className="required">*</span></label>
            <select 
              value={formData.year || ""}
              onChange={(e) => handleInputChange("year", e.target.value)}
              className={validationErrors.year ? "input-error" : ""}
            >
              <option value="">Select Year</option>
              {[2025, 2024, 2023, 2022, 2021].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
            {validationErrors.year && (
              <p className="error-text">{validationErrors.year}</p>
            )}
          </div>
        )}
        
        {fields.includes("email") && (
          <div className="form-group">
            <label>Email to Receive Document <span className="required">*</span></label>
            <input 
              type="email" 
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="your.email@company.com"
              className={validationErrors.email ? "input-error" : ""}
            />
            {validationErrors.email && (
              <p className="error-text">{validationErrors.email}</p>
            )}
          </div>
        )}
        
        {fields.includes("letter_type") && (
          <div className="form-group">
            <label>Letter Type <span className="required">*</span></label>
            <select 
              value={formData.letter_type || ""}
              onChange={(e) => handleInputChange("letter_type", e.target.value)}
              className={validationErrors.letter_type ? "input-error" : ""}
            >
              <option value="">Select Letter Type</option>
              <option value="Experience">Experience Certificate</option>
              <option value="Relieving">Relieving Letter</option>
              <option value="Employment">Employment Verification</option>
              <option value="Salary">Salary Certificate</option>
            </select>
            {validationErrors.letter_type && (
              <p className="error-text">{validationErrors.letter_type}</p>
            )}
          </div>
        )}
        
        {fields.includes("asset_type") && (
          <div className="form-group">
            <label>Asset Type <span className="required">*</span></label>
            <select 
              value={formData.asset_type || ""}
              onChange={(e) => handleInputChange("asset_type", e.target.value)}
              className={validationErrors.asset_type ? "input-error" : ""}
            >
              <option value="">Select Asset Type</option>
              <option value="Laptop">Laptop</option>
              <option value="Desktop">Desktop</option>
              <option value="Monitor">Monitor</option>
              <option value="Keyboard">Keyboard</option>
              <option value="Mouse">Mouse</option>
              <option value="Headset">Headset</option>
              <option value="Other">Other (Specify in Justification)</option>
            </select>
            {validationErrors.asset_type && (
              <p className="error-text">{validationErrors.asset_type}</p>
            )}
          </div>
        )}
        
        {fields.includes("justification") && (
          <div className="form-group">
            <label>Justification <span className="required">*</span></label>
            <textarea 
              rows="3"
              value={formData.justification || ""}
              onChange={(e) => handleInputChange("justification", e.target.value)}
              placeholder="Please explain why you need this asset..."
              className={validationErrors.justification ? "input-error" : ""}
            />
            {validationErrors.justification && (
              <p className="error-text">{validationErrors.justification}</p>
            )}
          </div>
        )}
        
        {fields.includes("date_needed") && (
          <div className="form-group">
            <label>Date Needed By <span className="required">*</span></label>
            <input 
              type="date" 
              value={formData.date_needed || ""}
              onChange={(e) => handleInputChange("date_needed", e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className={validationErrors.date_needed ? "input-error" : ""}
            />
            {validationErrors.date_needed && (
              <p className="error-text">{validationErrors.date_needed}</p>
            )}
          </div>
        )}
        
        {fields.includes("issue_type") && (
          <div className="form-group">
            <label>Issue Type <span className="required">*</span></label>
            <select 
              value={formData.issue_type || ""}
              onChange={(e) => handleInputChange("issue_type", e.target.value)}
              className={validationErrors.issue_type ? "input-error" : ""}
            >
              <option value="">Select Issue Type</option>
              <option value="Work Environment">Work Environment</option>
              <option value="Colleague Conduct">Colleague Conduct</option>
              <option value="Manager Feedback">Manager Feedback</option>
              <option value="Policy Question">Policy Question</option>
              <option value="Benefits Issue">Benefits Issue</option>
              <option value="Other">Other</option>
            </select>
            {validationErrors.issue_type && (
              <p className="error-text">{validationErrors.issue_type}</p>
            )}
          </div>
        )}
        
        {fields.includes("description") && (
          <div className="form-group">
            <label>Description <span className="required">*</span></label>
            <textarea 
              rows="4"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Please provide detailed information..."
              className={validationErrors.description ? "input-error" : ""}
            />
            {validationErrors.description && (
              <p className="error-text">{validationErrors.description}</p>
            )}
          </div>
        )}
        
        {fields.includes("anonymous") && (
          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="anonymous"
              checked={formData.anonymous || false}
              onChange={(e) => handleInputChange("anonymous", e.target.checked)}
            />
            <label htmlFor="anonymous">Submit Anonymously</label>
          </div>
        )}
        
        {fields.includes("attachment") && (
          <div className="form-group file-upload">
            <label>
              <IoCloudUploadOutline className="upload-icon" />
              <span>Attachment {fields.includes("reason") && fields.includes("attachment") && !fields.includes("description") ? <span className="required">*</span> : "(Optional)"}</span>
              <input 
                type="file" 
                onChange={(e) => handleInputChange("attachment", e.target.files[0])}
                className={validationErrors.attachment ? "input-error" : ""}
              />
            </label>
            <span className="file-name">
              {formData.attachment ? formData.attachment.name : "No file chosen"}
            </span>
            {validationErrors.attachment && (
              <p className="error-text">{validationErrors.attachment}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    if (!requestType) return false;
    
    const errors = {};
    let isValid = true;
    
    if (requestType === "HR Complaint/Feedback") {
      if (!formData.issue_type) {
        errors.issue_type = "Please select an issue type";
        isValid = false;
      }
      if (!formData.description) {
        errors.description = "Please provide a description";
        isValid = false;
      }
    } else {
      const requiredFields = requestTypes[requestType].fields.filter(field => 
        !["attachment", "anonymous"].includes(field)
      );
      
      for (const field of requiredFields) {
        if (!formData[field]) {
          errors[field] = `This field is required`;
          isValid = false;
        }
      }
      
      if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
        errors.end_date = "End date must be after start date";
        isValid = false;
      }
      
      if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }
    
    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmitRequest = async (type) => {
    try {
      setIsDraft(type === "draft");
      
      if (type === "submit" && !validateForm()) {
        return;
      }

      let newRequest;

      if (requestType === "HR Complaint/Feedback") {
        const complaintData = {
          type: formData.issue_type,
          description: formData.description,
          employeeId: employeeId
        };

        console.log('Submitting complaint with data:', complaintData);

        let response;
        try {
          if (formData.draftId) {
            response = await updateComplaint(formData.draftId, complaintData);
          } else {
            response = await createComplaint(complaintData);
          }

          if (!response || !response.id) {
            throw new Error('Invalid response from server');
          }

          newRequest = {
            id: response.id,
            type: requestType,
            submitted_date: response.submittedDate,
            status: response.status,
            details: {
              issue_type: response.type,
              description: response.description,
              hrdoc: response.hrdoc || []
            },
            employee: {
              id: response.employeeId,
              name: `${response.firstName || ''} ${response.lastName || ''}`.trim() || 'Employee',
              department: response.department || 'N/A'
            },
            last_updated: new Date().toISOString().split('T')[0]
          };

          console.log('Created new request:', newRequest);
        } catch (error) {
          console.error('Error in complaint submission:', error);
          alert(`Failed to submit complaint: ${error.message}`);
          return;
        }
      } else if (requestType === "Leave Request") {
        const leaveData = {
          type: formData.type || "Sick",
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          attachment: formData.attachment
        };

        const response = await createLeaveRequest(leaveData, employeeId);
        
        newRequest = {
          id: response.id,
          type: requestType,
          submitted_date: new Date().toISOString().split('T')[0],
          status: response.status || "Pending",
          details: {
            ...leaveData,
            leaveType: response.leaveType,
            employee: response.employee
          },
          last_updated: new Date().toISOString().split('T')[0]
        };
      }

      if (newRequest) {
        setRequests(prev => [newRequest, ...prev]);
        setSubmitted(true);
        
        setTimeout(() => {
          setSubmitted(false);
          setRequestType("");
          setFormData({});
          setActiveTab("myRequests");
          setIsDraft(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert(`Error submitting request: ${error.message}`);
    }
  };

  const filteredRequests = () => {
    return requests.filter(req => {
      if (filters.status !== "all" && req.status !== filters.status) {
        return false;
      }
      
      if (filters.type !== "all" && req.type !== filters.type) {
        return false;
      }
      
      if (filters.dateRange.start && new Date(req.submitted_date) < new Date(filters.dateRange.start)) {
        return false;
      }
      
      if (filters.dateRange.end && new Date(req.submitted_date) > new Date(filters.dateRange.end)) {
        return false;
      }
      
      return true;
    });
  };

  const handleDeleteRequest = async (request) => {
    try {
      if (request.type === "Leave Request") {
        await deleteLeaveRequest(request.id);
      } else if (request.type === "HR Complaint/Feedback") {
        await deleteComplaint(request.id);
      }

      setRequests(prev => prev.filter(req => req.id !== request.id));
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request. Please try again.');
    }
  };

  const renderDetailsModal = () => {
    if (!selectedRequest) return null;
    
    return (
      <div className="modal-backdrop">
        <div className="modal-content">
          <div className="modal-header">
            <h3>{selectedRequest.type} Details</h3>
            <button className="close-btn" onClick={closeDetailsModal}>×</button>
          </div>
          
          <div className="modal-body">
            <div className="request-info">
              <div className="info-row">
                <strong>Request ID:</strong> {selectedRequest.id}
              </div>
              <div className="info-row">
                <strong>Status:</strong> 
                <span 
                  className="status-badge" 
                  style={{ backgroundColor: statusColors[selectedRequest.status] }}
                >
                  {selectedRequest.status}
                </span>
              </div>
              <div className="info-row">
                <strong>Submitted Date:</strong> {selectedRequest.submitted_date}
              </div>
              <div className="info-row">
                <strong>Last Updated:</strong> {selectedRequest.last_updated}
              </div>
            </div>
            
            <div className="request-details">
              <h4>Request Details</h4>
              {selectedRequest.type === "Leave Request" && (
                <div>
                  <div className="detail-row">
                    <strong>Leave Type:</strong> {selectedRequest.details.leaveType || 'N/A'}
                  </div>
                  <div className="detail-row">
                    <strong>Start Date:</strong> {selectedRequest.details.start_date || selectedRequest.details.startDate}
                  </div>
                  <div className="detail-row">
                    <strong>End Date:</strong> {selectedRequest.details.end_date || selectedRequest.details.endDate}
                  </div>
                  <div className="detail-row">
                    <strong>Reason:</strong> {selectedRequest.details.reason}
                  </div>
                  {selectedRequest.details.employee && (
                    <div className="detail-row">
                      <strong>Employee:</strong> {selectedRequest.details.employee.firstName} {selectedRequest.details.employee.lastName}
                    </div>
                  )}
                </div>
              )}
              
              {selectedRequest.type === "HR Complaint/Feedback" && (
                <div>
                  <div className="detail-row">
                    <strong>Issue Type:</strong> {selectedRequest.details.issue_type}
                  </div>
                  <div className="detail-row">
                    <strong>Description:</strong> {selectedRequest.details.description}
                  </div>
                  {selectedRequest.details.attachment && (
                    <div className="detail-row">
                      <strong>Attachment:</strong> {selectedRequest.details.attachment.name || 'File attached'}
                    </div>
                  )}
                </div>
              )}
              
              {selectedRequest.type === "Salary Slip Request" && (
                <div>
                  <div className="detail-row">
                    <strong>Month:</strong> {selectedRequest.details.month}
                  </div>
                  <div className="detail-row">
                    <strong>Year:</strong> {selectedRequest.details.year}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {selectedRequest.details.email}
                  </div>
                </div>
              )}
              
              {selectedRequest.type === "Experience/Relieving Letter" && (
                <div>
                  <div className="detail-row">
                    <strong>Letter Type:</strong> {selectedRequest.details.letter_type}
                  </div>
                  <div className="detail-row">
                    <strong>Reason:</strong> {selectedRequest.details.reason}
                  </div>
                  <div className="detail-row">
                    <strong>Email:</strong> {selectedRequest.details.email}
                  </div>
                </div>
              )}
              
              {selectedRequest.type === "Asset Request" && (
                <div>
                  <div className="detail-row">
                    <strong>Asset Type:</strong> {selectedRequest.details.asset_type}
                  </div>
                  <div className="detail-row">
                    <strong>Justification:</strong> {selectedRequest.details.justification}
                  </div>
                  <div className="detail-row">
                    <strong>Date Needed By:</strong> {selectedRequest.details.date_needed}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="btn-secondary" 
              onClick={() => handleDownload(selectedRequest)}
            >
              <IoDownloadOutline /> Download
            </button>
            {(selectedRequest.status === "Draft" || selectedRequest.status === "Pending") && (
              <button 
                className="btn-danger" 
                onClick={() => handleDeleteRequest(selectedRequest)}
              >
                Delete Request
              </button>
            )}
            <button className="btn-primary" onClick={closeDetailsModal}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="hr-request-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your requests...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="hr-request-page">
        <div className="success-container">
          <div className="success-message">
            <div className="success-icon">✓</div>
            <h2>Request {isDraft ? 'Saved as Draft' : 'Submitted'} Successfully!</h2>
            <p>Your {requestType.toLowerCase()} has been {isDraft ? 'saved' : 'submitted'} and is now being processed.</p>
            {!isDraft && <p>You'll receive updates on the status via email and in your dashboard.</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
     <div className="container">
     
      <div className="main-content">
    <div className="hr-request-page">
      <header className="page-header">
        <h1>HR Service Portal</h1>
        <p>Submit and track your HR requests efficiently</p>
      </header>

      <nav className="tab-navigation">
        <button 
          className={`tab ${activeTab === "newRequest" ? "active" : ""}`}
          onClick={() => setActiveTab("newRequest")}
        >
          <IoCreateOutline />
          New Request
        </button>
        <button 
          className={`tab ${activeTab === "myRequests" ? "active" : ""}`}
          onClick={() => setActiveTab("myRequests")}
        >
          <IoDocumentTextOutline />
          My Requests ({requests.length})
        </button>
        <button 
          className={`tab ${activeTab === "holidays" ? "active" : ""}`}
          onClick={() => setActiveTab("holidays")}
        >
          <IoCalendarOutline />
          Holidays
        </button>
      </nav>

      {/* Render sections based on active tab - Holidays first */}
      {activeTab === "holidays" && (
        <div className="content-section">
          <div className="requests-header">
            <h2>Upcoming Holidays</h2>
          </div>
          <div className="holidays-list">
            {holidays.length === 0 ? (
              <div className="empty-state">
                <IoCalendarOutline className="empty-icon" />
                <h3>No Holidays Found</h3>
                <p>There are no upcoming holidays scheduled.</p>
              </div>
            ) : (
              holidays.map(holiday => (
                <div key={holiday.holidayId} className="holiday-card">
                  <div className="holiday-date">
                    {new Date(holiday.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="holiday-info">
                    <h3>{holiday.nameOfHoliday}</h3>
                    <p>{holiday.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === "newRequest" && (
        <div className="content-section">
          {step === 1 && (
            <div className="new-request-layout">
              {/* Holidays Section on the left */}
              <div className="holidays-sidebar">
                <div className="requests-header">
                  <h2>Upcoming Holidays</h2>
                </div>
                <div className="holidays-list">
                  {holidays.length === 0 ? (
                    <div className="empty-state empty-state-small">
                      <IoCalendarOutline className="empty-icon" />
                      <p>No upcoming holidays.</p>
                    </div>
                  ) : (
                    holidays.map(holiday => (
                      <div key={holiday.holidayId} className="holiday-card-small">
                        <div className="holiday-date">
                          {new Date(holiday.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="holiday-info">
                          <h3>{holiday.nameOfHoliday}</h3>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Request Types Grid on the right */}
              <div className="request-types">
                <h2>What can we help you with today?</h2>
                <div className="request-grid">
                  {Object.entries(requestTypes).map(([type, config]) => (
                    <div 
                      key={type}
                      className={`request-card ${requestType === type ? "selected" : ""}`}
                      onClick={() => {
                        setRequestType(type);
                        setStep(2);
                      }}
                    >
                      <div className="card-icon">{config.icon}</div>
                      <h3>{type}</h3>
                      <p>{config.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && requestType && (
            <div className="request-form">
              <div className="form-header">
                <button 
                  className="back-btn"
                  onClick={() => {
                    setStep(1);
                    setRequestType("");
                    setFormData({});
                  }}
                >
                  ← Back
                </button>
                <h2>{requestTypes[requestType].icon} {requestType}</h2>
                <p>{requestTypes[requestType].description}</p>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                {renderFormFields()}
                
                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => handleSubmitRequest("draft")}
                    disabled={actionInProgress}
                  >
                    <IoSaveOutline />
                    Save as Draft
                  </button>
                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={() => handleSubmitRequest("submit")}
                    disabled={actionInProgress}
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {activeTab === "myRequests" && (
        <div className="content-section">
          <div className="requests-header">
            <h2>My Requests</h2>
            <button 
              className="filter-btn"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <IoFilterOutline />
              Filter
            </button>
          </div>

          {isFilterOpen && (
            <div className="filter-panel">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Status</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({...prev, status: e.target.value}))}
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Draft">Draft</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>Type</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters(prev => ({...prev, type: e.target.value}))}
                  >
                    <option value="all">All Types</option>
                    {Object.keys(requestTypes).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                
                <div className="filter-group">
                  <label>From Date</label>
                  <input 
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({
                      ...prev, 
                      dateRange: {...prev.dateRange, start: e.target.value}
                    }))}
                  />
                </div>
                
                <div className="filter-group">
                  <label>To Date</label>
                  <input 
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({
                      ...prev, 
                      dateRange: {...prev.dateRange, end: e.target.value}
                    }))}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="requests-list">
            {filteredRequests().length === 0 ? (
              <div className="empty-state">
                <IoDocumentTextOutline className="empty-icon" />
                <h3>No requests found</h3>
                <p>You haven't submitted any requests yet, or none match your current filters.</p>
                <button 
                  className="btn-primary"
                  onClick={() => setActiveTab("newRequest")}
                >
                  Create New Request
                </button>
              </div>
            ) : (
              filteredRequests().map(request => (
                <div key={request.id} className="request-item">
                  <div className="request-info">
                    <div className="request-header">
                      <span className="request-icon">
                        {requestTypes[request.type]?.icon || "📄"}
                      </span>
                      <div>
                        <h4>{request.type}</h4>
                        <p className="request-id">ID: {request.id}</p>
                      </div>
                    </div>
                    
                    <div className="request-meta">
                      <span className="submitted-date">
                        Submitted: {request.submitted_date}
                      </span>
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: statusColors[request.status] }}
                      >
                        {request.status}
                      </span>
                    </div>
                  </div>
                  
                  <div className="request-actions">
                    {request.status === "Draft" && (
                      <button 
                        className="btn-secondary small"
                        onClick={() => loadDraftForEditing(request)}
                      >
                        Edit Draft
                      </button>
                    )}
                    <button 
                      className="btn-primary small"
                      onClick={() => viewRequestDetails(request)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showDetailsModal && renderDetailsModal()}
    </div>
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

export default HRRequestPage;