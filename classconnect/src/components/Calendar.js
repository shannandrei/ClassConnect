import React, { useState, useEffect } from 'react';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';  // Adjust the path to your Calendar.css file
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import { RRule } from 'rrule';
import AimsPasswordModal from './AimsPasswordModal';

const localizer = momentLocalizer(moment);

const CustomEvent = ({ event }) => (
  <div className={`event ${event.type === 'event' ? 'firebase-event' : 'scraped-event'}`}>
    <strong>{event.title}</strong>
    <div>{event.location}</div>
    <div>
      {moment(event.start).format('LT')} - {moment(event.end).format('LT')}
    </div>
  </div>
);

const Calendar = () => {
  const BASE_URL = 'https://class-connect-server.vercel.app';
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [classSchedule, setClassSchedule] = useState([]);
  const [combinedEvents, setCombinedEvents] = useState([]);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [success, setSuccess] = useState(null);
  const [aimsData, setAimsData] = useState(null);
  let fetchedClassSchedule = [];

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (!userDoc.exists) {
          console.error('User not found');
          return;
        }
        const userData = userDoc.data();
        const userCourse = userData.course;
        const userYear = userData.yearlvl;
        console.log("User course:", userCourse);
        console.log("User year level:", userYear);
        if (!userCourse || !userYear) {
          setError1('User course or year level not found. Please update your profile.');
          return;
        }

        const eventsCollectionRef = collection(db, 'events');
        const eventsSnapshot = await getDocs(eventsCollectionRef);
        const eventsData = eventsSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            start: new Date(`${data.date}T${data.startTime}`),
            end: new Date(`${data.date}T${data.endTime}`),
            location: data.location,
            targetYear: data.targetYear,
            targetCourse: data.targetCourse,
            type: 'event'
          };
        });
    
        let filteredEvents = [];
    
        // First loop: Add events targeting all years and all courses
        eventsData.forEach(event => {
          if (event.targetYear === 'All' && event.targetCourse === 'All') {
            filteredEvents.push(event);
          }
        });
    
        // Second loop: Add events targeting specific user year and course
        eventsData.forEach(event => {
          if ((event.targetYear === userYear || event.targetYear === 'All') && 
              (event.targetCourse === userCourse || event.targetCourse === 'All')) {
            // Avoid duplicates
            if (!filteredEvents.some(e => e.id === event.id)) {
              filteredEvents.push(event);
            }
          }
        });
    
        console.log("Filtered events:", filteredEvents);
    
        setEvents(filteredEvents);
        console.log("Events fetched:", filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    const fetchClassSchedule = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/fetch-schedules/${currentUser.uid}`);
        fetchedClassSchedule = response.data;
        if(fetchedClassSchedule.length === 0 || fetchedClassSchedule === '') {
          setError2('No class schedule imported. Please update your profile.');
          return;
        }

        const aimsResponse = await axios.get(`${BASE_URL}/fetch-aims/${currentUser.uid}`);
        const aimsData = aimsResponse.data.aimsData;
        setAimsData(aimsData);

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const lastUpdated = new Date(aimsData.lastUpdated);
        if (lastUpdated < oneWeekAgo) {
          setShowModal(true);
          await axios.post(`${BASE_URL}/update-last-updated`, { uid: currentUser.uid });
        }

        const endDate = moment().add(1, 'month').endOf('month').toDate();

        const recurringEvents = fetchedClassSchedule.flatMap(event => {
          const recurrenceRule = new RRule({
            freq: RRule.WEEKLY,
            dtstart: moment().toDate(),
            until: endDate,
            byweekday: moment().isoWeekday(event.day).isoWeekday(),
          });

          return recurrenceRule.all().map(date => ({
            title: event.title,
            start: moment(date).isoWeekday(moment().isoWeekday(event.day).isoWeekday()).set({hour: moment(event.start).hour(), minute: moment(event.start).minute()}).toDate(),
            end: moment(date).isoWeekday(moment().isoWeekday(event.day).isoWeekday()).set({hour: moment(event.end).hour(), minute: moment(event.end).minute()}).toDate(),
            description: event.description,
            day: event.day
          }));
        });

        setClassSchedule(recurringEvents);
      } catch (error) {
        console.error("Error fetching class schedule:", error);
      }
    };

    fetchEvents();
    fetchClassSchedule();
  }, [currentUser.uid]);

  useEffect(() => {
    setCombinedEvents([...events, ...classSchedule]);
  }, [events, classSchedule]);

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.type === 'event' ? '#3174ad' : '#f0b400',
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      display: 'block',
      border: '2px solid black',  // Initial border style
    };
    return {
      className: 'event',  // Apply the .event class for hover effect and animation
      style: style
    };
  };

  const Legend = () => (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: '20px' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: '#f0b400', marginRight: '5px', borderRadius: '50%' }}></div>
        <span>Class Schedule</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '20px', height: '20px', backgroundColor: '#3174ad', marginRight: '5px', borderRadius: '50%' }}></div>
        <span>Organization Event</span>
      </div>
    </div>
  );

  return (
    <div style={{ height: '90vh', width: '100%' }}>
      {error1 && (
        <div className="ls-error">
          <span>{error1}</span>
        </div>
      )}
      {error2 && (
        <div className="ls-error">
          <span>{error2}</span>
        </div>
      )}
      {success && (
        <div className="ls-success">
          <span>{success}</span>
        </div>
      )}
       <Legend />
      <BigCalendar
        localizer={localizer}
        events={combinedEvents}
        defaultView={'week'}
        startAccessor="start"
        endAccessor="end"
        components={{
          agenda: {
            event: CustomEvent
          }
        }}
        eventPropGetter={eventStyleGetter}
      />
      {showModal && (
        <AimsPasswordModal showModal={showModal} onClose={handleCloseModal} onSuccess={setSuccess} aimsData={aimsData}/>
      )}
    </div>
  );
};

export default Calendar;
