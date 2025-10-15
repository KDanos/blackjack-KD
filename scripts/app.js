
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

const card = {};
const hands = [];
const players = [];

//Cached element
const playersSeats = document.querySelector('#Player-Seats');
const dealerSeat = document.querySelector('#Dealer-Container')

//Initialise the table--------------------------------------------------------------------------------------------------
const createADeck = () => {
    const deck = [];
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const faces = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
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
    return deck
}

const asignCardAttributes = (deck) => {
    deck.forEach((card) => {
        if (card.face === 'A') { card.value = 11 }
        else if (card.face === 'K' || card.face === 'Q' || card.face === 'J') { card.value = 10 }
        else { card.value = parseInt(card.face) };
    })
}

const mixDecks = (noOfDecks, deck) => {
    for (let i = 1; i <= noOfDecks; i += 1) {
        for (let j = 0; j < deck.length; j += 1) {
            newCard = deck[j]
            table.cards.push(newCard);
        }
    }
}

const init = (noOfDecks) => {
    const deck = createADeck(noOfDecks);
    asignCardAttributes(deck);
    mixDecks(4, deck);
}

//Functions-----------------------------------------------------------------------------------------------------------------
const addPlayer = (playerName, cash = 0, hands = [], isDealer = false, isInGame = false) => {
    const newPlayer = {
        playerName: playerName,
        cash: cash,
        hands: hands,
        isDealer: isDealer,
        isInGame: isDealer,
        allowedHand: true,
        options: []
    }
    players.push(newPlayer)
}

const sitAPlayer = (player) => {
    const newPlayerElmt = document.createElement('div');
    newPlayerElmt.classList.add('Player-Container');
    newPlayerElmt.id = (`${player.playerName}-container`);
    if (player.playerName === 'Dealer') {
        dealerSeat.appendChild(newPlayerElmt);
    } else {
        playersSeats.appendChild(newPlayerElmt);
    }
    //create the player name div
    const newHeading = document.createElement('div')
    newHeading.classList.add('Player-Name');
    newHeading.id = (`${player.playerName}-display`);
    newHeading.textContent = player.playerName;
    newPlayerElmt.appendChild(newHeading);
    //create the players cash button
    const cashBtn = document.createElement('button')
    cashBtn.classList.add('Cash-Button');
    cashBtn.id = (`${player.playerName}-cash`);
    cashBtn.textContent = `$${player.cash}`;
    newPlayerElmt.appendChild(cashBtn);
    //create the players hands container
    const handsContainer = document.createElement('div')
    handsContainer.classList.add('Hands-Container');
    handsContainer.id = (`${player.playerName}-hands`);
    newPlayerElmt.appendChild(handsContainer);
    //create the players options container container
    const optionsContainer = document.createElement('div')
    optionsContainer.classList.add('Options-Container');
    optionsContainer.id = (`${player.playerName}-Options-List`);
    newPlayerElmt.appendChild(optionsContainer);
}

const makeBetButton = ((player) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    newBtn.textContent = 'Bet';
    // optionsContainer.id=(`${player.playerName}-Options-List`);
    parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerBets)
})

const makeSkipButton = ((player) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    newBtn.textContent = 'Skip';
    // optionsContainer.id=(`${player.playerName}-Options-List`);
    parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    // newBtn.addEventListener('click',handlePlayerSkips)
})

const dealACard = () => {
    //chose a random number to the size of the deck
    const myIndex = Math.floor(Math.random() * table.cards.length);
    const myCard = table.cards.splice(myIndex, 1);
    return myCard
}

const createHandDiv = (player, bet) => {
    console.log(`Inside the createHandDiv function, the player looks like`, player);
    //cache an element to track the new hand div
    const newHandElmt = document.createElement('div');
    //add the new had to the players hands array
    newHandElmt.classList.add('Hand');
    //create an id for the hand div
    const handIndex = player.hands.length - 1
    console.log('current hand index is ', handIndex);
    newHandElmt.id = (`${player.playerName}-hand-${handIndex}-container`);
    //createeate a button to track the bet on the hand
    const betBtn = document.createElement('button')
    betBtn.classList.add('Cash-Button');
    betBtn.id = (`${player.playerName}-hand-${handIndex}-bet-button`);
    betBtn.textContent = `$${bet}`;
    newHandElmt.appendChild(betBtn);
    //place the hand div inside the hands-container of the player
    parentElement = document.getElementById(`${player.playerName}-hands`);
    parentElement.appendChild(newHandElmt);
    console.log('the parent element is ', parentElement);
}

const createHand = (player, bet) => {
    const newHand = {
        cards: [],
        bet: bet
    }
    player.hands.push(newHand);
    createHandDiv(player, bet);
}

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

const checkPlayerOptions = (player) => {
    if (!player.isInGame) {
        player.options.push('bet')
        console.log(`player ${player.playerName} is not in the game and is give the option to bet`);
    }
    if (player.hands.length === 0) {
        playerCanBet(player);
        // startNewHand;
        // console.log(`player ${player.playerName} has no hands and will create one. Their hands array contains: `, player.hands)
        player.hands.push(createHand())
        // console.log(`player ${player.playerName} has created a hand which looks like:`, player.hands)
    } else {
        // playAllHands
        // console.log(`player ${player.selectedName} has ${player.hands.length} hands and will play them`)
    }
}

const identifyPlayer = (event) => {
    const containerId = event.target.parentElement.parentElement.id;
    const myPlayerName = containerId.split('-')[0];
    return players.find((player) => {
        return player.playerName === myPlayerName
    });
}

const updateCashButton = (player) => {
    const cashDisplay = document.getElementById(`${player.playerName}-cash`);
    cashDisplay.textContent = `$${player.cash}`
}

//Event handlers--------------------------------------------------------------------------------------------------
const handlePlayerBets = ((event) => {
    const myPlayer = identifyPlayer(event);
    const parent = event.target.parentElement
    parent.innerHTML = ''
    const newInput = document.createElement('input');
    newInput.classList.add('Bet-Input-Box')
    newInput.defaultValue = 10;
    myPlayer.options = [];
    const dollarSign = parent.appendChild(document.createElement('p'));
    dollarSign.textContent = '$';
    parent.appendChild(newInput);
    bet = newInput.value
    parent.addEventListener('keydown', (event) => handleNewHandActions(event, bet))
    myPlayer.cash -= newInput.value
    return bet
})

const handleClearOptionsList = ((event) => {
    const myPlayer = identifyPlayer(event);
    if (event.key === 'Enter') {
        event.target.parentElement.innerHTML = '';
        myPlayer.options = [];
        // updateCashButton(myPlayer, myPlayer.cash)
    }
})

const handleNewHandActions = (event, bet) => {
    console.log('inside the handleNewActions function, the bet is:', bet)

    const myPlayer = identifyPlayer(event);
    if (event.key === 'Enter') {
        handleClearOptionsList(event);
        updateCashButton(myPlayer, myPlayer.cash);
        createHand(myPlayer, bet);
    }
}
//----------------------------------------------------------------------------------------------------------------

//Play the game--------------------------------------------------------------------------------------------------

init()


addPlayer('Ninja', 100)
addPlayer('Samurai', 100)
addPlayer('Dealer', 0, [], true);



//Place the dealer and players on the table on the table
players.forEach((player) => {
    sitAPlayer(player);
})


// //Define the options available to each player
// players.forEach(player => {
//     console.log(player.hands);
//     checkPlayerOptions(player);
// });

makeBetButton(players[1]);
makeSkipButton(players[1]);
// createHand(players[1], 10);
