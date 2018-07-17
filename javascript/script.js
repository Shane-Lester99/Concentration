/*************************************************************************
Title:       script.js

Author:      Shane Lester

Created on:  July 16th 2018

Description: Creates the user interactivity, dynamisicm, and game logic  
			 for 'Concentration: The Classic Matching Game' web application. 
			 For more information on the game please refer to the README 
			 within this project.
			 
 *************************************************************************/

/*
* @constructor Creates an object that represents all the logic, functionality, and data 
* for one card game.
*/
const cardGame = {

	// Represents the number of pairs of cards picked (whether the two cards
	// matched or not).
	numberOfTurns: 0,

	// Represents the number of pairs of cards the user picked that didnt match.
	numberOfMisses: 0,

	// Represents the number of stars/ lives user has left.
	numberOfStars: 5,

	// Represents how many seconds the user has been playing the game.
	secondsElapsed: 0,

	// Represents the current turn. This array will only have a maximum of 2 cards.
	// Before it is emptied. Also note that the currentTurn[] and discardPile[] arrays
	// have no elements in common.
	currentTurn: [],

	// Represents all the cards that have been selected correctly (and now are face)
	// up. If the user wins, all 16 cards will be in the discardPile.
	discardPile: [],

	// This game notes if gameplay has started. If false, none of the above properites 
	// will be updated with new game data. If true, the properties above will be updated
	// as gameplay continues.
	gameStarted: false,

	// This property is used to toggle the ability for the start modal to come up. If it is
	// set to false, the start modal will appear if page is clicked. If it is set to true
	// normal functionality of the page will commence.
	gameInitialized: false,

	// Signifies the difficulty level of the game chosen from the selector html object in 
	// the start modal. Can only have values 'easy', 'medium', 'hard'm 'very hard'. 
	difficultyLevel: "",

	/* 
	* @description Represents the game logic to 'select' a card and the 
	* visual code to reveal the back (emoji side) of the card.
	* @param {string} newCard - represents the card selected by the user, 
	* as the string name of the class that is the unique card
	*/
	flipCardToRevealBack: function(newCard) {
		// Select the <div> element that represents the card name by its unique class.
		let cardElement = document.querySelector(`.${newCard}`);
		// Visually 'flip' the card over by hiding its front and revealing its back.
		cardElement.firstElementChild.style.display = "none";
		cardElement.lastElementChild.style.display = "block";
		// Push the card into the currentTurn array to take it out of the game
		// for the rest of the turn.
		this.currentTurn.push(newCard);
	},

	/*
	* @description 'Flips' the two elements that were in the currentTurn[] array so the
	* front is the only thing revealed.
	* @param { Array[string] } Contains the currentTurn[] array which contains two unique 
	* class names of cards. Note that this.currentTurn[] isnt used to allow for use in timeouts
	* (if not passed as a parameter, the data for this.currentTurn[] may be deleted before method
	* is called.)
	*/
	flipCardToHideBack: function(currentTurnArray) {
		// Set a timeout to allow the user 3/4 a second to memorize the card before the emoji
		// is hidden from the user.
		setTimeout(function() {
			// Find the two cards by class name in the DOM.
			let card1 = document.querySelector(`.${currentTurnArray[0]}`);
			let card2 = document.querySelector(`.${currentTurnArray[1]}`);
			// 'Flip' the cards so the emoji is hidden.
			card1.firstElementChild.style.display = "block";
			card1.lastElementChild.style.display = "none";
			card2.firstElementChild.style.display = "block";
			card2.lastElementChild.style.display = "none";
		}, 750);
	},

	/*
	* @description Takes the two matching cards in the currentTurn[] and places them in the 
	* this.discardPile[] array to signify that they have been matched and therefore out of the
	* game.
	* @param { Array[string] } Contains the currentTurn[] array which contains two unique 
	* class names of cards. If this method is called, these two cards will be 'matching' (meaning
	* they contain the same emoji on the back.) Note that this.currentTurn[] isnt used to allow for 
	* use in timeouts (and if not passed as a parameter, the data for this.currentTurn[] may be 
	* deleted before method is called.)
	*/
	discardCards: function(currentTurnArray) {
		// Send the two cards in the current hand to the discard pile.
		this.discardPile.push(currentTurnArray[0]);
		this.discardPile.push(currentTurnArray[1]);
		return;
	},

	/*
	* @description This method is where the card is transmitted from the user 'click' event to 
	* the gameplay events. It reads a card, determines if it is a valid card, reads up to two
	* cards, and then checks if they match and if the game was won. It then resets the currentArray[]
	* turn. It has all the this functionality of running the game by calling various other methods 
	* within this class.
	* @param { string } newCard - represents the card selected by the user, 
	* as the string name of the class that is the unique card.
	*/
	chooseCard: function(newCard) {
		// Card selected before 'start game' button pushed in the start modal.
		if (!this.gameStarted) {
			return;
		}
		// Card selected has already been flipped over and is out of the game.
		if (this.discardPile.includes(newCard)) {
			return;
		}
		// Test if card hasnt already been selected this turn.
		if (!this.currentTurn.includes(newCard)) {
			// Case 1: Succesful, card is flipped for at least rest of turn
			this.flipCardToRevealBack(newCard);
			
		} else {
			// Case 2: Card has already been selected, nothing happens
			return;
		}
		// Check if there are two cards currently flipped over (and if they are the results
		// of the turn are checked.
		if (this.currentTurn.length == 2) {
			// Call method to check if the two cards match. This method also increments the turn,
			// and adds cards to discard pile if they match.
			const matchStatus = this.checkIfMatch();
			// Tests if the cards matched.
			if (matchStatus) {
				// If they match, check if this was the winning match
				if (this.didWin()) {
					// Save the timeElapsed variable.
					this.secondsElapsed = parseInt(document.querySelector(".timer").textContent);
					const savedSeconds = this.secondsElapsed;
					// Set a timeout so the graphics have time to display the last card selection.
					setTimeout(function() {
						// Create win message.
						let endGameMessage = `Congratulations! You Won!<br>` 
						+ `With ${cardGame.numberOfTurns} Moves`;
						// Check if the stars at end of game were 1 to display star instead of stars.
						if (cardGame.numberOfStars == 1) {
							endGameMessage += ` and ${cardGame.numberOfStars} Star`;
						} else {
							endGameMessage += ` and ${cardGame.numberOfStars} Stars`;
						}
						// Make the difficulty level have a capital first letter for the win message.
						const difficulyLevelForMessage = cardGame.difficultyLevel[0].toUpperCase() 
						+ cardGame.difficultyLevel.slice(1);
						// Add the rest of the win message.
						endGameMessage += ` on ${difficulyLevelForMessage}`
						+ ` Mode in ${savedSeconds} Seconds.<br>Well done!`;
						// Display the winning message to the user on the win modal and display the message.
						document.querySelector(".winning-message").innerHTML = endGameMessage;
						document.querySelector(".off-page-win-modal").style.display = "block";
						// Set the this.gameStarted variable to false to signify the game is over.
						cardGame.gameStarted = false;
					}, 500);
					return;
				}
			} else {
				// If the cards werent the same, the user missed, so add one to the number of misses.
				this.numberOfMisses += 1;
				//Update the stars (if the stars go to 0 the user loses the game).
				this.updateStars();
			}
			// Reset the turn so the this.currentTurn[] array will never have more then 2 items in it
			this.currentTurn = [];	
		}
		return;
	}, 

	/*
	* @description This method is only called if the this.currentTurn[].length == 2, which is when the program
	* needs to check if the cards match. It checks if the two cards match and if they match it sends them to
	* the discard pile and keeps them emoji face first. Otherwise it flips the two cards back so the emoji is
	* hidden. Either way the turn is incremented afterwards. 
	* @returns { boolean } This method returns a boolean that is true if the cards match and false otherwise.
	*/	
	checkIfMatch: function() {
		// Create a boolean to test if the two cards match.	
		let didTheyMatch = false;
		// In the this.currentTurn[] array there are two cards (listed from "c1-1" to "c8-2" as strings).
		// So to see if the cards match the index at 1 is tested against each other for both cards.
		// For example, this will test "c3-1" and "c3-2" as "3 and "3" to signify they match.
		const card1 = this.currentTurn[0][1];
		const card2 = this.currentTurn[1][1];
		// Case 1: The cards match, so they are discarded remain permanetly flipped over.
		if (card1 == card2) {
			// The current cards are saved to an array.
			let correctCards = this.currentTurn;
			// They are then placed in the discard pile.
			this.discardCards(correctCards);
			// The match condition is set to true.
			didTheyMatch = true;
			// The turn is incremented.
			this.incrementTurn();	
		} else {
			// The current cards are saved to an array.
			let flipTheseCardsBack = this.currentTurn;
			// The cards dont match, so they are hidden again.
			this.flipCardToHideBack(flipTheseCardsBack);
			// The turn is incremented.
			this.incrementTurn();
		}	
		// Return if the match was successful or not		
		return didTheyMatch;
	},

	/*
	* @description This method adds one turn to the game data and updates the label accordingly
	*/	
	incrementTurn: function() {
		// Adds one to the number of turns played.
		this.numberOfTurns += 1;
		// Updates label.
		document.querySelector(".number-of-turns").textContent = this.numberOfTurns;
		return;
	},

	/*
	* @description This method restarts all the properties of the object to signify a new game
	* and updates all the UI to reflect a new game. 
	*/
	 startOver: function() {
	 	// This property is set to false to signify that the gameplay is not occuring currently.
	 	this.gameStarted = false;
	 	// The currentTurn[] array is empty (because there is no game happening at the moment).
		this.currentTurn = [];
		// The discard pile is reset to signify no matches have been found.
		this.discardPile = [];
		// Number of turns and seconds elapsed are set back to 0.
		this.numberOfTurns = 0;
		this.secondsElapsed = 0;
		// Number of stars/ lives is set back to 5 and the number of misses is set back to 0.
		this.numberOfStars = 5;
		this.numberOfMisses = 0;
		// The timer label and the number of turns label is updated to 0.
		document.querySelector(".timer").textContent = 0;
		document.querySelector(".number-of-turns").textContent = 0;
		// The cards emojis are hidden to prepare a start to the game.
		let deckOfCards = document.querySelector("#all-cards");
		for (let i = 0; i < deckOfCards.children.length; i++) {
			deckOfCards.children.item(i).firstElementChild.style.display = "block";
			deckOfCards.children.item(i).lastElementChild.style.display = "none";
		}
		// The star label is reset to show 5 lives.
		const starLabel = document.querySelector(".stars").innerHTML = "☆ ☆ ☆ ☆ ☆"
		return;
	},

	/*
	* @description This method checks if the this.discardPile[] array has reached a length of 16
	* (which indicated the user has found all the matches and the game was won).
	* @returns {boolean} Returns wether the game was won yet or not as a boolean  
	*/
	didWin: function() {
		// Set up boolan to test if game was won or not.
		let didIWin = false;
		// If all the cards have been discarded, the user has won.
		if (this.discardPile.length == 16) {
			// Game was won! Set test to 1.
			didIWin = true;
		}
		return didIWin;
	},

	/*
	* @description This method is called when the this.numberOfStars == 0, which signifies the
	* user has run out of 'lives.' It displays the end game modal with a lose message and stops
	* the game.
	*/
	youLose: function() {
		// Save the timeElapsed so it can be used within the setTimeout() method.
		this.secondsElapsed = parseInt(document.querySelector(".timer").textContent);
		const savedSeconds = this.secondsElapsed;
		// Set a timeout so the graphics have time to display last card selection.
		setTimeout(function() {
			// Write end of game message telling player they lost.
			let endGameMessage = `Oh no, you ran out of stars! <br> Game Over!` 
			// Change emoji from thumbs up to a crying face.
			document.querySelector(".thumbs-up").textContent = "😭";
			document.querySelector(".winning-message").innerHTML = endGameMessage;
			// Show the modal that displays the loss message to the user.
			document.querySelector(".off-page-win-modal").style.display = "block";
			// Set this.gameStarted to false so the gameplay stops.
			cardGame.gameStarted = false;
		}, 500);
	},

	/*
	* @description This method is called when the user chooses two cards that dont match.
	* It first checks the difficulty level and sees if a star/life is lost. If all stars 
	* are lost then they loss message is displayed to the user and the game ends.
	*/
	updateStars: function() {
		const starLabel = document.querySelector(".stars");
		// With "very hard" difficulty selected every two misses
		// a star is lost. 
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
				this.youLose();
			}
		}
		// With "hard" difficulty selected every three misses
		// a star is lost.
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
				this.youLose();
			}
		}
		// With "medium" difficulty selected every four misses
		// a star is lost.
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
				this.youLose();
			}
		}
		// With "easy" difficulty selected every five misses
		// a star is lost.
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
				this.youLose();
			}
		} 
		return;
	}
}

