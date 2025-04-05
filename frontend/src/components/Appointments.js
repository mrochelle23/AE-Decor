import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

function Appointments() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [step, setStep] = useState(1); // Step 1: Select date/time, Step 2: Enter details
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [confirmation, setConfirmation] = useState('');

  const times = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
    '5:00 PM',
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(''); // Reset time when date changes
    setConfirmation(''); // Clear confirmation message
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setConfirmation(''); // Clear confirmation message
    setStep(2); // Move to Step 2
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Limit the message to 500 characters
    if (name === 'message' && value.length > 500) {
      alert('Message cannot exceed 500 characters.');
      return;
    }
  
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleConfirm = async () => {
    if (!userDetails.name || !userDetails.email || !userDetails.phone) {
      alert('Please fill in all required fields.');
      return;
    }

    const formattedDate = selectedDate.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    // Convert selectedTime to 24-hour format
    const [time, modifier] = selectedTime.split(' '); // Split time and AM/PM
    let [hours, minutes] = time.split(':'); // Split hours and minutes
    hours = parseInt(hours); // Convert hours to a number

    if (modifier === 'PM' && hours !== 12) {
      hours += 12; // Convert PM hours to 24-hour format
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0; // Convert 12 AM to 00 (midnight)
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`; // Ensure hours are 2 digits

    try {
      const response = await axios.post('/appointments', {
        date: formattedDate,
        time: formattedTime,
        ...userDetails, // Include user details in the request
      });

      setConfirmation(
        `Your tablescaping consultation is scheduled for ${selectedDate.toDateString()} at ${selectedTime}.`
      );
      console.log('Appointment booked:', response.data);
      setStep(1); // Reset to Step 1 after booking
    } catch (error) {
      console.error('Error booking appointment:', error);
      alert('Failed to book appointment. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Book a Tablescaping Consultation</h2>
      <p className="text-center text-lg mb-4 text-gray-700">
        Each consultation costs <span className="font-bold">$75</span>.
      </p>
      {step === 1 && (
        <div className="flex flex-col items-center">
          {/* Calendar */}
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="mb-8"
          />

          {/* Time Slots */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {times.map((time) => (
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
        </div>
      )}

    {step === 2 && (
    <div className="flex flex-col md:flex-row items-start justify-between w-full">
        {/* Left Column: Client Details */}
        <div className="w-full md:w-1/2 pr-4">
        <h3 className="text-xl font-bold mb-4">Client Details</h3>
        <hr className="border-gray-300 w-full mb-6" />
        <div className="mb-4">
            <input
            type="text"
            name="name"
            value={userDetails.name}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
            placeholder="Name"
            required
            />
        </div>
        <div className="mb-4">
            <input
            type="email"
            name="email"
            value={userDetails.email}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
            placeholder="Email"
            required
            />
        </div>
        <div className="mb-4">
            <input
            type="tel"
            name="phone"
            value={userDetails.phone}
            onChange={handleInputChange}
            className="border rounded px-4 py-2 w-full"
            placeholder="Phone"
            required
            />
        </div>
        <div className="mb-4 relative">
            <textarea
                name="message"
                placeholder='Message (optional)'
                value={userDetails.message}
                onChange={handleInputChange}
                onInput={(e) => {
                e.target.style.height = 'auto'; // Reset height to auto to calculate new height
                e.target.style.height = `${e.target.scrollHeight}px`; // Set height based on scrollHeight
                }}
                className="border rounded px-4 py-2 w-full"
                maxLength="500"
                style={{ overflow: 'hidden', resize: 'none' }} // Prevent manual resizing
            />
            <span
                className="absolute bottom-2 right-4 text-sm text-gray-500"
                style={{ pointerEvents: 'none' }} // Prevent interaction with the counter
            >
                {userDetails.message.length}/500
            </span>
            </div>
        </div>

        {/* Right Column: Booking Details, Payment Details, and Book Now Button */}
        <div className="w-full md:w-1/2 pl-4">
        {/* Booking Details */}
        <div className="w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <hr className="border-gray-300 w-full mb-6" />
            <p className="text-gray-700">
            Tablescaping Consultation
            </p>
            <p className="text-gray-700">
            {selectedDate.toDateString()} at {selectedTime}
            </p>
            <p className="text-gray-700">
            1 hour
            </p>
        </div>

        {/* Payment Details */}
        <div className="w-full max-w-md mt-8">
            <h3 className="text-xl font-bold mb-4">Payment Details</h3>
            <p className="text-gray-700">
            <strong>Total:</strong> $75
            <hr className="border-gray-300 w-full mb-6" />
            </p>
        </div>

        {/* Book Now Button */}
        <button
            onClick={handleConfirm}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-300 mt-2"
        >
            Book Now
        </button>
        </div>
    </div>
    )}
    </div>
  );
}

export default Appointments;