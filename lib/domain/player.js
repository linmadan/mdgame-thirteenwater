var cardStack = require('./cardStack');

function Player(playerData) {
    this.playerID = playerData.playerID;
    this.hand = [];
    this.isPalyAHand = false;
    this.thirteenWaterCardStack = null;
    this.passCardStack = null;
    this.firstCardStack = null;
    this.middleCardStack = null;
    this.endCardStack = null;
    this.point = 0;
    this.winCount = 0;
};

Player.prototype.takeOneCard = function (card) {
    this.hand.push(card);
};

Player.prototype.playAHandOfThirteenWater = function (cardIndexs) {
    var cards = [];
    for (var i = 0; i < 13; i++) {
        cards.push(this.hand[cardIndexs[i]]);
    }
    this.thirteenWaterCardStack = cardStack.createCardStack(cards);
    this.__setFMECardStack__(cardIndexs);
    this.isPalyAHand = true;
};

Player.prototype.playAHandOfPass = function (cardIndexs) {
    var cards = [];
    for (var i = 0; i < 13; i++) {
        cards.push(this.hand[cardIndexs[i]]);
    }
    this.passCardStack = cardStack.createCardStack(cards);
    this.__setFMECardStack__(cardIndexs);
    this.isPalyAHand = true;
};

Player.prototype.playAHandOfNormal = function (cardIndexs) {
   this.__setFMECardStack__(cardIndexs);
    this.isPalyAHand = true;
};

Player.prototype.__setFMECardStack__ = function(cardIndexs){
    var firstCards = [];
    for (var i = 0; i < 3; i++) {
        firstCards.push(this.hand[cardIndexs[i]]);
    }
    this.firstCardStack = cardStack.createCardStack(firstCards);
    var middleCards = [];
    for (var i = 3; i < 8; i++) {
        middleCards.push(this.hand[cardIndexs[i]]);
    }
    this.middleCardStack =cardStack.createCardStack(middleCards);
    var endCards = [];
    for (var i = 8; i < 13; i++) {
        endCards.push(this.hand[cardIndexs[i]]);
    }
    this.endCardStack = cardStack.createCardStack(endCards);
}

module.exports.createPlayer = function (playerData) {
    return new Player(playerData);
};
