DomainUtils = {
    sortByCardValueLargeToSmall: function (cards) {
        cards.sort(function (cardValueA, cardValueB) {
            var cardValueA = cardValueA.cardValue;
            var cardValueB = cardValueB.cardValue;
            return cardValueB - cardValueA;
        });
        return cards;
    },
    sortByCardValueSmallToLarge: function (cards) {
        cards.sort(function (cardValueA, cardValueB) {
            var cardValueA = cardValueA.cardValue;
            var cardValueB = cardValueB.cardValue;
            return cardValueA - cardValueB;
        });
        return cards;
    },
    isSameSuit: function (cards) {
        var suit = cards[0].cardSuit;
        for(var i = 1; i < cards.length; i++){
            if(cards[i].cardSuit != suit){
                return false;
            }
        }
        return true;
    },
    isStraightLargeToSmall: function (cards) {
        var value = cards[0].cardValue;
        for(var i = 1; i < cards.length; i++){
            if(cards[i].cardValue != (value - 1)){
                return false;
            }
            value = cards[i].cardValue;
        }
        return true;
    },
    isStraightSmallToLarge: function (cards) {
        var value = cards[0].cardValue;
        for(var i = 1; i < cards.length; i++){
            if(cards[i].cardValue != (value + 1)){
                return false;
            }
            value = cards[i].cardValue;
        }
        return true;
    }
};

module.exports = DomainUtils;