/*
* @description Once a card is clicked, this method saves the <div> element that contains all the
* information of each card (front and back) to the cardGame.chooseCard(card) method and a turn happens.
* @param { Event object } - represents the click event that will be sent to the cardGame object once a card
* is clicked.
*/
function updateGame(event) {
	// Creates a card variable to get the <div> element associated with the card selected.
	let card = null;
	// If the <div> element (which represents a card) is clicked directly, 
	// it is set to the card variable.
	if (event.target.nodeName === "DIV") {   
    	card = event.target.classList.item(1);
    } 
    // If the internal span is clicked, save the parent element (the <div>) that represents the
    // whole card (front and back).
    else if (event.target.parentElement.nodeName === "DIV"){
    	// Saves the parent of the span (the <div>) element into the card variable.
     	card = event.target.parentElement.classList.item(1);
    }
    // Calls the .chooseCard() method to have a all the funcitonality of a turn once 
    // this function is evoked. This is the only method that can cause a whole turn to
    // happen.
    cardGame.chooseCard(card);
    return;
}

/*
* @description This function starts the timer and sets an interval which updates the content
* of the time elapsed label every second while the card.gameStarted == true.
*/
function startTimer() {
	// Get the timer label from the DOM
	let timerLabel = document.querySelector(".timer");
	// Create an interval variable that will update the timer every second until
	// cardGame.gameStarted == false, in which the interval will stop and the label
	// will no longer be updated.
	let physicalTimer = setInterval( function() {
		if (cardGame.gameStarted == true) {
			timerLabel.textContent = parseInt(timerLabel.textContent, 10) + 1;
		} else {
			clearInterval(physicalTimer);
		}	
	}, 1000);
}

