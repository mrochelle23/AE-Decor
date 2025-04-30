import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import '../CustomCalendar.css';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState('');
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cancel flow states
  const [isCancelFlow, setIsCancelFlow] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [cancelEmail, setCancelEmail] = useState('');

  const times = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM',
  ];

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setConfirmation('');
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setConfirmation('');
    setStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const formattedTime = convertTo24Hour(selectedTime);

    try {
      await axios.post('/appointments', {
        date: formattedDate,
        time: formattedTime,
        ...userDetails,
      });

      setBookedTimes((prev) => [...prev, formattedTime]);

      setConfirmation(
        `Your tablescaping consultation is scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`
      );
      setStep(1);
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    if (!cancelEmail) {
      alert('Please enter your email.');
      return;
    }
  
    try {
      console.log('Fetching appointments for email:', cancelEmail);
      const response = await axios.get('/appointments', {
        params: { email: cancelEmail },
      });
  
      if (response.data && Array.isArray(response.data)) {
        console.log('Appointments fetched:', response.data);
        setAppointments(response.data);
      } else {
        console.error('Unexpected response:', response.data);
        alert('No appointments found for this email.');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to fetch appointments. Please try again.');
    }
  };

  const handleSelectAppointment = (e, appointment) => {
    if (e.target.checked) {
      setSelectedAppointments((prev) => {
        if (!prev.some((a) => a._id === appointment._id)) {
          const updated = [...prev, appointment];
          console.log('Updated selectedAppointments:', updated);
          return updated;
        }
        return prev;
      });
    } else {
      setSelectedAppointments((prev) => {
        const updated = prev.filter((a) => a._id !== appointment._id);
        console.log('Updated selectedAppointments:', updated);
        return updated;
      });
    }
  };

  const [cancelLoading, setCancelLoading] = useState(false);

  const handleCancelSelectedAppointments = async () => {
    if (!selectedAppointments.length) {
      alert('Please select at least one appointment to cancel.');
      return;
    }
  
    setCancelLoading(true); // Start loading
    console.log('Cancel button clicked'); // Debugging
  
    try {
      console.log('Selected appointments:', selectedAppointments); // Debugging
      const response = await axios.delete('/appointments', {
        data: { appointments: selectedAppointments },
      });
  
      console.log('Cancel response:', response.data); // Debugging
  
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
      setCancelLoading(false); // Stop loading
      console.log('Cancel loading state:', cancelLoading); // Debugging
    }
  };

  const getAvailableTimes = () => {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    const availableTimes = times.filter((time) => {
      const time24 = convertTo24Hour(time);

      if (isToday) {
        const [hours, minutes] = time24.split(':').map(Number);
        const timeDate = new Date(selectedDate);
        timeDate.setHours(hours, minutes, 0, 0);
        if (timeDate < now) return false;
      }

      return !bookedTimes.includes(time24);
    });

    return availableTimes;
  };

  return (
    <div className="container mx-auto p-4">
      {!isCancelFlow ? (
        <>
          <h2 className="text-3xl font-bold mb-8 text-center">Book a Tablescaping Consultation</h2>
          <p className="text-center text-lg mb-4 text-gray-700">
            Each consultation costs <span className="font-bold">$75</span>.
          </p>

          {step === 1 && (
            <div className="flex flex-col items-center">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="mb-8"
                tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
              />
              <div className="grid grid-cols-3 gap-4 mb-8">
                {getAvailableTimes().map((time) => (
                  <button
                    key={time}
                    onClick={() => handleTimeSelect(time)}
                    className={`px-4 py-2 rounded ${
                      selectedTime === time
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                {confirmation && <p className="text-green-600 font-semibold mb-4">{confirmation}</p>}
                <button
                  onClick={() => setIsCancelFlow(true)}
                  className="px-6 py-3 rounded bg-red-500 text-white hover:bg-red-600"
                >
                  Cancel Appointments
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col md:flex-row items-start justify-between w-full">
              <div className="w-full md:w-1/2 pr-4">
                <h3 className="text-xl font-bold mb-4">Client Details</h3>
                <input
                  type="text"
                  name="name"
                  value={userDetails.name}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full mb-4"
                  placeholder="Name"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={userDetails.email}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full mb-4"
                  placeholder="Email"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={userDetails.phone}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full mb-4"
                  placeholder="Phone"
                  required
                />
                <textarea
                  name="message"
                  value={userDetails.message}
                  onChange={handleInputChange}
                  className="border rounded px-4 py-2 w-full mb-4"
                  placeholder="Message (optional)"
                  maxLength="500"
                />
              </div>

              <div className="w-full md:w-1/2 pl-4">
                <h3 className="text-xl font-bold mb-4">Booking Details</h3>
                <p className="text-gray-700">Tablescaping Consultation</p>
                <p className="text-gray-700">{selectedDate.toDateString()} at {selectedTime}</p>
                <p className="text-gray-700">1 hour</p>
                <div className="flex space-x-4 mt-4">
                  <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className={`px-6 py-3 rounded ${
                      loading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {loading ? 'Booking...' : 'Book Now'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="container mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center">Cancel Appointments</h2>
          {!appointments.length ? (
            <div className="flex flex-col items-center">
              <input
                type="email"
                value={cancelEmail}
                onChange={(e) => {
                  console.log('Email input changed:', e.target.value);
                  setCancelEmail(e.target.value);
                }}
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
          onClick={() => setIsCancelFlow(false)} // Back button functionality
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
                disabled={loading}
                className={`px-6 py-3 rounded ${
                  loading
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {loading ? 'Cancelling...' : 'Cancel Selected Appointments'}
              </button>
              <button
                onClick={() => setIsCancelFlow(false)}
                className="ml-4 px-6 py-3 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
              >
                Back
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Appointments;