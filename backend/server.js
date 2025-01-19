const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5001; // Change the port number here

app.use(cors());
app.use(bodyParser.json());

app.post('/appointments', (req, res) => {
    // Handle appointment booking logic here
    res.status(200).send({ message: 'Appointment booked successfully!' });
});

app.post('/contact', (req, res) => {
    // Handle contact form submission logic here
    res.status(200).send({ message: 'Message sent successfully!' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});