const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();

// Body parser middleware
app.use(bodyParser.json());

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB URI
const mongoURI = 'mongodb+srv://dhyeybhuva2003:Dhyey%4010@monarck-university-clus.gzjcj0f.mongodb.net/mydatabase?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Circular Model
const Circular = mongoose.model('circular', new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  file: {
    type: String, // Store file path
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  }
}));

// Multer middleware for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Routes
// @route   POST api/circular
// @desc    Create a new circular
// @access  Public
app.post('/api/circular', upload.single('file'), (req, res) => {
  const { title } = req.body;
  const file = req.file.path; // Path to uploaded file

  const newCircular = new Circular({
    title,
    file
  });

  newCircular
    .save()
    .then(circular => res.json(circular))
    .catch(err => console.log(err));
});

// @route   GET api/circular
// @desc    Get all circulars
// @access  Public
app.get('/api/circular', (req, res) => {
  Circular.find()
    .sort({ uploadDate: -1 })
    .then(circulars => res.json(circulars))
    .catch(err => console.log(err));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));