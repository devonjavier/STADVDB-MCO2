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

let details_ID; // added to store details_ID after selecting a game

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

        details_ID = game.details_ID
        return game.details.toJSON();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Updating game information
app.post('/update-game', async (req, res) => {
    const { game_ID, newGameName, newPrice } = req.body
    if(game_ID !== null){
        try{
            if(details_ID){
                const response = await update_game(details_ID, newGameName, newPrice);
                if(!response){
                    res.status(404).json({ success: false, message: 'Game ID not found or no updates applied.' });
                } else {
                    res.status(200).json({ success: true, message: 'Game updated successfully.' });
                }
            }
        } catch(error) {
            console.error('Error updating game:', error.message);
            res.status(500).send({ success: false, message: 'Error updating game.', error: error.message });
        }
    }
});

async function update_game(details_id, newGameName, newPrice){

    console.log(newGameName, newPrice);

    const { error } = await DimDetails.update(
        {
            game_name : newGameName,
            price : newPrice
        }, 
        {
        where: { details_ID : details_id }
        })

    if(error){
        console.log(error);
        return { success: false, message: 'No rows updated. game_id may not exist.' };
    } else return { success: true, message: 'Game updated successfully.' };
};


app.post('/delete-game', async (req, res) => {
    const { game_ID } = req.body
    if(game_ID !== null){
        try{
            await Fact_Game.destroy({
                where: { details_ID: details_ID },
            });

            // Then delete the row in DimDetails
            await DimDetails.destroy({
                where: { details_ID: details_ID },
            });
        } catch(error) {
            console.error('Error updating game:', error.message);
            res.status(500).send({ success: false, message: 'Error deleting game.', error: error.message });
        }

        res.status(200).json({ success: true, message: 'Game deleted successfully.' });
    }
});


