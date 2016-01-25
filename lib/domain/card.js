function Card(cardData) {
    this.cardSuit = cardData.cardSuit;
    this.cardName = cardData.cardName;
    this.cardValue = cardData.cardValue;
};

module.exports.createCard = function (cardData) {
    return new Card(cardData);
};
