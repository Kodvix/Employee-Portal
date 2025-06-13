import React, { useState, useEffect, useRef } from "react";
import styles from "./NotificationBell.module.css";
import { FaBell } from "react-icons/fa";

const mockNotifications = [
  { id: 1, type: "Sick Leave", status: "Approved", message: "Sick leave approved from Apr 1 to Apr 3." },
  { id: 2, type: "Casual Leave", status: "Rejected", message: "Casual leave rejected for Mar 15 to Mar 16." },
  { id: 3, type: "Work From Home", status: "Approved", message: "WFH approved for Apr 5." },
  { id: 4, type: "Sick Leave", status: "Approved", message: "Sick leave approved from Mar 20 to Mar 21." },
  { id: 5, type: "Casual Leave", status: "Rejected", message: "Casual leave rejected for Feb 28." },
  { id: 6, type: "Annual Leave", status: "Approved", message: "Annual leave approved from Apr 10 to Apr 12." },
  { id: 7, type: "Emergency Leave", status: "Rejected", message: "Emergency leave rejected for Apr 2." },
  { id: 8, type: "Sick Leave", status: "Approved", message: "Sick leave approved for Mar 5." },
];

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const bellRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.bellWrapper} ref={bellRef}>
      <div className={styles.bellIcon} onClick={() => setOpen(!open)}>
        <FaBell size={20} />
        {mockNotifications.length > 0 && (
          <span className={styles.badge}>{mockNotifications.length}</span>
        )}
      </div>

      {open && (
        <div className={styles.dropdown}>
          <h4>Notifications</h4>
          <div className={styles.notificationsList}>
            {mockNotifications.length === 0 ? (
              <p className={styles.noNotifications}>No notifications</p>
            ) : (
              mockNotifications.map((note) => (
                <div
                  key={note.id}
                  className={`${styles.notificationItem} ${styles[note.status.toLowerCase()]}`}
                >
                  <strong>{note.status}</strong>: {note.message}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
