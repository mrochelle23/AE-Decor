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
    setFormData({ ...formData, [name]: value });
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
        <label className="block mb-2 text-lg font-medium">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <label className="block mb-2 text-lg font-medium">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        />
        <label className="block mb-2 text-lg font-medium">Message:</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
        ></textarea>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Send Message</button>
      </form>
    </div>
  );
}

export default ContactForm;