/*
* @description This function will set the cardGame.gameStarted to false to signify 
* that the gameplay has stopped and the .gameIntialized to false to signify that a 
* start modal menu will need to be evoked again to re-enable gameplay. Also the even 
* listener to allow for the start modal is re-enabled here so clicks will open it up
* and it will be opened upon evotion of this method.
*/
function resetGame() {
	// Allow the start modal to come back on screen.
	cardGame.gameInitialized = false;
	// Stops current gameplay.
	cardGame.gameStarted = false;
	// Add an event listener to the body to re-enable the feature where a click anywhere on the screen
	// will re-enable the start modal. So once the reset button is clicked it re-enables the current click
	// (which is added here) as an event which opens the modal via .initializeGame().
	document.querySelector("body").addEventListener("click", initializeGame);
	return;
}

/*
* @description This function will randomize the order of the cards by giving them a 
* css order property somewhere
* between 0 and 1000.
*/
function randomizeCards() {
	// Get a list of all the card objects represented by <div> elements.
	const listOfCards = document.querySelectorAll(".card");
	// Assign each one an order property between 0 and 1000.
	for (let i = 0; i < listOfCards.length; i++) {
		listOfCards.item(i).style.order = `${Math.floor(Math.random() * 1000)}`;
	}
	return;
}

