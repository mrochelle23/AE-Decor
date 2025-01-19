import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function AppointmentForm() {
  const [date, setDate] = useState(new Date());

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/appointments', { date });
      alert(response.data.message);
    } catch (error) {
      console.error('There was an error booking the appointment!', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Book an Appointment</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <label className="block mb-2 text-lg font-medium">Select Date:</label>
        <Calendar onChange={setDate} value={date} className="mb-4" />
        <p className="text-gray-700 mb-4">Cost: $75 per hour</p>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Book Appointment</button>
      </form>
    </div>
  );
}

export default AppointmentForm;