const express = require('express');
const app = express();
const port = 3000;

app.get('/api/data', (req, res) => {
    res.json({ message: 'Data from Old Backend' });
});

app.get('/api/switch', (req, res) => {
    console.log('Switching to Old Backend');
    res.send('Switched to Old Backend');
});

app.listen(port, () => {
    console.log(`Old Backend listening at http://localhost:${port}`);
});
￼Enter