/*
* @description This function is called clicking 'continue' button after game is won or lost. 
* It re-enables the start game and calls resetGame() so start modal can reappear so game can be started. 
*/
function playAgain() {
	// Take off the end of game modal.
	document.querySelector(".off-page-win-modal").style.display = "none";
	// Reset game so that the start game modal can re-appear.
	resetGame();
}

/*
* @description This function is called when 'Exit' is clicked upon the start modal. It returns to the 
* main page of the app, keeps the UI the same as the end of the previous game, and allows for
* the next click of the page to re-enable the start modal. 
*/
function takeBreakBeforeStart() {
	// De-display the start modal menu.
	document.querySelector(".off-page-start-modal").style.display = "none";
	// Temperarily set the cardGame.gameInitialized to true to dis-engange the start modal from
	// immediately re-appearing.
	cardGame.gameInitialized = true;
	// Set a timeout so that the next click will cause the start modal to re-appear after 1/4 of a second.
	// Note that the timeout makes it so that the start modal doesnt immediately re-appear.
	setTimeout(function() {
		cardGame.gameInitialized = false;
		document.querySelector("body").addEventListener("click", initializeGame);
	}, 250);
}

/*
* @description This function is called when the 'begin' button is clicked on the start game modal.
* Upon evoktion, it de-displays the start modal, it resets all the cardGame properties to their 
* initial values, disables the start modal from re-appearing, selects the difficulty value (from the
* html selector element), it starts the timer, and allows the cardGame object to begin gameplay.
* @param { Event object } Event object is used to call event.preventDefault() so the page doesnt 
* refresh after button is clicked.
*/
function startGame(event) {
	// Allows the button to not refresh the page (which is the default behavior of a button).
	event.preventDefault();
	// Disables the start modal.
	document.querySelector(".off-page-start-modal").style.display = "none";
	// Replaces the thumbs up in the end game modal (which is what is the inital value for a win,
	// if the player loses its updated to a crying emoji).
	document.querySelector(".thumbs-up").textContent = "👍";
	// Resets all the properties of the cardGame object to their initial values.
	cardGame.startOver();
	// Disables the start modal from re-appearing upon click anywhere in body.
	cardGame.gameInitialized = true;	
	// Selects the difficulty level from the selector HTML element.
	cardGame.difficultyLevel = document.querySelector(".difficulty-selector").value;
	// Randomizes the order of the cards.
	randomizeCards();
	// Enables click events to reach the cardGame object (which allows gameplay to comence).
	cardGame.gameStarted = true;
	// Starts the timer so the timer label gets updated and also to signify to the user to begin
	// matching.
	startTimer();
	return;
}

