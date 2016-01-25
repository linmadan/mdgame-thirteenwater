var _ = require('underscore');
var DomainUtils = require('../domainUtils');

function GeneralCardStackEvaluation(cardData) {
    this.cardStackType = {
        THIRTEENWATER: "thirteen water",
        PASS: "pass",
        STRAIGHTFLUSH: "straight flush",
        FOUROFAKIND: "four of a kind",
        FULLHOUSE: "full house",
        FLUSH: "flush",
        STRAIGHT: "straight",
        THREEOFAKIND: "three of a kind",
        TWOPAIR: "two pair",
        ONEPAIR: "one pair",
        HIGHCARD: "high card",
        PERVERSIONWATER: "perversion water"
    };
};
GeneralCardStackEvaluation.prototype.isThirteenWater = function (cardStack) {
    var cards = cardStack.cards;
    if (cards.length != 13) {
        return false;
    }
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    if (!DomainUtils.isStraightLargeToSmall(cards)) {
        return false;
    }
    return true;
};
GeneralCardStackEvaluation.prototype.justThirteenWater = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.THIRTEENWATER;
    cardStack.compareValues.push(12);
};
GeneralCardStackEvaluation.prototype.isPass = function (cardStack) {
    var cards = cardStack.cards;
    if (cards.length != 13) {
        return false;
    }
    var flushCount = 0;
    var straightCount = 0;
    var pairCount = 0;
    var firstCards = cards.slice(0, 3);
    var middleCards = cards.slice(3, 5);
    var endCards = cards.slice(8);
    if (DomainUtils.isSameSuit(firstCards)) {
        flushCount++;
    }
    if (DomainUtils.isSameSuit(middleCards)) {
        flushCount++;
    }
    if (DomainUtils.isSameSuit(endCards)) {
        flushCount++;
    }
    firstCards = DomainUtils.sortByCardValueLargeToSmall(firstCards);
    if (isStraight(firstCards)) {
        straightCount++;
    }
    middleCards = DomainUtils.sortByCardValueLargeToSmall(middleCards);
    if (isStraight(middleCards)) {
        straightCount++;
    }
    endCards = DomainUtils.sortByCardValueLargeToSmall(endCards);
    if (isStraight(endCards)) {
        straightCount++;
    }
    function isStraight(someCards) {
        var cardValues = _.map(someCards, function (card) {
            return card.cardValue;
        });
        if (_.indexOf(cardValues, 14) < 0) {
            if (!DomainUtils.isStraightLargeToSmall(someCards)) {
                return false;
            }
        }
        else {
            if (!DomainUtils.isStraightLargeToSmall(someCards)) {
                someCards[0].cardValue = 1;
                someCards = DomainUtils.sortByCardValueSmallToLarge(someCards);
                if (!DomainUtils.isStraightSmallToLarge(someCards)) {
                    return false;
                }
            }
        }
        return true;
    }

    cards = DomainUtils.sortByCardValueLargeToSmall(cardStack.cards);
    for (var i = 0; i <= cards.length - 2; i++) {
        if (cards[i].cardValue == cards[i + 1].cardValue) {
            pairCount++;
            i++;
        }
    }
    if (pairCount == 6 || flushCount == 3 || straightCount == 3) {
        return true;
    }
    else {
        return false;
    }
};
GeneralCardStackEvaluation.prototype.justPass = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.PASS;
    cardStack.compareValues.push(11);
};
GeneralCardStackEvaluation.prototype.isStraightFlush = function (cardStack) {
    var cards = cardStack.cards;
    if (!DomainUtils.isSameSuit(cards)) {
        return false;
    }
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    var cardValues = _.map(cards, function (card) {
        return card.cardValue;
    });
    if (_.indexOf(cardValues, 14) < 0) {
        if (!DomainUtils.isStraightLargeToSmall(cards)) {
            return false;
        }
    }
    else {
        if (!DomainUtils.isStraightLargeToSmall(cards)) {
            cards[0].cardValue = 1;
            cards = DomainUtils.sortByCardValueSmallToLarge(cards);
            if (!DomainUtils.isStraightSmallToLarge(cards)) {
                cards[0].cardValue = 14;
                return false;
            }
            cards[0].cardValue = 14;
        }
    }
    return true;
};
GeneralCardStackEvaluation.prototype.justStraightFlush = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.STRAIGHTFLUSH;
    cardStack.compareValues.push(10);
    var cards = DomainUtils.sortByCardValueLargeToSmall(cardStack.cards);
    for (var i = 0; i < cards.length; i++) {
        cardStack.compareValues.push(cards[i].cardValue);
    }
};
GeneralCardStackEvaluation.prototype.isFourOfAKind = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    if (cards[0].cardValue != cards[1].cardValue) {
        if ((cards[1].cardValue == cards[2].cardValue) && (cards[1].cardValue == cards[3].cardValue) && (cards[1].cardValue == cards[4].cardValue)) {
            return true;
        }
        return false;
    }
    else {
        if ((cards[0].cardValue == cards[2].cardValue) && (cards[0].cardValue == cards[3].cardValue)) {
            return true;
        }
        return false;
    }
};
GeneralCardStackEvaluation.prototype.justFourOfAKind = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.FOUROFAKIND;
    cardStack.compareValues.push(9);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    if (cards[0].cardValue == cards[1].cardValue) {
        cardStack.compareValues.push(cards[0].cardValue);
    }
    else {
        cardStack.compareValues.push(cards[1].cardValue);
    }
};
GeneralCardStackEvaluation.prototype.isFullHouse = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    if (cards[0].cardValue != cards[1].cardValue) {
        return false;
    }
    else {
        if (cards[0].cardValue == cards[2].cardValue) {
            if (cards[3].cardValue == cards[4].cardValue) {
                return true;
            }
            return false;
        }
        else {
            if ((cards[2].cardValue == cards[3].cardValue) && (cards[2].cardValue == cards[4].cardValue)) {
                return true;
            }
            return false;
        }
    }
};
GeneralCardStackEvaluation.prototype.justFullHouse = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    cardStack.cardStackType = this.cardStackType.FULLHOUSE;
    cardStack.compareValues.push(8);
    if (cards[1].cardValue == cards[2].cardValue) {
        cardStack.compareValues.push(cards[0].cardValue);
    }
    else {
        cardStack.compareValues.push(cards[2].cardValue);
    }
};
GeneralCardStackEvaluation.prototype.isFlush = function (cardStack) {
    var cards = cardStack.cards;
    if (DomainUtils.isSameSuit(cards)) {
        return true;
    }
    return false;
};
GeneralCardStackEvaluation.prototype.justFlush = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.FLUSH;
    cardStack.compareValues.push(7);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i < cards.length; i++) {
        cardStack.compareValues.push(cards[i].cardValue);
    }
};
GeneralCardStackEvaluation.prototype.isStraight = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    var cardValues = _.map(cards, function (card) {
        return card.cardValue;
    });
    if (_.indexOf(cardValues, 14) < 0) {
        if (!DomainUtils.isStraightLargeToSmall(cards)) {
            return false;
        }
    }
    else {
        if (!DomainUtils.isStraightLargeToSmall(cards)) {
            cards[0].cardValue = 1;
            cards = DomainUtils.sortByCardValueSmallToLarge(cards);
            if (!DomainUtils.isStraightSmallToLarge(cards)) {
                cards[0].cardValue = 14;
                return false;
            }
            cards[0].cardValue = 14;
        }
    }
    return true;
};
GeneralCardStackEvaluation.prototype.justStraight = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.STRAIGHT;
    cardStack.compareValues.push(6);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i < cards.length; i++) {
        cardStack.compareValues.push(cards[i].cardValue);
    }
};
GeneralCardStackEvaluation.prototype.isThreeOfAKind = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i <= cards.length - 3; i++) {
        if ((cards[i].cardValue == cards[i + 1].cardValue) && (cards[i].cardValue == cards[i + 2].cardValue)) {
            return true;
        }
    }
    return false;
};
GeneralCardStackEvaluation.prototype.justThreeOfAKind = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.THREEOFAKIND;
    cardStack.compareValues.push(5);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i <= cards.length - 3; i++) {
        if ((cards[i].cardValue == cards[i + 1].cardValue) && (cards[i].cardValue == cards[i + 2].cardValue)) {
            cardStack.compareValues.push(cards[i].cardValue);
        }
    }
};
GeneralCardStackEvaluation.prototype.isTwoPair = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    var pairCount = 0;
    for (var i = 0; i <= cards.length - 2; i++) {
        if (cards[i].cardValue == cards[i + 1].cardValue) {
            pairCount++;
            i++;
        }
    }
    if (pairCount >= 2) {
        return true;
    }
    else {
        return false;
    }
};
GeneralCardStackEvaluation.prototype.justTwoPair = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.TWOPAIR;
    cardStack.compareValues.push(4);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    var pairValues = [];
    var oneValue = null;
    for (var i = 0; i <= cards.length - 2; i++) {
        if (cards[i].cardValue == cards[i + 1].cardValue) {
            i++;
            pairValues.push(cards[i].cardValue);
        }
        else {
            oneValue = cards[i].cardValue;
        }
    }
    cardStack.compareValues.push(pairValues[0]);
    cardStack.compareValues.push(pairValues[1]);
    if (_.isNull(oneValue)) {
        cardStack.compareValues.push(cards[4].cardValue);
    }
    else {
        cardStack.compareValues.push(oneValue);
    }
};
GeneralCardStackEvaluation.prototype.isOnePair = function (cardStack) {
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i <= cards.length - 2; i++) {
        if (cards[i].cardValue == cards[i + 1].cardValue) {
            return true;
        }
    }
    return false;
};
GeneralCardStackEvaluation.prototype.justOnePair = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.ONEPAIR;
    cardStack.compareValues.push(3);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i <= cards.length - 2; i++) {
        if (cards[i].cardValue == cards[i + 1].cardValue) {
            cardStack.compareValues.push(cards[i].cardValue);
            for (var n = 0; n < cards.length; n++) {
                if (n != i && n != (i + 1)) {
                    cardStack.compareValues.push(cards[n].cardValue);
                }
            }
        }
    }
};
GeneralCardStackEvaluation.prototype.justHighCard = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.HIGHCARD;
    cardStack.compareValues.push(2);
    var cards = cardStack.cards;
    cards = DomainUtils.sortByCardValueLargeToSmall(cards);
    for (var i = 0; i < cards.length; i++) {
        cardStack.compareValues.push(cards[i].cardValue);
    }
};

GeneralCardStackEvaluation.prototype.justPerversionWater = function (cardStack) {
    cardStack.cardStackType = this.cardStackType.PERVERSIONWATER;
    cardStack.compareValues.push(1);
};

module.exports.createEvaluation = function () {
    return new GeneralCardStackEvaluation();
};
