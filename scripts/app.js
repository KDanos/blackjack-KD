
//Constants
const table = {
    cards: [],
    players: [],
};

// const card = {};
// const hands = [];
const players = table.players;
const faceDownImage = new Image();
faceDownImage.src = 'images/red_joker.png'
faceDownImage.classList.add('Card-Image')
//Cached element
const playersSeats = document.querySelector('#Player-Seats');
const dealerSeat = document.querySelector('#Dealer-Container')

//Initialise the table--------------------------------------------------------------------------------------------------
const createADeck = () => {
    const deck = [];
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const faces = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    suits.forEach((suit) => {
        faces.forEach((face) => {
            //create a new card
            const newCard = {
                suit: suit,
                face: face,
                isFaceUp: true
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
        else { card.value = parseInt(card.face) }
    })
}

const generateCardPicture = (deck) => {
    let myText = '';
    deck.forEach((card) => {
        if (card.face === 'A') { myText = 'ace' }
        else if (card.face === 'K') { myText = 'king' }
        else if (card.face === 'Q') { myText = 'queen' }
        else if (card.face === 'J') { myText = 'jack' }
        else { myText = card.face.toString() }

        const imgName = myText + '_of_' + card.suit + '.png'
        const newCardImage = new Image()
        newCardImage.src = 'images/' + imgName
        newCardImage.classList.add('Card-Image')
        card.cardImage = newCardImage;
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
    const deck = createADeck();
    generateCardPicture(deck);
    asignCardAttributes(deck);
    mixDecks(noOfDecks, deck);
}

//Functions-----------------------------------------------------------------------------------------------------------------
const addPlayer = (playerName, cash = 0, hands = [], isDealer = false, isInGame = false) => {
    const newPlayer = {
        playerName: playerName,
        cash: cash,
        hands: hands,
        isDealer: isDealer,
        isInGame: isDealer,
        isAllowedHand: true,
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

const makeOptionsButton = ((player, myText) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    // parentElement = document.getElementById(`${player.playerName}-Options-List`)
    newBtn.textContent = myText;
    // parentElement.appendChild(newBtn)
    return newBtn
})

const makeBetButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Bet');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    // const newBtn = document.createElement('button');
    // newBtn.classList.add('Options-Button');
    // newBtn.textContent = 'Bet';
    // parentElement = document.getElementById(`${player.playerName}-Options-List`)
    // parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerBets)
})

const makeSkipButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Skip');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    // const newBtn = document.createElement('button');
    // newBtn.classList.add('Options-Button');
    // newBtn.textContent = 'Skip';
    // parentElement = document.getElementById(`${player.playerName}-Options-List`)
    // parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerSkips)
})

const makeHitButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Hit');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    // newBtn.classList.add('Options-Button');
    // newBtn.textContent = 'Hit';
    // parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerHits)
})

const makeStayButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Stay');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerStays)

    // newBtn.textContent = 'Stay';
    // parentElement = document.getElementById(`${player.playerName}-Options-List`)
    // parentElement.appendChild(newBtn)
    // newBtn.addEventListener('click', handlePlayerStays)
})

const makeDrawCardButton = ((player) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    newBtn.textContent = 'Draw';
    parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handleDrawCard)
})

const countHandValue = (hand) => {
    let totalPoints = 0;
    hand.cards.forEach((card) => {
        totalPoints += card.value
    })
    hand.score = totalPoints
}

const dealACard = (hand, player) => {
    console.log ('we are inside the dealACard method');
    console.log(`the hand is `, hand);
    console.log('the player is', player);
    const myIndex = Math.floor(Math.random() * table.cards.length);
    const myCardArray = table.cards.splice(myIndex, 1);
    const myCard = myCardArray[0];
    hand.cards.push(myCard)
    countHandValue(hand);
    if (player.playerName === 'Dealer' && hand.cards.length === 2) {
        myCard.isFaceUp = false;
        myCard.value = 0;
    }
    updateHandDiv(hand, player)
    return myCard
}

const createHandDiv = (player, bet) => {
    console.log('I have entered the createHandDiv function')
    //cache an element to track the new hand div
    const newHandElmt = document.createElement('div');
    //add the new had to the players hands array
    newHandElmt.classList.add('Hand');
    //create an id for the hand div
    const handIndex = player.hands.length - 1
    newHandElmt.id = (`${player.playerName}-hand-${handIndex}-container`);
    //create a container to place the buttons
    buttonContainer = document.createElement('div');
    buttonContainer.classList.add('Hand-Buttons-Container');
    buttonContainer.id = (`${player.playerName}-hand-${handIndex}-Hand-Buttons-Container`);
    newHandElmt.appendChild(buttonContainer);
    //create a container to place the cards
    cardsContainer = document.createElement('div');
    cardsContainer.classList.add('Cards-Container');
    cardsContainer.id = (`${player.playerName}-hand-${handIndex}-Cards-Container`);
    newHandElmt.appendChild(cardsContainer);
    //create a container to Hand-Options buttons
    handOptionsContainer = document.createElement('div');
    handOptionsContainer.classList.add('Hand-Options-Container');
    handOptionsContainer.id = (`${player.playerName}-hand-${handIndex}-Hand-Options-Container`);
    newHandElmt.appendChild(handOptionsContainer);
    //create a button to track the bet on the hand
    const betBtn = document.createElement('button')
    betBtn.classList.add('Cash-Button');
    betBtn.id = (`${player.playerName}-hand-${handIndex}-bet-button`);
    betBtn.textContent = `$${bet}`;
    buttonContainer.appendChild(betBtn);
    //create a paragraph to show the points of the hand
    const pointsBtn = document.createElement('button')
    pointsBtn.classList.add('Points-Button');
    pointsBtn.id = (`${player.playerName}-hand-${handIndex}-points-button`);
    buttonContainer.appendChild(pointsBtn);
    //place the hand div inside the hands-container of the player
    parentElement = document.getElementById(`${player.playerName}-hands`);
    parentElement.appendChild(newHandElmt);
}

