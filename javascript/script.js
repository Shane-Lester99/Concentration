// //Object to keep track of card game
// const cardGame = {
// 	currentTurn: Array,

// 	addCard: function(newCard) {
// 		return;
// 	}, 

// 	turnOver: function() {
// 		return;
// 	}
// };

function updateGame(event) {
	alert(event.target.className);
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}



