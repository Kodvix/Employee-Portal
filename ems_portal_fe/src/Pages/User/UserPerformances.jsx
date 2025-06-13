import React from "react";
import styles from "./Userperformances.module.css";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const UserPerformances = () => {
  const performanceData = [
    { month: "Jan", score: 75 },
    { month: "Feb", score: 78 },
    { month: "Mar", score: 82 },
    { month: "Apr", score: 85 },
    { month: "May", score: 88 },
    { month: "Jun", score: 90 },
  ];
  const handleDownload = () => {
    const reportData = `
      Name: John Doe
      Role: Software Engineer
      Department: Engineering
      Performance Period: Q1 2025
      Manager Feedback: Excellent code quality and collaboration skills.
      Peer Feedback: Great team player.
      Goals:
        - Improve Code Quality: 60%
        - Increase Unit Test Coverage: 80%
    `;

    const blob = new Blob([reportData], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "performance-report.pdf";
    link.click();
  };

  return (
    <div className={styles.userPerformance}>
      <div className={styles.sidebarWrapper}>{/* <AdminSidebar /> */}</div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* <TopBar /> */}
        {/* Header */}
        <header className={styles.header}>Employee performance</header>

        {/* Employee Summary */}
        <section className={styles.employeeSummary}>
          <h2>Employee Summary</h2>
          <p>Name: John Doe</p>
          <p>Role: Software Engineer</p>
          <p>Department: Engineering</p>
          <p>Performance Period: Q1 2025</p>
        </section>

        {/* Goals and Objectives */}
        <section className={styles.goals}>
          <h2>Goals and Objectives</h2>
          <ul>
            <li>
              <p>Goal: Improve Code Quality</p>
              <progress value="60" max="100"></progress>
            </li>
            <li>
              <p>Goal: Increase Unit Test Coverage</p>
              <progress value="80" max="100"></progress>
            </li>
          </ul>
        </section>

        {/* Feedback */}
        <section className={styles.feedback}>
          <h2>Feedback</h2>
          <p>
            Manager Feedback: Excellent code quality and collaboration skills.
          </p>
          <p>
            Peer Feedback: Great team player, always willing to help others.
          </p>
        </section>

        {/* Skills and Competencies */}
        <section className={styles.skills}>
          <h2>Skills & Competencies</h2>
          <ul>
            <li>
              <p>
                JavaScript: <span className={styles.skillLevel}>Advanced</span>
              </p>
            </li>
            <li>
              <p>
                React: <span className={styles.skillLevel}>Intermediate</span>
              </p>
            </li>
          </ul>
        </section>

        {/* Achievements */}
        <section className={styles.achievements}>
          <h2>Achievements</h2>
          <ul>
            <li>Employee of the Month - January 2025</li>
            <li>Successfully led the XYZ project</li>
          </ul>
        </section>

        {/* Performance Trends with Chart */}
        <section className={styles.performanceTrends}>
          <h2>Performance Trends</h2>
          <p>Performance over the last 6 months:</p>
          <div className={styles.chart}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={performanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[60, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Development Plan */}
        <section className={styles.developmentPlan}>
          <h2>Development Plan</h2>
          <ul>
            <li>Complete React Certification by Q2 2025</li>
            <li>Attend Advanced JavaScript Workshop</li>
          </ul>
        </section>

        {/* Export Report */}
        <section className={styles.exportReport}>
          <h2>Export Performance Report</h2>
          <button className={styles.button} onClick={handleDownload}>
            Download Report
          </button>
        </section>
      </div>
      
    </div>
  );
};

export default UserPerformances;
