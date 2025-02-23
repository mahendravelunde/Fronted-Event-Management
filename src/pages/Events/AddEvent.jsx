import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddEvent.css';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEvent = () => {
  const [eventData, setEventData] = useState({
    name: '',
    date: '',
    type: 'image',
    file: null,
    attendees: null,
    webLink: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('eventName', eventData.name);
    formData.append('eventDate', eventData.date);
    formData.append('eventType', eventData.type);
    if (eventData.file) formData.append('eventFile', eventData.file);
    if (eventData.attendees) formData.append('attendeeList', eventData.attendees);
    if (eventData.webLink) formData.append('eventWebLink', eventData.webLink);

    try {
      const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';
      const response = await fetch(`${baseUrl}/events`, {
        method: 'POST',
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        body: formData, // Send as FormData
      });

      const data = await response.json();
      debugger
      if (!response.ok) {
        toast.error(data.error || 'Failed to create event');
        // throw new Error(data.error || 'Failed to create event');
      } else {
        toast.success('Event created successfully!');
        setEventData({
          name: '',
          date: '',
          type: 'image',
          file: null,
          attendees: null,
          webLink: '',
        });
      }


    } catch (error) {

      toast.error(`Error: ${error}`);

    }
  };

  return (
    <>
      <Header />

      <div className="event-form-container">
        <form className="event-form" onSubmit={handleSubmit}>
          <h2>Add an Event</h2>
          <input
            type="text"
            placeholder="Event Name"
            value={eventData.name}
            onChange={(e) => setEventData({ ...eventData, name: e.target.value })}
            required
          />
          <input
            type="date"
            value={eventData.date}
            onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
            required
          />
          <div className="radio-group">
            <label>
              <input
                type="radio"
                value="image"
                checked={eventData.type === 'image'}
                onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                required
              />
              Image
            </label>
            <label>
              <input
                type="radio"
                value="video"
                checked={eventData.type === 'video'}
                onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                required
              />
              Video
            </label>
          </div>
          <div className="file-upload">
            <label>Event File</label>
            <input
              type="file"
              className="file-input"
              onChange={(e) => setEventData({ ...eventData, file: e.target.files[0] })}
              required
            />
          </div>
          <div className="file-upload">
            <label>Attendee List (Excel)</label>
            <input
              className="file-input"
              type="file"
              accept=".xlsx,.xls"
              onChange={(e) => setEventData({ ...eventData, attendees: e.target.files[0] })}
              required
            />
          </div>
          <input
            type="url"
            placeholder="Event Web Link"
            value={eventData.webLink}
            onChange={(e) => setEventData({ ...eventData, webLink: e.target.value })}
            required
          />
          <button type="submit" className="submit-button">Submit</button>
        </form>

        <div className="link-container">
          <a href="/events" className="view-events-link">
            See All Events
          </a>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default AddEvent;
