// app.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 666;
const DATA_FILE = path.join(__dirname, 'data', 'challenges.json');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());

// Charger les challenges depuis le fichier
const loadChallenges = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
};
const tagLevels = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'tagsLevels.json'), 'utf8'));

// Sauvegarder les challenges
const saveChallenges = (challenges) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(challenges, null, 2));
};
const levelColors = {
    1: "text-green-700",    // 🟢
    2: "text-blue-700",     // 🔵
    3: "text-orange-600",   // 🔶
    4: "text-red-700",      // 🔴
    5: "text-purple-700",   // 🐘
    6: "text-lime-800",    // 🧱
    7: "text-cyan-700",     // 🌐
    8: "text-rose-700",     // 🛡️
    9: "text-yellow-700",   // 🚀
    10: "text-fuchsia-700"  ,  // 🧠
    11: "text-rose-700"    // 💰
};
const levelTagColors = {
    1: "bg-green-100 text-green-900",
    2: "bg-blue-100 text-blue-900",
    3: "bg-orange-100 text-orange-900",
    4: "bg-red-100 text-red-900",
    5: "bg-purple-100 text-purple-900",
    6: "bg-lime-100 text-lime-900",
    7: "bg-cyan-100 text-cyan-900",
    8: "bg-rose-100 text-rose-900",
    9: "bg-yellow-100 text-yellow-900",
    10: "bg-fuchsia-100 text-fuchsia-900",
    11: "bg-rose-100 text-rose-900"

};
// Titre des niveaux
const levelTitles = {
    1: "🟢 LEVEL 1 – Fundamentals: Language & Tooling",
    2: "🔵 LEVEL 2 – Concurrency + Idioms",
    3: "🔶 LEVEL 3 – Advanced Craftsmanship",
    4: "🔴 LEVEL 4 – Web APIs & Fullstack",
    5: "🐘 LEVEL 5 – PostgreSQL & ORM",
    6: "🧱 LEVEL 6 – Clean Architecture",
    7: "🌐 LEVEL 7 – Distributed Systems",
    8: "🛡️ LEVEL 8 – Security",
    9: "🚀 LEVEL 9 – Deployment & DevOps",
    10: "🧠 LEVEL 10 – Algorithms & CS",
    11: "💰 LEVEL 11 – Cryptocurrency Programming"

};

// Page principale : 20 challenges max
app.get('/', (req, res) => {
    const challenges = loadChallenges();
    const sorted = challenges.sort((a, b) => a.id - b.id);
    res.render('index', {
        challenges: sorted.slice(0, 300),
        levelTitles,
        levelColors,
        levelTagColors,
        tagLevels

    });

});

// Marquer comme terminé
app.post('/toggle/:id', (req, res) => {
    const challenges = loadChallenges();
    const challenge = challenges.find(c => c.id === parseInt(req.params.id));
    if (challenge) {
        challenge.completed = !challenge.completed;
        saveChallenges(challenges);
    }
    res.sendStatus(200);
});

// Publier ou dépublier
app.post('/toggle-published/:id', (req, res) => {
    const challenges = loadChallenges();
    const challenge = challenges.find(c => c.id === parseInt(req.params.id));
    if (challenge) {
        challenge.published = !challenge.published;
        saveChallenges(challenges);
    }
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
