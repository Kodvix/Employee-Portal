import React, { useState, useEffect } from 'react';
import   './AdminAttendancePage.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminAttendancePage = () => {
  
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
const employeeOptions = employees.map((emp) => ({
  value: emp.id,
  label: `${emp.employeeId} - ${emp.firstName} ${emp.lastName}`,
}));

useEffect(() => {
  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/employee');
      if (response.ok) {
        const data = await response.json();
        const employeesArray = Array.isArray(data) ? data : data.data || [];
        // Transform the data to ensure it has the correct structure
        const transformedEmployees = employeesArray.map(emp => ({
          id: emp.id,
          firstName: emp.firstName || '',
          lastName: emp.lastName || '',
          employeeId: emp.employeeId || emp.id,
          employeeName: `${emp.firstName || ''} ${emp.lastName || ''}`.trim()
        }));
        setEmployees(transformedEmployees);
      } else {
        console.error('Failed to fetch employees');
        setEmployees([]); // fallback
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]); // fallback
    }
  };

  fetchEmployees();
}, []);


   

    const workLocations = ['WFO', 'WFH', 'N/A']; 

  
  const [searchText, setSearchText] = useState('');
  const [filterEmployee, setFilterEmployee] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState(''); // Filter by a specific date
  const [filterWorkLocation, setFilterWorkLocation] = useState(''); // New filter for work location

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [modalMode, setModalMode] = useState(null); // 'view', 'edit', 'add'
   const [selectedRecord, setSelectedRecord] = useState(null);
   const [formData, setFormData] = useState({ // For edit/add modal
       employeeId: '',
       date: '',
       clockIn: '',
       clockOut: '',
       status: 'Present',
       workLocation: 'WFO' // Default work location
   });

    const [downloadMonth, setDownloadMonth] = useState(''); // State for selected month for download

   const getEmployeeNameById = (employeeId) => {
       const employee = employees.find(emp => emp.id === employeeId);
       return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee';
   };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const resetFormData = () => {
        setFormData({
            employeeId: '',
            date: '',
            clockIn: '',
            clockOut: '',
            status: 'Present',
            workLocation: 'WFO'
        });
    };

    const handleDownloadMonthlyAttendance = () => {
        if (!downloadMonth) {
            toast.error('Please select a month to download.');
            return;
        }

        // Filter records for the selected month
        const [year, month] = downloadMonth.split('-');
        const monthlyRecords = attendanceRecords.filter(record => {
            const [recordYear, recordMonth] = record.date.split('-');
            return recordYear === year && recordMonth === month;
        });

        if (monthlyRecords.length === 0) {
             toast.info('No attendance records found for the selected month.');
             return;
        }

        // Create CSV content
        const header = ["ID", "Employee ID", "Employee Name", "Date", "Clock In", "Clock Out", "Status", "Work Location"];
        const rows = monthlyRecords.map(record => [
            record.id,
            record.employeeId,
            record.employeeName,
            record.date,
            record.clockIn || 'N/A',
            record.clockOut || 'N/A',
            record.status,
            record.workLocation
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        // Create a blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) { // Feature detection for download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `attendance_${downloadMonth}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Attendance data for ${downloadMonth} downloaded.`);
        } else {
            // Fallback for browsers that don't support download attribute
            toast.error('Your browser does not support direct download. Please copy the data manually.');
            
        }
    };


  // --- Event Handlers ---

   const handleViewClick = (record) => {
       setSelectedRecord(record);
       setModalMode('view');
       setIsModalOpen(true);
   };

   const handleEditClick = (record) => {
       setSelectedRecord(record);
       setFormData({ ...record, employeeName: '' }); 
       setModalMode('edit');
       setIsModalOpen(true);
   };

   const handleAddClick = () => {
       resetFormData();
       setModalMode('add');
       setIsModalOpen(true);
   };

   const handleCloseModal = () => {
       setIsModalOpen(false);
       setModalMode(null);
       setSelectedRecord(null);
       resetFormData();
   };


const handleUpdateRecord = async () => {
  if (!formData.employeeId || !formData.date || !formData.status || !formData.workLocation) {
    toast.error('Please fill all required fields!');
    return;
  }

  try {
    const response = await fetch(`http://localhost:8080/api/attendances/${selectedRecord.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: formData.employeeId,
        date: formData.date,
        checkIn: formData.clockIn || null,
        checkOut: formData.clockOut || null,
        present: formData.status === 'Present',
        workLocation: formData.workLocation 
      }),
    });

    if (!response.ok) throw new Error('Failed to update record');

    const updatedRecord = {
      ...selectedRecord,
      employeeId: formData.employeeId,
      employeeName: getEmployeeNameById(formData.employeeId),
      date: formData.date,
      clockIn: formData.clockIn || 'N/A',
      clockOut: formData.clockOut || 'N/A',
      status: formData.status,
      workLocation: formData.workLocation
    };

    setAttendanceRecords(prev =>
      prev.map(rec => (rec.id === selectedRecord.id ? updatedRecord : rec))
    );
    toast.success('Attendance record updated successfully!');
    handleCloseModal();
  } catch (error) {
    console.error(error);
    toast.error('Failed to update attendance record');
  }
};


const handleCreateRecord = async () => {
  if (!formData.employeeId || !formData.date || !formData.status || !formData.workLocation) {
    toast.error('Please fill all required fields!');
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/attendances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: formData.employeeId.replace('EMP', ''),
        date: formData.date,
        checkIn: formData.clockIn || null,
        checkOut: formData.clockOut || null,
        present: formData.status === 'Present' ,
        workLocation: formData.workLocation 
      }),
    });

    if (!response.ok) throw new Error('Failed to add attendance record');

    const newRecord = await response.json();
    newRecord.employeeId = `EMP${newRecord.employeeId.toString().padStart(3, '0')}`;
    newRecord.employeeName = getEmployeeNameById(newRecord.employeeId);
    newRecord.clockIn = newRecord.checkIn || 'N/A';
    newRecord.clockOut = newRecord.checkOut || 'N/A';
    newRecord.status = newRecord.present ? 'Present' : 'Absent';
    newRecord.workLocation = formData.workLocation;

    setAttendanceRecords(prev => [...prev, newRecord]);
    toast.success('Attendance record created successfully!');
    handleCloseModal();
  } catch (error) {
    console.error(error);
    toast.error('Failed to create attendance record');
  }
};

const handleDeleteRecord = async (recordId) => {
  if (!window.confirm('Are you sure you want to delete this attendance record?')) return;

  try {
    const response = await fetch(`http://localhost:8080/api/attendances/${recordId}`, {
      method: 'DELETE',
    });

    if (!response.ok) throw new Error('Failed to delete record');

    setAttendanceRecords(prev => prev.filter(rec => rec.id !== recordId));
    toast.success('Attendance record deleted successfully!');
    if (selectedRecord?.id === recordId) {
      handleCloseModal();
    }
  } catch (error) {
    console.error(error);
    toast.error('Failed to delete attendance record');
  }
};


  // --- Filtered Data ---
  const filteredRecords = attendanceRecords.filter(record => {
  return (
    (filterEmployee ? record.employeeId === filterEmployee : true) &&
    (filterStatus ? record.status === filterStatus : true) &&
    (filterDate ? record.date === filterDate : true) &&
    (filterWorkLocation ? record.workLocation === filterWorkLocation : true)
  );
});

