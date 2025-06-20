import React, { useState, useEffect, useRef } from "react";
import "./AdminEmployeeManagement.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import employeeService from "../../Services/employeeService";

const AdminEmployeeManagement = () => {
  const departments = [
    "IT Services",
    "Product Development",
    "Quality Assurance",
    "DevOps & Infrastructure",
    "Database Management",
    "Business Analysis",
    "Human Resources",
    "Sales & Marketing",
    "Customer Support",
  ];

  const positionsByDepartment = {
    "IT Services": [
      "IT Administrator",
      "IT Support Engineer",
      "Network Engineer",
      "System Administrator",
      "Technical Lead",
    ],
    "Product Development": [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Mobile App Developer",
      "Software Architect",
    ],
    "Quality Assurance": [
      "QA Engineer",
      "QC Analyst",
      "Automation Tester",
      "Manual Tester",
      "Test Lead",
    ],
    "DevOps & Infrastructure": [
      "DevOps Engineer",
      "Cloud Engineer",
      "Site Reliability Engineer",
      "CI/CD Engineer",
      "Infrastructure Architect",
    ],
    "Database Management": [
      "Database Developer",
      "Database Administrator",
      "Data Engineer",
      "SQL Specialist",
      "ETL Developer",
    ],
    "Business Analysis": [
      "Business Analyst",
      "Product Manager",
      "Scrum Master",
      "Project Coordinator",
      "Requirements Analyst",
    ],
    "Human Resources": [
      "HR Manager",
      "Recruitment Specialist",
      "HR Coordinator",
      "Talent Acquisition Lead",
      "Training & Development Officer",
    ],
    "Sales & Marketing": [
      "Sales Executive",
      "Marketing Manager",
      "Digital Marketing Executive",
      "Business Development Manager",
      "Content Strategist",
    ],
    "Customer Support": [
      "Customer Support Executive",
      "Technical Support Specialist",
      "Support Manager",
      "Client Relationship Manager",
      "Service Desk Agent",
    ],
  };

  // Employee data
  const [employees, setEmployees] = useState([]);
  const [view, setView] = useState("employees");
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [isEditingEmployee, setIsEditingEmployee] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const fileInputRef = useRef(null);
  const [currentDocAction, setCurrentDocAction] = useState(null);

  // Updated newEmployee state to include address fields
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    joinDate: "",
    status: "Active",
    username: "",
    password: "",
    salary: "",
    // Address fields
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  // Load all employees using service
  const loadAllEmployees = async () => {
    try {
      const data = await employeeService.getAllEmployees();
      const transformed = data.map((emp) =>
        employeeService.transformEmployeeData(emp)
      );
      setEmployees(transformed);
    } catch (err) {
      console.error("Error loading employees:", err.message);
      toast.error("Failed to load employees");
    }
  };

  useEffect(() => {
    loadAllEmployees();
  }, []);

  // Generate positions based on selected department
  const [availablePositions, setAvailablePositions] = useState([]);

  useEffect(() => {
    if (newEmployee.department) {
      setAvailablePositions(
        positionsByDepartment[newEmployee.department] || []
      );
      if (
        !positionsByDepartment[newEmployee.department]?.includes(
          newEmployee.position
        )
      ) {
        setNewEmployee({
          ...newEmployee,
          position: "",
        });
      }
    } else {
      setAvailablePositions([]);
    }
  }, [newEmployee.department]);

  
  const filteredEmployees = employees.filter((employee) => {
    const searchMatch =
      employee.name.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchText.toLowerCase()) ||
      employee.employeeNumber.toLowerCase().includes(searchText.toLowerCase());

    const departmentMatch = filterDepartment
      ? employee.department === filterDepartment
      : true;
    const statusMatch = filterStatus ? employee.status === filterStatus : true;

    return searchMatch && departmentMatch && statusMatch;
  });

  // Handle employee creation with authentication
  const handleCreateEmployee = async () => {
    if (
      !newEmployee.name ||
      !newEmployee.department ||
      !newEmployee.position ||
      !newEmployee.email
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    // Validate address fields
    if (
      !newEmployee.address.street ||
      !newEmployee.address.city ||
      !newEmployee.address.state ||
      !newEmployee.address.postalCode ||
      !newEmployee.address.country
    ) {
      toast.error("Please fill all address fields!");
      return;
    }

    const username =
      newEmployee.username ||
      employeeService.generateUsername(newEmployee.name);
    const password = newEmployee.password || "welcome123";
    const employeeNumber = employeeService.generateEmployeeNumber(employees);

    // Prepare employee data for API
    const employeeData = employeeService.transformToApiFormat(
      newEmployee,
      employeeNumber
    );

    // Prepare authentication data
    const authData = {
      email: newEmployee.email,
      password: password,
      role: "EMPLOYEE",
    };

    console.log(
      "Creating employee with data:",
      JSON.stringify(employeeData, null, 2)
    );
    console.log("Auth data:", JSON.stringify(authData, null, 2));

    try {
      const result = await employeeService.createEmployeeWithAuth(
        employeeData,
        authData
      );

      if (result.authRegistered) {
        toast.success(
          "Employee created and authentication registered successfully!"
        );
      } else {
        toast.warning(
          `Employee created but authentication failed: ${result.authError}`
        );
      }

      const finalEmployee = {
        ...employeeService.transformEmployeeData(result.employee),
        username,
        password,
      };

      setEmployees((prev) => [...prev, finalEmployee]);
      setIsAddingEmployee(false);

      // Reset form
      setNewEmployee({
        name: "",
        department: "",
        position: "",
        email: "",
        phone: "",
        joinDate: "",
        status: "Active",
        username: "",
        password: "",
        salary: "",
        address: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
      });
    } catch (error) {
      console.error("Error while creating employee:", error.message);
      toast.error(`Error while creating employee: ${error.message}`);
    }
  };

  // Handle employee update using service
  const handleUpdateEmployee = async () => {
    if (
      !selectedEmployee.name ||
      !selectedEmployee.department ||
      !selectedEmployee.position ||
      !selectedEmployee.email
    ) {
      toast.error("Please fill all required fields!");
      return;
    }

    const employeeData = employeeService.transformToApiFormat(
      selectedEmployee,
      selectedEmployee.employeeNumber
    );
    employeeData.id = selectedEmployee.id;

    try {
      const updated = await employeeService.updateEmployee(
        selectedEmployee.id,
        employeeData
      );
      const updatedEmployee = employeeService.transformEmployeeData(updated);

      const updatedEmployees = employees.map((emp) =>
        emp.id === updated.id ? updatedEmployee : emp
      );

      setEmployees(updatedEmployees);
      setIsEditingEmployee(false);
      setSelectedEmployee(null);
      toast.success("Employee updated successfully!");
    } catch (error) {
      console.error("Error updating employee:", error.message);
      toast.error(`Error updating employee: ${error.message}`);
    }
  };
 

  // Handle status toggle
  const handleToggleStatus = (employeeId) => {
    const updatedEmployees = employees.map((emp) => {
      if (emp.id === employeeId) {
        return {
          ...emp,
          status: emp.status === "Active" ? "Inactive" : "Active",
        };
      }
      return emp;
    });

    setEmployees(updatedEmployees);
    toast.success("Employee status updated!");
  };

  // Handle edit click
  const handleEditClick = (employee) => {
    setSelectedEmployee({ ...employee });
    setIsEditingEmployee(true);

    if (employee.department) {
      setAvailablePositions(positionsByDepartment[employee.department] || []);
    }
  };

  // Handle reset password
  const handleResetPassword = (employeeId) => {
    if (
      window.confirm("Are you sure you want to reset this employee's password?")
    ) {
      const updatedEmployees = employees.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            password: "welcome123",
          };
        }
        return emp;
      });

      setEmployees(updatedEmployees);
      toast.success("Password reset successfully!");
    }
  };

  // Handle address field changes
  const handleAddressChange = (field, value) => {
    setNewEmployee({
      ...newEmployee,
      address: {
        ...newEmployee.address,
        [field]: value,
      },
    });
  };

  
  const formatSalary = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="pageWrapper">
      <ToastContainer />
      <div className="sidebarWrapper">{/* <AdminSidebar /> */}</div>
      <div className="main">
        {/* <AdminTopBar /> */}

        <div className="headerContainer">
          <h3 className="header-1">Employee Management</h3>
          <button
            className="addEmployeeBtn"
            onClick={() => setIsAddingEmployee(true)}
          >
            + New Employee
          </button>
        </div>

        <div className="tabs">
          <button
            className={view === "employees" ? "activeTab" : ""}
            onClick={() => setView("employees")}
          >
            All Employees
          </button>
          <button
            className={view === "departments" ? "activeTab" : ""}
            onClick={() => setView("departments")}
          >
            By Department
          </button>
          <button
            className={view === "analytics" ? "activeTab" : ""}
            onClick={() => setView("analytics")}
          >
            Analytics
          </button>
        </div>

        <div className="filtersContainer">
          <div className="searchBar">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="filterSelects">
            <select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              className="filterSelect"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filterSelect"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {view === "employees" && (
          <div className="employeesList">
            <div className="table-container">
              <div className="employeesHeader">
                <span className="employeeId">ID</span>
                <span className="employeeName">Name</span>
                <span className="employeeDepartment">Department</span>
                <span className="employeePosition">Position</span>
                <span className="employeeEmail">Email</span>
                <span className="employeeStatus">Status</span>
                <span className="employeeActions">Actions</span>
              </div>

              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <div key={employee.id} className="employeeItem">
                    <span className="employeeId">
                      {employee.employeeNumber}
                    </span>
                    <span className="employeeName">
                    
                      {employee.name}
                    </span>
                    <span className="employeeDepartment">
                      {employee.department}
                    </span>
                    <span className="employeePosition">
                      {employee.position}
                    </span>
                    <span className="employeeEmail">{employee.email}</span>
                    <span
                      className={`employeeStatus ${employee.status.toLowerCase()}`}
                    >
                      {employee.status}
                    </span>
                    <span className="employeeActions">
                      <button
                        className="viewButton"
                        onClick={() => setSelectedEmployee(employee)}
                      >
                        View
                      </button>
                      <button
                        className="editButton"
                        onClick={() => handleEditClick(employee)}
                      >
                        Edit
                      </button>
                      {/* <button 
                      className="deleteButton"
                      onClick={() => handleDeleteEmployee(employee.id)}
                    >
                      Delete
                    </button> */}
                    </span>
                  </div>
                ))
              ) : (
                <div className="noEmployees">
                  No employees found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {view === "departments" && (
          <div className="departmentsList">
            {departments.map((department, index) => {
              const deptEmployees = employees.filter(
                (emp) => emp.department === department
              );

              return (
                <div key={index} className="departmentSection">
                  <div className="departmentHeader">
                    <h3>{department}</h3>
                    <span className="employeeCount">
                      {deptEmployees.length} employees
                    </span>
                  </div>

                  {deptEmployees.length > 0 ? (
                    <div className="departmentEmployees">
                      {deptEmployees.map((employee) => (
                        <div key={employee.id} className="employeeCard">
                          <div className="employeeCardHeader">
                            
                            <div className="employeeCardInfo">
                              <h4>{employee.name}</h4>
                              <p>{employee.position}</p>
                              <span
                                className={`statusIndicator ${employee.status.toLowerCase()}`}
                              >
                                {employee.status}
                              </span>
                            </div>
                          </div>
                          <div className="employeeCardDetails">
                            <div className="detailItem">
                              <span className="detailLabel">ID:</span>
                              <span className="detailValue">
                                {employee.employeeNumber}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="detailLabel">Email:</span>
                              <span className="detailValue">
                                {employee.email}
                              </span>
                            </div>
                            <div className="detailItem">
                              <span className="detailLabel">Join Date:</span>
                              <span className="detailValue">
                                {employee.joinDate}
                              </span>
                            </div>
                          </div>
                          <div className="employeeCardActions">
                            <button
                              className="cardActionButton view"
                              onClick={() => setSelectedEmployee(employee)}
                            >
                              View Details
                            </button>
                            <button
                              className="cardActionButton edit"
                              onClick={() => handleEditClick(employee)}
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="noDepartmentEmployees">
                      No employees in this department
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === "analytics" && (
          <div className="analyticsContainer">
            <div className="analyticsCards">
              <div className="analyticsCard">
                <h3>Department Distribution</h3>
                <div className="departmentChart">
                  {departments.map((dept, index) => {
                    const deptCount = employees.filter(
                      (emp) => emp.department === dept
                    ).length;
                    const percentage =
                      employees.length > 0
                        ? (deptCount / employees.length) * 100
                        : 0;

                    return (
                      <div key={index} className="chartItem">
                        <div className="chartLabel">{dept}</div>
                        <div className="chartBarContainer">
                          <div
                            className="chartBar"
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <span className="chartValue">{deptCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="analyticsCard">
                <h3>Employee Status</h3>
                <div className="statusChart">
                  <div className="pieChart">
                    <div
                      className="pieSegment active"
                      style={{
                        transform: "rotate(0deg)",
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 +
                          50 *
                            Math.cos(
                              (employees.filter((e) => e.status === "Active")
                                .length /
                                employees.length) *
                                2 *
                                Math.PI
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              (employees.filter((e) => e.status === "Active")
                                .length /
                                employees.length) *
                                2 *
                                Math.PI
                            )
                        }%, 50% 50%)`,
                      }}
                    ></div>
                    <div
                      className="pieSegment inactive"
                      style={{
                        transform: `rotate(${
                          (employees.filter((e) => e.status === "Active")
                            .length /
                            employees.length) *
                          360
                        }deg)`,
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 +
                          50 *
                            Math.cos(
                              (employees.filter((e) => e.status === "Inactive")
                                .length /
                                employees.length) *
                                2 *
                                Math.PI
                            )
                        }% ${
                          50 -
                          50 *
                            Math.sin(
                              (employees.filter((e) => e.status === "Inactive")
                                .length /
                                employees.length) *
                                2 *
                                Math.PI
                            )
                        }%, 50% 50%)`,
                      }}
                    ></div>
                  </div>
                  <div className="chartLegend">
                    <div className="legendItem">
                      <span className="legendColorBox active"></span>
                      <span>
                        Active (
                        {employees.filter((e) => e.status === "Active").length})
                      </span>
                    </div>
                    <div className="legendItem">
                      <span className="legendColorBox inactive"></span>
                      <span>
                        Inactive (
                        {
                          employees.filter((e) => e.status === "Inactive")
                            .length
                        }
                        )
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="analyticsTable">
              <h3>Department Summary</h3>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Total Employees</th>
                    <th>Active Employees</th>
                    <th>Inactive Employees</th>
                    <th>Positions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept, index) => {
                    const deptEmployees = employees.filter(
                      (emp) => emp.department === dept
                    );
                    const activeEmployees = deptEmployees.filter(
                      (emp) => emp.status === "Active"
                    ).length;
                    const inactiveEmployees = deptEmployees.filter(
                      (emp) => emp.status === "Inactive"
                    ).length;
                    const positions = [
                      ...new Set(deptEmployees.map((emp) => emp.position)),
                    ];

                    return (
                      <tr key={index}>
                        <td>{dept}</td>
                        <td>{deptEmployees.length}</td>
                        <td>{activeEmployees}</td>
                        <td>{inactiveEmployees}</td>
                        <td>{positions.join(", ") || "None"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Employee details modal */}
        {selectedEmployee && !isEditingEmployee && (
          <div className="modalOverlay">
            <div className="modal">
              <button
                className="closeButton"
                onClick={() => setSelectedEmployee(null)}
              >
                ✕
              </button>

              <div className="modalHeader">
                {/* <div className="employeeModalAvatar">
                  {selectedEmployee.avatar ? (
                    <img src={selectedEmployee.avatar} alt={selectedEmployee.name} onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "../assets/images/No-image.jpg";
                    }} />
                  ) : (
                    <div className="avatarPlaceholder large">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div> */}
                <div className="employeeModalInfo">
                  <h2>{selectedEmployee.name}</h2>
                  <p>
                    {selectedEmployee.position} • {selectedEmployee.department}
                  </p>
                  <span
                    className={`employeeStatus ${selectedEmployee.status.toLowerCase()}`}
                  >
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              <div className="modalContent">
                <div className="employeeDetailSection">
                  <h3>Personal Information</h3>
                  <div className="detailsGrid">
                    <div className="detailItem">
                      <span className="detailLabel">Employee ID:</span>
                      <span className="detailValue">
                        {selectedEmployee.employeeNumber}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Full Name:</span>
                      <span className="detailValue">
                        {selectedEmployee.name}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Email:</span>
                      <span className="detailValue">
                        {selectedEmployee.email}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Phone:</span>
                      <span className="detailValue">
                        {selectedEmployee.phone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Address Information Section */}
                <div className="employeeDetailSection">
                  <h3>Address Information</h3>
                  <div className="detailsGrid">
                    <div className="detailItem">
                      <span className="detailLabel">Street:</span>
                      <span className="detailValue">
                        {selectedEmployee.address?.street || "Not provided"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">City:</span>
                      <span className="detailValue">
                        {selectedEmployee.address?.city || "Not provided"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">State:</span>
                      <span className="detailValue">
                        {selectedEmployee.address?.state || "Not provided"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Postal Code:</span>
                      <span className="detailValue">
                        {selectedEmployee.address?.postalCode || "Not provided"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Country:</span>
                      <span className="detailValue">
                        {selectedEmployee.address?.country || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="employeeDetailSection">
                  <h3>Employment Details</h3>
                  <div className="detailsGrid">
                    <div className="detailItem">
                      <span className="detailLabel">Department:</span>
                      <span className="detailValue">
                        {selectedEmployee.department}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Position:</span>
                      <span className="detailValue">
                        {selectedEmployee.position}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Join Date:</span>
                      <span className="detailValue">
                        {selectedEmployee.joinDate || "Not provided"}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Status:</span>
                      <span
                        className={`detailValue ${selectedEmployee.status.toLowerCase()}`}
                      >
                        {selectedEmployee.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="employeeDetailSection">
                  <h3>Account Credentials</h3>
                  <div className="detailsGrid">
                    <div className="detailItem">
                      <span className="detailLabel">Username:</span>
                      <span className="detailValue">
                        {selectedEmployee.username}
                      </span>
                    </div>
                    <div className="detailItem">
                      <span className="detailLabel">Password:</span>
                      <span className="detailValue passwordMask">
                        •••••••••••
                      </span>
                    </div>
                  </div>
                  <div className="credentialActions">
                    <button
                      className="resetPasswordButton"
                      onClick={() => handleResetPassword(selectedEmployee.id)}
                    >
                      Reset Password
                    </button>
                  </div>
                </div>

                {/* {renderDocumentManagement()} */}

                <div className="modalActions">
                  <button
                    className="editButton"
                    onClick={() => handleEditClick(selectedEmployee)}
                  >
                    Edit Employee
                  </button>
                  <button
                    className={`toggleStatusButton ${
                      selectedEmployee.status === "Active"
                        ? "deactivate"
                        : "activate"
                    }`}
                    onClick={() => handleToggleStatus(selectedEmployee.id)}
                  >
                    {selectedEmployee.status === "Active"
                      ? "Deactivate"
                      : "Activate"}{" "}
                    Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Employee Modal */}
        {isEditingEmployee && selectedEmployee && (
          <div className="modalOverlay">
            <div className="modal">
              <button
                className="closeButton"
                onClick={() => {
                  setIsEditingEmployee(false);
                  setSelectedEmployee(null);
                }}
              >
                ✕
              </button>

              <div className="modalHeader">
                <h2>Edit Employee</h2>
              </div>

              <div className="modalContent">
                <div className="formGroup">
                  <label>Full Name*</label>
                  <input
                    type="text"
                    value={selectedEmployee.name}
                    onChange={(e) =>
                      setSelectedEmployee({
                        ...selectedEmployee,
                        name: e.target.value,
                      })
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Department*</label>
                    <select
                      value={selectedEmployee.department}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          department: e.target.value,
                          position: "",
                        })
                      }
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label>Position*</label>
                    <select
                      value={selectedEmployee.position}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          position: e.target.value,
                        })
                      }
                      required
                      disabled={!selectedEmployee.department}
                    >
                      <option value="">Select Position</option>
                      {availablePositions.map((pos, index) => (
                        <option key={index} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Email*</label>
                    <input
                      type="email"
                      value={selectedEmployee.email}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={selectedEmployee.phone || ""}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Join Date</label>
                    <input
                      type="date"
                      value={selectedEmployee.joinDate || ""}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          joinDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="formGroup">
                    <label>Status</label>
                    <select
                      value={selectedEmployee.status}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Username</label>
                    <input
                      type="text"
                      value={selectedEmployee.username}
                      onChange={(e) =>
                        setSelectedEmployee({
                          ...selectedEmployee,
                          username: e.target.value,
                        })
                      }
                      placeholder="Enter username"
                    />
                  </div>

                  {/* <div className="formGroup">
                    <label>Avatar URL</label>
                    <input
                      type="text"
                      value={selectedEmployee.avatar || ''}
                      onChange={(e) => setSelectedEmployee({...selectedEmployee, avatar: e.target.value})}
                      placeholder="Enter avatar URL"
                    />
                  </div> */}
                </div>

                <div className="modalActions">
                  <button
                    className="cancelButton"
                    onClick={() => {
                      setIsEditingEmployee(false);
                      setSelectedEmployee(null);
                    }}
                  >
                    Cancel
                  </button>
                  <button className="saveButton" onClick={handleUpdateEmployee}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Employee Modal with Address Fields */}
        {isAddingEmployee && (
          <div className="modalOverlay">
            <div className="modal">
              <button
                className="closeButton"
                onClick={() => setIsAddingEmployee(false)}
              >
                ✕
              </button>

              <div className="modalHeader">
                <h2>Add New Employee</h2>
              </div>

              <div className="modalContent">
                <div className="formGroup">
                  <label>Full Name*</label>
                  <input
                    type="text"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Department*</label>
                    <select
                      value={newEmployee.department}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          department: e.target.value,
                          position: "",
                        })
                      }
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="formGroup">
                    <label>Position*</label>
                    <select
                      value={newEmployee.position}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          position: e.target.value,
                        })
                      }
                      required
                      disabled={!newEmployee.department}
                    >
                      <option value="">Select Position</option>
                      {availablePositions.map((pos, index) => (
                        <option key={index} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Email*</label>
                    <input
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div className="formGroup">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={newEmployee.phone}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          phone: e.target.value,
                        })
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div className="addressSection">
                  <h3>Address Information</h3>
                  <div className="formGroup">
                    <label>Street Address*</label>
                    <input
                      type="text"
                      value={newEmployee.address.street}
                      onChange={(e) =>
                        handleAddressChange("street", e.target.value)
                      }
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div className="formRow">
                    <div className="formGroup">
                      <label>City*</label>
                      <input
                        type="text"
                        value={newEmployee.address.city}
                        onChange={(e) =>
                          handleAddressChange("city", e.target.value)
                        }
                        placeholder="Enter city"
                        required
                      />
                    </div>

                    <div className="formGroup">
                      <label>State*</label>
                      <input
                        type="text"
                        value={newEmployee.address.state}
                        onChange={(e) =>
                          handleAddressChange("state", e.target.value)
                        }
                        placeholder="Enter state"
                        required
                      />
                    </div>
                  </div>

                  <div className="formRow">
                    <div className="formGroup">
                      <label>Postal Code*</label>
                      <input
                        type="text"
                        value={newEmployee.address.postalCode}
                        onChange={(e) =>
                          handleAddressChange("postalCode", e.target.value)
                        }
                        placeholder="Enter postal code"
                        required
                      />
                    </div>

                    <div className="formGroup">
                      <label>Country*</label>
                      <input
                        type="text"
                        value={newEmployee.address.country}
                        onChange={(e) =>
                          handleAddressChange("country", e.target.value)
                        }
                        placeholder="Enter country"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Join Date</label>
                    <input
                      type="date"
                      value={newEmployee.joinDate}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          joinDate: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="formGroup">
                    <label>Salary</label>
                    <input
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          salary: parseFloat(e.target.value) || "",
                        })
                      }
                      placeholder="Enter salary"
                    />
                    {newEmployee.salary && (
                      <div
                        style={{
                          marginTop: "5px",
                          color: "#2e7d32",
                          fontWeight: "bold",
                        }}
                      >
                        ₹
                        {new Intl.NumberFormat("en-IN").format(
                          newEmployee.salary
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Status</label>
                    <select
                      value={newEmployee.status}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="formRow">
                  <div className="formGroup">
                    <label>Username</label>
                    <input
                      type="text"
                      value={newEmployee.username}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          username: e.target.value,
                        })
                      }
                      placeholder="Auto-generated from name if empty"
                    />
                    <small>Leave empty to auto-generate from name</small>
                  </div>

                  <div className="formGroup">
                    <label>Password</label>
                    <input
                      type="password"
                      value={newEmployee.password}
                      onChange={(e) =>
                        setNewEmployee({
                          ...newEmployee,
                          password: e.target.value,
                        })
                      }
                      placeholder="Default: welcome123"
                    />
                    <small>Leave empty for default password</small>
                  </div>
                </div>

                {/* <div className="formGroup">
                  <label>Avatar URL</label>
                  <input
                    type="text"
                    value={newEmployee.avatar}
                    onChange={(e) => setNewEmployee({...newEmployee, avatar: e.target.value})}
                    placeholder="Enter avatar URL"
                  />
                </div> */}

                <div className="modalActions">
                  <button
                    className="cancelButton"
                    onClick={() => setIsAddingEmployee(false)}
                  >
                    Cancel
                  </button>
                  <button className="saveButton" onClick={handleCreateEmployee}>
                    Create Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default AdminEmployeeManagement;
