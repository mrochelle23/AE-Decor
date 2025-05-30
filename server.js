const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('MongoDB URI:', process.env.MONGO_URI);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

const mongoose = require('mongoose');
const Booking = require('./models/Booking');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 })
  .then(async () => {
    console.log('Connected to MongoDB');
    try {
      const appointments = await Booking.find();
      console.log('Appointments stored in MongoDB on startup:', appointments);
    } catch (error) {
      console.error('Error fetching appointments on startup:', error);
    }
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
  console.log('Database Name:', mongoose.connection.name);
});

mongoose.connection.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Utility function to convert 24-hour time to 12-hour format
function formatTo12Hour(time24) {
  const [hour, minute] = time24.split(':');
  const date = new Date();
  date.setHours(hour, minute);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const businessMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Contact Form Submission',
      text: `You have received a new message from your website contact form:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    const userMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank You for Contacting Us',
      text: `Dear ${name},\n\nThank you for reaching out to us. We have received your message and will get back to you shortly.\n\nHere is a copy of your message:\n${message}\n\nBest regards,\nAE Decor`,
    };

    await transporter.sendMail(businessMailOptions);
    await transporter.sendMail(userMailOptions);

    res.status(200).send({ message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending emails:', error);
    res.status(500).send({ message: 'There was an error sending your message. Please try again later.' });
  }
});

// Google Calendar Setup
const credentials = require('./credentials.json');
const { client_id, client_secret, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[1]);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

async function checkAndRefreshToken() {
  const token = oAuth2Client.credentials;
  const expiresIn = token.expiry_date - Date.now();
  if (expiresIn < 0) {
    await refreshAccessToken();
  }
}

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

// Book appointment
app.post('/api/appointments', async (req, res) => {
  const { date, time, name, email, phone, message } = req.body;

  try {
    console.log('Received booking request:', { date, time, name, email, phone, message });

    const newBooking = new Booking({ date, time, name, email, phone, message });
    await newBooking.save();
    console.log('Booking saved to MongoDB:', newBooking);

    const endHour = parseInt(time.split(':')[0]) + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${time.split(':')[1]}`;

    const event = {
      summary: 'Tablescaping Consultation',
      description: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'No message provided.'}`,
      start: { dateTime: `${date}T${time}:00`, timeZone: 'America/New_York' },
      end: { dateTime: `${date}T${endTime}:00`, timeZone: 'America/New_York' },
      attendees: [{ email }, { email: process.env.EMAIL_USER, organizer: true }],
      reminders: { useDefault: true },
    };

    await checkAndRefreshToken();
    const response = await calendar.events.insert({ calendarId: 'primary', resource: event });
    console.log('Event created:', response.data);

    const formattedTime = formatTo12Hour(time);

    const userMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Booking Confirmation - Tablescaping Consultation',
      text: `Dear ${name},\n\nThank you for booking a tablescaping consultation with AE Decor. Here are your booking details:\n\nDate: ${date}\nTime: ${formattedTime}\nDuration: 1 hour\nTotal: $75\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nAE Decor`,
    };

    const businessMailOptions = {
      from: `"AE Decor" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'New Booking - Tablescaping Consultation',
      text: `A new tablescaping consultation has been booked. Here are the details:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message || 'No message provided.'}\n\nDate: ${date}\nTime: ${formattedTime}\nDuration: 1 hour\nTotal: $75`,
    };

    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(businessMailOptions);

    res.status(200).send({ message: 'Appointment booked successfully!', eventLink: response.data.htmlLink });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).send({ message: 'Error booking appointment', error });
  }
});

// Get appointments
app.get('/api/appointments', async (req, res) => {
  const { date } = req.query;
  try {
    const query = {};
    if (date) query.date = date;

    console.log('Query sent to MongoDB:', query);
    const appointments = await Booking.find(query);
    console.log('Fetched appointments from MongoDB:', appointments);

    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).send({ message: 'Failed to fetch appointments', error });
  }
});

// Delete appointments
app.delete('/api/appointments', async (req, res) => {
  const { appointments } = req.body;

  try {
    const ids = appointments.map((appointment) => appointment._id);
    const result = await Booking.deleteMany({ _id: { $in: ids } });
    console.log('Delete result:', result);

    for (const appointment of appointments) {
      const { date, time, email, name } = appointment;
      const formattedTime = formatTo12Hour(time);

      const userMailOptions = {
        from: `"AE Decor" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Appointment Cancellation Confirmation',
        text: `Dear ${name},\n\nYour appointment on ${date} at ${formattedTime} has been successfully canceled.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nAE Decor`,
      };

      const businessMailOptions = {
        from: `"AE Decor" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: 'Appointment Canceled',
        text: `An appointment has been canceled. Here are the details:\n\nName: ${name}\nEmail: ${email}\nDate: ${date}\nTime: ${formattedTime}\n\nPlease update your records accordingly.`,
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

// Serve frontend
const frontendPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
