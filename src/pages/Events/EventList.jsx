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
  const [editEvent, setEditEvent] = useState(false);

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

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/events/${updatedEvent._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': localStorage.getItem("token"),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedEvent)
      });

      if (!response.ok) {
        toast.error('Failed to update event');
        return;
      }

      toast.success('Event updated successfully');
      fetchEvents(); // Refresh event list
      setEditEvent(null); // Close modal
    } catch (error) {
      toast.error('Failed to update event');
      console.error('Error updating event:', error);
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
                {
                  role == "admin" ? <div className="event-actions">
                    <button className="edit-button" onClick={() => setEditEvent(event)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(event._id)}>Delete</button>
                  </div> : ""
                }

              </div>

            </div>
          ))}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>


        {editEvent && (
          <>
            <div className="modal-overlay" onClick={() => setEditEvent(null)}></div>
            <div className="edit-modal">
              <h3>Edit Event</h3>

              <input
                type="text"
                placeholder="Event Name"
                value={editEvent.eventName}
                onChange={(e) => setEditEvent({ ...editEvent, eventName: e.target.value })}
              />

              <input
                type="date"
                value={new Date(editEvent.eventDate).toISOString().split("T")[0]}
                onChange={(e) => setEditEvent({ ...editEvent, eventDate: e.target.value })}
              />

              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    value="image"
                    checked={editEvent.eventType === 'image'}
                    onChange={(e) => setEditEvent({ ...editEvent, eventType: e.target.value })}
                  />
                  Image
                </label>
                <label>
                  <input
                    type="radio"
                    value="video"
                    checked={editEvent.eventType === 'video'}
                    onChange={(e) => setEditEvent({ ...editEvent, eventType: e.target.value })}
                  />
                  Video
                </label>
              </div>

              <div className="file-upload">
                <label>Event File</label>
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => setEditEvent({ ...editEvent, eventFile: e.target.files[0] })}
                />
              </div>

              <div className="file-upload">
                <label>Attendee List (Excel)</label>
                <input
                  className="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={(e) => setEditEvent({ ...editEvent, attendees: e.target.files[0] })}
                />
              </div>

              <input
                type="url"
                placeholder="Event Web Link"
                value={editEvent.eventWebLink}
                onChange={(e) => setEditEvent({ ...editEvent, eventWebLink: e.target.value })}
              />

              <button onClick={() => handleUpdateEvent(editEvent)}>Save</button>
              <button onClick={() => setEditEvent(null)}>Cancel</button>
            </div>
          </>
        )}


        <ToastContainer />
      </div>
    </>
  );
};

export default EventList;
