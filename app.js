// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 666;
const DATA_FILE = path.join(__dirname, 'data', 'challenges.json');

// Set up view engine and middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

// Load challenges from JSON file
const loadChallenges = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
};

// Save challenges to JSON file
const saveChallenges = (challenges) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(challenges, null, 2));
};

// Route to render index.ejs with challenges
app.get('/', (req, res) => {
    const challenges = loadChallenges();
    const levelFilter = parseInt(req.query.level) || 0;
    const filteredChallenges = levelFilter
        ? challenges.filter(c => c.level === levelFilter)
        : challenges;
    res.render('index', { challenges: filteredChallenges, levelFilter });
});

// Route to toggle challenge completion
app.post('/toggle/:id', (req, res) => {
    const challenges = loadChallenges();
    const id = parseInt(req.params.id);
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
        challenge.completed = !challenge.completed;
        saveChallenges(challenges);
    }
    res.sendStatus(200);
});

// Route to toggle challenge published status
app.post('/toggle-published/:id', (req, res) => {
    const challenges = loadChallenges();
    const id = parseInt(req.params.id);
    const challenge = challenges.find(c => c.id === id);
    if (challenge) {
        challenge.published = !challenge.published;
        saveChallenges(challenges);
    }
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
