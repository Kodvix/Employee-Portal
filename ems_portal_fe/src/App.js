

import { Routes, Route } from 'react-router-dom';
import './styles/index.css'; 

import EmployeeDashboard from './Pages/EmployeeDashboard'
import Dashboard from './Pages/User/Dashboard.jsx';
import AttendanceOverview from './Pages/User/AttendanceOverview.jsx';
import Task from './Pages/User/EmployeeTask.jsx';
import LeaveRequestPage from './Pages/User/HRRequestPage.jsx';
import UserPerformances from './Pages/User/UserPerformances.jsx';
import OfficeEventPage from './Pages/User/OfficeEventPage.jsx';
import DocumentCenter from './Pages/User/DocumentCenter.jsx';

import AdminDashboards from './Pages/AdminDashboards.jsx';
import AdminDashboard from './Pages/Admin/AdminDashboard.jsx';
import AdminEmployeeManagement from './Pages/Admin/AdminEmployeeManagement.jsx';
import AdminAttendancePage from './Pages/Admin/AdminAttendancePage.jsx';
import AdminTask from './Pages/Admin/AdminTask.jsx';
import AdminHRManagementPage from './Pages/Admin/AdminHRManagementPage.jsx';
import AddOfficeEventPage from './Pages/Admin/AddOfficeEventPage.jsx';
import AdminDocumentsPage from './Pages/Admin/AdminDocumentsPage.jsx';

import EMSLoginPage from './Pages/Login/EMSLoginPage.jsx';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword.jsx';
import EmployeeProfile from './Pages/User/EmployeeProfile.jsx';
import NotFoundPage from './Pages/ErrorPages/NotFoundPage.jsx';

import { 
  GuestRoute, 
  EmployeeProtectedRoute, 
  AdminProtectedRoute 
} from './components/ProtectedRoutes.jsx';

function App() {
  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <GuestRoute>
            <EMSLoginPage />
          </GuestRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <GuestRoute>
            <ForgotPassword />
          </GuestRoute>
        } 
      />

      <Route 
        path="/employee-dashboard" 
        element={
          <EmployeeProtectedRoute>
            <EmployeeDashboard />
          </EmployeeProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} /> 
        <Route path="Attendance" element={<AttendanceOverview />} />
        <Route path="Task" element={<Task/>} />
        <Route path="LeaveRequestPage" element={<LeaveRequestPage />} />
        <Route path="UserPerformances" element={<UserPerformances/>} />
        <Route path="DocumentCenter" element={<DocumentCenter />} />
        <Route path="OfficeEventPage" element={<OfficeEventPage />} />
        <Route path="EmployeeProfile" element={<EmployeeProfile />} />
      </Route>
      
      <Route 
        path="/Admin-dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminDashboards />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="AdminEmployeeManagement" element={<AdminEmployeeManagement />} />
        <Route path="AdminAttendancePage" element={<AdminAttendancePage />} />
        <Route path="AdminTask" element={<AdminTask />} />
        <Route path="AdminHRManagementPage" element={<AdminHRManagementPage />} />
        <Route path="AddOfficeEventPage" element={<AddOfficeEventPage />} />
        <Route path="AdminDocumentsPage" element={<AdminDocumentsPage />} />
      </Route>

      {/* 404 Page - Should be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;