import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calendar, ChevronDown, Clock, Download, Search, Filter, Users, User, Home, FileText, Settings, LogOut, Bell, Menu } from 'lucide-react';
import styles from './AttendanceOverview.module.css';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext'; // Import useAuth hook
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirects

const API_BASE_URL = 'http://localhost:8080/api';

const AttendancePage = () => {
  // Get authentication data from context
  const { employeeId, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [employeeData, setEmployeeData] = useState({
    name: "",
    id: "",
    department: "",
    designation: ""
  });
  
  const [attendanceData, setAttendanceData] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentAttendanceId, setCurrentAttendanceId] = useState(null);
  const [viewMode, setViewMode] = useState('table');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchTime, setPunchTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [elapsedTime, setElapsedTime] = useState(0);
  const [punchInDate, setPunchInDate] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isLate, setIsLate] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated || !employeeId) {
      console.error('User not authenticated or employee ID missing');
      navigate('/'); // Redirect to login page
      return;
    }
  }, [isAuthenticated, employeeId, navigate]);

  const fetchEmployeeData = async () => {
    if (!employeeId) {
      console.error('Employee ID not available');
      setError('Employee ID not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/employee/${employeeId}`);
      
      if (response.status === 200 && response.data) {
        const dept = response.data.department;
        const title = response.data.jobTitle;

        setEmployeeData({
          name: `${response.data.firstName || ''} ${response.data.lastName || ''}`.trim() || "Employee Name",
          id: `KDX-${response.data.id}` || `KDX-${employeeId}`,
          department: (dept && dept.trim() !== '') ? dept.trim() : "Department",
          designation: (title && title.trim() !== '') ? title.trim() : "Designation"
        });
      } else {
        setEmployeeData({
          name: "Unknown (Fallback)",
          id: `KDX-${employeeId}`,
          department: "Unknown (Fallback)",
          designation: "Unknown (Fallback)"
        });
      }
    } catch (err) {
      console.error("Failed to fetch employee data:", err);
      setEmployeeData({
        name: " Unknown ",
        id: `KDX-${employeeId}`,
        department: "Unknown (Error)",
        designation: "Unknown (Error)"
      });
      
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

  const fetchEmployeeAddress = async () => {
    if (!employeeId) return;
    
    try {
      const response = await axios.get(`${API_BASE_URL}/addresses/employee/${employeeId}`);
      if (response.status === 200 && response.data.length > 0) {
        console.log('Employee address:', response.data[0]);
      }
    } catch (err) {
      console.error("Failed to fetch employee address:", err);
    }
  };

  const fetchAttendanceData = async () => {
    if (!employeeId) {
      console.error('Employee ID not available for fetching attendance');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/attendances`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.status === 200) {
        const employeeRecords = response.data.filter(record => 
          record.employeeId === employeeId
        );
        
        const transformedData = employeeRecords.map(record => ({
          id: record.id,
          date: record.date,
          checkIn: record.checkIn ? record.checkIn : 'N/A',
          checkOut: record.checkOut && record.checkOut !== "00:00:00" ? record.checkOut : 'N/A',
          hours: calculateHoursWorkedFromStrings(record.checkIn, record.checkOut),
          status: record.status ? 'Present' : 'Absent',
          remarks: record.remark || ''
        }));
        
        setAttendanceData(transformedData);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Authentication failed. Please login again.');
          logout();
          navigate('/');
        } else {
          setError(`Failed to load attendance data: ${error.response.data.message || error.response.data.error || 'Server error'}`);
        }
      } else if (error.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError(`Failed to load attendance data: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateHoursWorkedFromStrings = (checkInStr, checkOutStr) => {
    if (!checkInStr || !checkOutStr || checkOutStr === "00:00:00") {
      return '0h';
    }
    
    const [inHours, inMinutes] = checkInStr.split(':').map(Number);
    const [outHours, outMinutes] = checkOutStr.split(':').map(Number);
    
    let totalMinutes = (outHours * 60 + outMinutes) - (inHours * 60 + inMinutes);
    
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; 
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  const isAfterLateTime = (time) => {
    if (typeof time === 'string') {
      const [hours, minutes] = time.split(':').map(Number);
      return (hours > 10 || (hours === 10 && minutes >= 15));
    } else if (time instanceof Date) {
      const lateHour = 10;
      const lateMinute = 15;
      return (time.getHours() > lateHour || 
            (time.getHours() === lateHour && time.getMinutes() >= lateMinute));
    }
    return false;
  };

  const formatTimeForAPI = (date) => {
    return date.toTimeString().slice(0, 8);
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handlePunch = async () => {
    if (!employeeId) {
      setError('Employee ID not available. Please login again.');
      return;
    }

    const now = new Date();
    const formattedDate = formatDateForAPI(now);
    const formattedTime = formatTimeForAPI(now);

    try {
      if (!isPunchedIn) {
        const punchInData = {
          employeeId: employeeId, // Use employeeId from context
          date: formattedDate,
          checkIn: formattedTime,
          checkOut: "00:00:00",
          status: true,
          remark: isAfterLateTime(now) ? "Late arrival" : "Good"
        };

        const response = await axios.post(`${API_BASE_URL}/attendances`, punchInData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200 || response.status === 201) {
          setPunchTime(now);
          setPunchInDate(now);
          setIsPunchedIn(true);
          setElapsedTime(0);
          setCurrentAttendanceId(response.data.id);
          
          if (isAfterLateTime(now)) {
            setStatusMessage("You are late today!");
            setIsLate(true);
          } else {
            setStatusMessage("Have a productive day!");
            setIsLate(false);
          }
          
          await fetchAttendanceData();
        }
      } else {
        if (!currentAttendanceId) {
          throw new Error('No active attendance record found');
        }
        
        const currentRecord = attendanceData.find(record => record.id === currentAttendanceId);
        if (!currentRecord) {
          throw new Error('Current attendance record not found');
        }

        const punchOutData = {
          employeeId: employeeId, // Use employeeId from context
          date: formattedDate,
          checkIn: currentRecord.checkIn,
          checkOut: formattedTime,
          status: true,
          remark: currentRecord.remarks
        };

        const response = await axios.put(`${API_BASE_URL}/attendances/${currentAttendanceId}`, punchOutData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          setIsPunchedIn(false);
          setPunchTime(null);
          setPunchInDate(null);
          setCurrentAttendanceId(null);
          setStatusMessage("Thanks! Have a nice day!");
          await fetchAttendanceData();
        }
      }
    } catch (error) {
      console.error('Failed to update attendance:', error);
      if (error.response) {
        if (error.response.status === 401) {
          setError('Authentication failed. Please login again.');
          logout();
          navigate('/');
        } else {
          setError(`Failed: ${error.response.data.message || 'Server error'}`);
        }
      } else if (error.request) {
        setError('No server response.');
      } else {
        setError(`Error: ${error.message}`);
      }
    }
  };

  const checkExistingPunch = async () => {
    if (!employeeId) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/attendances`);
      const today = formatDateForAPI(new Date());
      
      const record = response.data.find(r =>
        r.date === today && 
        r.employeeId === employeeId && // Use employeeId from context
        (!r.checkOut || r.checkOut === "00:00:00")
      );

      if (record) {
        setIsPunchedIn(true);
        
        const checkInTime = new Date();
        const [hours, minutes, seconds] = record.checkIn.split(':').map(Number);
        checkInTime.setHours(hours, minutes, seconds);
        
        setPunchTime(checkInTime);
        setPunchInDate(checkInTime);
        setCurrentAttendanceId(record.id);
        setIsLate(isAfterLateTime(record.checkIn));
        setStatusMessage(isAfterLateTime(record.checkIn) ? "You are late today!" : "Have a productive day!");
      }
    } catch (err) {
      console.error("Check existing punch error:", err);
    }
  };

  useEffect(() => {
    // Only fetch data if user is authenticated and employeeId is available
    if (isAuthenticated && employeeId) {
      fetchEmployeeData();
      fetchEmployeeAddress();
      fetchAttendanceData();
      checkExistingPunch();
    }
  }, [isAuthenticated, employeeId]); // Add dependencies

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      if (isPunchedIn && punchTime) {
        const diff = Math.floor((now - punchTime) / 1000);
        setElapsedTime(diff);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPunchedIn, punchTime]);

  const filteredData = attendanceData.filter(item => {
    return (
      (statusFilter === '' || item.status === statusFilter) &&
      (dateFilter === '' || item.date.includes(dateFilter)) &&
      (searchTerm === '' || 
        item.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remarks.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }).sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const getSummaryData = () => {
    const present = attendanceData.filter(a => a.status === 'Present').length;
    const absent = attendanceData.filter(a => a.status === 'Absent').length;
    const late = attendanceData.filter(a => a.remarks.includes('Late')).length;
    
    return [
      { name: 'Present', value: present, color: '#4CAF50' },
      { name: 'Absent', value: absent, color: '#F44336' },
      { name: 'Late', value: late, color: '#FF9800' }
    ];
  };

  const getTotalsByStatus = () => {
    const totals = {
      totalDays: attendanceData.length,
      present: attendanceData.filter(a => a.status === 'Present').length,
      absent: attendanceData.filter(a => a.status === 'Absent').length,
      late: attendanceData.filter(a => a.remarks.includes('Late')).length,
      overtime: attendanceData.filter(a => a.remarks.includes('Overtime')).length,
      wfh: attendanceData.filter(a => a.remarks.includes('WFH')).length,
    };
    return totals;
  };

  const totals = getTotalsByStatus();

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Check In', 'Check Out', 'Hours', 'Status', 'Remarks'];
    const dataRows = filteredData.map(item => 
      [item.date, item.checkIn, item.checkOut, item.hours, item.status, item.remarks]
    );
    
    const csvContent = [
      headers.join(','),
      ...dataRows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${formatDateForAPI(new Date())}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return '#4CAF50';
      case 'Absent': return '#F44336';
      case 'Late': return '#FF9800';
      case 'WFH': return '#2196F3';
      case 'Overtime': return '#9C27B0';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated || !employeeId) {
    return (
      <div className={styles.loading}>
        {!isAuthenticated ? "Authentication required. Redirecting to login..." : "Loading user data..."}
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebarWrapper}>
      </div>

      <div className={styles.main}>

        <div className={styles.employeeCard}>
          <div className={styles.employeeDetails}>
            <h2>Employee Details</h2>
            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Name:</span>
                <span className={styles.detailValue}>{employeeData.name}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Employee ID:</span>
                <span className={styles.detailValue}>{employeeData.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Department:</span>
                <span className={styles.detailValue}>{employeeData.department}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Designation:</span>
                <span className={styles.detailValue}>{employeeData.designation}</span>
              </div>
            </div>
          </div>

          <div className={styles.timeAction}>
            <div className={styles.currentTime}>
              <Clock size={20} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            {isPunchedIn && (
              <div className={styles.elapsedTime}>
                <span>Time elapsed: {formatElapsedTime(elapsedTime)}</span>
              </div>
            )}
            <button 
              className={`${styles.punchButton} ${isPunchedIn ? styles.punchOut : styles.punchIn}`}
              onClick={handlePunch}
            >
              {isPunchedIn ? 'Punch Out' : 'Punch In'}
            </button>
            {statusMessage && (
              <div className={`${styles.statusMessage} ${isLate && isPunchedIn ? styles.lateMessage : ''}`}>
                {statusMessage}
              </div>
            )}
          </div>
        </div>

        <section className={styles.quickStats}>
          <div className={styles.statCard}>
            <h3>Total Days</h3>
            <p>{totals.totalDays}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Present</h3>
            <p>{totals.present}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Absent</h3>
            <p>{totals.absent}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Work from Home</h3>
            <p>{totals.wfh}</p>
          </div>
        </section>

        <div className={styles.attendanceSummary}>
          <div className={styles.summaryTitle}>
            <h2>Attendance Summary</h2>
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={getSummaryData()}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {getSummaryData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className={styles.attendanceHistory}>
          <div className={styles.historyHeader}>
            <h2>Attendance History</h2>
            <div className={styles.viewControls}>
              <div className={styles.viewToggle}>
                <button 
                  className={viewMode === 'table' ? styles.active : ''} 
                  onClick={() => setViewMode('table')}
                >
                  Table View
                </button>
                <button 
                  className={viewMode === 'calendar' ? styles.active : ''} 
                  onClick={() => setViewMode('calendar')}
                >
                  Calendar View
                </button>
              </div>
              <button className={styles.exportBtn} onClick={exportToCSV}>
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className={styles.filterControls}>
              <div className={styles.filterItem}>
                <input 
                  type="date" 
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              <div className={styles.filterItem}>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="WFH">WFH</option>
                  <option value="Overtime">Overtime</option>
                </select>
                <ChevronDown size={16} className={styles.selectIcon} />
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className={styles.tableView}>
              <table className={styles.attendanceTable}>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('date')}>
                      Date 
                      {sortConfig.key === 'date' && (
                        <span className={styles.sortIndicator}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Hours</th>
                    <th onClick={() => handleSort('status')}>
                      Status
                      {sortConfig.key === 'status' && (
                        <span className={styles.sortIndicator}>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                      <tr key={index}>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.checkIn}</td>
                        <td>{item.checkOut}</td>
                        <td>{item.hours}</td>
                        <td>
                          <span 
                            className={styles.statusIndicator} 
                            style={{ backgroundColor: getStatusColor(item.status) }}
                          ></span>
                          {item.status}
                        </td>
                        <td>{item.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className={styles.noData}>No records found matching your filters.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={styles.calendarView}>
              <p className={styles.comingSoon}>Calendar view will be implemented soon.</p>
            </div>
          )}
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

      {loading && (
        <div className={styles.loading}>Loading attendance data...</div>
      )}
      
      {error && (
        <div className={styles.error}>{error}</div>
      )}
       
    </div>
    
  );
};
export default AttendancePage;