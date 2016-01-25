function CardStack(cards) {
    this.cards = cards || [];
    this.cardStackType = null;
    this.compareValues = [];
};

CardStack.prototype.compareTo = function (cardStack) {
    for (var i = 0; i < this.compareValues.length; i++) {
        if (this.compareValues[i] > cardStack.compareValues[i]) {
            return 1;
        }
        if (this.compareValues[i] < cardStack.compareValues[i]) {
            return -1;
        }
    }
    return 0;
};

module.exports.createCardStack = function (cards) {
    return new CardStack(cards);
};
