import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';
import Header from './Header';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const[role,setRole]=useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/events', {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });
        const data = await response.json();
        setEvents(data);
        debugger
        setRole(data[0]?.role)
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);


  return (
    <>
      <Header role={role}/>
      <div className="events-container">
        <div className='header-flex'>
          <h4 className="events-title">All Events</h4>
        </div>

        <div className="events-grid">
          {events?.map((event, index) => (
            <div key={index + 1} className="event-card">
              <a
                href={event.eventWebLink}
                target="_blank"
                rel="noopener noreferrer"
                className="web-link-button"
              >
                <div className="event-image-container">
                  {event.eventType === 'video' && (
                    <div className="play-button">
                      <div className="play-icon"></div>
                    </div>
                  )}
                  <img src={`http://localhost:5000/uploads/${event.eventFile}`} alt={event.eventName} className="event-image" />

                </div>
              </a>
              <div className="event-details">
                <div className="event-header">
                  <span className="event-label">Event Name :</span>
                  <span className="event-name">{event.eventName}</span>
                </div>
                <div className="event-info">
                  <div className="event-date">Created Date - {event.eventDate}</div>
                  <div className="event-attendees">
                    <span className="attendees-label">Attendees</span>
                    {/* <span className="attendees-list">{event.attendees}</span> */}
                  </div>
                </div>
                <div className="event-actions">
                  <button className="edit-button">Edit</button>
                  <button className="delete-button">Delete</button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EventList;
