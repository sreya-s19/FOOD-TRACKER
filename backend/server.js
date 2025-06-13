import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware to allow requests from our frontend and to parse JSON
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large image payloads

// Your Clarifai credentials
const PAT = '02ce7dc9cd674ccbbd82594fb8aa1ea7';
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'food-item-recognition';
const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044';

// Create a new endpoint for our frontend to call
app.post('/analyze', async (req, res) => {
  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ error: 'Image data is required.' });
  }

  const url = `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`;
  const requestData = {
    inputs: [
      {
        data: {
          image: {
            base64: image
          }
        }
      }
    ]
  };
  const requestOptions = {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Key ${PAT}`
    }
  };

  try {
    console.log('Forwarding request to Clarifai...');
    const response = await axios.post(url, requestData, requestOptions);
    console.log('Received response from Clarifai.');
    res.json(response.data);
  } catch (error) {
    console.error('Error calling Clarifai API:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to analyze image with Clarifai.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
});