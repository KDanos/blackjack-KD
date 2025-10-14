// 1. Define your initial player structure (good for reference/re-use)
// NOTE: I recommend making this a function to easily create new players.
function createPlayer(name = '', initialCash = 100) {
    return {
        playerName: name,
        hands: [], // Use an array for 'hands' if the player can have multiple hands (e.g., splitting in Blackjack)
        cash: initialCash,
        // You might want to add other states like:
        // isDealer: false
    };
}

// 2. Constants
const table = {
    cards: [],
    players: [], // This array is initially empty
};

// 3. Create the Dealer object
const dealer = createPlayer("Dealer", 0);
// Set dealer-specific properties
// NOTE: I changed 'hand' to 'hands' to be an array for card management.
// If 'hand' meant the number of hands, you'd use 'hands: 1'
dealer.hands = [
    { cards: [], totalValue: 0, bet: 0 } // Example structure for one hand
];
dealer.cash = 0; // Already set by the function, but good to be explicit

// 4. ADD the new player object to the players array
table.players.push(dealer);


// Verification
console.log(`Players in the table: ${table.players.length}`); // Output: 1
console.log("First player name:", table.players[0].playerName); // Output: Dealer
console.log("First player cash:", table.players[0].cash);       // Output: 0