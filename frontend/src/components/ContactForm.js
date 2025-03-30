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
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
          placeholder='Name'
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
          placeholder='Email'
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="border p-2 mb-4 w-full rounded"
          required
          placeholder='Message'
          maxLength={500}
          oninput={updateCharacterCountAndResize}
        ></textarea>
        <small id="charCount" class="char-counter">0 / 500</small>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">Send Message</button>
      </form>
    </div>
  );
}

// Function to update character count and resize the textarea
function updateCharacterCountAndResize() {
  var messageBox = document.getElementById("message");
  var charCount = document.getElementById("charCount");

  // Show the character counter when the user starts typing
  if (messageBox.value.length > 0) {
      charCount.style.display = "block";
  } else {
      charCount.style.display = "none";
  }

  // Update the character count
  charCount.textContent = messageBox.value.length + " / 500";

  // Resize the textarea based on the content
  messageBox.style.height = 'auto'; // Reset the height to auto
  messageBox.style.height = (messageBox.scrollHeight) + 'px'; // Set height based on content
}

export default ContactForm;