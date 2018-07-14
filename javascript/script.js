
//TODO: Once the game starts over once, the timer doubles in spped

//Object to keep track of card game
const cardGame = {
	numberOfTurns: 0,

	numberOfMisses: 0,

	numberOfStars: 5,

	secondsElapsed: 0,

	currentTurn: [],

	discardPile: [],

	gameStarted: false,

	difficultyLevel: "",

	flipCardToRevealBack: function(newCard) {
		let cardElement = document.querySelector(`.${newCard}`);
		cardElement.firstElementChild.style.display = "none";
		cardElement.lastElementChild.style.display = "block";
		this.currentTurn.push(newCard);
	},

	flipCardToHideBack: function(currentTurnArray) {
		setTimeout(function() {
			let card1 = document.querySelector(`.${currentTurnArray[0]}`);
			let card2 = document.querySelector(`.${currentTurnArray[1]}`);

			card1.firstElementChild.style.display = "block";
			card1.lastElementChild.style.display = "none";

			card2.firstElementChild.style.display = "block";
			card2.lastElementChild.style.display = "none";

			//alert(`${currentTurnArray[0]} and ${currentTurnArray[1]} dont match`);
		}, 250);
	},

	discardCards: function(currentTurnArray) {
		//setTimeout(function() {
			//Add cards to discard pile
			this.discardPile.push(currentTurnArray[0]);
			this.discardPile.push(currentTurnArray[1]);
			//Turn color of unusable cards to red
			document.querySelector(`.${currentTurnArray[0]}`).style.color = "red";
			document.querySelector(`.${currentTurnArray[1]}`).style.color = "red";
		//	alert(`match of ${currentTurnArray[0]} and ${currentTurnArray[1]}`);
		//}, 1000);
		return;
	},

	chooseCard: function(newCard) {
		//Card selected before 'start game' button pushed
		if (!this.gameStarted) {
			alert("Please choose difficulty then select 'Start game' to begin.");
			return;
		}
		//Card selected that has already been flipped over (and found)
		if (this.discardPile.includes(newCard)) {
			//alert(`${newCard} has already been picked.`);
			return;
		}
		//Test if card selection successful
		if (!this.currentTurn.includes(newCard)) {
			//Case 1: Succesful, card is flipped for at least rest of turn
			this.flipCardToRevealBack(newCard);
			
		} else {
			//Case 2: Card has already been selected, nothing happens
			//alert(`${newCard} is currently selected. Please select a different card.`);
			return;
		}
		//Check if there are two cards currently flipped over
		if (this.currentTurn.length == 2) {
			//Call method to check if the two cards match. This method also increments the turn,
			//and adds appropriate cards to appropriate containers.
			const matchStatus = this.checkIfMatch();
			//Tests if the cards matched
			if (matchStatus) {
				//If they match, check if this was the winning match
				if (this.didWin()) {
					//Save the timeElapsed so it can be used within the setTimeout() method
					this.secondsElapsed = parseInt(document.querySelector(".timer").textContent);
					const savedSeconds = this.secondsElapsed;
					//Set a timeout so the graphics have time to display of the last card selection
					setTimeout(function() {
						//Display win alert
						let endGameMessage = `Congratulations! You Won!\n` 
						+ `With ${cardGame.numberOfTurns} Moves`
						+ ` and ${cardGame.numberOfStars} Stars`
						+` on ${cardGame.difficultyLevel[0].toUpperCase() + cardGame.difficultyLevel.slice(1)}`
						+ ` Mode in ${savedSeconds} Seconds.\nWoooooo!`
						document.querySelector(".winning-message").textContent = endGameMessage;
						document.querySelector("#off-page-win-modal").style.display = "block";
						// document.querySelector(".winning-modal").style.display = "block";
						// document.querySelector(".winning-message").style.display= "inline";
						// document.querySelector(".play-again").style.display = "inline-block";	
						

						// let header = document.querySelector("header");
						// let main = document.querySelector("main");
						// header.style.position = "absolute";	
						// main.style.position = "absolute";
						// header.style.right = "-1000px";
						// main.style.right = "-1000px";
						//Start game over after alert is displayed
						cardGame.gameStarted = false;
					}, 500);
					return;
				}
			} else {
				this.numberOfMisses += 1;
				this.updateStars();
			}
			//If they didnt win, reset the current turn, update the stars
			//and continue game play
			this.currentTurn = [];
			
		}
		return;
	}, 

	checkIfMatch: function() {	
		let didTheyMatch = false;
		//choose the first and second string in the array, and
		//the string indexed at 1 is the value of the card (which)
		//tells us wether it matches or not
		const card1 = this.currentTurn[0][1];
		const card2 = this.currentTurn[1][1];
		//The cards match, so we discard them and they are permanetly flipped over
		if (card1 == card2) {
			let correctCards = this.currentTurn;
			this.discardCards(correctCards);
			didTheyMatch = true;
			//We increment the turn
			this.incrementTurn();
			
		} else {
			let flipTheseCardsBack = this.currentTurn;
			//Cards dont match, so we hide the back again
			this.flipCardToHideBack(flipTheseCardsBack);
			this.incrementTurn();
		}
		
		//Return if the match was successful or not		
		return didTheyMatch;
	},

	incrementTurn: function() {
		this.numberOfTurns += 1;
		document.querySelector(".number-of-turns").textContent = this.numberOfTurns;
		return;
	},

	 startOver: function() {
	 	this.gameStarted = false;
		this.currentTurn = [];
		this.discardPile = [];
		this.numberOfTurns = 0;
		this.secondsElapsed = 0;
		this.numberOfStars = 5;
		document.querySelector(".timer").textContent = 0;
		document.querySelector(".number-of-turns").textContent = 0;
		let deckOfCards = document.querySelector("#all-cards");
		for (let i = 0; i < deckOfCards.children.length; i++) {
			deckOfCards.children.item(i).style.color = "black";
			deckOfCards.children.item(i).firstElementChild.style.display = "block";
			deckOfCards.children.item(i).lastElementChild.style.display = "none";
		}
		const starLabel = document.querySelector(".stars").innerHTML = "☆ ☆ ☆ ☆ ☆"
		return;
	},

	didWin: function() {
		let didIWin = false;
		if (this.discardPile.length == 16) {
			didIWin = true;
		}
		return didIWin;
	},

	updateStars: function() {
		const starLabel = document.querySelector(".stars");
		if (this.difficultyLevel == "very hard") {
			if (this.numberOfMisses == 2) {
				//4 stars
				starLabel.innerHTML = "☆ ☆ ☆ ☆";
				this.numberOfStars = 4;
			} 
			else if (this.numberOfMisses == 4) {
				//3 stars
				starLabel.innerHTML = "☆ ☆ ☆";
				this.numberOfStars = 3;

			} 
			else if (this.numberOfMisses == 6) {
				//2 stars
				starLabel.innerHTML = "☆ ☆";
				this.numberOfStars = 2;

			} 
			else if (this.numberOfMisses == 8) {
				//1 stars
				starLabel.innerHTML = "☆";
				this.numberOfStars = 1;

			} 
			else if (this.numberOfMisses == 10) {
				//0 stars
				starLabel.innerHTML = "";
				this.numberOfStars = 0;
			}
		}

		if (this.difficultyLevel == "hard") {
			if (this.numberOfMisses == 3) {
				//4 stars
				starLabel.innerHTML = "☆ ☆ ☆ ☆";
				this.numberOfStars = 4;
			} 
			else if (this.numberOfMisses == 6) {
				//3 stars
				starLabel.innerHTML = "☆ ☆ ☆";
				this.numberOfStars = 3;

			} 
			else if (this.numberOfMisses == 9) {
				//2 stars
				starLabel.innerHTML = "☆ ☆";
				this.numberOfStars = 2;

			} 
			else if (this.numberOfMisses == 12) {
				//1 stars
				starLabel.innerHTML = "☆";
				this.numberOfStars = 1;

			} 
			else if (this.numberOfMisses == 15) {
				//0 stars
				starLabel.innerHTML = "";
				this.numberOfStars = 0;

			}
		}

		if (this.difficultyLevel == "medium") {
			if (this.numberOfMisses == 4) {
				//4 stars
				starLabel.innerHTML = "☆ ☆ ☆ ☆";
				this.numberOfStars = 4;
			} 
			else if (this.numberOfMisses == 8) {
				//3 stars
				starLabel.innerHTML = "☆ ☆ ☆";
				this.numberOfStars = 3;

			} 
			else if (this.numberOfMisses == 12) {
				//2 stars
				starLabel.innerHTML = "☆ ☆";
				this.numberOfStars = 2;

			} 
			else if (this.numberOfMisses == 16) {
				//1 stars
				starLabel.innerHTML = "☆";
				this.numberOfStars = 1;

			} 
			else if (this.numberOfMisses == 20) {
				//0 stars
				starLabel.innerHTML = "";
				this.numberOfStars = 0;

			}
		}

		if (this.difficultyLevel == "easy") {
			if (this.numberOfMisses == 5) {
				//4 stars
				starLabel.innerHTML = "☆ ☆ ☆ ☆";
				this.numberOfStars = 4;
			} 
			else if (this.numberOfMisses == 10) {
				//3 stars
				starLabel.innerHTML = "☆ ☆ ☆";
				this.numberOfStars = 3;

			} 
			else if (this.numberOfMisses == 15) {
				//2 stars
				starLabel.innerHTML = "☆ ☆";
				this.numberOfStars = 2;

			} 
			else if (this.numberOfMisses == 20) {
				//1 stars
				starLabel.innerHTML = "☆";
				this.numberOfStars = 1;

			} 
			else if (this.numberOfMisses == 25) {
				//0 stars
				starLabel.innerHTML = "";
				this.numberOfStars = 0;

			}
		} 
		return;
	}
}

