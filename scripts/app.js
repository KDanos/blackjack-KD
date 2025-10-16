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

//Cached element---------------------------------------------------------------------------------------------------------
const playersSeats = document.querySelector('#Player-Seats');
const dealerSeat = document.querySelector('#Dealer-Container')
const startButton = document.querySelector(`#Start-Button`)
const sitButton = document.querySelector(`#Sit-Button`)

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

const setTheCards = (noOfDecks) => {
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
        isAllowedHand: true
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

//Create Button Functions--------------------------------------------------------------------------------------------------
const makeOptionsButton = ((player, myText) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    newBtn.textContent = myText;
    return newBtn
})

const makeBetButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Bet');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`);
    parentElement.appendChild(newBtn);
    newBtn.addEventListener('click', handlePlayerBets);
    player.status = 'active';
})

const makeSkipButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Skip');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`);
    parentElement.appendChild(newBtn);
    newBtn.addEventListener('click', handlePlayerSkips);
})

const makeGoButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Go!!');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`);
    parentElement.appendChild(newBtn);
    newBtn.addEventListener('click', handleNewHandActions);
})

const makeDoneButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Done');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    parentElement.appendChild(newBtn)
    // player.status = 'stopped'
})

const makeBustButton = ((player, handIndex) => {
    clearHandButtons(player, handIndex);
    const newBtn = makeOptionsButton(player, 'Bust');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    parentElement.appendChild(newBtn)
})

const makeStayButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Stay');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`);
    parentElement.appendChild(newBtn);
    newBtn.addEventListener('click', handlePlayerStays);
    player.hands[handIndex].status = 'stopped';
})

const makeHitButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Hit');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerHits)
})

const makeBlackJackButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'BlackJack!!!');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    newBtn.style.color = 'red';
    parentElement.appendChild(newBtn);
})

const makeWinButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'VICTORY!!!');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`);
    newBtn.classList.replace('Options-Button', 'Result-Button')
    parentElement.innerHTML = '';
    parentElement.appendChild(newBtn);
})

const makeLoseButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Bummer 😭');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`);
    newBtn.classList.replace('Options-Button', 'Result-Button')
    parentElement.innerHTML = '';
    parentElement.appendChild(newBtn);
})

