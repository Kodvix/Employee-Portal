import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { Button, Progress } from 'reactstrap';
import 'react-circular-progressbar/dist/styles.css';
import Modal from 'react-modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Configure axios with base URL
axios.defaults.baseURL = 'http://192.168.1.32:8080';

const COLORS = ['#00C49F', '#FF8042', '#0088FE', '#FFBB28'];

const PriorityBadge = ({ priority }) => {
  let className = styles.priorityBadge;

  switch (priority?.toLowerCase()) {
    case 'high':
      className += ` ${styles.highPriority}`;
      break;
    case 'medium':
      className += ` ${styles.mediumPriority}`;
      break;
    case 'low':
      className += ` ${styles.lowPriority}`;
      break;
    default:
      break;
  }

  return <span className={className}>{priority}</span>;
};

const Dashboard = () => {
  const { employeeId, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    wfh: 0,
    tasks: 0,
    leaveBalance: 0,
  });

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log(`Fetching data for employee ID: ${employeeId}`);

        const attendanceResponse = await axios.get(`/api/attendances/employee/${employeeId}`);
        console.log('Attendance response:', attendanceResponse.data);

        const tasksResponse = await axios.get(`/api/tasks/employee/${employeeId}`);
        console.log('Tasks response:', tasksResponse.data);

        const projectsResponse = await axios.get(`/api/projects`);
        console.log('Projects response:', projectsResponse.data);

        const employeeResponse = await axios.get(`/api/employee/${employeeId}`);
        console.log('Employee response:', employeeResponse.data);

        const leaveRequestsResponse = await axios.get(`/api/leaves/employee/${employeeId}`);
        console.log('Leave Requests response:', leaveRequestsResponse.data);

        const tasksData = tasksResponse?.data || [];
        const leaveRequestsData = leaveRequestsResponse?.data || [];
        const employeeData = employeeResponse?.data;

        setTasks(tasksData);
        setProjects(projectsResponse?.data || []);
        setLeaveRequests(leaveRequestsData);

        const processedPerformanceData = processPerformanceData(tasksData);
        setPerformanceData(processedPerformanceData);

        // Calculate Leave Balance
        let leaveBalance = 0;
        let monthsWorked = 0;
        let accruedLeave = 0;
        let approvedLeaveTaken = 0;

        if (employeeData && employeeData.hireDate) {
          const hireDate = new Date(employeeData.hireDate);
          const today = new Date();
          
          // Calculate the number of full months between hire date and today
          let monthsDiff = (today.getFullYear() - hireDate.getFullYear()) * 12 + (today.getMonth() - hireDate.getMonth());

          // Adjust if today's day is before the hire date's day in the current month
          if (today.getDate() < hireDate.getDate()) {
              monthsDiff--;
          }
          
          // Ensure we count the hire month if the hire date is within it and today is after or on the hire date
          if (hireDate.getFullYear() === today.getFullYear() && hireDate.getMonth() === today.getMonth()) {
               if (today.getDate() >= hireDate.getDate()) {
                   monthsDiff = 1; // Count the first month if hired within it and still in that month
               } else {
                   monthsDiff = 0; // Not even one month completed yet
               }
          } else if (today > hireDate && monthsDiff <= 0) {
              // This case handles if the hire date is in a previous month but monthsDiff became 0 or negative due to day difference
              // It ensures we count at least the first partial month
              monthsDiff = 1;
          }

          // Ensure months worked is not negative
          monthsWorked = Math.max(0, monthsDiff);

          accruedLeave = monthsWorked * 1.5;

          approvedLeaveTaken = leaveRequestsData
            .filter(leave => leave.status === 'APPROVED')
            .reduce((totalDays, leave) => {
              const start = new Date(leave.startDate);
              const end = new Date(leave.endDate);
              const timeDiff = end.getTime() - start.getTime();
              const dayDiff = timeDiff / (1000 * 3600 * 24);
              return totalDays + dayDiff + 1; 
            }, 0);

          leaveBalance = accruedLeave - approvedLeaveTaken;
        }

        console.log('Leave Calculation Details:', {
            hireDate: employeeData?.hireDate,
            monthsWorked,
            accruedLeave,
            approvedLeaveTaken,
            leaveBalance
        });

        setStats({
          present: attendanceResponse?.data?.present || 0,
          absent: attendanceResponse?.data?.absent || 0,
          wfh: attendanceResponse?.data?.wfh || 0,
          tasks: tasksData.length || 0,
          leaveBalance: leaveBalance < 0 ? 0 : parseFloat(leaveBalance.toFixed(1)),
        });

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        if (err.response && err.response.status === 401) {
            setError('Authentication failed. Please login again.');
            logout();
            navigate('/');
        } else {
            // Set default values instead of error on other errors
            console.error('Setting default stats due to error:', err);
            setStats({
              present: 0,
              absent: 0,
              wfh: 0,
              tasks: 0,
              leaveBalance: 0,
            });
            setTasks([]);
            setProjects([]);
            setLeaveRequests([]);
            setPerformanceData([]);
            // Optionally set a more user-friendly error message if needed
            // setError('Failed to load dashboard data.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && employeeId) {
      fetchDashboardData();
    } else if (!isAuthenticated) {
        console.error('User not authenticated, redirecting to login.');
        // Redirection is handled in the catch block or by the AuthContext logic
    }
  }, [isAuthenticated, employeeId, navigate, logout]);

  const processPerformanceData = (tasks) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map(month => {
      const monthTasks = tasks.filter(task => {
        const taskDate = new Date(task.dueDate);
        return taskDate.getMonth() === months.indexOf(month);
      });
      return {
        month,
        notStarted: monthTasks.filter(task => !task.completed && !task.progress).length,
        completed: monthTasks.filter(task => task.completed).length,
        pending: monthTasks.filter(task => !task.completed && task.progress > 0).length,
      };
    });
  };

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = tasks.filter(task => !task.completed && task.progress > 0).length;
  const completedPercentage = (completedTasksCount / (tasks.length || 1)) * 100;
  const pendingPercentage = (pendingTasksCount / (tasks.length || 1)) * 100;
  const inProgressPercentage = 100 - completedPercentage - pendingPercentage;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // const handleTaskComplete = async (taskId) => {
  //   try {
  //     await markTaskAsCompleted(taskId);
  //     const tasksResponse = await getTaskById();
  //     setTasks(tasksResponse.data);
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.sidebarWrapper}>
      </div>

      <div className={styles.main}>
        <header className={styles.header}>Dashboard</header>

        <section className={styles.quickStats}>
          <div className={styles.statCard}>
            <h3>Total Present</h3>
            <p>{stats.present}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Absent</h3>
            <p>{stats.absent}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Leave Balance</h3>
            <p>{stats.leaveBalance}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Tasks</h3>
            <p>{stats.tasks}</p>
          </div>
        </section>

        <section className={styles.graphSection}>
          <div className={styles.chartContainer}>
            <h3>Task Completion Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [`${value} tasks`, name.replace(/([A-Z])/g, ' $1').trim()]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="notStarted"
                  name="Not Started"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  name="Completed"
                  stroke="#00C49F"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="pending"
                  name="Pending"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartContainer}>
            <h3>Project Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={projects.map(project => ({
                    name: project.name,
                    value: project.tasks?.length || 0
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {projects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} tasks`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className={styles.tasksSection}>
          <div className={styles.taskProgressContainer}>
            <h3>Task Status</h3>
            <div className={styles.circularProgressWrapper}>
              <CircularProgressbar
                value={completedPercentage}
                text={`${Math.round(completedPercentage)}%`}
                styles={buildStyles({
                  pathColor: '#00C49F',
                  textColor: '#333',
                  trailColor: '#f4f4f4',
                })}
                className={styles.circularProgress}
              />
            </div>
            
            <div className={styles.taskStatusContainer}>
              <div className={styles.progressBarContainer}>
                <p>Completed Tasks ({completedTasksCount})</p>
                <Progress value={completedPercentage} color="success" />
              </div>
              <div className={styles.progressBarContainer}>
                <p>In Progress Tasks ({Math.round(stats.tasks - completedTasksCount - pendingTasksCount)})</p>
                <Progress value={inProgressPercentage} color="warning" />
              </div>
              <div className={styles.progressBarContainer}>
                <p>Pending Tasks ({pendingTasksCount})</p>
                <Progress value={pendingPercentage} color="danger" />
              </div>
            </div>
          </div>

          <div className={styles.upcomingTasksContainer}>
            <h3>Upcoming Tasks</h3>
            <div className={styles.tasksList}>
              {tasks.map(task => (
                <div
                  key={task.id}
                  className={styles.taskCard}
                  onClick={() => {
                    setSelectedTask(task);
                    setModalOpen(true);
                  }}
                >
                  <div className={styles.taskHeader}>
                    <h4>{task.title}</h4>
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className={styles.taskDetails}>
                    <span className={styles.taskDeadline}>Due: {formatDate(task.dueDate)}</span>
                    <span className={styles.taskAssignee}>{task.assignedTo}</span>
                  </div>
                  <div className={styles.clickHint}>
                    <span>Click for details</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
{/* 
        <Modal
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}
          className={styles.taskDetailModal}
          overlayClassName={styles.modalOverlay}
          ariaHideApp={false}
          contentLabel="Task Details"
        >
          {selectedTask && (
            <div className={styles.modalContainer}>
              <div className={styles.modalHeader}>
                <h3>{selectedTask.title}</h3>
                <PriorityBadge priority={selectedTask.priority} />
                <button
                  className={styles.closeButton}
                  onClick={() => setModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              
              <div className={styles.modalContent}>
                <div className={styles.modalRow}>
                  <div className={styles.modalLabel}>Assignee:</div>
                  <div>{selectedTask.assignedTo}</div>
                </div>
                <div className={styles.modalRow}>
                  <div className={styles.modalLabel}>Deadline:</div>
                  <div>{formatDate(selectedTask.dueDate)}</div>
                </div>
                <div className={styles.modalRow}>
                  <div className={styles.modalLabel}>Status:</div>
                  <div className={`${styles.statusBadge} ${styles[selectedTask.completed ? 'completed' : 'pending']}`}>
                    {selectedTask.completed ? 'Completed' : 'Pending'}
                  </div>
                </div>
                <div className={styles.modalRow}>
                  <div className={styles.modalLabel}>Description:</div>
                  <div className={styles.modalDescription}>{selectedTask.description}</div>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <Button
                  color="secondary"
                  onClick={() => setModalOpen(false)}
                  className={styles.primaryButton}
                  style={{ marginLeft: '10px' }}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal> */}
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

export default Dashboard;