/*
* @description This function is called whenever the body is clicked. It re-enables the start modal.
* It is disabled during gameplay and when the end game modal is up. Other then that, it allows for
* a click anywhere in the HTML body to re-enable the start modal so the player can play another
* game.
*/
function initializeGame() {
	// Checks if the game has already been initialized.
	if (cardGame.gameInitialized) {
		// If it has, remove the eventListener so the start modal wont appear when it isnt supposed to.
		document.querySelector("body").removeEventListener("click", initializeGame)
	}
	else {
	// If the game is un-initialized, display the start modal.
		document.querySelector(".off-page-start-modal").style.display = "block";
	}
}

// Add event listeners to each card so upon click updateGame will pass the card to the cardGame object.
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}

// Add 'Reset' button functionality to game.
document.querySelector(".reset").addEventListener("click", resetGame);

// Add 'Continue' button functionality to game.
document.querySelector("#play-again").addEventListener("click", playAgain);

//Add 'Exit' button functionality to game.
document.querySelector("#go-back").addEventListener("click", takeBreakBeforeStart);

// Add 'Begin' button functionality to game.
document.querySelector("#start-button").addEventListener('click', startGame);

// Face all the cards face up so emojis are hidden.
let backOfCardList = document.querySelectorAll(".back-of-card");
for (let i = 0; i < backOfCardList.length; i++) {
	backOfCardList[i].style.display = "none";
}

// Allow the start modal to be evoked when clicking anywhere in document body.
document.querySelector("body").addEventListener("click", initializeGame)

