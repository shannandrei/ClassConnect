import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Modal.css';

const Modal = ({ onClose }) => {
  const [date, setDate] = useState(new Date());
  const [reminder, setReminder] = useState('');
  const [reminders, setReminders] = useState({}); 

  const onChange = (newDate) => {
    setDate(newDate);
    setReminder(reminders[newDate.toDateString()] || '');
  };

  const onReminderChange = (event) => {
    setReminder(event.target.value);
  };

  const addOrUpdateReminder = () => {
    setReminders({ ...reminders, [date.toDateString()]: reminder });
  };

  const deleteReminder = () => {
    const updatedReminders = { ...reminders };
    delete updatedReminders[date.toDateString()];
    setReminders(updatedReminders);
    setReminder('');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <div className="calendar">
            <h2>REMINDERS</h2>
        </div>
        <div className="calendar-container">
          <Calendar
            onChange={onChange}
            value={date}
            className="custom-calendar"
          />
          <div className="reminder-input">
            <input
              type="text"
              placeholder="Enter reminder"
              value={reminder}
              onChange={onReminderChange}
            />
            <button onClick={addOrUpdateReminder}>Add/Update Reminder</button>
            <button onClick={deleteReminder}>Delete Reminder</button>
          </div>
          <div className="reminders">
            <p className="reminder-text">{reminders[date.toDateString()]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
