import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Events.css';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1); // Current page
  const [limit, setLimit] = useState(10); // Events per page
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, [page, search]);

  const fetchEvents = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/events?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      const data = await response.json();
      setEvents(data);
      setRole(data?.role);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleSearch = () => {
    setPage(1);
  };

  const handleDelete = async (eventId) => {
    try {
      debugger
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        toast.error('Failed to delete event');
      } else {
        toast.success('Event deleted successfully');
        fetchEvents(); // Refresh event list after deletion
      }


    } catch (error) {
      toast.error('Failed to delete event');
      console.error("Error deleting event:", error);
    }
  };



  return (
    <>
      <Header role={role} />
      <div className="events-container">
        {/* <div className='header-flex'>
          <h4 className="events-title">All Events</h4>
        </div> */}
        <div className="header-flex">
          <h4 className="events-title">All Events</h4>
          <div>
            <input
              type="text"
              placeholder="Search events..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={handleSearch} className="search-button">Search</button>
          </div>
        </div>

        <div className="events-grid">
          {events?.events?.map((event, index) => (
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
                  <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
                </div>
              </div>

            </div>
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default EventList;
