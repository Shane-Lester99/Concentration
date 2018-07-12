//Object to keep track of card game
const cardGame = {
	numberOfTurns: 0,

	numberOfMisses: 0,

	currentTurn: [],

	discardPile: [],

	chooseCard: function(newCard) {
		if (this.discardPile.includes(newCard)) {
			alert(`${newCard} already chosen.`);
			return;
		}
		if (!this.currentTurn.includes(newCard)) {
			this.currentTurn.push(newCard);
		}
		//If there are two cards in array, it is time to check if they are equal
		if (this.currentTurn.length == 2) {
			//Check if the two cards match
			const matchStatus = this.checkIfMatch();
			if (matchStatus) {
				//If they match, check if they win
				if (this.didWin()) {
					setTimeout(function() {
					//Display win alert
					alert(`You won in ${cardGame.numberOfTurns} turns!!`);			
					//Start game over after alert is displayed
					cardGame.startOver();
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
		if (card1 == card2) {
			//Add cards to discard pile
			this.discardPile.push(this.currentTurn[0]);
			this.discardPile.push(this.currentTurn[1]);
			//Turn color of unusable cards to red
			document.querySelector(`.${this.currentTurn[0]}`).style.color = "red";
			document.querySelector(`.${this.currentTurn[1]}`).style.color = "red";
			alert(`match of ${this.currentTurn[0]} and ${this.currentTurn[1]}`);
			didTheyMatch = true;
		}
		else {
			alert(`${this.currentTurn[0]} and ${this.currentTurn[1]} dont match`);
		}
		this.incrementTurns();		
		return didTheyMatch;
	},

	incrementTurns: function() {
		this.numberOfTurns += 1;
		document.querySelector(".number-of-turns").textContent = this.numberOfTurns;
		return;
	},

	 startOver: function() {
		this.currentTurn = [];
		this.discardPile = [];
		this.numberOfTurns = 0;
		document.querySelector(".number-of-turns").textContent = 0;
		let deckOfCards = document.querySelector("#all-cards");
		for (let i = 0; i < deckOfCards.children.length; i++) {
			deckOfCards.children.item(i).style.color = "black";
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
		if (this.numberOfMisses == 1) {
			//4 stars
			starLabel.innerHTML = "☆ ☆ ☆ ☆";
		}
		else if (this.numberOfMisses == 3) {
			//3 stars
			starLabel.innerHTML = "☆ ☆ ☆";
		}
		else if (this.numberOfMisses == 5) {
			//2 stars
			starLabel.innerHTML = "☆ ☆";
		}
		else if (this.numberOfMisses == 7) {
			//1 stars
			starLabel.innerHTML = "☆";
		}
		else if (this.numberOfMisses == 9) {
			//0 stars
			starLabel.innerHTML = "";
		}
		return;
	}
};

function updateGame(event) {
	let card = null;
	//Click directly on <div> element here
	if (event.target.nodeName === 'DIV') {   
    	card = event.target.classList.item(1);
    }
    //Clicked one of the spans, so we need to get the <div> element to check what card it is
    else if (event.target.parentElement.nodeName === 'DIV'){
     	card = event.target.parentElement.classList.item(1);
    }
    cardGame.chooseCard(card);
    return;
}

function resetGame() {
	cardGame.startOver();
	return;
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}

document.querySelector(".reset").addEventListener('click', resetGame);
