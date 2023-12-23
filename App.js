// backend/app.js
const express = require('express');
const app = express();
const PORT = 3001;

// Simulating the switch to a new backend
let useNewBackend = false;

app.get('/api/data', (req, res) => {
  const responseData = useNewBackend ? 'New backend data' : 'Old backend data';
  res.json({ message: responseData });
});

// Endpoint to toggle between backends
app.get('/api/switch', (req, res) => {
  useNewBackend = !useNewBackend;
  res.json({ message: `Switched to ${useNewBackend ? 'new' : 'old'} backend` });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
