import React, { useEffect, useState, useRef } from 'react';
import styles from './OfficeEventsPage.module.css';
import axios from 'axios';

// Configure axios with base URL
axios.defaults.baseURL = 'http://192.168.1.19:8080';

const OfficeEventPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const upcomingRef = useRef(null);

  const now = new Date();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/events');
        console.log('Raw API Response:', response);
        console.log('Events API Response Data:', response.data);
        
        if (!Array.isArray(response.data)) {
          console.error('API response is not an array:', response.data);
          setError('Invalid data format received from server');
          return;
        }

        const apiEvents = response.data.map(event => {
          console.log('Processing event:', event);
          // Format the date to include time if not present
          const eventDate = event.date.includes('T') ? event.date : `${event.date}T00:00:00`;
          return {
            id: event.id,
            title: event.name || 'Untitled Event',
            description: event.description || 'No description',
            organizer: 'HR Team',
            date: eventDate,
            location: event.location,
            image: event.eventImage ? `data:image/jpeg;base64,${event.eventImage}` : null
          };
        });
        
        console.log('Formatted Events:', apiEvents);
        setEvents(apiEvents);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events
    .filter((event) => {
      const eventDate = new Date(event.date);
      const currentDate = new Date();
      // Reset time part for comparison
      currentDate.setHours(0, 0, 0, 0);
      eventDate.setHours(0, 0, 0, 0);
      console.log('Filtering event:', event.title, 'Date:', eventDate, 'Now:', currentDate);
      return eventDate >= currentDate;
    })
    .filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  console.log('Filtered Events:', filteredEvents);
  const currentEvent = filteredEvents[0];
  const nextEvents = filteredEvents.slice(1);
  console.log('Current Event:', currentEvent);
  console.log('Next Events:', nextEvents);

  const handleToggleUpcoming = () => {
    setShowUpcoming((prev) => {
      const nextValue = !prev;
      if (!prev && upcomingRef.current) {
        setTimeout(() => {
          upcomingRef.current.scrollIntoView({ behavior: 'smooth' });
        }, 2000);
      }
      return nextValue;
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.sidebarWrapper}></div>
        <div className={styles.main}>
          <div className={styles.loading}>Loading events...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.sidebarWrapper}></div>
        <div className={styles.main}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.sidebarWrapper}></div>
      <div className={styles.main}>
        <h1 className={styles.heading}>Events</h1>

        <input
          type="text"
          placeholder="Search events by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />

        {selectedEvent ? (
          <div className={styles.detailView}>
            <button
              className={styles.backBtn}
              onClick={() => setSelectedEvent(null)}
            >
              ← Back to Events
            </button>
            <h2 className={styles.title}>{selectedEvent.title}</h2>
            {selectedEvent.image ? (
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className={styles.detailImage}
              />
            ) : (
              <div className={styles.noImage}>No image available</div>
            )}
            <p><strong>Description:</strong> {selectedEvent.description}</p>
            <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
            <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()}</p>
            <p>
              <strong>📍 Location:</strong>{' '}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  selectedEvent.location
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.locationLink}
              >
                {selectedEvent.location}
              </a>
            </p>
          </div>
        ) : (
          <>
            {loading ? (
              <div className={styles.loading}>Loading events...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : filteredEvents.length === 0 ? (
              <div className={styles.noEvents}>No upcoming events found.</div>
            ) : (
              <>
                {currentEvent && (
                  <div className={styles.currentEvent}>
                    <h2 className={styles.subHeading}>Current Event</h2>
                    <div className={`${styles.card} ${styles.cardAnimation}`}>
                      {currentEvent.image ? (
                        <img
                          src={currentEvent.image}
                          alt={currentEvent.title}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.noImage}>No image available</div>
                      )}
                      <div className={styles.content}>
                        <h2 className={styles.title}>{currentEvent.title}</h2>
                        <p className={styles.description}>
                          {currentEvent.description}
                        </p>
                        <div className={styles.info}>
                          <span><strong>Organizer:</strong> {currentEvent.organizer}</span>
                          <span><strong>Date:</strong> {new Date(currentEvent.date).toLocaleDateString()}</span>
                          <span><strong>📍 Location:</strong> {currentEvent.location}</span>
                        </div>
                        <div className={styles.actions}>
                          <button
                            className={styles.detailsBtn}
                            onClick={() => setSelectedEvent(currentEvent)}
                          >
                            See Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button className={styles.toggleBtn} onClick={handleToggleUpcoming}>
                  {showUpcoming ? 'Hide Upcoming Events' : 'Show Upcoming Events'}
                </button>

                {showUpcoming && nextEvents.length > 0 && (
                  <div className={styles.upcomingEvents} ref={upcomingRef}>
                    <h2 className={styles.subHeading}>Upcoming Events</h2>
                    <div className={styles.scrollContainer}>
                      <div className={styles.eventsList}>
                        {nextEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`${styles.card} ${styles.eventCardAnimation}`}
                          >
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className={styles.image}
                              />
                            ) : (
                              <div className={styles.noImage}>No image available</div>
                            )}
                            <div className={styles.content}>
                              <h2 className={styles.title}>{event.title}</h2>
                              <p className={styles.description}>
                                {event.description}
                              </p>
                              <div className={styles.info}>
                                <span><strong>Organizer:</strong> {event.organizer}</span>
                                <span><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</span>
                                <span><strong>📍 Location:</strong> {event.location}</span>
                              </div>
                              <div className={styles.actions}>
                                <button
                                  className={styles.detailsBtn}
                                  onClick={() => setSelectedEvent(event)}
                                >
                                  See Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
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

export default OfficeEventPage;