function updateGame(event) {
	let card = null;
	//Click directly on <div> element here
	if (event.target.nodeName === "DIV") {   
    	card = event.target.classList.item(1);
    } 
    //Clicked one of the spans, so we need to get the <div> element to check what card it is
    else if (event.target.parentElement.nodeName === "DIV"){
     	card = event.target.parentElement.classList.item(1);
    }
    cardGame.chooseCard(card);
    return;
}

function startTimer() {
	let timerLabel = document.querySelector(".timer");
	//start timer
	let physicalTimer = setInterval( function() {
		//alert("set interval")
		if (cardGame.gameStarted == true) {
			timerLabel.textContent = parseInt(timerLabel.textContent, 10) + 1;
		} else {
			clearInterval(physicalTimer);
		}	
	}, 1000);
}

function resetGame() {
	cardGame.startOver();
	return;
}

function randomizeCards() {
	const listOfCards = document.querySelectorAll(".card");
	for (let i = 0; i < listOfCards.length; i++) {
		listOfCards.item(i).style.order = `${Math.floor(Math.random() * 1000)}`;
	}
	return;
}

function playAgain() {
	cardGame.startOver();
	document.querySelector("#off-page-win-modal").style.display = "none";
	// document.querySelector(".winning-modal").style.display= "none";
	// document.querySelector(".winning-message").style.display = "none";
	// document.querySelector(".play-again").style.display = "none";		
	// let header = document.querySelector("header");
	// let main = document.querySelector("main");
	// header.style.position = "static";	
	// main.style.position = "static";
	// header.style.right = "0px";
 //    main.style.right = "0px";
}

function startGame(event) {
	event.preventDefault();
	if (cardGame.gameStarted == true) {
		alert("Game already started");
		return;
	}	
	cardGame.difficultyLevel = document.querySelector(".difficulty-selector").value;
	randomizeCards();
	cardGame.gameStarted = true;
	alert("Game Started");
	startTimer();
	return;
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}

//Add reset button functionality to game
document.querySelector(".reset").addEventListener("click", resetGame);

//Add play again functionality
document.querySelector("#play-again").addEventListener("click", playAgain);

//Add start button functionality and difficulty form
document.querySelector("#start-button").addEventListener('click', startGame);

//Face all the cards face up
let backOfCardList = document.querySelectorAll(".back-of-card");
//Iterate through list and hide all of them
for (let i = 0; i < backOfCardList.length; i++) {
	backOfCardList[i].style.display = "none";
}
