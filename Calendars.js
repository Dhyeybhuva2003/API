const express = require('express'); // Import Express.js framework
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const multer = require('multer'); // Import Multer for handling file uploads
const cors = require('cors'); // Import CORS middleware for enabling cross-origin resource sharing

const app = express(); // Create an Express application
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB database named 'academic_calendar'
mongoose.connect('mongodb://localhost:27017/academic_calendar', {
  useNewUrlParser: true, // Use new URL parser
  useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
});

// Define Mongoose schema for calendar data
const calendarSchema = new mongoose.Schema({
  program: String, // Program name
  filePath: String, // File path for uploaded calendar file
});

// Create a Mongoose model named 'Calendar' based on the schema
const Calendar = mongoose.model('Calendar', calendarSchema);

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save uploaded files to 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);  // Use original file name
  },
});

const upload = multer({ storage }); // Initialize Multer with the configured storage settings

// Route for handling file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { program } = req.body; // Extract program name from request body
    const filePath = req.file.path; // Get file path of uploaded file

    // Create a new calendar document with program name and file path
    const newCalendar = new Calendar({
      program,
      filePath,
    });

    await newCalendar.save(); // Save the new calendar document to the database
    res.status(201).send('File uploaded and saved to database'); // Respond with success message
  } catch (error) {
    console.error('Error uploading file:', error); // Log any errors that occur
    res.status(500).send('Error uploading file'); // Respond with error message
  }
});

// Route for fetching all calendars from the database
app.get('/calendars', async (req, res) => {
  try {
    const calendars = await Calendar.find(); // Retrieve all calendar documents from the database
    res.status(200).json(calendars); // Respond with JSON containing the retrieved calendars
  } catch (error) {
    console.error('Error fetching calendars:', error); // Log any errors that occur
    res.status(500).send('Error fetching calendars'); // Respond with error message
  }
});

// Start the Express server and listen on port 5000
app.listen(5000, () => {
  console.log('Server is running on port 5000'); // Log a message indicating that the server is running
});
