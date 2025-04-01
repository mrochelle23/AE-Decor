import React, { useState } from 'react';
import axios from 'axios';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    // Limit the message to 500 characters
    if (name === 'message' && value.length > 500) {
      return;
    }

    setFormData({ ...formData, [name]: value });

    // Adjust the height of the textarea dynamically
    if (name === 'message') {
      event.target.style.height = 'auto'; // Reset height to auto to calculate new height
      event.target.style.height = `${event.target.scrollHeight}px`; // Set height based on scrollHeight
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/contact', formData);
      alert(response.data.message);
    } catch (error) {
      console.error('There was an error sending the message!', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Contact Us</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
          placeholder="Your Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
          placeholder="Your Email"
        />
       <div className="relative">
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="border p-4 mb-4 w-full rounded resize-none pr-20 pb-10"
          required
          placeholder="Your Message"
          rows="4" // Initial height
        />
        <div className="absolute bottom-6 right-3 text-sm text-gray-500 pointer-events-none">
          {formData.message.length}/500
        </div>
      </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export default ContactForm;