useEffect(() => {
  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/attendances');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const mappedData = data.map(record => {
        const employee = employees.find(emp => emp.id === record.employeeId);
        return {
          id: record.id,
          employeeId: record.employeeId,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee',
          date: record.date,
          clockIn: record.checkIn || 'N/A',
          clockOut: record.checkOut || 'N/A',
          status: record.present ? 'Present' : 'Absent',
          workLocation: record.workLocation || 'N/A',
        };
      });

      setAttendanceRecords(mappedData);
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
      toast.error('Error fetching attendance records');
    }
  };

  if (employees.length > 0) {
    fetchAttendanceRecords();
  }
}, [employees]);


useEffect(() => {
  if (employees.length === 0 || attendanceRecords.length === 0) return;

  const updatedRecords = attendanceRecords.map(record => {
    const empName = getEmployeeNameById(record.employeeId);
    return {
      ...record,
      employeeName: empName
    };
  });

  setAttendanceRecords(updatedRecords);
}, [employees]); // only re-run when employee data is fetched

  // --- Render Logic ---

  const renderAttendanceTable = () => (
    <div className="attendance-list-container">
      <div className="attendance-table-header">
        <span className="header-employee">Employee</span>
        <span className="header-date">Date</span>
        <span className="header-clock-in">Clock In</span>
        <span className="header-clock-out">Clock Out</span>
        <span className="header-status">Status</span>
        <span className="header-work-location">Location</span> 
        <span className="header-actions">Actions</span>
      </div>
      {filteredRecords.length > 0 ? (
        <div className="attendance-table-body">
          {filteredRecords.map(record => (
            <div key={record.id} className="attendance-table-row">
              <span className="row-employee">{record.employeeName} ({record.employeeId})</span>
              <span className="row-date">{record.date}</span>
              <span className="row-clock-in">{record.clockIn || 'N/A'}</span>
              <span className="row-clock-out">{record.clockOut || 'N/A'}</span>
              <span className={`row-status status-${record.status.toLowerCase().replace(/\s+/g, '-')}`}>
                {record.status}
              </span>
               {/* New Work Location Cell */}
              <span className={`row-work-location status-${record.workLocation.toLowerCase().replace(/\s+/g, '-')}`}>
                {record.workLocation}
              </span>
              <span className="row-actions">
                <button className="action-button view-button" onClick={() => handleViewClick(record)}>View</button>
                <button className="action-button edit-button" onClick={() => handleEditClick(record)}>Edit</button>
                <button className="action-button delete-button" onClick={() => handleDeleteRecord(record.id)}>Delete</button>
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-records">No attendance records found matching your criteria.</div>
      )}
    </div>
  );


   const renderModal = () => {
    if (!isModalOpen) return null;

    const isView = modalMode === 'view';
    const isEdit = modalMode === 'edit';
    const isAdd = modalMode === 'add';

    const currentRecord = isView || isEdit ? selectedRecord : formData;

    return (
      <div className="modal-overlay" onClick={handleCloseModal}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          {/* <button 
            className="modal-close-button" 
            onClick={handleCloseModal}
            style={{
              position: 'absolute',
              right: '10px',
              top: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '5px',
              color: '#666'
            }}
          >
            ✕
          </button> */}

          <div className="modal-header">
            {isAdd && <h2>Add Attendance Record</h2>}
            {isView && <h2>Attendance Details</h2>}
            {isEdit && <h2>Edit Attendance Record</h2>}
          </div>

          <div className="modal-content">
            {isView && selectedRecord && (
              <>
                <div className="details-section">
                    <h4>Record Information</h4>
                    <div className="details-grid">
                         <div className="detail-item">
                             <span className="detail-label">Employee:</span>
                             <span className="detail-value">{selectedRecord.employeeName} ({selectedRecord.employeeId})</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Date:</span>
                             <span className="detail-value">{selectedRecord.date}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Clock In:</span>
                             <span className="detail-value">{selectedRecord.clockIn || 'N/A'}</span>
                         </div>
                          <div className="detail-item">
                             <span className="detail-label">Clock Out:</span>
                             <span className="detail-value">{selectedRecord.clockOut || 'N/A'}</span>
                         </div>
                         <div className="detail-item">
                             <span className="detail-label">Status:</span>
                             <span className={`detail-value status-${selectedRecord.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                 {selectedRecord.status}
                             </span>
                         </div>
                         {/* New Detail Item for Work Location */}
                         <div className="detail-item">
                             <span className="detail-label">Location:</span>
                             <span className={`detail-value status-${selectedRecord.workLocation.toLowerCase().replace(/\s+/g, '-')}`}>
                                 {selectedRecord.workLocation}
                             </span>
                         </div>
                    </div>
                </div>
              </>
            )}

            {(isAdd || isEdit) && (
              <form onSubmit={(e) => {
                  e.preventDefault();
                  if (isAdd) handleCreateRecord();
                  if (isEdit) handleUpdateRecord();
              }}>
                <div className="form-group">
                  <label htmlFor="employeeId">Employee*</label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                     disabled={isEdit} // Usually don't change employee on edit
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.id} - {emp.firstName} {emp.lastName}
                      </option>
                    ))}
                  </select>
                   {isEdit && <small>Employee cannot be changed after creation.</small>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date*</label>
                    <input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="status">Status*</label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="Excused">Excused</option>
                    </select>
                  </div>
                </div>

                 <div className="form-group"> {/* Work Location Form Group */}
                    <label htmlFor="workLocation">Work Location*</label>
                    <select
                        id="workLocation"
                        name="workLocation"
                        value={formData.workLocation}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Location</option>
                        {workLocations.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                        ))}
                    </select>
                 </div>


                {(formData.status === 'Present' || formData.status === 'Late') && (
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="clockIn">Clock In Time</label>
                            <input
                                id="clockIn"
                                type="time"
                                name="clockIn"
                                value={formData.clockIn || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="clockOut">Clock Out Time</label>
                            <input
                                id="clockOut"
                                type="time"
                                name="clockOut"
                                value={formData.clockOut || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                )}


                <div className="modal-actions">
                  <button type="button" className="action-button cancel-button" onClick={handleCloseModal}>
                    Cancel
                  </button>
                  <button type="submit" className="action-button primary-button">
                    {isAdd ? 'Create Record' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}
          </div>

           {isView && selectedRecord && (
              <div className="modal-actions view-actions">
                 <button
                    className="action-button edit-button"
                    onClick={() => handleEditClick(selectedRecord)}
                 >
                    Edit Record
                 </button>
                 <button
                    className="action-button delete-button"
                     onClick={() => handleDeleteRecord(selectedRecord.id)}
                 >
                    Delete Record
                 </button>
              </div>
           )}
        </div>
      </div>
    );
  };


  return (
    <div className="page-wrapper">
      {/* <ToastContainer /> */}
      <div className="sidebar-wrapper">
        {/* <AdminSidebar /> */}
      </div>
      <div className="main-content">
        {/* <AdminTopBar /> */}

        <div className="content-header">
          <h1 className="page-title">Attendance Records</h1>
          <button className="action-button primary-button" onClick={handleAddClick}>
            + Add Record
          </button>
        </div>

         {/* Monthly Download Section */}
         <div className="download-controls">
             <h3 className="download-title">Download Monthly Data</h3>
             <div className="download-inputs">
                 <input
                     type="month"
                     value={downloadMonth}
                     onChange={(e) => setDownloadMonth(e.target.value)}
                     className="download-month-picker"
                 />
                 <button
                     className="action-button primary-button download-button"
                     onClick={handleDownloadMonthlyAttendance}
                     disabled={!downloadMonth}
                 >
                     Download CSV
                 </button>
             </div>
         </div>


        <div className="filter-controls">
        

          <div className="filter-selects">
              <div className="search-bar">
            <input
              type="text"
              placeholder="Search employee or time..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
             {/* <select
              value={filterEmployee}
              onChange={(e) => setFilterEmployee(e.target.value)}
              className="filter-select"
            >
              <option value="">All Employees</option>
              {employees.map((emp, index) => (
                <option key={index} value={emp.employeeId}>{emp.employeeName}</option>
              ))}
            </select> */}
            <select
  value={formData.employeeId}
  onChange={(e) =>
    setFormData({ ...formData, employeeId: e.target.value })
  }
>
  <option value="">Select Employee</option>
  {employees.map((emp) => (
    <option key={emp.id} value={emp.id}>
      {emp.id} - {emp.firstName} {emp.lastName}
    </option>
  ))}
</select>


            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Late">Late</option>
              <option value="Excused">Excused</option>
            </select>

             {/* New Work Location Filter */}
             <select
                value={filterWorkLocation}
                onChange={(e) => setFilterWorkLocation(e.target.value)}
                className="filter-select"
             >
                 <option value="">All Locations</option>
                 {workLocations.map((location, index) => (
                     <option key={index} value={location}>{location}</option>
                 ))}
             </select>


             <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="filter-select" // Reuse select styling for date input
             />
          </div>
        </div>

        <div className="content-area">
            {renderAttendanceTable()}
        </div>

        {renderModal()}
        
        <footer className="footer">
                <div className="footerLeft">
                Copyright © 2025 Kodvix Technologies. All Rights Reserved.
              </div>
            <div className="footerright">
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

export default AdminAttendancePage;
