const express = require('express');
const { Sequelize } = require('sequelize'); // Sequelize instance for queries
const { GameDetails1, GameDetails2, GameDetails3 } = require('./models/MCO_datawarehouse'); // Import the GameDetails model
const app = express();
const PORT = 3000;


// section to initialize connection booleans
let centralnodeconnection, node2connection, node3connection;

initializeConnections();

async function initializeConnections(){
    if(GameDetails1){
        centralnodeconnection = true;
    } else centralnodeconnection = false;

    if(GameDetails2){
        node2connection = true;
    } else node2connection = false;

    if(GameDetails3){
        node3connection = true;
    } else node3connection = false;
}



app.use(express.json());

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Basic route
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Get game details by game_ID
app.post('/get-game-details', async (req, res) => {
    const { game_ID } = req.body;

    try {
        const game = await GameDetails1.findOne({
            where: { game_ID }
        });

        if (!game) {
            return res.status(404).send('Game details not found');
        }

        // Respond with game details
        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching game details');
    }
});

// Update game details by game_ID (partial update)
app.post('/update-game', async (req, res) => {
    const { game_ID, newGameName } = req.body;

    if (!game_ID || !newGameName) {
        return res.status(400).json({ success: false, message: 'Game ID and new game name are required' });
    }

    try {
        const game = await GameDetails1.findOne({
            where: { game_ID }
        });

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        // Only update the game name if provided
        const updatedGame = await game.update({
            game_name: newGameName // Only updating the game_name
        });

        res.status(200).json({ success: true, message: 'Game updated successfully.', game: updatedGame });
    } catch (error) {
        console.error('Error updating game:', error.message);
        res.status(500).send({ success: false, message: 'Error updating game.', error: error.message });
    }
});

// Delete game by game_ID
app.post('/delete-game', async (req, res) => {
    const { game_ID } = req.body;

    if (!game_ID) {
        return res.status(400).json({ success: false, message: 'Game ID is required' });
    }

    try {
        const game = await GameDetails1.findOne({
            where: { game_ID }
        });

        if (!game) {
            return res.status(404).json({ success: false, message: 'Game not found' });
        }

        // Delete the game
        await game.destroy();

        res.status(200).json({ success: true, message: 'Game deleted successfully.' });
    } catch (error) {
        console.error('Error deleting game:', error.message);
        res.status(500).send({ success: false, message: 'Error deleting game.', error: error.message });
    }
});

// Sum of games in a specific release year
app.post('/get-games-sum', async (req, res) => {
    const { releaseYear } = req.body;

    if (!releaseYear || !/^\d{4}$/.test(releaseYear)) {
        return res.status(400).json({ success: false, message: 'Valid release year is required' });
    }

    try {
        const sum = await GameDetails1.count({
            where: Sequelize.where(
                Sequelize.fn('YEAR', Sequelize.col('release_date')),
                releaseYear
            )
        });

        res.status(200).json({ success: true, sum });
    } catch (error) {
        console.error('Error fetching sum of games:', error.message);
        res.status(500).send({ success: false, message: 'Error fetching sum of games.', error: error.message });
    }
});

// Average of games in a specific release year
app.post('/get-games-avg', async (req, res) => {
    const { releaseYear } = req.body;

    if (!releaseYear || !/^\d{4}$/.test(releaseYear)) {
        return res.status(400).json({ success: false, message: 'Valid release year is required' });
    }

    try {
        const totalGames = await GameDetails1.count({
            where: Sequelize.where(
                Sequelize.fn('YEAR', Sequelize.col('release_date')),
                releaseYear
            )
        });

        const totalRecords = await GameDetails1.count();

        const average = totalGames / totalRecords;

        res.status(200).json({ success: true, average });
    } catch (error) {
        console.error('Error fetching average of games:', error.message);
        res.status(500).send({ success: false, message: 'Error fetching average of games.', error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
