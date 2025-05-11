import React, { useState } from 'react';
import axios from 'axios';
import "../ContactForm.css"; // Import your CSS file for styling

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [confirmation, setConfirmation] = useState(''); // Confirmation message

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
    setLoading(true); // Start loading
    setConfirmation(''); // Clear previous confirmation message

    try {
      const response = await axios.post('https://ae-decor.onrender.com/contact', formData);
      setConfirmation(response.data.message); // Show success message
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      console.error('There was an error sending the message!', error);
      alert('There was an error sending your message. Please try again later.');
    } finally {
      setLoading(false); // Stop loading
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
          disabled={loading} // Disable button while loading
          className={`px-6 py-3 rounded ${
            loading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner border-t-4 border-white rounded-full w-5 h-5 animate-spin mr-2"></div>
              Sending...
            </div>
          ) : (
            'Send Message'
          )}
        </button>
      </form>

      {confirmation && (
        <div className="mt-4 text-green-600 font-semibold text-center">{confirmation}</div>
      )}
    </div>
  );
}

export default ContactForm;