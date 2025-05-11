import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CancelApp from './CancelApp';
import axios from 'axios';

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
  const [isCancelFlow, setIsCancelFlow] = useState(false);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState(''); // New state for success message

  const times = [
    '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM', '5:00 PM',
  ];

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
      const response = await axios.post('http://localhost:5001/api/appointments', {
        date: formattedDate,
        time: formattedTime,
        ...userDetails,
      });

      if (response.status === 200) {
        setBookedTimes((prev) => [...prev, formattedTime]);
        setConfirmation(
          `Your tablescaping consultation is scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`
        );
        setStep(1);
      } else {
        alert('Failed to book the appointment. Please try again.');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointments = async (appointmentsToCancel) => {
    try {
      const response = await axios.delete('http://localhost:5001/api/appointments', {
        data: { appointments: appointmentsToCancel },
      });

      if (response.status === 200) {
        setCancelSuccessMessage('Appointments cancelled successfully'); // Set success message
        setTimeout(() => setCancelSuccessMessage(''), 5000); // Clear message after 5 seconds
        // Optionally, refresh booked times or other data
      }
    } catch (error) {
      console.error('Error cancelling appointments:', error);
      alert('Failed to cancel appointments. Please try again.');
    }
  };

  useEffect(() => {
    const fetchBookedTimes = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
        console.log('Fetching booked times for date:', formattedDate);

        const response = await axios.get('http://localhost:5001/api/appointments', {
          params: { date: formattedDate },
        });

        console.log('Response from backend:', response.data);

        if (response.data && Array.isArray(response.data)) {
          const times = response.data.map((appointment) =>
            appointment.time.slice(0, 5) // Truncate to 'HH:mm'
          );
          console.log('Mapped booked times (HH:mm):', times);
          setBookedTimes(times);
        }
      } catch (error) {
        console.error('Error fetching booked times:', error);
      }
    };

    fetchBookedTimes();
  }, [selectedDate]);

  const getAvailableTimes = () => {
    const now = new Date();
    const isToday = selectedDate.toDateString() === now.toDateString();

    const availableTimes = times.filter((time) => {
      const time24 = convertTo24Hour(time);
      console.log(`Checking time: ${time24}`);

      if (bookedTimes.includes(time24)) {
        console.log(`Time ${time24} is booked and will be excluded.`);
        return false;
      }

      if (isToday) {
        const [hours, minutes] = time24.split(':').map(Number);
        const timeDate = new Date(selectedDate);
        timeDate.setHours(hours, minutes, 0, 0);
        if (timeDate < now) {
          console.log(`Time ${time24} is in the past and will be excluded.`);
          return false;
        }
      }

      console.log(`Time ${time24} is available.`);
      return true;
    });

    console.log('Available times:', availableTimes);
    return availableTimes;
  };

  return (
    <div className="container mx-auto p-4">
      {!isCancelFlow ? (
        <>
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            Book a Tablescaping Consultation
          </h2>
          <p className="text-center text-base sm:text-lg mb-4 text-gray-700">
            Each consultation costs <span className="font-bold">$75</span>.
          </p>

          {cancelSuccessMessage && (
            <div className="text-green-600 font-semibold mb-4 text-center">
              {cancelSuccessMessage}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col items-center">
              <Calendar
                onChange={handleDateChange}
                value={selectedDate}
                className="mb-8"
                tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
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
                {confirmation && (
                  <p className="text-green-600 font-semibold mb-4">{confirmation}</p>
                )}
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
              <div className="w-full md:w-1/2 pr-0 md:pr-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Client Details</h3>
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

              <div className="w-full md:w-1/2 pl-0 md:pl-4">
                <h3 className="text-lg sm:text-xl font-bold mb-4">Booking Details</h3>
                <p className="text-gray-700">Tablescaping Consultation</p>
                <p className="text-gray-700">
                  {selectedDate.toDateString()} at {selectedTime}
                </p>
                <p className="text-gray-700">1 hour</p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
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
        <CancelApp
          onBack={() => setIsCancelFlow(false)}
          onCancel={handleCancelAppointments} // Pass the cancel handler
        />
      )}
    </div>
  );
}

export default Appointments;