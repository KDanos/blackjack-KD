//Constants
const table = {
    cards: [],
    players: [],
};

const player = {
    playerName: '',
    hands: 0,
    cash: 100,
    isDealer: false
}

const hand = {
    cards: [],
    bet: 0
}

const decksOnTable = 4;
const deck = [];
const card = {};
const hands = [];
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const faces = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const players = [];

//Create a deck of cards
suits.forEach((suit) => {
    faces.forEach((face) => {
        //create a new card
        const newCard = {
            suit: suit,
            face: face,
        }
        deck.push(newCard);
    })
})

//assign the attributes classes to the cards
deck.forEach((card) => {
    if (card.face === 'A') { card.value = 11 }
    else if (card.face === 'K' || card.face === 'Q' || card.face === 'J') { card.value = 10 }
    else { card.value = parseInt(card.face) };
})

//Functions
//Create a new player
const addPlayer = (playerName, cash = 0, hands = [], isDealer = false, isInGame = false) => {
    const newPlayer = {
        playerName: playerName,
        cash: cash,
        hands: hands,
        isDealer: isDealer,
        isInGame: isDealer,
    }
    players.push(newPlayer)
}

//Deal a card
const dealACard = () => {
    //chose a random number to the size of the deck
    myIndex = Math.floor(Math.random() * table.cards.length);
    myCard = table.cards.splice(myIndex, 1);
    return myCard
}

//Create a new hand
const createHand = (bet) => {
    const newHand = {
        cards: [],
        bet:bet
    }
    return newHand;
}

//Does the player need to bet?
const playerCanBet = ((player) => {
    if (!player.isInGame) {
        console.log(`player ${player.playerName} has the options to bet`)
        player.isInGame = true;
        player.hands.push(
            newHand = {
                cards: [],
                bet: 10
            })
    }
})

//Identify options available to each player
const checkPlayerOptions = (player) => {
    if (player.hands.length === 0) {
        playerCanBet(player);
        // startNewHand;
        console.log(`player ${player.playerName} has no hands and will create one. Their hands array contains: `, player.hands)
        player.hands.push(createHand())
        console.log(`player ${player.playerName} has created a hand which looks like:`, player.hands)
    } else {
        // playAllHands
        console.log(`player ${player.selectedName} has ${player.hands.length} hands and will play them`)
    }
}


//----------------------------------------------------------------------------------------------------------------

//Play the game

//Assemble the cards
for (let i = 1; i <= decksOnTable; i += 1) {
    for (let j = 0; j < deck.length; j += 1) {
        newCard = deck[j]
        table.cards.push(newCard);
    }
}

//Add the dealer to the table
addPlayer('Dealer', 0, [], true);

//Add 2 players to the table
addPlayer('Ninja', 100)
addPlayer('Samurai', 100)

//Place the dealer at the end of the players array
players.push(players.splice(0, 1)[0]);
console.log('The players array currently contains: ', players);// = table.players;

// //Define the options available to each player
// players.forEach(player => {
//     console.log(player.hands);
//     checkPlayerOptions(player);
// });
