//Object to keep track of card game
const cardGame = {
	currentTurn: [],

	chooseCard: function(newCard) {
		if (!this.currentTurn.includes(newCard)) {
			this.currentTurn.push(newCard);
		}
		//If there are two cards in array, it is time to check if they are equal
		if (this.currentTurn.length == 2) {
			alert(this.currentTurn);
			this.currentTurn = [];
			return;
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
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}



