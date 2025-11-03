const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Database connection ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codex';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// --- API Routes ---
const auth = require('./routes/auth');
const problems = require('./routes/problems');
const judge = require('./routes/judge');

app.use('/api/auth', auth);
app.use('/api/problems', problems);
app.use('/api/judge', judge);

// --- Serve frontend build files (important for Render) ---
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

// --- Fallback: serve index.html for any non-API route ---
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --- Start server ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('Codex backend listening on', PORT));
