import express from 'express';
import cors from 'cors';
import { readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 5000;

// Get the __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosFolderPath = path.join(__dirname, 'photos');

// Serve static files with specific CORS headers
app.use('/photos', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static(photosFolderPath));

// Configure CORS to allow requests from http://localhost:5173
app.use(cors());

app.get('/api/photos', async (req, res) => {
  try {
    const files = await readdir(photosFolderPath);
    const photos = files.map(file => `/photos/${file}`);
    res.json(photos);
  } catch (err) {
    res.status(500).json({ error: 'Unable to scan directory' });
  }
});

// Simple test endpoint
app.get('/test-cors', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.json({ message: 'CORS is working!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