const createHand = (player, bet) => {
    const newHand = {
        cards: [],
        bet: bet,
        score: 0
    }
    player.isInGame = true;
    player.hands.push(newHand);
    createHandDiv(player, bet);
    const card1 = dealACard(newHand, player);
    const card2 = dealACard(newHand, player);
    return [newHand, player]
}

// const playerCanBet = ((player) => {
//     if (!player.isInGame) {
//         console.log(`player ${player.playerName} has the options to bet`)
//         player.isInGame = true;
//         player.hands.push(
//             newHand = {
//                 cards: [],
//                 bet: 10
//             })
//     }
// })

// const checkPlayerOptions = (player) => {
//     console.log('I am inside the checkPlayerOptions method')
//     console.log(`I am looking at ${player.playerName}'s options`,player ) 
//     if (player.isAllowedHand) {
//         makeBetButton(player)
//         makeSkipButton(player)
//     }
//     else {return}
// }

const identifyPlayer = (event) => {
    const containerId = event.target.parentElement.parentElement.id;
    const myPlayerName = containerId.split('-')[0];
    return players.find((player) => {
        return player.playerName === myPlayerName
    });
}

const identifyHand = ((event) => {
    const handId = event.target.parentElement.parentElement.id;
    console.log(`inside the identifyHand method, the handId is`, handId)
    const myHandIndex = handId.split('-')[2];
    console.log(`myhandIndex is ${myHandIndex}`);
    const myPlayer = identifyPlayer(event);
    const myHand = myPlayer.hands[myHandIndex];
    console.log (`myHand is `, myHand);
    return myHand;    
})


const updateCashButton = (player) => {
    console.log('I have entered the updateCashButton function')
    const cashDisplay = document.getElementById(`${player.playerName}-cash`);
    cashDisplay.textContent = `$${player.cash}`
}

const updateHandDiv = (hand, player) => {
    console.log('I have entered the updateHandDiv method')
    handIndex = player.hands.indexOf(hand);
    const divElmt = document.getElementById(`${player.playerName}-hand-${handIndex}-Cards-Container`)
    let newImage
    hand.cards.forEach((card) => {
        if (player.playerName != 'Dealer') {
            newImage = card.cardImage;
        }
        else if (!card.isFaceUp) {
            newImage = faceDownImage;
        }
        else {
            newImage = card.cardImage;
        }
        divElmt.appendChild(newImage);
    })
    pointsBtn = document.getElementById(`${player.playerName}-hand-${handIndex}-points-button`);
    pointsBtn.textContent = hand.score;
}

const startTheGame = () => {
    players.forEach((player) => {
        if (player.playerName != 'Dealer') {
            makeBetButton(player);
            makeSkipButton(player);
        } else {
            makeDrawCardButton(player);
        }
    })
}

const checkHandOptions = () => {
    players.forEach((player) => {
        console.log(`you are checking the options of player ${player.playerName}`)
        player.hands.forEach((hand) => {
            const handIndex = player.hands.indexOf(hand);
            if (hand.score > 21) {
                console.log(`player ${player.playerName} is bust`)
            }
            else if (hand.score === 21 && hand.cards.length === 2) {
                console.log(`player ${player.playerName} has blackJack`)
            }
            else {
                makeHitButton(player, handIndex);
                makeStayButton(player, handIndex);
            }
        })
    })
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
    // console.log(parent)
    // parent.replaceChildren(); 
    return bet
})

const handleDrawCard = ((event) => {
    const myPlayer = identifyPlayer(event);
    createHand(myPlayer, 0);
    betButton = document.getElementById(`${myPlayer.playerName}-hand-${handIndex}-bet-button`);
    betButton.style.display = 'none';
    checkHandOptions();
})

const handlePlayerSkips = ((event) => {
    const myPlayer = identifyPlayer(event);
    myPlayer.isAllowedHand = false;
    const parent = event.target.parentElement;
    parent.innerHTML = '';
    skipButton = document.createElement('button');
    skipButton.classList.add('Options-Button');
    skipButton.textContent = 'Not playing';
    parent.appendChild(skipButton);
})

const handlePlayerHits = ((event) => {
    console.log('you are inside the handlePlayerHits method')
    const myPlayer = identifyPlayer(event);
    const myHand = identifyHand(event);
    console.log('the hand is', myHand);
    dealACard(myHand, myPlayer);
    console.log(event.target.parentElement);
    // dealACard(player)
})

const handlePlayerStays = ((event) => {
    const myPlayer = identifyPlayer(event);
    console.log(event.target.parentElement)
    // dealACard(player)
})

const handleClearOptionsList = ((event) => {
    console.log('I have entered the handleClearOptionsList method')
    const myPlayer = identifyPlayer(event);
    if (event.key === 'Enter') {
        event.target.parentElement.innerHTML = '';
        myPlayer.options = [];
    }
})

const handleNewHandActions = (event, bet) => {
    const myPlayer = identifyPlayer(event);
    if (event.key === 'Enter') {
        handleClearOptionsList(event);
        updateCashButton(myPlayer, myPlayer.cash);
        createHand(myPlayer, bet);
    }
}

const handleHit = ((event) => {

})
//----------------------------------------------------------------------------------------------------------------

//Play the game--------------------------------------------------------------------------------------------------

init(4)

addPlayer('Ninja', 100)
addPlayer('Samurai', 100)
addPlayer('Dealer', 0, [], true);

//Place the dealer and players on the table on the table
players.forEach((player) => {
    sitAPlayer(player);
})

startTheGame()

