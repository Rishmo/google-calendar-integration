const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// 👉 CORS Setup
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

const TOKEN_PATH = path.join(__dirname, 'tokens.json');

// 👉 OAuth2 Client Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// 👉 Load Tokens (if available)
if (fs.existsSync(TOKEN_PATH)) {
  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH));
  oauth2Client.setCredentials(tokens);
  console.log('✅ Tokens loaded from file');
} else {
  console.log('🚫 No tokens found, authentication required.');
}

// 👉 Step 1: Generate OAuth URL
app.get('/auth', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });
  res.redirect(url);
});

// 👉 Step 2: Handle OAuth Callback and Save Tokens
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Save tokens to file
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
    console.log('✅ Tokens acquired and saved:', tokens);

    res.send('Authentication successful! You can close this window.');
  } catch (error) {
    console.error('❌ Error during authentication:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 👉 Step 3: List Events
app.get('/events', async (req, res) => {
  try {
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items.map(event => ({
      id: event.id,
      title: event.summary || 'No Title',
      dateTime: event.start?.dateTime || event.start?.date || 'No Date',
      ...(event.location && { location: event.location }) // Only include if location exists
    }));

    res.json(events);
  } catch (error) {
    console.error('❌ Error fetching events:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 👉 Step 4: Add Event
app.post('/events', async (req, res) => {
  const { title, dateTime, location } = req.body;

  try {
    if (!title || !dateTime) {
      throw new Error('Title and dateTime are required.');
    }

    const formattedDateTime = new Date(dateTime).toISOString();

    const event = {
      summary: title,
      start: {
        dateTime: formattedDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: new Date(new Date(formattedDateTime).getTime() + 3600000).toISOString(),
        timeZone: 'Asia/Kolkata',
      },
      ...(location && { location }) // Only add location if provided
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    res.status(201).json(response.data);
  } catch (error) {
    console.error('❌ Error creating event:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 👉 Step 5: Delete Event
app.delete('/events/:id', async (req, res) => {
  const eventId = req.params.id;

  console.log('🗑️ Deleting event:', eventId);

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId,
    });

    console.log('✅ Event deleted:', eventId);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Error deleting event:', error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
});

// 👉 Step 6: Refresh Tokens (Optional)
app.get('/refresh-token', async (req, res) => {
  try {
    const { credentials } = await oauth2Client.refreshAccessToken();
    oauth2Client.setCredentials(credentials);

    fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials));
    console.log('✅ Tokens refreshed:', credentials);

    res.json({ message: 'Token refreshed successfully', tokens: credentials });
  } catch (error) {
    console.error('❌ Error refreshing token:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 👉 Start the Server
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
