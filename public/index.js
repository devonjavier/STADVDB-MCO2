const express = require('express');
const developer = require('./models/DimDevelopers');
const app = express();
const PORT = 3000;

// Server static files (e.g, HTML, CSS, JS)
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/dev', async (req, res) => {
    try {
        const users = await developer.findAll();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching users');
    }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});