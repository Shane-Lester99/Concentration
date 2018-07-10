//Object to keep track of card game
const cardGame = {
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
			this.checkIfMatch();
			this.currentTurn = [];
			return;
		}
		return;
	}, 

	checkIfMatch: function() {	
		//choose the first and second string in the array, and
		//the string indexed at 1 is the value of the card (which)
		//tells us wether it matches or not
		const card1 = this.currentTurn[0][1];
		const card2 = this.currentTurn[1][1];
		if (card1 == card2) {
			alert(`match of ${this.currentTurn[0]} and ${this.currentTurn[1]}`);
			//Add cards to discard pile
			this.discardPile.push(this.currentTurn[0]);
			this.discardPile.push(this.currentTurn[1]);
			//Turn color of unusable cards to red
			document.querySelector(`.${this.currentTurn[0]}`).style.color = "red";
			document.querySelector(`.${this.currentTurn[1]}`).style.color = "red";
		}
		else {
			alert(`${this.currentTurn[0]} and ${this.currentTurn[1]} dont match`);
		}
		return;
	},

	resetGame: function() {
		this.currentTurn = [];
		this.discardPile = [];
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
}

function resetGame() {
	cardGame.resetGame();
	let deckOfCards = document.querySelector("#all-cards");
	for (let i = 0; i < deckOfCards.children.length; i++) {
		deckOfCards.children.item(i).style.color = "black";
	}
	
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}

document.querySelector(".reset").addEventListener('click', resetGame);
