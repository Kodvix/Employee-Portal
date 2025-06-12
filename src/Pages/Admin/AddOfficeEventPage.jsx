import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddOfficeEventPage.module.css";
import NoImage from "../../assets/images/No-image.jpg";

const API_URL = "http://192.168.1.32:8080/api/events";

const AddOfficeEventPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState({
    name: "",
    date: "",
    time: "",
    meridiem: "AM",
    location: "",
    eventImage: null,
    description: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      const enriched = res.data.map((ev) => {
        // Handle the date format from API response
        const date = ev.date || '';
        
        return {
          ...ev,
          date: date,
          recent: false,
          eventImage: ev.eventImage || null,
        };
      });
      setEvents(enriched);
    } catch (err) {
      console.error("Error fetching events:", err);
      setEvents([]); // Set empty array on error
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setEvent((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object for multipart/form-data
    const formData = new FormData();
    formData.append('name', event.name);
    formData.append('description', event.description);
    formData.append('date', event.date);
    formData.append('location', event.location);
    if (event.eventImage) {
      formData.append('eventImage', event.eventImage);
    }

    try {
      let savedEvent;
      if (isEditing) {
        const res = await axios.put(`${API_URL}/${editingId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        savedEvent = res.data;
      } else {
        const res = await axios.post(`${API_URL}/save`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        savedEvent = res.data;
      }

      // Format the saved event for display
      const newFormatted = {
        ...savedEvent,
        recent: true,
        eventImage: savedEvent.eventImage || null,
      };

      const updatedEvents = isEditing
        ? events.map((ev) => (ev.id === editingId ? newFormatted : { ...ev, recent: false }))
        : [newFormatted, ...events.map((ev) => ({ ...ev, recent: false }))];

      setEvents(updatedEvents);
      setShowPopup(true);
      resetForm();
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Error saving event. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (!confirm) return;

    try {
      await axios.delete(`${API_URL}/${id}`);
      setEvents((prev) => prev.filter((ev) => ev.id !== id));
      setSelectedEvent(null);
    } catch (err) {
      console.error("Error deleting event:", err);
    }
  };

  const handleEdit = (ev) => {
    setEvent({
      name: ev.name,
      date: ev.date,
      time: ev.time,
      meridiem: ev.meridiem,
      location: ev.location,
      eventImage: null,
      description: ev.description,
    });
    setEditingId(ev.id);
    setIsEditing(true);
    setShowForm(true);
    setSelectedEvent(null);
  };

  const resetForm = () => {
    setEvent({
      name: "",
      date: "",
      time: "",
      meridiem: "AM",
      location: "",
      eventImage: null,
      description: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingId(null);
    setSelectedEvent(null);
  };

  const filteredEvents = events.filter((ev) =>
    ev.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderDetailsView = () => (
    <div className={styles.detailsCard}>
      <button className={styles.backButton} onClick={() => setSelectedEvent(null)}>
        ← Back to Events
      </button>
      <div className={styles.eventDetails}>
        <h2 className={styles.eventTitle}>{selectedEvent.name}</h2>
        <div className={styles.eventInfo}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>📅 Date:</span>
            <span>{selectedEvent.date}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>🕒 Time:</span>
            <span>{selectedEvent.time} {selectedEvent.meridiem}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>📍 Location:</span>
            <span>{selectedEvent.location}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>📝 Description:</span>
            <p>{selectedEvent.description}</p>
          </div>
        </div>
        {selectedEvent.location && (
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapLink}
          >
            🌍 View on Google Maps
          </a>
        )}
      </div>
      <div className={styles.actions}>
        <button className={styles.editButton} onClick={() => handleEdit(selectedEvent)}>✏️ Edit</button>
        <button className={styles.deleteButton} onClick={() => handleDelete(selectedEvent.id)}>🗑️ Delete</button>
      </div>
    </div>
  );

  // Update the renderEventImage function to handle the new image format
  const renderEventImage = (event) => {
    return (
      <img
        src={event.eventImage ? `data:image/jpeg;base64,${event.eventImage}` : NoImage}
        alt="Event Cover"
        className={styles.coverImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = NoImage;
        }}
      />
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebarWrapper}>{/* Optional Sidebar */}</div>
      <div className={styles.main}>
        {showForm ? (
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.head}>
              <button type="button" className={styles.backButton} onClick={resetForm}>
                ← Back
              </button>
              <h2>{isEditing ? "Edit Event" : "Create a New Event"}</h2>
            </div>
            <label>
              Event Title
              <input 
                type="text" 
                name="name" 
                value={event.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter event title"
              />
            </label>
            <label>
              Description
              <textarea 
                name="description" 
                value={event.description} 
                onChange={handleChange} 
                rows={4} 
                required 
                placeholder="Enter event description"
              />
            </label>
            <label>
              Date
              <input 
                type="date" 
                name="date" 
                value={event.date} 
                onChange={handleChange} 
                required 
              />
            </label>
            <label>
              Location
              <input 
                type="text" 
                name="location" 
                value={event.location} 
                onChange={handleChange} 
                required 
                placeholder="Enter event location"
              />
            </label>
            <label className={styles.fileUpload}>
              Event Image
              <input 
                type="file" 
                name="eventImage" 
                accept="image/*" 
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEvent(prev => ({
                      ...prev,
                      eventImage: file
                    }));
                  }
                }} 
              />
              {event.eventImage && (
                <div className={styles.imagePreview}>
                  <img 
                    src={URL.createObjectURL(event.eventImage)} 
                    alt="Preview" 
                    className={styles.previewImage}
                  />
                </div>
              )}
            </label>
            <button type="submit" className={styles.submitButton}>
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </form>
        ) : selectedEvent ? (
          renderDetailsView()
        ) : (
          <div className={styles.previewSection}>
            <h2>Events History</h2>
            <div className={styles.footer}>
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              <button className={styles.createButton} onClick={() => {
                setShowForm(true);
                setIsEditing(false);
                setEditingId(null);
              }}>
                Create {events.length > 0 ? "Another" : "an"} Event
              </button>
            </div>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((ev) => (
                <div key={ev.id} className={styles.banner} onClick={() => setSelectedEvent(ev)}>
                  <div className={styles.imageBox}>
                    {renderEventImage(ev)}
                  </div>
                  <div className={styles.textBox}>
                    <h1>{ev.name}</h1>
                    <p>📅 {ev.date}</p>
                    <p>📍 {ev.location}</p>
                    {ev.recent && <p className={styles.recentText}>🆕 Recently added</p>}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>No events match your search.</p>
            )}
          </div>
        )}
        {showPopup && (
          <div className={styles.popup}>✅ Event {isEditing ? "updated" : "created"} successfully!</div>
        )}

    <footer className={styles.footer}>
                <div className={styles.footerLeft}>
                Copyright © 2025 Kodvix Technologies. All Rights Reserved.
              </div>
            <div className={styles.footerright}>
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


export default AddOfficeEventPage;
