const express = require('express');
const { Sequelize } = require('sequelize'); // Sequelize instance for queries
const { GameDetails1, GameDetails2, GameDetails3 } = require('./models/MCO_datawarehouse'); // Import the GameDetails model for each node
const { centralNode, node2, node3 } = require('./db.js');
const app = express();
const PORT = 3000;

// section to initialize connection booleans
let centralnodeconnection, node2connection, node3connection, 
centralnodeInactiveAtStart = false, node2InactiveAtStart = false, node3InactiveAtStart = false;
// MAKING DOUBLE SURE U CANT TURN ON THE NDOES
initializeConnections();

async function initializeConnections(){
    if(GameDetails1){
        centralnodeconnection = true;
    } else {
        centralnodeconnection = false;
        centralnodeInactiveAtStart = true;
    }

    if(GameDetails2){
        node2connection = true;
    } else {
        node2connection = false;
        node2InactiveAtStart = true;
    }

    if(GameDetails3){
        node3connection = true;
    } else {
        node3connection = false;
        node3InactiveAtStart = true;
    }
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
        let game;
        if(node2connection){
            game = await GameDetails2.findOne({
                where: { game_ID }
            });
        }
        
        if (!game) {
            if(node3connection){
                game = await GameDetails3.findOne({
                    where: { game_ID }
                });
            }
        }

        if (!game) {
            if(centralnodeconnection){
                game = await GameDetails1.findOne({
                    where: { game_ID }
                });
            }  
        }

        if (!game) {
            return res.status(404).send('Game details not found');
        }

        res.json(game);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching game details');
    }
});

app.post('/add-game', async (req, res) => {
    const { game_name, release_date, game_description, price, estimated_ownership, esrb_rating } = req.body;

    try {
        // Choose the appropriate model based on the node connections
        if (centralnodeconnection) {
            await GameDetails1.create({
                game_name,
                release_date,
                game_description,
                price,
                estimated_ownership,
                esrb_rating,
            });
        } else {
            return res.status(503).send({ success: false, message: 'No active database connection available.' });
        }
        res.status(200).send({ success: true, message: 'Game added successfully.' });
    } catch (error) {
        console.error('Error adding game:', error);
        res.status(500).send({ success: false, message: 'Failed to add game.' });
    }
});

app.put('/update-game/:game_ID', async (req, res) => {
    const { game_ID } = req.params; // Retrieve game_ID from URL parameters
    const { 
        newGameName, 
        newReleaseDate, 
        newDescription, 
        newPrice, 
        newOwnership, 
        newEsrbRating 
    } = req.body;

    if (!game_ID) {
        return res.status(400).json({ success: false, message: 'Game ID is required' });
    }

    const updatedFields = {};

    if (newGameName) updatedFields.game_name = newGameName;
    if (newReleaseDate) updatedFields.release_date = newReleaseDate;
    if (newDescription) updatedFields.game_description = newDescription;
    if (newPrice !== undefined) updatedFields.price = newPrice;
    if (newOwnership) updatedFields.estimated_ownership = newOwnership;
    if (newEsrbRating) updatedFields.esrb_rating = newEsrbRating;

    if (Object.keys(updatedFields).length === 0) {
        return res.status(400).json({ success: false, message: 'Please provide at least one field to update' });
    }

    if (centralnodeconnection) {
        try {
            const game = await GameDetails1.findOne({ where: { game_ID } });

            if (!game) {
                return res.status(404).json({ success: false, message: 'Game not found' });
            }

            const updatedGame = await game.update(updatedFields);

            return res.status(200).json({
                success: true,
                message: 'Game updated successfully.',
                game: updatedGame
            });
        } catch (error) {
            console.error('Error updating game:', error.message);
            return res.status(500).json({
                success: false,
                message: 'Error updating game.',
                error: error.message
            });
        }
    } else {
        return res.status(503).json({
            success: false,
            message: 'Service unavailable, please try again later.'
        });
    }
});

// Delete game by game_ID
app.post('/delete-game', async (req, res) => {
    const { game_ID } = req.body;

    if (!game_ID) {
        return res.status(400).json({ success: false, message: 'Game ID is required' });
    }

    if(centralnodeconnection){
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
    } else {
        res.status(503).send({ success: false, message: 'Service unavailable, please try again later.', error: error.message });
    }
    
});

// Sum of games in a specific release year
app.post('/get-games-sum', async (req, res) => {
    const { releaseYear } = req.body;
    
   
    if (!releaseYear || !/^\d{4}$/.test(releaseYear)) {
        return res.status(400).json({ success: false, message: 'Valid release year is required' });
    }

    if(Number(releaseYear) < 2019 && node2connection){
        try {
            console.log('node2');
            const sum = await GameDetails2.count({
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
    } else if(Number(releaseYear) >= 2019 && node3connection){
        try {
            console.log('node3');
            const sum = await GameDetails3.count({
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
    } else if(centralnodeconnection) {
        try {
            console.log('node1');
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
    }
    
});

// Average of games in a specific release year
app.post('/get-games-avg', async (req, res) => {
    const { releaseYear } = req.body;

    if (!releaseYear || !/^\d{4}$/.test(releaseYear)) {
        return res.status(400).json({ success: false, message: 'Valid release year is required' });
    }


    if(Number(releaseYear) < 2019 && node2connection){
        try {
            const totalGames = await GameDetails2.count({
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

    } else if(Number(releaseYear) >= 2019 && node3connection){
        try {
            const totalGames = await GameDetails3.count({
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

    } else if (centralnodeconnection) {
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
    }
    
});

app.get('/node-statuses', (req, res) => {
    res.status(200).json({
        centralNode: centralnodeconnection,
        node2: node2connection,
        node3: node3connection
    });
});


app.post('/toggle-central-node', (req, res) => {
    console.log('CENTRAL NODE BEFORE : ', centralnodeconnection);
    centralnodeconnection = !centralnodeconnection;
    console.log('CENTRAL NODE AFTER : ', centralnodeconnection);
    res.status(200).json({
        success: true,
        message: `Central node connection is now ${centralnodeconnection ? 'enabled' : 'disabled'}.`,
        status: centralnodeconnection
    });
});

// Toggle Node 2 connection
app.post('/toggle-node2', (req, res) => {
    console.log('NODE 2 BEFORE : ', node2connection);
    node2connection = !node2connection;
    console.log('NODE 2 AFTER : ', node2connection);
    res.status(200).json({
        success: true,
        message: `Node 2 connection is now ${node2connection ? 'enabled' : 'disabled'}.`,
        status: node2connection
    });

    
});

// Toggle Node 3 connection
app.post('/toggle-node3', (req, res) => {
    console.log('NODE 3 BEFORE : ', node3connection);
    node3connection = !node3connection;
    console.log('NODE 3 AFTER : ', node3connection);
    res.status(200).json({
        success: true,
        message: `Node 3 connection is now ${node3connection ? 'enabled' : 'disabled'}.`,
        status: node3connection
    });

});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
