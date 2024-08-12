// async function updateTable() {
//     const finalPlayers = await fetchPlayerStats();
//     const tableBody = document.getElementByID('player-data');
//     tableBody.innerHTML = '';

//     finalPlayers.forEach(player => {
//         const row = document.createElement('tr');
//         Object.keys(player).forEach(key => {
//             const cell = document.createElement('td');
//             cell.textContent = player[key];
//             row.appendChild(cell);
//         });
//         tableBody.appendChild(row);
//     });
// }

// updateTable();

// const url = "https://www.nba.com/stats/player/203954";
// const playerId = url.split('/');
// console.log(playerId); // Output: 203954

// async function filterByConditions() {

//     const finalPlayers = [];
//     const playerStats = await fetchPlayerStats();

//     for (let i = 0; i < 2; i++) {
//         const player = playerStats[i];
//         if (player.Country === 'USA') {
//             console.log(player);
//             finalPlayers.push(player);
//         }
//     }
//     return finalPlayers;
// }

// filterByConditions();

// async function fetchPlayerStats() {

//     // Colleting all the NBA stats of every player
//     const allStats = [];

//     // Use the players with the highest PER

//     const playerArray = await scrapeforPlayers();

//     for (const p1 of playerArray) {

//         // Find player using their name
//         const p2 = NBA.findPlayer(p1);

//         if (p2) {

//             // Fetch player's name, country, and boxscore stats using their ID
//             const playerInfo = await NBA.stats.playerInfo({ PlayerID: p2.playerId });
//             let stats = await NBA.stats.playerSplits({ Season: '2023-24', PlayerID: p2.playerId});
            
//             let rawStats = stats.startingPosition;
//             rawStats = rawStats[0];

//             // Extract desired info
//             const name = playerInfo.commonPlayerInfo[0].displayFirstLast;
//             const country = playerInfo.commonPlayerInfo[0].country;

//             const GP= rawStats.gp;
//             const MP = rawStats.min;
//             const PPG = rawStats.pts;
//             const RPG = rawStats.reb;
//             const AST = rawStats.ast;
//             const BPM = rawStats.plusMinus;
            
//             // Store player stats
//             // 'GP' : GP, 'MIN': MP, 'PTS': PPG, 'REB': RPG, 'AST': AST
//             let playerStats = {'Name': name, 'Country': country};
//             console.log(playerStats);
//             allStats.push(playerStats);
//             playerStats = {};

//         }

//     }
//     return allStats;
// }

// fetchPlayerStats();


// async function filterByConditions() {
//     const finalPlayers = [];
//     const playerStats = await fetchPlayerStats();

//     for (let i = 0; i < playerStats.length; i++) {
//         const player = playerStats[i];
//         if (player.Country === 'USA' && player.GP >= 60 && player.MIN >= 30) {
//             finalPlayers.push(player);
//         }
//     }
//     // console.log(finalPlayers.slice(0,12))
//     return finalPlayers.slice(0,12);
// }

// // filterByConditions();

// async function updateTable() {
//     const finalPlayers = await filterByConditions();
//     const tableBody = document.getElementByID('player-data');
//     tableBody.innerHTML = '';

//     finalPlayers.forEach(player => {
//         const row = document.createElement('tr');
//         Object.keys(player).forEach(key => {
//             const cell = document.createElement('td');
//             cell.textContent = player[key];
//             row.appendChild(cell);
//         });
//         tableBody.appendChild(row);
//     });
// }

// updateTable();

// function validYear(event) {
//     event.preventDefault(); // Prevent form submission
//     const yearInput = document.getElementById('year-input').value;
//     const secondRow = document.querySelector('.second-row-hidden');

//     if (yearInput.trim() !== "") {
//         // Optionally, validate the year range if needed
//         const year = parseInt(yearInput, 10);
//         if (year >= 1974 && year <= 2024) {
//             // Hide the second row
//             secondRow.style.display = 'none';
//             // Update the table
//             updateTable();
//             return true;
//         }
//     }
//     alert('Please enter a valid year between 1974 and 2024');
//     return false;
// }

// document.getElementById('year-form').addEventListener('submit', validYear);

// // Call the function to update the table
// document.addEventListener('DOMContentLoaded', (event) => {
//     updateTable();



// async function filterbyGPMIN() {

//     let playerArray = await fetchPlayerStats();

//     for (let i = 0; i < playerArray.length; i++) {

//         let playerID = playerArray[i];
//         const { data } = await axios.get('https://insider.espn.com/nba/player/stats/_/id/' + playerID.ID);
//         const $ = cheerio.load(data);

//         let gamesPlayed = $('table.Table tbody.Table__TBODY');
        
//         console.log(gamesPlayed);

//     }
// }

// filterbyGPMIN();