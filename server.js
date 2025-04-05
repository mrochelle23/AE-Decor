const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load environment variables from .env file

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load your credentials JSON file
const credentials = require('./credentials.json');
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);

// Set your refresh token (store it in .env for security)
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN, // Retrieve refresh token from .env
});

// Log the refresh token to verify it's set correctly (for debugging, remove in production)
console.log('Refresh Token:', process.env.REFRESH_TOKEN);

// Initialize the Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Middleware to check if the token is expired
async function checkAndRefreshToken() {
  const token = oAuth2Client.credentials;
  const expiresIn = token.expiry_date - Date.now();

  if (expiresIn < 0) {
    // Token is expired, refresh it
    await refreshAccessToken();
  }
}

// Refresh the access token using the refresh token
async function refreshAccessToken() {
  try {
    const res = await oAuth2Client.refreshAccessToken();
    const { access_token, expiry_date } = res.credentials;
    oAuth2Client.setCredentials({
      access_token,
      refresh_token: process.env.REFRESH_TOKEN,
      expiry_date,
    });
    console.log('Access token refreshed!');
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
}

app.post('/appointments', async (req, res) => {
  const { date, time, name, email, phone, message } = req.body;

  // Create the event object for Google Calendar
  const event = {
    summary: 'Tablescaping Consultation',
    description: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message} || 'No message provided.'}`,
    start: {
      dateTime: `${date}T${time}:00`,
      timeZone: 'America/New_York',
    },
    end: {
      dateTime: `${date}T${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}:00`,
      timeZone: 'America/New_York',
    },
    attendees: [
      { email: email }, // Client's email
      { email: process.env.EMAIL_USER, organizer: true }, // AE Decor's email as organizer
    ],
    reminders: {
      useDefault: true,
    },
  };

  try {
    // Ensure the access token is valid before creating the event
    await checkAndRefreshToken();

    // Create the event in Google Calendar
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    console.log('Event created:', response.data);

    // Email Configuration using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use Gmail or your preferred email service
      auth: {
        user: process.env.EMAIL_USER, // Your email address from .env
        pass: process.env.EMAIL_PASS, // Your email password or app password from .env
      },
    });

    // Email to the User
    const userMailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: email, // Send to the user's email
      subject: 'Booking Confirmation - Tablescaping Consultation',
      text: `Dear ${name},

Thank you for booking a tablescaping consultation with AE Decor. Here are your booking details:

Event Name: Tablescaping Consultation
Date: ${date}
Time: ${time}
Duration: 1 hour
Total: $75

If you have any questions, feel free to contact us.

Best regards,
AE Decor`,
    };

    // Email to AE Decor
    const aeDecorMailOptions = {
      from: process.env.EMAIL_USER, // Your email address
      to: process.env.EMAIL_USER, // Replace with AE Decor's email
      subject: 'New Booking - Tablescaping Consultation',
      text: `A new tablescaping consultation has been booked. Here are the details:

Client Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Message: ${message || 'No message provided.'}

Booking Details:
Event Name: Tablescaping Consultation
Date: ${date}
Time: ${time}
Duration: 1 hour

Payment Details:
Total: $75`,
    };

    // Send Emails
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(aeDecorMailOptions);

    res.status(200).send({
      message: 'Appointment booked successfully! Confirmation emails have been sent.',
      eventLink: response.data.htmlLink,
    });
  } catch (error) {
    console.error('Error creating event or sending emails:', error);
    res.status(500).send({ message: 'Error booking appointment', error });
  }
});

// Serve the React app's static files
const frontendPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendPath));

// Catch-all route to serve the React app for any unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));