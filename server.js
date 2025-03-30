const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load your credentials JSON file
const credentials = require('./credentials.json');
const { client_id, client_secret, redirect_uris } = credentials.web; // Use 'web' instead of 'installed'

const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Set your refresh token (you'll need to generate this manually)
oAuth2Client.setCredentials({
  refresh_token: '1//04Vzao1tpVdiTCgYIARAAGAQSNwF-L9IrXaBBOipqFwlEe1G-diM_-jCxBmFxxDDR2_gZH5gWth-yKwnUECMXQpvcLuOpacZIvhM',
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

app.post('/appointments', async (req, res) => {
  const { date, time } = req.body;

  const event = {
    summary: 'Appointment',
    description: 'Booked through the appointment form.',
    start: {
      dateTime: `${date}T${time}:00`,
      timeZone: 'America/New_York', // Adjust to your timezone
    },
    end: {
      dateTime: `${date}T${parseInt(time.split(':')[0]) + 1}:${time.split(':')[1]}:00`,
      timeZone: 'America/New_York',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    res.status(200).send({ message: 'Appointment booked successfully!', event: response.data });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).send({ message: 'Error booking appointment', error });
  }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));