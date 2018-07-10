//Object to keep track of card game
const cardGame = {
	currentTurn: Array,

	addCard: function(newCard) {
		return;
	}, 

	turnOver: function() {
		return;
	}
};

function updateGame(event) {
	//Click directly on <div> element here
	if (event.target.nodeName === 'DIV') {   
    	alert(event.target.className);
    }
    //Clicked one of the spans, so we need to get the <div> element to check what card it is
    else if (event.target.parentElement.nodeName === 'DIV'){
     	alert(event.target.parentElement.className);
    }
}

//Add event listeners to each card
const listOfCards = document.querySelectorAll(".card");
for (let i = 0; i < listOfCards.length; i++) {
	listOfCards.item(i).addEventListener('click', updateGame);
}



