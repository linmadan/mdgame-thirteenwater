var _ = require('underscore');
var card = require('./card');

function Deck(deckData) {
    this.cards = [];
    var cardSuits = deckData.cardSuits;
    var cardNameValues = deckData.cardNameValues;
    _.each(_.keys(cardSuits), function (cardSuit) {
        _.each(_.keys(cardNameValues), function (cardNameValueKey) {
            var cardData = {};
            cardData.cardSuit = cardSuit;
            cardData.cardName = cardNameValueKey;
            cardData.cardValue = cardNameValues[cardNameValueKey];
            var newCard = card.createCard(cardData);
            this.cards.push(newCard);
        }, this);
    }, this);
    if (deckData.jokers.length > 0) {
        _.each(deckData.jokers, function (joker) {
            var cardData = {};
            var cardName = _.keys(joker)[0];
            cardData.cardSuit = cardName;
            cardData.cardName = cardName;
            cardData.cardValue = joker[cardName];
            var card = card.createCard(cardData);
            this.cards.push(card);
        }, this);
    }
};

Deck.prototype.shuffle = function () {
    var tempCard = null;
    var exchange = 0;
    var cardNumber = this.cards.length;
    for (var i = 0; i < cardNumber; i++) {
        exchange = _.random(0, cardNumber - 1);
        tempCard = this.cards[i];
        this.cards[i] = this.cards[exchange];
        this.cards[exchange] = tempCard;
    }
};

Deck.prototype.dealOneCard = function () {
    return this.cards.shift();
};

module.exports.createDeck = function (deckData) {
    return new Deck(deckData);
};
