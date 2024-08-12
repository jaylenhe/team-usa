// Import axios and cheerio for webscraping NBA page, NBA API, and Express to render HTML 

const axios = require('axios');
const cheerio = require('cheerio');
const NBA = require('nba');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));


// Initialize the players and year to render in HTML
app.get('/', (req, res) => {
    res.render('index', { players: [], year: null});
});

// Render the stats table when the year is submitted and fetch the data
app.post('/submit-form', async(req, res) => {
    const year = req.body.olympicyear;
    try {
        console.log("Fetching Player Stats...");
        const players = await fetchPlayerStats(year);
        console.log("Fetched Successfully!");
        res.render('index', { players, year });
    } catch (error) {
        console.error('Error fetching player stats:', error);
        res.status(500).send('Server Error!');
    }
});

// Load the website that will display the web page
app.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});


// Make sure the players are American and birthplace match the US States
const usStates = {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
};


// Scrape the Players with the highest PER per year
async function scrapeforPlayers(year) {

    // Fetch the HTML content of the page
    if (year === 2024) {
        const { data } = await axios.get("https://insider.espn.com/nba/hollinger/statistics");
    }
    
    const { data } = await axios.get(`https://insider.espn.com/nba/hollinger/statistics/_/year/${year}`); 
    // Load website into cheerio
    const $ = cheerio.load(data);
    
    // Store all players in an array
    const allPlayers = [];

    // Iterate through the tables and extract their names and ID
    $('table').each((i, elem) => {
        $(elem).find('tr').each((j, row) => {

            let name = $(row).find('td[align="left"]').text().trim();
            name = name.replace(/^\d+/, '').split(',')[0].trim();

            const anchorTag = $(row).find('a[href*="playerId"]');
            const href = anchorTag.attr('href');
            
            if (href) {
                // Extract the player ID after the '=' sign
                const playerId = href.split('=').pop();
                
                // Store the player ID in the array
                let playerStats = {'Player': name, 'ID': playerId};
                allPlayers.push(playerStats);
            }
        });
    });
    // console.log(allPlayers);
    return allPlayers;
}

// Filter the players by only Americans
async function filterByCountry(year) {

    // Collecting all NBA stats of every player
    const allStats = [];

    // Use the players with the highest PER
    let playerArray = await scrapeforPlayers(year);

    // Iterate through each player and identify their country
    for (let i = 0; i < playerArray.length; i++) {

        let playerID = playerArray[i];

        const { data } = await axios.get('https://insider.espn.com/nba/player/bio/_/id/' + playerID.ID);
        const $ = cheerio.load(data);

        let country = $('span.dib.flex-uniform.mr3.clr-gray-01').text().trim();
        country = country.split(',').pop().trim();
        playerID.Country = country;

    }

    // Filter the players and turn each player back into an array of strings
    playerArray = playerArray.filter(item => item.Country.length === 2 && Object.values(usStates).includes(item.Country));
    const playerNames = playerArray.map(player => player.Player);
    // console.log(playerNames);
    return playerNames;
}

// To Render the NBA API efficiently by allowing time
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

// Fetch each NBA players Box Score Numbers
async function fetchPlayerStats(year) {

    const playerArray = await filterByCountry(year);
    let allStats = [];


    for (const p1 of playerArray) {

        // Use NBA API to find player numbers and splits by the season
        let player = NBA.findPlayer(p1);

        if (player) {

            await sleep(300);

            let stats = await NBA.stats.playerSplits({ Season: `${year-1}-${year.slice(2,4)}`, PlayerID: player.playerId});

            stats = stats.startingPosition[0];

            // Extract games played and minutes, points, rebounds, and assists per game
            const GP= stats.gp;
            const MP = stats.min;
            const PPG = stats.pts;
            const RPG = stats.reb;
            const AST = stats.ast;

            let playerStats = {'Player': p1, 'GP' : GP, 'MIN': MP, 'PTS': PPG, 'REB': RPG, 'AST': AST};

            allStats.push(playerStats);
           
    }
}
    // Filter by GP (60) and MIN (30) conditions 
    let filteredStats = allStats.filter(player => player.MIN > 30 && player.GP > 60).slice(0,12);    

    // console.log(filteredStats);
    // console.log(filteredStats.length);
    return filteredStats;

}

