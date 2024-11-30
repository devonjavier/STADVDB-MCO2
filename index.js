const express = require('express');
const {
    Fact_Game,
    DimDevelopers,
    DimPublishers,
    DimPlaytimeDetails,
    DimDetails,
    DimSupport,
    DimLanguages,
    DimReviews,
    DimMediaUrl,
    DimAttributes,
} = require('./models/MCO_datawarehouse');

const app = express();
const PORT = 3000;

app.use(express.json());

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

app.post('/get-game-details', async (req, res) => {
    const { game_ID, estimated_ownership } = req.body;

    try {
        const gameDetails = await getGameDetails(game_ID, estimated_ownership);

        if (!gameDetails) {
            return res.status(404).send('Game details not found');
        }

        res.json(gameDetails);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching game details');
    }
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});

async function getGameDetails(game_ID, estimated_ownership) {
    try {
        const game = await Fact_Game.findOne({
            where: { game_ID },
            include: [{
                model: DimDetails,
                as: 'details',
                where: { estimated_ownership }
            }]
        });

        if (!game) {
            return null;
        }

        return game.details.toJSON();
    } catch (err) {
        console.error(err);
        throw err;
    }
}