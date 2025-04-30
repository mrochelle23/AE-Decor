const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load environment variables from .env file
console.log('MongoDB URI:', process.env.MONGO_URI);

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email provider
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoose = require('mongoose');
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); // Load environment variables

const MONGO_URI = process.env.MONGO_URI; // Your MongoDB connection string

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
  console.log('Database Name:', mongoose.connection.name);
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1); // Exit the process if the database connection fails
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Nodemailer transporter setup
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email provider
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Email to the business
    const businessMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Business email address
      subject: 'New Contact Form Submission',
      text: `You have received a new message from your website contact form:

Name: ${name}
Email: ${email}
Message: ${message}`,
    };

    // Confirmation email to the user
    const userMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: email, // User's email address
      subject: 'Thank You for Contacting Us',
      text: `Dear ${name},

Thank you for reaching out to us. We have received your message and will get back to you shortly.

Here is a copy of your message:
${message}

Best regards,
AE Decor`,
    };

    // Send emails
    await transporter.sendMail(businessMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).send({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send({ message: 'There was an error sending your message. Please try again later.' });
  }
});

// Load your credentials JSON file
const credentials = require('./credentials.json');
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);

// Set your refresh token (store it in .env for security)
oAuth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

// Initialize the Google Calendar API client
const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

// Middleware to check if the token is expired
async function checkAndRefreshToken() {
  const token = oAuth2Client.credentials;
  const expiresIn = token.expiry_date - Date.now();

  if (expiresIn < 0) {
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

const Booking = require('./models/Booking');

// Endpoint to book an appointment
app.post('/appointments', async (req, res) => {
  const { date, time, name, email, phone, message } = req.body;

  try {
    console.log('Received booking request:', { date, time, name, email, phone, message });

    // Save the booking to MongoDB
    const newBooking = new Booking({ date, time, name, email, phone, message });
    await newBooking.save();
    console.log('Booking saved to MongoDB:', newBooking);

    // Create the Google Calendar event
    const event = {
      summary: 'Tablescaping Consultation',
      description: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'No message provided.'}`,
      start: { dateTime: `${date}T${time}:00`, timeZone: 'America/New_York' },
      end: { dateTime: `${date}T${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}:00`, timeZone: 'America/New_York' },
      attendees: [{ email }, { email: process.env.EMAIL_USER, organizer: true }],
      reminders: { useDefault: true },
    };

    await checkAndRefreshToken();
    const response = await calendar.events.insert({ calendarId: 'primary', resource: event });
    console.log('Event created:', response.data);

    // Send confirmation emails
    const userMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Booking Confirmation - Tablescaping Consultation',
      text: `Dear ${name},\n\nThank you for booking a tablescaping consultation with AE Decor. Here are your booking details:\n\nDate: ${date}\nTime: ${time}\nDuration: 1 hour\nTotal: $75\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nAE Decor`,
    };

    const businessMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Booking - Tablescaping Consultation',
      text: `A new tablescaping consultation has been booked. Here are the details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'No message provided.'}\n\nDate: ${date}\nTime: ${time}\nDuration: 1 hour\nTotal: $75`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(businessMailOptions);

    res.status(200).send({ message: 'Appointment booked successfully!', eventLink: response.data.htmlLink });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send({ message: 'Error booking appointment', error });
  }
});

// Endpoint to fetch appointments by email
app.get('/appointments', async (req, res) => {
  const { email } = req.query;

  try {
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    const appointments = await Booking.find({ email });
    if (!appointments.length) {
      return res.status(404).send({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ message: 'Failed to fetch appointments', error });
  }
});

// Endpoint to delete an appointment
// Endpoint to delete an appointment
app.delete('/appointments', async (req, res) => {
  const { appointments } = req.body;

  try {
    console.log('Received delete request for appointments:', appointments); // Debugging

    if (!appointments || !appointments.length) {
      return res.status(400).send({ message: 'No appointments provided' });
    }

    const ids = appointments.map((appointment) => appointment._id);
    console.log('Deleting appointments with IDs:', ids); // Debugging

    const result = await Booking.deleteMany({ _id: { $in: ids } });
    console.log('Delete result:', result); // Debugging

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: 'No appointments found to delete' });
    }

    // Send confirmation emails
    for (const appointment of appointments) {
      const { date, time, email, name } = appointment;

      // Email to the user
      const userMailOptions = {
        from: `"AE Decor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Appointment Cancellation Confirmation',
        text: `Dear ${name},\n\nYour appointment on ${date} at ${time} has been successfully canceled.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nAE Decor`,
      };

      // Email to the business
      const businessMailOptions = {
        from: `"AE Decor" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'Appointment Canceled',
        text: `An appointment has been canceled. Here are the details:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${time}\n\nPlease update your records accordingly.`,
      };

      try {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(businessMailOptions);
        console.log(`Cancellation emails sent for appointment ID: ${appointment._id}`);
      } catch (emailError) {
        console.error(`Error sending cancellation emails for appointment ID: ${appointment._id}`, emailError);
      }
    }

    res.status(200).send({ message: 'Appointments successfully deleted and emails sent' });
  } catch (error) {
    console.error('Error deleting appointments:', error);
    res.status(500).send({ message: 'Failed to delete appointments', error });
  }
});

// Endpoint to fetch booked times for a specific date
app.get('/appointments', async (req, res) => {
  const { email } = req.query;

  console.log('Received email:', email); // Debugging

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    const appointments = await Booking.find({ email });
    if (!appointments.length) {
      return res.status(404).send({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ message: 'Failed to fetch appointments', error });
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