import React from 'react';
import moment from 'moment';
import Calendar from './Calendar';
import Navbar from './Navbar';
import { useAuth} from "../context/AuthContext";

const events = [
    {
        title: 'Math 101',
        start: moment('2024-05-18T10:00:00').toDate(),
        end: moment('2024-05-18T11:00:00').toDate(),
    },
    {
        title: 'Example 101',
        start: moment('2024-05-25T10:00:00').toDate(),
        end: moment('2024-05-27T11:00:00').toDate(),
    },
];

export default function MyCalendar() {
    return (
        <div className="bc-container">
            <Navbar />
            <div className="calendar-wrapper">
                <Calendar 
                    
                />
            </div>
        </div>
    );
}
