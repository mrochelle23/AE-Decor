import React, { useState } from 'react';
import axios from 'axios';

function CancelApp({ onBack }) {
  const [cancelEmail, setCancelEmail] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchAppointments = async () => {
    if (!cancelEmail || !cancelEmail.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.get('/appointments', {
        params: { email: cancelEmail },
      });

      if (response.data && Array.isArray(response.data)) {
        setAppointments(response.data);
      } else {
        alert('No appointments found for this email.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to fetch appointments. Please try again.');
    }
  };

  const handleSelectAppointment = (e, appointment) => {
    if (e.target.checked) {
      setSelectedAppointments((prev) => [...prev, appointment]);
    } else {
      setSelectedAppointments((prev) =>
        prev.filter((a) => a._id !== appointment._id)
      );
    }
  };

  const handleCancelSelectedAppointments = async () => {
    if (!selectedAppointments.length) {
      alert('Please select at least one appointment to cancel.');
      return;
    }

    setCancelLoading(true);

    try {
      const response = await axios.delete('/appointments', {
        data: { appointments: selectedAppointments },
      });

      if (response.status === 200) {
        alert('Selected appointments successfully canceled.');
        setAppointments((prev) =>
          prev.filter((a) => !selectedAppointments.some((sa) => sa._id === a._id))
        );
        setSelectedAppointments([]);
      }
    } catch (error) {
      console.error('Error canceling appointments:', error);
      alert('Failed to cancel appointments. Please try again.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        Cancel Appointments
      </h2>
      {!appointments.length ? (
        <div className="flex flex-col items-center">
          <input
            type="email"
            name="cancelEmail"
            value={cancelEmail}
            onChange={(e) => setCancelEmail(e.target.value)}
            className="border rounded px-4 py-2 w-full mb-4"
            placeholder="Enter your email"
            required
          />
          <button
            onClick={fetchAppointments}
            className="px-6 py-3 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Fetch Appointments
          </button>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-3 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      ) : (
        <div>
          <h3 className="text-lg font-bold mb-4">Select Appointments to Cancel</h3>
          <ul className="mb-4">
            {appointments.map((appointment) => (
              <li key={appointment._id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={appointment._id}
                  onChange={(e) => handleSelectAppointment(e, appointment)}
                  className="mr-2"
                />
                <span>
                  {new Date(appointment.date).toDateString()} at {appointment.time}
                </span>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCancelSelectedAppointments}
            disabled={cancelLoading}
            className={`px-6 py-3 rounded ${
              cancelLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            {cancelLoading ? 'Canceling...' : 'Cancel Selected Appointments'}
          </button>
          <button
            onClick={onBack}
            className="ml-4 px-6 py-3 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default CancelApp;