const makePushButton = ((player, handIndex) => {
    const newBtn = makeOptionsButton(player, 'Push');
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`);
    newBtn.classList.replace('Options-Button', 'Result-Button')
    parentElement.innerHTML = '';
    parentElement.appendChild(newBtn);
 })

const makeDealerShowButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Show');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handleDealerShows)
    player.status = 'active'
})

const makeDealerStaysButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Dealer Stay');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    player.status = 'stopped'
    endGame()
})

const makeDealerHitsButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Dealer Hit');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handlePlayerHits)
})

const makeDealerBustButton = ((player) => {
    const newBtn = makeOptionsButton(player, 'Bust');
    const parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    endGame()
})

const makeDrawCardButton = ((player) => {
    const newBtn = document.createElement('button');
    newBtn.classList.add('Options-Button');
    newBtn.textContent = 'Draw';
    parentElement = document.getElementById(`${player.playerName}-Options-List`)
    parentElement.appendChild(newBtn)
    newBtn.addEventListener('click', handleDrawCard)
})

//Playing function----------------------------------------------------------------------------------------------
const clearHandButtons = ((player, handIndex) => {
    const parentElement = document.getElementById(`${player.playerName}-hand-${handIndex}-Hand-Options-Container`)
    parentElement.innerHTML = ''
})

const countHandValue = (hand) => {
    let totalPoints = 0;
    hand.cards.forEach((card) => {
        if (card.isFaceUp) {
            totalPoints += card.value
        }
    })
    if (totalPoints > 21 && hand.cards.some((card) => (card.face === 'A'))) {
        totalPoints -= 10;
    }
    hand.score = totalPoints
}

const dealACard = (hand, player) => {
    const myIndex = Math.floor(Math.random() * table.cards.length);
    const myCardArray = table.cards.splice(myIndex, 1);
    const myCard = myCardArray[0];
    hand.cards.push(myCard)
    if (player.playerName === 'Dealer' && hand.cards.length === 2) {
        myCard.isFaceUp = false;
    }
    countHandValue(hand);
    updateHandDiv(hand, player)
    return myCard
}

const createHandDiv = (player, bet) => {
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
        score: 0,
        status: 'active'
    }
    player.isInGame = true;
    player.hands.push(newHand);
    createHandDiv(player, bet);
    const card1 = dealACard(newHand, player);
    const card2 = dealACard(newHand, player);
    return [newHand, player]
}

const identifyPlayer = (event) => {
    const containerId = event.target.parentElement.parentElement.id;
    const myPlayerName = containerId.split('-')[0];
    return players.find((player) => {
        return player.playerName === myPlayerName
    });
}

const identifyHand = ((event) => {
    const myPlayer = identifyPlayer(event);
    const handId = event.target.parentElement.parentElement.id;
    const myHandIndex = handId.split('-')[2];
    let myHand = myPlayer.hands[myHandIndex];

    if (myPlayer.playerName === "Dealer") {
        myHand = myPlayer.hands[0];
    }
    return myHand;
})


const updateCashButton = (player) => {
    const cashDisplay = document.getElementById(`${player.playerName}-cash`);
    cashDisplay.textContent = `$${player.cash}`
}

const updateHandDiv = (hand, player) => {
    const handIndex = player.hands.indexOf(hand);
    const divElmt = document.getElementById(`${player.playerName}-hand-${handIndex}-Cards-Container`)
    divElmt.innerHTML = '';
    let newImage;
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

const checkHandOptions = () => {
    players.forEach((player) => {
        if (player.playerName != 'Dealer' && player.isInGame) {
            player.hands.forEach((hand) => {
                const handIndex = player.hands.indexOf(hand);
                clearHandButtons(player, handIndex);
                if (hand.score > 21) {
                    makeBustButton(player, handIndex);
                    hand.status = 'bust';
                }
                else if (hand.score === 21 && hand.cards.length === 2) {
                    makeBlackJackButton(player, handIndex)
                    hand.status = 'blackjack';
                }
                else {
                    makeHitButton(player, handIndex);
                    makeStayButton(player, handIndex);
                }
            })
        }
        else if (player.playerName === 'Dealer') {
            checkDealerOptions()
        }
        else { console.log('not a dealer and not a player. How did we get here???') }
    }
    )
}

const checkDealerOptions = () => {
    const parentElement = document.getElementById("Dealer-Options-List")
    const theDealer = players[players.length - 1];
    parentElement.innerHTML = ''
    dealerHand = theDealer.hands[0];
    if (dealerHand.status === 'bust' || dealerHand.status === 'finished') {
        console.log('dealer will now end the game')
        endGame();
    }
    else if (!dealerHand.cards[1].isFaceUp) {
        makeDealerShowButton(theDealer);
    }
    else if (dealerHand.score <= 16) {
        makeDealerHitsButton(theDealer, 0);
    }
    else if (dealerHand.score >= 22) {
        dealerHand.status = 'bust';
        makeDealerBustButton(theDealer, 0);

    }
    else if (dealerHand.score === 21 && dealerHand.cards.length === 2) {
        dealerHand.status = 'blackjack';
        makeDealerStaysButton(theDealer, 0);
    }
    else {
        dealerHand.status = 'stopped';
        makeDealerStaysButton(theDealer, 0);
    }
}

const sitThePlayers = (players) => {
    players.forEach((player) => {
        console.log('you are sitting player', player)
        console.log('the table is', table)
        sitAPlayer(player);
    })
}

const playerWins = (player, hand) => {
    const handValue = Number(hand.bet);
    const handIndex = player.hands.indexOf(hand);
    player.cash += (2 * handValue);
    const theDealer = players[players.length - 1];
    theDealer.cash -= handValue;
    updateCashButton(player);
    updateCashButton(theDealer);
    makeWinButton(player, handIndex);
}

const playerWinsBlackJack = (player, hand) => {
    const handValue = Number(hand.bet);
    const handIndex = player.hands.indexOf(hand);
    player.cash += (3 * handValue);
    const theDealer = players[players.length - 1];
    theDealer.cash -= (1.5 * handValue);
    updateCashButton(player);
    updateCashButton(theDealer);
    document.getElementById()
    makeBlackJackButton(player, handIndex);
}

const playerTies = (player, hand) => {
    const handValue = Number(hand.bet);
    const handIndex = player.hands.indexOf(hand);
    player.cash += handValue;
    const theDealer = players[players.length - 1];
    updateCashButton(player);
    updateCashButton(theDealer);
    makePushButton(player, handIndex);
}

const playerLoses = (player, hand) => {
    const handValue = Number(hand.bet);
    const handIndex = player.hands.indexOf(hand);
    const theDealer = players[players.length - 1];
    theDealer.cash += handValue;
    updateCashButton(player);
    updateCashButton(theDealer);
    makeLoseButton(player, handIndex);
}

const endGame = () => {
    const theDealer = players[players.length - 1];
    const dealerHand = theDealer.hands[0];
    const dealerStatus = dealerHand.status;
    players.forEach((player) => {
        if (player.playerName != 'Dealer') {
            player.hands.forEach((hand) => {
                const playerStatus = hand.status;
                if (dealerStatus === 'bust') {
                    if (playerStatus === 'bust') { playerLoses(player, hand)}
                    else if (playerStatus === 'blackjack') { playerWinsBlackJack(player, hand)}
                    else { playerWins(player, hand)}
                }
                else if (dealerStatus === 'blackjack') {
                    if (playerStatus === 'blackjack') { playerTies(player, hand)}
                    else { playerLoses(player, hand)}
                }
                else if (dealerStatus === 'stopped') {
                    if (playerStatus === 'bust') { playerLoses(player, hand)}
                    else if (playerStatus === 'blackjack') { playerWinsBlackJack(player, hand)}
                    else if (playerStatus === 'stopped' && dealerHand.score > hand.score) { playerLoses(player, hand)}
                    else if (playerStatus === 'stopped' && dealerHand.score === hand.score) { playerTies(player, hand)}
                    else { playerWins(player, hand)}
                }
                else { console.log('you have messed up your dealer status options at the endGame method') }
            })
        }
    })
}

const deleteAllHands = () => {
    console.log('you are in the deleteAllHands method')
    players.forEach((player) => {
        player.hands = []
        console.log(`after deletion ${player.playerName} has ${player.hands.length} hands`)
    })

    let allHandDivs = document.querySelectorAll('.Hand');
    allHandDivs.forEach((div) => {
        div.remove();
    })
}

const countNumberOfHands = () => {
    let numberOfHands = 0;
    players.forEach((player) => {
        numberOfHands += player.hands.length;
    })
    return numberOfHands
}

const deleteAllPlayerOptionsButtons = () => {
    players.forEach((player) => {
        let myText = player.playerName;
        myText += '-Options-List';
        myElement = document.getElementById(myText);
        myElement.innerHTML = '';
    })
}

//Event handlers--------------------------------------------------------------------------------------------------
const handlePlayersSit = (() => {
    table.players = []
    addPlayer('Ninja', 100)
    addPlayer('Samurai', 100)
    addPlayer('Dealer', 0, [], true);
    players.forEach((player) => {
        sitAPlayer(player);
    })
})

const handleStartTheGame = () => {
    table.cards = []
    setTheCards(1)

    deleteAllPlayerOptionsButtons()

    let allHands = countNumberOfHands();
    if (allHands > 0) {
        console.log('you are trying to delete all hands')
        deleteAllHands()
    }
    players.forEach((player) => {
        if (player.playerName != 'Dealer') {
            makeBetButton(player);
            makeSkipButton(player);
        } else {
            makeDrawCardButton(player);
        }
    })
}

const handlePlayerBets = ((event) => {
    const myPlayer = identifyPlayer(event);
    const parent = event.target.parentElement
    parent.innerHTML = ''

    const newInput = document.createElement('input');
    newInput.classList.add('Bet-Input-Box')
    newInput.value = 10;
    const dollarSign = parent.appendChild(document.createElement('p'));
    dollarSign.textContent = '$';
    parent.appendChild(newInput);
    // bet = newInput.value
    makeGoButton (myPlayer);
    // parent.addEventListener('keydown', (event) => handleNewHandActions(event))
    // return bet
})

const handleDrawCard = ((event) => {
    const myPlayer = identifyPlayer(event);
    createHand(myPlayer, 0);
    // betButton = document.getElementById(`${myPlayer.playerName}-hand-${handIndex}-bet-button`);
    // betButton.style.display = 'none';
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
    const myPlayer = identifyPlayer(event);
    const myHand = identifyHand(event);
    dealACard(myHand, myPlayer);
    checkHandOptions();
})

const handlePlayerStays = ((event) => {
    const myPlayer = identifyPlayer(event);
    const myHand = identifyHand(event);
    myPlayer.isInGame = false;
    handIndex = myPlayer.hands.indexOf(myHand);
    clearHandButtons(myPlayer, handIndex);
    makeDoneButton(myPlayer, handIndex);
})

const handleClearOptionsList = ((event) => {
    const myPlayer = identifyPlayer(event);
    // if (event.key === 'Enter') {
    event.target.parentElement.innerHTML = '';
    // }
})

const handleNewHandActions = (event) => {
    // if (event.key === 'Enter') {
        const inputBetElmt = document.querySelector('.Bet-Input-Box');
        const bet = inputBetElmt.value;
        const myPlayer = identifyPlayer(event);
        myPlayer.cash -= bet
        updateCashButton(myPlayer, myPlayer.cash);
        createHand(myPlayer, bet);
        handleClearOptionsList(event);
    // }
}


const handleDealerShows = (event) => {
    const myPlayer = identifyPlayer(event);
    myHand = myPlayer.hands[0];
    myHand.cards[1].isFaceUp = true;
    countHandValue(myHand);
    updateHandDiv(myHand, myPlayer);
    checkDealerOptions();
}

//Event Listeners----------------------------------------------------------------------------------------------------------------
startButton.addEventListener('click', handleStartTheGame);
sitButton.addEventListener('click', handlePlayersSit);


